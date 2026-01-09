from sqlmodel import SQLModel
from .session import engine
from ..models.user_task_models import User, Task


def create_db_and_tables():
    SQLModel.metadata.create_all(bind=engine)