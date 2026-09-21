from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.assets import router as assets_router
from app.api.inspection_tasks import router as inspection_tasks_router
from app.api.risk_snapshots import router as risk_snapshots_router
from app.api.alerts import router as alerts_router

app = FastAPI(
    title="Signal Backend",
    description="Infrastructure risk intelligence API",
    version="1.0.0",
)

allowed_origins = [
    "http://localhost:5173",
    "http://localhost:5174",
    "http://127.0.0.1:5173",
    "http://127.0.0.1:5174",
    "https://signal-six-plum.vercel.app",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_origin_regex=r"https://signal-[a-z0-9-]+\.vercel\.app",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(assets_router)
app.include_router(inspection_tasks_router)
app.include_router(risk_snapshots_router)
app.include_router(alerts_router)


@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "service": "signal-backend",
    }
