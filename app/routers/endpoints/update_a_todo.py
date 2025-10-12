from fastapi import APIRouter, HTTPException
from models import Todo
from .todos import router, todos, find_todo_by_id

@router.put("/update/{todo_id}", summary="Update a todo")
async def update_todo(todo_id: int, updated_todo: Todo):
    todo = find_todo_by_id(todo_id)
    if todo is None:
        raise HTTPException(status_code=404, detail="Todo not found")
    
    todo.title = updated_todo.title
    todo.description = updated_todo.description
    return todo
