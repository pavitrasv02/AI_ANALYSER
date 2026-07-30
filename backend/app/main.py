from pathlib import Path
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

from app.routers.ai_router import router as ai_router

# Load backend/.env
env_path = Path(__file__).resolve().parents[1] / ".env"
load_dotenv(env_path)

app = FastAPI(title="AIVOA Complaint Management")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(ai_router)

frontend_dist = Path(__file__).resolve().parents[2] / "frontend" / "dist"

if frontend_dist.exists():
    app.mount(
        "/assets",
        StaticFiles(directory=frontend_dist / "assets"),
        name="assets",
    )

    @app.get("/{full_path:path}")
    async def serve_react(full_path: str):
        return FileResponse(frontend_dist / "index.html")