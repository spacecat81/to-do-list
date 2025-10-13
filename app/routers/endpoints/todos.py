from fastapi import APIRouter, HTTPException
from datetime import datetime, timezone
from models import Todo, TaskStatus

router = APIRouter(prefix="/todos", tags=["To-do list"])

todos = {}

def get_next_id():
    return len(todos) + 1

def find_todo_by_id(todo_id: int):
    return todos.get(todo_id)


@router.get("/", summary="Get all todos")
async def get_todos():
    return list(todos.values())


@router.get("/{todo_id}", summary="Get a todo by id")
async def get_todo(todo_id: int):
    todo = find_todo_by_id(todo_id)
    if todo is None:
        raise HTTPException(status_code=404, detail="Todo not found")
    return todo


@router.post("/", summary="Create a todo")
async def create_todo(todo: Todo):
    todo_id = get_next_id()
    new_todo = Todo(
        id=todo_id,
        title=todo.title,
        description=todo.description,
        status=todo.status,
        created_at=datetime.now(timezone.utc)
    )
    todos[todo_id] = new_todo
    return new_todo


@router.put("/{todo_id}", summary="Update a todo")
async def update_todo(todo_id: int, updated_todo: Todo):
    todo = find_todo_by_id(todo_id)
    if todo is None:
        raise HTTPException(status_code=404, detail="Todo not found")
    
    todo.title = updated_todo.title
    todo.description = updated_todo.description
    todo.status = updated_todo.status
    todos[todo_id] = todo
    return todo


@router.patch("/{todo_id}/status", summary="Update todo status")
async def update_todo_status(todo_id: int, status: TaskStatus):
    todo = find_todo_by_id(todo_id)
    if todo is None:
        raise HTTPException(status_code=404, detail="Todo not found")
    
    todo.status = status
    todos[todo_id] = todo
    return todo


@router.delete("/{todo_id}", summary="Delete a todo")
async def delete_todo(todo_id: int):
    todo = todos.pop(todo_id, None)
    if todo is None:
        raise HTTPException(status_code=404, detail="Todo not found")
    
    return todo
