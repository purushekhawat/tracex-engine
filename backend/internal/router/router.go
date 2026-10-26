package router

import (
	"encoding/json"
	"net/http"

	"github.com/tracex/tracex-backend/internal/config"
	"github.com/tracex/tracex-backend/internal/connector"
	"github.com/tracex/tracex-backend/internal/handler"
	"github.com/tracex/tracex-backend/internal/middleware"
	"github.com/tracex/tracex-backend/internal/repository"
	"github.com/tracex/tracex-backend/internal/service"
	"github.com/tracex/tracex-backend/pkg/attribution"
	"github.com/tracex/tracex-backend/pkg/audit"
	"github.com/tracex/tracex-backend/pkg/sahyog"
)

func SetupRoutes(cfg *config.Config) http.Handler {
	mux := http.NewServeMux()

	// 0. Root Welcome & Discovery Handler
	mux.HandleFunc("GET /{$}", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		_ = json.NewEncoder(w).Encode(map[string]interface{}{
			"service":     "TRACE-X Backend API Engine",
			"status":      "online",
			"version":     "v1.0.0",
			"health":      "/api/v1/health",
			"description": "TRACE-X: Explainable Cross-Chain VASP Attribution & Investigation Platform",
		})
	})

	// 1. Health Services
	healthService := service.NewHealthService(cfg)
	healthHandler := handler.NewHealthHandler(healthService)

	mux.HandleFunc("GET /api/v1/health", healthHandler.Health)
	mux.HandleFunc("GET /api/v1/health/dependencies", healthHandler.Dependencies)

	// Authentication Handler
	authHandler := handler.NewAuthHandler(cfg.PostgresPassword)
	mux.HandleFunc("POST /api/v1/auth/login", authHandler.Login)

	// Audit Logs Handler
	mux.HandleFunc("GET /api/v1/audit/logs", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		entries := audit.GetLogger().GetEntries()
		w.WriteHeader(http.StatusOK)
		_ = json.NewEncoder(w).Encode(map[string]interface{}{
			"total": len(entries),
			"logs":  entries,
		})
	})

	// 2. Connector Provider Factory
	factory := connector.NewProviderFactory()

	ethProvider := connector.NewEthereumProvider(cfg.PostgresUser, "")
	tronProvider := connector.NewTronProvider("", "")
	mockEthProvider := connector.NewMockProvider("ethereum")
	mockTronProvider := connector.NewMockProvider("tron")

	if cfg.AppEnv == "development" || cfg.PostgresUser == "tracex" {
		factory.RegisterProvider("ethereum", mockEthProvider)
		factory.RegisterProvider("tron", mockTronProvider)
	} else {
		factory.RegisterProvider("ethereum", ethProvider)
		factory.RegisterProvider("tron", tronProvider)
	}

	// 3. Repositories & Core Services
	pgRepo := repository.NewMemoryPostgresRepo()
	neoRepo := repository.NewMemoryNeo4jRepo()
	ingestionSvc := service.NewIngestionService(factory, pgRepo, neoRepo)
	graphSvc := service.NewGraphTraversalService()
	intelSvc := service.NewIntelligenceService()
	poaeEngine := attribution.NewPoAEEngine()
	attrSvc := service.NewAttributionService(poaeEngine)
	riskSvc := service.NewRiskAssessmentService()
	copilotSvc := service.NewCopilotService(graphSvc, attrSvc, riskSvc, intelSvc, pgRepo)
	reportSvc := service.NewReportService(graphSvc, attrSvc, riskSvc, intelSvc)
	sahyogClient := sahyog.NewMockSahyogClient()
	sahyogSvc := service.NewSahyogService(sahyogClient)
	demoSvc := service.NewDemoService(pgRepo)

	// 4. Handlers Initialization
	invHandler := handler.NewInvestigationHandler(ingestionSvc, pgRepo)
	graphHandler := handler.NewGraphHandler(graphSvc)
	intelHandler := handler.NewIntelligenceHandler(intelSvc)
	attrHandler := handler.NewAttributionHandler(attrSvc)
	riskHandler := handler.NewRiskHandler(riskSvc)
	copilotHandler := handler.NewCopilotHandler(copilotSvc)
	reportHandler := handler.NewReportHandler(reportSvc)
	sahyogHandler := handler.NewSahyogHandler(sahyogSvc)
	demoHandler := handler.NewDemoHandler(demoSvc)

	// 5. Route Registrations
	mux.HandleFunc("POST /api/v1/investigations", invHandler.StartInvestigation)
	mux.HandleFunc("GET /api/v1/investigations/{id}", invHandler.GetInvestigation)
	mux.HandleFunc("GET /api/v1/investigations/{id}/progress", invHandler.GetInvestigationProgress)
	mux.HandleFunc("GET /api/v1/investigations/{id}/graph", graphHandler.GetInvestigationGraph)
	mux.HandleFunc("GET /api/v1/investigations/{id}/attributions", attrHandler.GetInvestigationAttributions)
	mux.HandleFunc("GET /api/v1/investigations/{id}/risk", riskHandler.GetInvestigationRisk)
	mux.HandleFunc("POST /api/v1/investigations/{id}/copilot", copilotHandler.QueryCopilot)
	mux.HandleFunc("GET /api/v1/investigations/{id}/report", reportHandler.GetInvestigationReport)
	mux.HandleFunc("GET /api/v1/investigations/{id}/report/download", reportHandler.DownloadInvestigationReportPDF)

	// Controlled Demonstration Endpoints
	mux.HandleFunc("POST /api/v1/demo/load-investment-fraud", demoHandler.LoadInvestmentFraud)
	mux.HandleFunc("POST /api/v1/demo/load-cross-chain", demoHandler.LoadCrossChain)

	// SAHYOG Integration Endpoints
	mux.HandleFunc("GET /api/v1/sahyog/status", sahyogHandler.GetStatus)
	mux.HandleFunc("POST /api/v1/sahyog/disclosure-draft", sahyogHandler.PrepareDisclosureDraft)
	mux.HandleFunc("POST /api/v1/sahyog/freeze-draft", sahyogHandler.PrepareFreezeDraft)
	mux.HandleFunc("POST /api/v1/sahyog/submit", sahyogHandler.SubmitWithConfirmation)

	// Intelligence Endpoints
	mux.HandleFunc("POST /api/v1/intelligence/labels", intelHandler.RegisterLabel)
	mux.HandleFunc("GET /api/v1/intelligence/labels/{address}", intelHandler.LookupLabel)
	mux.HandleFunc("GET /api/v1/intelligence/vasps", intelHandler.ListVASPs)
	mux.HandleFunc("GET /api/v1/intelligence/vasps/{id}", intelHandler.GetVASPByID)

	// Middleware Security Pipeline
	securedMux := middleware.SecurityHeaders(middleware.RateLimiter(middleware.JWTAuthMiddleware(cfg.PostgresPassword)(mux)))

	return enableCORS(securedMux)
}

func enableCORS(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")

		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusOK)
			return
		}

		next.ServeHTTP(w, r)
	})
}
