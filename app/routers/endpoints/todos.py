from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import delete, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models import TaskStatus, Todo, TodoCreate, TodoDB

router = APIRouter(prefix="/todos", tags=["To-do list"])


def todo_db_to_pydantic(todo_db: TodoDB) -> Todo:
    return Todo(
        id=todo_db.id,
        title=todo_db.title,
        description=todo_db.description,
        status=TaskStatus(todo_db.status),
        created_at=todo_db.created_at,
    )


@router.get("/", summary="Get all todos")
async def get_todos(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(TodoDB))
    todos = result.scalars().all()
    return [todo_db_to_pydantic(todo) for todo in todos]


@router.get("/{todo_id}", summary="Get a todo by id")
async def get_todo(todo_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(TodoDB).where(TodoDB.id == todo_id))
    todo_db = result.scalar_one_or_none()
    if todo_db is None:
        raise HTTPException(status_code=404, detail="Todo not found")
    return todo_db_to_pydantic(todo_db)


@router.post("/", summary="Create a todo")
async def create_todo(todo: TodoCreate, db: AsyncSession = Depends(get_db)):
    new_todo_db = TodoDB(
        title=todo.title,
        description=todo.description,
        status=TaskStatus.TODO,
    )
    db.add(new_todo_db)
    await db.commit()
    await db.refresh(new_todo_db)
    return todo_db_to_pydantic(new_todo_db)


@router.put("/{todo_id}", summary="Update a todo")
async def update_todo(
    todo_id: int,
    updated_todo: Todo,
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(select(TodoDB).where(TodoDB.id == todo_id))
    todo_db = result.scalar_one_or_none()
    if todo_db is None:
        raise HTTPException(status_code=404, detail="Todo not found")

    todo_db.title = updated_todo.title
    todo_db.description = updated_todo.description
    todo_db.status = updated_todo.status
    await db.commit()
    await db.refresh(todo_db)
    return todo_db_to_pydantic(todo_db)


@router.patch("/{todo_id}/status", summary="Update todo status")
async def update_todo_status(
    todo_id: int,
    status: TaskStatus,
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(select(TodoDB).where(TodoDB.id == todo_id))
    todo_db = result.scalar_one_or_none()
    if todo_db is None:
        raise HTTPException(status_code=404, detail="Todo not found")

    todo_db.status = status
    await db.commit()
    await db.refresh(todo_db)
    return todo_db_to_pydantic(todo_db)


@router.delete("/{todo_id}", summary="Delete a todo")
async def delete_todo(todo_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(TodoDB).where(TodoDB.id == todo_id))
    todo_db = result.scalar_one_or_none()
    if todo_db is None:
        raise HTTPException(status_code=404, detail="Todo not found")

    await db.execute(delete(TodoDB).where(TodoDB.id == todo_id))
    await db.commit()
    return todo_db_to_pydantic(todo_db)
