from datetime import datetime
from enum import StrEnum

from pydantic import BaseModel
from sqlalchemy import Column, DateTime, Enum as SQLEnum, Integer, String
from sqlalchemy.sql import func

from app.database import Base


class TaskStatus(StrEnum):
    TODO = "todo"
    IN_PROGRESS = "in_progress"
    DONE = "done"


class TodoCreate(BaseModel):
    title: str
    description: str


class Todo(BaseModel):
    id: int
    title: str
    description: str
    status: TaskStatus = TaskStatus.TODO
    created_at: datetime


class TodoDB(Base):
    __tablename__ = "todos"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(String, nullable=False)
    status = Column(
        SQLEnum(TaskStatus, native_enum=False), default=TaskStatus.TODO, nullable=False
    )
    created_at = Column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )
