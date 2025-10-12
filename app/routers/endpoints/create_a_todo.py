from fastapi import APIRouter
from datetime import datetime, timezone
from models import Todo
from .todos import router, todos, get_next_id


@router.post("/create", summary="Create a todo")
async def create_todo(todo: Todo):
    new_todo = Todo(
        id=get_next_id(),
        title=todo.title,
        description=todo.description,
        created_at=datetime.now(timezone.utc)
    )
    todos.append(new_todo)
    return new_todo
