from pydantic import BaseModel
from datetime import datetime
from enum import Enum


class TaskStatus(Enum):
    TODO = "todo"
    IN_PROGRESS = "in_progress"
    DONE = "done"


class Todo(BaseModel):
    id: int
    title: str
    description: str
    status: TaskStatus = TaskStatus.TODO
    created_at: datetime
