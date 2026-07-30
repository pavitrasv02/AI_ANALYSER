from pathlib import Path

from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers.ai_router import router as ai_router

# Load backend/.env
env_path = Path(__file__).resolve().parents[1] / ".env"
load_dotenv(env_path)
from pathlib import Path
from dotenv import load_dotenv
import os

env_path = Path(__file__).resolve().parents[1] / ".env"
print("Loading .env from:", env_path)
load_dotenv(env_path)
print("MAIN:", os.getenv("GROQ_API_KEY"))
app = FastAPI(title="AIVOA Complaint Management")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(ai_router)

@app.get("/")
def root():
    return {"message": "Backend is running"}