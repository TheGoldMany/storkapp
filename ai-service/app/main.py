from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

from app.api import match, health

app = FastAPI(
    title="Stork App AI Service",
    description="AI-powered image matching service for lost and found pets",
    version="1.0.0"
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routes
app.include_router(health.router, prefix="/api/health", tags=["health"])
app.include_router(match.router, prefix="/api/match", tags=["matching"])

@app.get("/")
async def root():
    return {
        "service": "Stork App AI Service",
        "status": "running",
        "version": "1.0.0"
    }

if __name__ == "__main__":
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=True
    )
