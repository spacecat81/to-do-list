from fastapi import APIRouter
from .todos import router, todos

@router.get("/all", summary="Get all todos")
async def get_todos():
    for todo in todos:
        print(todo)
    return todos
