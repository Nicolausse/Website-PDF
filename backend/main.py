import os
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

from backend.routers import conversion, manipulation, security, advanced, ai, system

app = FastAPI(
    title="ChangeFilePDF API",
    description="Backend API untuk pemrosesan, konversi, manipulasi, keamanan, dan analisis AI dokumen PDF.",
    version="1.0.0"
)

# Configure CORS for frontend access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["Content-Disposition"]
)

# Global exception handler
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    return JSONResponse(
        status_code=500,
        content={"detail": f"Terjadi kesalahan server internal: {str(exc)}"}
    )

# Include Routers
app.include_router(conversion.router)
app.include_router(manipulation.router)
app.include_router(security.router)
app.include_router(advanced.router)
app.include_router(ai.router)
app.include_router(system.router)

@app.get("/")
def root():
    return {
        "message": "Selamat datang di API ChangeFilePDF",
        "docs_url": "/docs",
        "status": "aktif"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.main:app", host="127.0.0.1", port=8000, reload=True)
