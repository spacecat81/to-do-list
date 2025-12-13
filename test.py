import os
import pytest
import pytest_asyncio
from httpx import AsyncClient, ASGITransport
from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker

from app.main import app
from app.models import TaskStatus, Base
from app.database import get_db

# Override database URL for tests to use SQLite
TEST_DATABASE_URL = "sqlite+aiosqlite:///./test.db"

# Create test engine with SQLite-specific settings
test_engine = create_async_engine(
    TEST_DATABASE_URL,
    echo=False,
    connect_args={"check_same_thread": False},  # SQLite-specific
)

TestAsyncSessionLocal = sessionmaker(
    test_engine,
    class_=AsyncSession,
    expire_on_commit=False,
)


# Override get_db dependency for tests
async def override_get_db():
    async with TestAsyncSessionLocal() as session:
        yield session


# Override the dependency in the app
app.dependency_overrides[get_db] = override_get_db


@pytest_asyncio.fixture(scope="session", autouse=True)
async def setup_database():
    """Create database tables before running tests."""
    async with test_engine.begin() as conn:
        # Enable foreign keys for SQLite
        await conn.execute(text("PRAGMA foreign_keys = ON"))
        await conn.run_sync(Base.metadata.create_all)
    yield
    # Cleanup: remove test database file
    await test_engine.dispose()
    if os.path.exists("./test.db"):
        os.remove("./test.db")


@pytest_asyncio.fixture(scope="function", autouse=True)
async def clean_db():
    """Clean database before each test."""
    async with TestAsyncSessionLocal() as session:
        # Enable foreign keys for SQLite
        await session.execute(text("PRAGMA foreign_keys = ON"))
        # SQLite doesn't support TRUNCATE, so we use DELETE
        await session.execute(text("DELETE FROM todos"))
        await session.execute(text("DELETE FROM users"))
        # Reset auto-increment for SQLite (if sequence table exists)
        try:
            await session.execute(text("DELETE FROM sqlite_sequence WHERE name IN ('todos', 'users')"))
        except Exception:
            # sqlite_sequence might not exist if no auto-increment was used yet
            pass
        await session.commit()
    yield


@pytest_asyncio.fixture
async def client():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        yield ac


@pytest_asyncio.fixture
async def authenticated_client(client: AsyncClient):
    """Create an authenticated client with a test user."""
    # Register a test user (clean_db runs before this, so user doesn't exist)
    user_data = {
        "email": "test@example.com",
        "username": "testuser",
        "password": "TestPassword123"
    }
    register_response = await client.post("/auth/register", json=user_data)
    assert register_response.status_code in [200, 201], f"Registration failed: {register_response.text}"
    
    # Login to get token
    login_data = {
        "username": "testuser",
        "password": "TestPassword123"
    }
    login_response = await client.post("/auth/login", data=login_data)
    assert login_response.status_code == 200, f"Login failed: {login_response.text}"
    token = login_response.json()["access_token"]
    
    # Create a new client with auth token in headers
    async with AsyncClient(
        transport=ASGITransport(app=app),
        base_url="http://test",
        headers={"Authorization": f"Bearer {token}"}
    ) as auth_client:
        yield auth_client


@pytest.mark.asyncio
async def test_ping(client: AsyncClient):
    response = await client.get("/ping")
    assert response.status_code == 200
    assert response.text == '"pong"'


@pytest.mark.asyncio
async def test_get_todos_empty(authenticated_client: AsyncClient):
    response = await authenticated_client.get("/todos/")
    assert response.status_code == 200
    assert response.json() == []


@pytest.mark.asyncio
async def test_create_todo(authenticated_client: AsyncClient):
    todo_data = {
        "title": "Test Todo",
        "description": "This is a test todo"
    }
    response = await authenticated_client.post("/todos/", json=todo_data)
    assert response.status_code == 201
    
    data = response.json()
    assert data["title"] == "Test Todo"
    assert data["description"] == "This is a test todo"
    assert data["status"] == TaskStatus.TODO
    assert data["id"] == 1
    assert "created_at" in data
    assert "owner_id" in data


@pytest.mark.asyncio
async def test_get_todos_with_data(authenticated_client: AsyncClient):
    todo_data = {
        "title": "Test Todo",
        "description": "This is a test todo"
    }
    await authenticated_client.post("/todos/", json=todo_data)
    response = await authenticated_client.get("/todos/")
    assert response.status_code == 200
    
    data = response.json()
    assert len(data) == 1
    assert data[0]["title"] == "Test Todo"
    assert data[0]["description"] == "This is a test todo"
    assert data[0]["status"] == TaskStatus.TODO
    assert "owner_id" in data[0]


@pytest.mark.asyncio
async def test_get_todo_by_id(authenticated_client: AsyncClient):
    todo_data = {
        "title": "Test Todo",
        "description": "This is a test todo"
    }
    create_response = await authenticated_client.post("/todos/", json=todo_data)
    todo_id = create_response.json()["id"]
    
    response = await authenticated_client.get(f"/todos/{todo_id}")
    assert response.status_code == 200
    
    data = response.json()
    assert data["title"] == "Test Todo"
    assert data["description"] == "This is a test todo"
    assert data["status"] == TaskStatus.TODO
    assert data["id"] == todo_id
    assert "owner_id" in data


