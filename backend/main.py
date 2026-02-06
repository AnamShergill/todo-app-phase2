from datetime import datetime
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from src.api.tasks import router as tasks_router
from src.api.auth import router as auth_router
from src.database.init_db import create_db_and_tables
from src.models.user_task_models import User, Task  # Import models to register them
from contextlib import asynccontextmanager
from src.database.session import engine
from sqlmodel import SQLModel
import logging


@asynccontextmanager
async def lifespan(app: FastAPI):
    try:
        # Create database tables on startup
        create_db_and_tables()
        logging.info("Database tables created successfully")
    except Exception as e:
        logging.error(f"Error creating database tables: {e}")
        # Continue without failing the startup
    yield
    # Cleanup on shutdown if needed


app = FastAPI(
    title="TodoBoom API",
    description="API for exploding productivity in the TodoBoom application",
    version="1.0.0",
    lifespan=lifespan
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        os.getenv("FRONTEND_URL", "http://localhost:3000"),
        "https://todo-app-phase2-two.vercel.app",  # Your Vercel deployment
        "http://localhost:3000",  # Local Next.js dev server
        "http://localhost:3001",  # Alternative local dev server
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API routers
app.include_router(auth_router)
app.include_router(tasks_router)

@app.get("/")
def read_root():
    return {"message": "Welcome to the Todo API"}


@app.get("/health")
def health_check():
    return {"status": "healthy", "timestamp": datetime.utcnow()}