from fastapi import APIRouter, HTTPException
from .todos import router, todos, find_todo_by_id

@router.delete("/delete/{todo_id}", summary="Delete a todo")
async def delete_todo(todo_id: int):
    todo = find_todo_by_id(todo_id)
    if todo is None:
        raise HTTPException(status_code=404, detail="Todo not found")
    
    todos.remove(todo)
    return todo