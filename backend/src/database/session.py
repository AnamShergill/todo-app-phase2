from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlmodel import Session
import os
from dotenv import load_dotenv

load_dotenv()

# Use environment variable for database URL, with SQLite as fallback for local development
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./todo_app.db")

engine = create_engine(DATABASE_URL, echo=True)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def get_session():
    session = SessionLocal()
    try:
        yield session
    finally:
        session.close()