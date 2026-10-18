package main

import (
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/sih26182/tracex-backend/internal/config"
	"github.com/sih26182/tracex-backend/internal/router"
)

func main() {
	cfg := config.Load()
	r := router.SetupRoutes(cfg)

	addr := fmt.Sprintf(":%s", cfg.Port)
	log.Printf("[TRACE-X Backend] Engine starting on port %s in %s mode...", cfg.Port, cfg.AppEnv)

	if err := http.ListenAndServe(addr, r); err != nil {
		log.Printf("Server failed: %v", err)
		os.Exit(1)
	}
}
