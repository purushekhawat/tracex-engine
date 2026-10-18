import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    app_name: str = "TRACE-X Analytics Engine"
    app_env: str = os.getenv("APP_ENV", "development")
    port: int = int(os.getenv("PORT", "5000"))
    neo4j_uri: str = os.getenv("NEO4J_URI", "bolt://localhost:7687")
    neo4j_user: str = os.getenv("NEO4J_USER", "neo4j")
    neo4j_password: str = os.getenv("NEO4J_PASSWORD", "tracex_neo4j_secret")

settings = Settings()
