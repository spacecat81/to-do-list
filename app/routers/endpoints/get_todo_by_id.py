from fastapi import APIRouter, HTTPException
from .todos import router, todos, find_todo_by_id

@router.get("/{todo_id}", summary="Get a todo by id")
async def get_todo(todo_id: int):
    todo = find_todo_by_id(todo_id)
    if todo is None:
        raise HTTPException(status_code=404, detail="Todo not found")
    return todo
