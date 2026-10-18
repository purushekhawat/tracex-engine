package config

import (
	"os"
)

type Config struct {
	AppEnv               string
	Port                 string
	PostgresHost         string
	PostgresPort         string
	PostgresUser         string
	PostgresPassword     string
	PostgresDB           string
	Neo4jURI             string
	Neo4jUser            string
	Neo4jPassword        string
	RedisHost            string
	RedisPort            string
	AnalyticsServiceURL string
}

func Load() *Config {
	return &Config{
		AppEnv:               getEnv("APP_ENV", "development"),
		Port:                 getEnv("PORT", "8080"),
		PostgresHost:         getEnv("POSTGRES_HOST", "localhost"),
		PostgresPort:         getEnv("POSTGRES_PORT", "5432"),
		PostgresUser:         getEnv("POSTGRES_USER", "tracex"),
		PostgresPassword:     getEnv("POSTGRES_PASSWORD", "tracex_secret_password"),
		PostgresDB:           getEnv("POSTGRES_DB", "tracex_db"),
		Neo4jURI:             getEnv("NEO4J_URI", "bolt://localhost:7687"),
		Neo4jUser:            getEnv("NEO4J_USER", "neo4j"),
		Neo4jPassword:        getEnv("NEO4J_PASSWORD", "tracex_neo4j_secret"),
		RedisHost:            getEnv("REDIS_HOST", "localhost"),
		RedisPort:            getEnv("REDIS_PORT", "6379"),
		AnalyticsServiceURL: getEnv("ANALYTICS_SERVICE_URL", "http://localhost:5000"),
	}
}

func getEnv(key, fallback string) string {
	if value, ok := os.LookupEnv(key); ok && value != "" {
		return value
	}
	return fallback
}
