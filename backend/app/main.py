from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import Base, engine
from app.models import Asset

from app.api.assets import router as assets_router
from app.api.inspection_tasks import (
    router as inspection_tasks_router,
)
from app.api.risk_snapshots import (
    router as risk_snapshots_router,
)
from app.api.alerts import (
    router as alerts_router,
)


# --------------------------------------------------
# Create database tables
# --------------------------------------------------

Base.metadata.create_all(bind=engine)


# --------------------------------------------------
# FastAPI application
# --------------------------------------------------

app = FastAPI(
    title="Signal API",
    description=(
        "Infrastructure intelligence and "
        "risk monitoring API"
    ),
    version="1.0.0",
)


# --------------------------------------------------
# CORS
# --------------------------------------------------

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:5174",
        "http://127.0.0.1:5174",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# --------------------------------------------------
# API routers
# --------------------------------------------------

app.include_router(assets_router)

app.include_router(
    inspection_tasks_router
)

app.include_router(
    risk_snapshots_router
)

app.include_router(
    alerts_router
)


# --------------------------------------------------
# Root endpoint
# --------------------------------------------------

@app.get("/")
def root():
    return {
        "name": "Signal API",
        "status": "operational",
        "version": "1.0.0",
    }


# --------------------------------------------------
# Health endpoint
# --------------------------------------------------

@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "service": "signal-backend",
    }