@pytest.mark.asyncio
async def test_update_todo(authenticated_client: AsyncClient):
    todo_data = {
        "title": "Test Todo",
        "description": "This is a test todo"
    }
    create_response = await authenticated_client.post("/todos/", json=todo_data)
    todo_id = create_response.json()["id"]
    
    updated_todo_data = {
        "id": todo_id,
        "title": "Updated Todo",
        "description": "This is an updated todo",
        "status": TaskStatus.IN_PROGRESS,
        "created_at": create_response.json()["created_at"],
        "owner_id": create_response.json()["owner_id"]
    }
    response = await authenticated_client.put(f"/todos/{todo_id}", json=updated_todo_data)
    assert response.status_code == 200
    
    data = response.json()
    assert data["title"] == "Updated Todo"
    assert data["description"] == "This is an updated todo"
    assert data["status"] == TaskStatus.IN_PROGRESS
    assert data["id"] == todo_id
    assert "owner_id" in data


@pytest.mark.asyncio
async def test_update_todo_status(authenticated_client: AsyncClient):
    todo_data = {
        "title": "Test Todo",
        "description": "This is a test todo"
    }
    create_response = await authenticated_client.post("/todos/", json=todo_data)
    todo_id = create_response.json()["id"]
    
    response = await authenticated_client.patch(f"/todos/{todo_id}/status?status={TaskStatus.DONE}")
    assert response.status_code == 200
    
    data = response.json()
    assert data["title"] == "Test Todo"
    assert data["description"] == "This is a test todo"
    assert data["status"] == TaskStatus.DONE
    assert data["id"] == todo_id
    assert "owner_id" in data


@pytest.mark.asyncio
async def test_delete_todo(authenticated_client: AsyncClient):
    todo_data = {
        "title": "Test Todo",
        "description": "This is a test todo"
    }
    create_response = await authenticated_client.post("/todos/", json=todo_data)
    todo_id = create_response.json()["id"]
    
    response = await authenticated_client.delete(f"/todos/{todo_id}")
    assert response.status_code == 200
    
    data = response.json()
    assert data["title"] == "Test Todo"
    assert data["description"] == "This is a test todo"
    assert data["id"] == todo_id
    
    get_response = await authenticated_client.get(f"/todos/{todo_id}")
    assert get_response.status_code == 404


@pytest.mark.asyncio
async def test_get_todos_after_operations(authenticated_client: AsyncClient):
    todo1_data = {"title": "Todo 1", "description": "First todo"}
    todo2_data = {"title": "Todo 2", "description": "Second todo"}
    
    await authenticated_client.post("/todos/", json=todo1_data)
    await authenticated_client.post("/todos/", json=todo2_data)
    
    response = await authenticated_client.get("/todos/")
    assert response.status_code == 200
    
    data = response.json()
    assert len(data) == 2
    
    titles = [todo["title"] for todo in data]
    assert "Todo 1" in titles
    assert "Todo 2" in titles
    
    # Check that all todos have owner_id
    for todo in data:
        assert "owner_id" in todo


@pytest.mark.asyncio
async def test_unauthorized_access(client: AsyncClient):
    """Test that unauthenticated requests to todos return 401."""
    response = await client.get("/todos/")
    assert response.status_code == 401
    
    response = await client.post("/todos/", json={"title": "Test", "description": "Test"})
    assert response.status_code == 401


@pytest.mark.asyncio
async def test_user_isolation(client: AsyncClient):
    """Test that users can only see their own todos."""
    # Create first user and todo
    user1_data = {
        "email": "user1@example.com",
        "username": "user1",
        "password": "Password123"
    }
    reg1 = await client.post("/auth/register", json=user1_data)
    assert reg1.status_code in [200, 201], f"User1 registration failed: {reg1.text}"
    login1 = await client.post("/auth/login", data={"username": "user1", "password": "Password123"})
    assert login1.status_code == 200, f"User1 login failed: {login1.text}"
    token1 = login1.json()["access_token"]
    
    async with AsyncClient(
        transport=ASGITransport(app=app),
        base_url="http://test",
        headers={"Authorization": f"Bearer {token1}"}
    ) as client1:
        todo1_resp = await client1.post("/todos/", json={"title": "User1 Todo", "description": "User1's todo"})
        assert todo1_resp.status_code == 201, f"User1 todo creation failed: {todo1_resp.text}"
    
    # Create second user and todo
    user2_data = {
        "email": "user2@example.com",
        "username": "user2",
        "password": "Password123"
    }
    reg2 = await client.post("/auth/register", json=user2_data)
    assert reg2.status_code in [200, 201], f"User2 registration failed: {reg2.text}"
    login2 = await client.post("/auth/login", data={"username": "user2", "password": "Password123"})
    assert login2.status_code == 200, f"User2 login failed: {login2.text}"
    token2 = login2.json()["access_token"]
    
    async with AsyncClient(
        transport=ASGITransport(app=app),
        base_url="http://test",
        headers={"Authorization": f"Bearer {token2}"}
    ) as client2:
        todo2_resp = await client2.post("/todos/", json={"title": "User2 Todo", "description": "User2's todo"})
        assert todo2_resp.status_code == 201, f"User2 todo creation failed: {todo2_resp.text}"
        
        # User2 should only see their own todo
        response = await client2.get("/todos/")
        assert response.status_code == 200
        todos = response.json()
        assert len(todos) == 1
        assert todos[0]["title"] == "User2 Todo"
        assert "owner_id" in todos[0]
