from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import health, graph, risk
from app.config import settings

app = FastAPI(
    title="TRACE-X Graph Analytics Engine",
    description="Python microservice for graph traversal, explainable attribution scoring, and risk typologies",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health.router)
app.include_router(graph.router)
app.include_router(risk.router)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=settings.port, reload=True)
