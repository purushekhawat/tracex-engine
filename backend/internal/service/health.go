package service

import (
	"context"
	"fmt"
	"net"
	"net/http"
	"time"

	"github.com/sih26182/tracex-backend/internal/config"
)

type DependencyStatus struct {
	Name    string `json:"name"`
	Status  string `json:"status"` // "healthy" or "unhealthy"
	Details string `json:"details,omitempty"`
}

type HealthService struct {
	cfg *config.Config
}

func NewHealthService(cfg *config.Config) *HealthService {
	return &HealthService{cfg: cfg}
}

func (s *HealthService) CheckHealth() map[string]interface{} {
	return map[string]interface{}{
		"status":    "healthy",
		"service":   "tracex-backend",
		"version":   "v1.0.0",
		"timestamp": time.Now().Format(time.RFC3339),
	}
}

func (s *HealthService) CheckDependencies(ctx context.Context) map[string]interface{} {
	dependencies := make([]DependencyStatus, 0)

	// Check Postgres TCP connectivity
	pgAddr := fmt.Sprintf("%s:%s", s.cfg.PostgresHost, s.cfg.PostgresPort)
	dependencies = append(dependencies, checkTCPDependency("postgresql", pgAddr))

	// Check Neo4j TCP connectivity
	neoAddr := fmt.Sprintf("%s:%s", s.cfg.Neo4jURI, "7687") // default bolt port
	dependencies = append(dependencies, checkTCPDependency("neo4j", neoAddr))

	// Check Redis TCP connectivity
	redisAddr := fmt.Sprintf("%s:%s", s.cfg.RedisHost, s.cfg.RedisPort)
	dependencies = append(dependencies, checkTCPDependency("redis", redisAddr))

	// Check Analytics Microservice HTTP health
	analyticsStatus := checkHTTPDependency("analytics-service", s.cfg.AnalyticsServiceURL+"/health")
	dependencies = append(dependencies, analyticsStatus)

	allHealthy := true
	for _, dep := range dependencies {
		if dep.Status != "healthy" {
			allHealthy = false
			break
		}
	}

	overallStatus := "healthy"
	if !allHealthy {
		overallStatus = "degraded"
	}

	return map[string]interface{}{
		"status":       overallStatus,
		"timestamp":    time.Now().Format(time.RFC3339),
		"dependencies": dependencies,
	}
}

func checkTCPDependency(name, addr string) DependencyStatus {
	conn, err := net.DialTimeout("tcp", addr, 1*time.Second)
	if err != nil {
		return DependencyStatus{
			Name:    name,
			Status:  "unhealthy",
			Details: fmt.Sprintf("TCP dial failed: %v", err),
		}
	}
	_ = conn.Close()
	return DependencyStatus{
		Name:    name,
		Status:  "healthy",
		Details: "Connection established",
	}
}

func checkHTTPDependency(name, url string) DependencyStatus {
	client := &http.Client{Timeout: 1 * time.Second}
	resp, err := client.Get(url)
	if err != nil || resp.StatusCode != http.StatusOK {
		details := "HTTP request failed"
		if err != nil {
			details = err.Error()
		} else if resp != nil {
			details = fmt.Sprintf("Status code: %d", resp.StatusCode)
		}
		return DependencyStatus{
			Name:    name,
			Status:  "unhealthy",
			Details: details,
		}
	}
	_ = resp.Body.Close()
	return DependencyStatus{
		Name:    name,
		Status:  "healthy",
		Details: "HTTP 200 OK",
	}
}
