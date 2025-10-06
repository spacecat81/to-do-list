from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from datetime import datetime


class Todo(BaseModel):
    id: int
    title: str
    description: str
    created_at: datetime


todos = []


app = FastAPI()


@app.get("/ping", tags=["Ping"], summary="Pong :D")
async def ping():
    return "pong"


@app.get("/todos", tags=["To-do list"], summary="Get all todos")
async def get_todos():
    if not todos:
        return {"message": "No active tasks."}

    for todo in todos:
        print(todo)
    return todos


@app.get("/todos/{todo_id}", tags=["To-do list"], summary="Get a todo by id")
async def get_todo(todo_id: int):
    for todo in todos:
        if todo.id == todo_id:
            return todo
    raise HTTPException(status_code=404, detail="Todo not found")


@app.post("/create-todo", tags=["To-do list"], summary="Create a todo")
async def create_todo(todo: Todo):
    new_todo = Todo(
        id=len(todos) + 1,
        title=todo.title,
        description=todo.description,
        created_at=datetime.now()
    )
    todos.append(new_todo)
    return new_todo


@app.put("/update-todo/{todo_id}", tags=["To-do list"], summary="Update a todo")
async def update_todo(todo_id: int, updated_todo: Todo):
    for todo in todos:
        if todo.id == todo_id:
            todo.title = updated_todo.title
            todo.description = updated_todo.description
            return todo
    raise HTTPException(status_code=404, detail="Todo not found")


@app.delete("/delete-todo/{todo_id}", tags=["To-do list"], summary="Delete a todo")
async def delete_todo(todo_id: int):
    for todo in todos:
        if todo.id == todo_id:
            todos.remove(todo)
            return todo
    raise HTTPException(status_code=404, detail="Todo not found")
