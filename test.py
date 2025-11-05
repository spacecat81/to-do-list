import pytest
import pytest_asyncio
from httpx import AsyncClient, ASGITransport
from sqlalchemy import text

from app.main import app
from app.models import TaskStatus
from app.database import AsyncSessionLocal


@pytest_asyncio.fixture(scope="function", autouse=True)
async def clean_db():
    """Clean database before each test and reset auto-increment counter."""
    async with AsyncSessionLocal() as session:
        await session.execute(text("TRUNCATE TABLE todos RESTART IDENTITY CASCADE"))
        await session.commit()


@pytest_asyncio.fixture
async def client():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        yield ac


@pytest.mark.asyncio
async def test_ping(client: AsyncClient):
    response = await client.get("/ping")
    assert response.status_code == 200
    assert response.text == '"pong"'


@pytest.mark.asyncio
async def test_get_todos_empty(client: AsyncClient):
    response = await client.get("/todos/")
    assert response.status_code == 200
    assert response.json() == []


@pytest.mark.asyncio
async def test_create_todo(client: AsyncClient):
    todo_data = {
        "title": "Test Todo",
        "description": "This is a test todo"
    }
    response = await client.post("/todos/", json=todo_data)
    assert response.status_code == 200
    
    data = response.json()
    assert data["title"] == "Test Todo"
    assert data["description"] == "This is a test todo"
    assert data["status"] == TaskStatus.TODO
    assert data["id"] == 1
    assert "created_at" in data


@pytest.mark.asyncio
async def test_get_todos_with_data(client: AsyncClient):
    todo_data = {
        "title": "Test Todo",
        "description": "This is a test todo"
    }
    await client.post("/todos/", json=todo_data)
    response = await client.get("/todos/")
    assert response.status_code == 200
    
    data = response.json()
    assert len(data) == 1
    assert data[0]["title"] == "Test Todo"
    assert data[0]["description"] == "This is a test todo"
    assert data[0]["status"] == TaskStatus.TODO


@pytest.mark.asyncio
async def test_get_todo_by_id(client: AsyncClient):
    todo_data = {
        "title": "Test Todo",
        "description": "This is a test todo"
    }
    create_response = await client.post("/todos/", json=todo_data)
    todo_id = create_response.json()["id"]
    
    response = await client.get(f"/todos/{todo_id}")
    assert response.status_code == 200
    
    data = response.json()
    assert data["title"] == "Test Todo"
    assert data["description"] == "This is a test todo"
    assert data["status"] == TaskStatus.TODO
    assert data["id"] == todo_id


@pytest.mark.asyncio
async def test_update_todo(client: AsyncClient):
    todo_data = {
        "title": "Test Todo",
        "description": "This is a test todo"
    }
    create_response = await client.post("/todos/", json=todo_data)
    todo_id = create_response.json()["id"]
    
    updated_todo_data = {
        "id": todo_id,
        "title": "Updated Todo",
        "description": "This is an updated todo",
        "status": TaskStatus.IN_PROGRESS,
        "created_at": create_response.json()["created_at"]
    }
    response = await client.put(f"/todos/{todo_id}", json=updated_todo_data)
    assert response.status_code == 200
    
    data = response.json()
    assert data["title"] == "Updated Todo"
    assert data["description"] == "This is an updated todo"
    assert data["status"] == TaskStatus.IN_PROGRESS
    assert data["id"] == todo_id


@pytest.mark.asyncio
async def test_update_todo_status(client: AsyncClient):
    todo_data = {
        "title": "Test Todo",
        "description": "This is a test todo"
    }
    create_response = await client.post("/todos/", json=todo_data)
    todo_id = create_response.json()["id"]
    
    response = await client.patch(f"/todos/{todo_id}/status?status={TaskStatus.DONE}")
    assert response.status_code == 200
    
    data = response.json()
    assert data["title"] == "Test Todo"
    assert data["description"] == "This is a test todo"
    assert data["status"] == TaskStatus.DONE
    assert data["id"] == todo_id


@pytest.mark.asyncio
async def test_delete_todo(client: AsyncClient):
    todo_data = {
        "title": "Test Todo",
        "description": "This is a test todo"
    }
    create_response = await client.post("/todos/", json=todo_data)
    todo_id = create_response.json()["id"]
    
    response = await client.delete(f"/todos/{todo_id}")
    assert response.status_code == 200
    
    data = response.json()
    assert data["title"] == "Test Todo"
    assert data["description"] == "This is a test todo"
    assert data["id"] == todo_id
    
    get_response = await client.get(f"/todos/{todo_id}")
    assert get_response.status_code == 404


@pytest.mark.asyncio
async def test_get_todos_after_operations(client: AsyncClient):
    todo1_data = {"title": "Todo 1", "description": "First todo"}
    todo2_data = {"title": "Todo 2", "description": "Second todo"}
    
    await client.post("/todos/", json=todo1_data)
    await client.post("/todos/", json=todo2_data)
    
    response = await client.get("/todos/")
    assert response.status_code == 200
    
    data = response.json()
    assert len(data) == 2
    
    titles = [todo["title"] for todo in data]
    assert "Todo 1" in titles
    assert "Todo 2" in titles
