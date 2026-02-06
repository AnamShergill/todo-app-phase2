from sqlalchemy import create_engine
from sqlalchemy.pool import QueuePool
from sqlalchemy.orm import sessionmaker
from sqlmodel import Session
import os
from dotenv import load_dotenv

load_dotenv()

# Use environment variable for database URL, with SQLite as fallback for local development
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./todo_app.db")

# Configure engine with better connection pooling for Neon
if DATABASE_URL.startswith("postgresql"):
    # For PostgreSQL/Neon, use connection pooling parameters
    engine = create_engine(
        DATABASE_URL,
        poolclass=QueuePool,
        pool_size=5,
        max_overflow=10,
        pool_pre_ping=True,  # Verify connections before use
        pool_recycle=60,    # Recycle connections every 5 minutes
        pool_timeout=30,     # Increase timeout for slow connections
        echo=True
    )
else:
    # For SQLite, use default settings
    engine = create_engine(DATABASE_URL, echo=True)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def get_session():
    session = SessionLocal()
    try:
        yield session
    finally:
        session.close()