from fastapi import APIRouter, HTTPException
from datetime import datetime, timezone
from models import Todo

router = APIRouter(prefix="/todos", tags=["To-do list"])

todos = []

def get_next_id():
    return len(todos) + 1

def find_todo_by_id(todo_id: int):
    for todo in todos:
        if todo.id == todo_id:
            return todo
    return None


@router.get("/", summary="Get all todos")
async def get_todos():
    for todo in todos:
        print(todo)
    return todos


@router.get("/{todo_id}", summary="Get a todo by id")
async def get_todo(todo_id: int):
    todo = find_todo_by_id(todo_id)
    if todo is None:
        raise HTTPException(status_code=404, detail="Todo not found")
    return todo


@router.post("/", summary="Create a todo")
async def create_todo(todo: Todo):
    new_todo = Todo(
        id=get_next_id(),
        title=todo.title,
        description=todo.description,
        created_at=datetime.now(timezone.utc)
    )
    todos.append(new_todo)
    return new_todo


@router.put("/{todo_id}", summary="Update a todo")
async def update_todo(todo_id: int, updated_todo: Todo):
    todo = find_todo_by_id(todo_id)
    if todo is None:
        raise HTTPException(status_code=404, detail="Todo not found")
    
    todo.title = updated_todo.title
    todo.description = updated_todo.description
    return todo


@router.delete("/{todo_id}", summary="Delete a todo")
async def delete_todo(todo_id: int):
    todo = find_todo_by_id(todo_id)
    if todo is None:
        raise HTTPException(status_code=404, detail="Todo not found")
    
    todos.remove(todo)
    return todo
