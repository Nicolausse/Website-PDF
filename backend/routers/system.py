from fastapi import APIRouter

router = APIRouter(prefix="/api/system", tags=["System"])

@router.get("/health")
async def health_check():
    """System health check endpoint."""
    return {
        "status": "online",
        "app": "ChangeFilePDF Backend Engine",
        "version": "1.0.0",
        "supported_tools_count": 31
    }
