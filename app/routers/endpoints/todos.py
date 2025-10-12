from fastapi import APIRouter
from datetime import datetime, timezone
from models import Todo

router = APIRouter()

todos = []

def get_next_id():
    return len(todos) + 1

def find_todo_by_id(todo_id: int):
    for todo in todos:
        if todo.id == todo_id:
            return todo
    return None
