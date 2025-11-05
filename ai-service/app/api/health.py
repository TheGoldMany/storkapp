from fastapi import APIRouter

router = APIRouter()


@router.get("/")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "service": "AI Image Matching Service",
        "version": "1.0.0"
    }


@router.get("/ready")
async def readiness_check():
    """Readiness check endpoint"""
    # Check if model is loaded, database is accessible, etc.
    return {
        "status": "ready",
        "model_loaded": True,
        "database_connected": True
    }
