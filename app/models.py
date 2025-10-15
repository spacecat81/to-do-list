from pydantic import BaseModel
from datetime import datetime
from enum import StrEnum


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
