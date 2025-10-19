import pytest
from fastapi.testclient import TestClient

from app.main import app
from app.models import TaskStatus
from app.routers.endpoints.todos import todos

client = TestClient(app)


@pytest.fixture(autouse=True)
def clear_todos():
    todos.clear()
    yield
    todos.clear()


def test_ping():
    response = client.get("/ping")
    assert response.status_code == 200
    assert response.text == '"pong"'


def test_get_todos_empty():
    response = client.get("/todos/")
    assert response.status_code == 200
    assert response.json() == []


def test_create_todo():
    todo_data = {
        "title": "Test Todo",
        "description": "This is a test todo"
    }
    response = client.post("/todos/", json=todo_data)
    assert response.status_code == 200
    
    data = response.json()
    assert data["title"] == "Test Todo"
    assert data["description"] == "This is a test todo"
    assert data["status"] == TaskStatus.TODO
    assert data["id"] == 1
    assert "created_at" in data


def test_get_todos_with_data():
    todo_data = {
        "title": "Test Todo",
        "description": "This is a test todo"
    }
    client.post("/todos/", json=todo_data)
    response = client.get("/todos/")
    assert response.status_code == 200
    
    data = response.json()
    assert len(data) == 1
    assert data[0]["title"] == "Test Todo"
    assert data[0]["description"] == "This is a test todo"
    assert data[0]["status"] == TaskStatus.TODO


def test_get_todo_by_id():
    todo_data = {
        "title": "Test Todo",
        "description": "This is a test todo"
    }
    create_response = client.post("/todos/", json=todo_data)
    todo_id = create_response.json()["id"]
    
    response = client.get(f"/todos/{todo_id}")
    assert response.status_code == 200
    
    data = response.json()
    assert data["title"] == "Test Todo"
    assert data["description"] == "This is a test todo"
    assert data["status"] == TaskStatus.TODO
    assert data["id"] == todo_id


def test_update_todo():
    todo_data = {
        "title": "Test Todo",
        "description": "This is a test todo"
    }
    create_response = client.post("/todos/", json=todo_data)
    todo_id = create_response.json()["id"]
    
    updated_todo_data = {
        "id": todo_id,
        "title": "Updated Todo",
        "description": "This is an updated todo",
        "status": TaskStatus.IN_PROGRESS,
        "created_at": create_response.json()["created_at"]
    }
    response = client.put(f"/todos/{todo_id}", json=updated_todo_data)
    assert response.status_code == 200
    
    data = response.json()
    assert data["title"] == "Updated Todo"
    assert data["description"] == "This is an updated todo"
    assert data["status"] == TaskStatus.IN_PROGRESS
    assert data["id"] == todo_id


def test_update_todo_status():
    todo_data = {
        "title": "Test Todo",
        "description": "This is a test todo"
    }
    create_response = client.post("/todos/", json=todo_data)
    todo_id = create_response.json()["id"]
    
    response = client.patch(f"/todos/{todo_id}/status?status={TaskStatus.DONE}")
    assert response.status_code == 200
    
    data = response.json()
    assert data["title"] == "Test Todo"
    assert data["description"] == "This is a test todo"
    assert data["status"] == TaskStatus.DONE
    assert data["id"] == todo_id


def test_delete_todo():
    todo_data = {
        "title": "Test Todo",
        "description": "This is a test todo"
    }
    create_response = client.post("/todos/", json=todo_data)
    todo_id = create_response.json()["id"]
    
    response = client.delete(f"/todos/{todo_id}")
    assert response.status_code == 200
    
    data = response.json()
    assert data["title"] == "Test Todo"
    assert data["description"] == "This is a test todo"
    assert data["id"] == todo_id
    
    get_response = client.get(f"/todos/{todo_id}")
    assert get_response.status_code == 404


def test_get_todos_after_operations():
    todo1_data = {"title": "Todo 1", "description": "First todo"}
    todo2_data = {"title": "Todo 2", "description": "Second todo"}
    
    client.post("/todos/", json=todo1_data)
    client.post("/todos/", json=todo2_data)
    
    response = client.get("/todos/")
    assert response.status_code == 200
    
    data = response.json()
    assert len(data) == 2
    
    titles = [todo["title"] for todo in data]
    assert "Todo 1" in titles
    assert "Todo 2" in titles
