from pydantic import BaseModel
from datetime import datetime


class Todo(BaseModel):
    id: int
    title: str
    description: str
    created_at: datetime
