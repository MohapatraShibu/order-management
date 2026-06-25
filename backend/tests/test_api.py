import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from backend.database import Base, get_db
from backend.models import MenuItem, OrderStatus
from backend.seed import MENU_DATA

TEST_DB_URL = "sqlite:///./test.db"
engine = create_engine(TEST_DB_URL, connect_args={"check_same_thread": False})
TestingSession = sessionmaker(bind=engine)


def override_get_db():
    db = TestingSession()
    try:
        yield db
    finally:
        db.close()


# Apply override before importing app so lifespan uses test DB
from backend import main as app_module
app_module.app.dependency_overrides[get_db] = override_get_db

from backend.main import app  # noqa: E402

client = TestClient(app, raise_server_exceptions=True)


@pytest.fixture(autouse=True)
def setup_db():
    Base.metadata.create_all(bind=engine)
    db = TestingSession()
    if db.query(MenuItem).count() == 0:
        db.add_all([MenuItem(**d) for d in MENU_DATA])
        db.commit()
    db.close()
    yield
    Base.metadata.drop_all(bind=engine)


# --- Menu tests ---
def test_get_menu_returns_items():
    res = client.get("/menu/")
    assert res.status_code == 200
    items = res.json()
    assert len(items) > 0
    assert "name" in items[0]
    assert "price" in items[0]


# --- Order placement tests ---
def test_place_order_success():
    menu = client.get("/menu/").json()
    res = client.post("/orders/", json={
        "customer_name": "John Doe",
        "address": "123 Main St",
        "phone": "1234567890",
        "items": [{"menu_item_id": menu[0]["id"], "quantity": 2}]
    })
    assert res.status_code == 201
    data = res.json()
    assert data["customer_name"] == "John Doe"
    assert data["status"] == "Order Received"
    assert len(data["items"]) == 1


def test_place_order_invalid_menu_item():
    res = client.post("/orders/", json={
        "customer_name": "Jane",
        "address": "456 Elm St",
        "phone": "9876543210",
        "items": [{"menu_item_id": 9999, "quantity": 1}]
    })
    assert res.status_code == 404


def test_place_order_invalid_quantity():
    menu = client.get("/menu/").json()
    res = client.post("/orders/", json={
        "customer_name": "Bob",
        "address": "789 Oak Ave",
        "phone": "5555555555",
        "items": [{"menu_item_id": menu[0]["id"], "quantity": 0}]
    })
    assert res.status_code == 422


def test_place_order_missing_fields():
    res = client.post("/orders/", json={"customer_name": "Alice"})
    assert res.status_code == 422


# --- Order retrieval tests ---
def test_get_order_by_id():
    menu = client.get("/menu/").json()
    order = client.post("/orders/", json={
        "customer_name": "Alice",
        "address": "1 Queen St",
        "phone": "1112223333",
        "items": [{"menu_item_id": menu[0]["id"], "quantity": 1}]
    }).json()
    res = client.get(f"/orders/{order['id']}")
    assert res.status_code == 200
    assert res.json()["id"] == order["id"]


def test_get_order_not_found():
    res = client.get("/orders/99999")
    assert res.status_code == 404


def test_list_orders():
    menu = client.get("/menu/").json()
    client.post("/orders/", json={
        "customer_name": "Test User",
        "address": "Anywhere",
        "phone": "0000000000",
        "items": [{"menu_item_id": menu[0]["id"], "quantity": 1}]
    })
    res = client.get("/orders/")
    assert res.status_code == 200
    assert len(res.json()) >= 1


# --- Status update tests ---
def test_update_order_status():
    menu = client.get("/menu/").json()
    order = client.post("/orders/", json={
        "customer_name": "Sam",
        "address": "99 Park Lane",
        "phone": "4443332222",
        "items": [{"menu_item_id": menu[0]["id"], "quantity": 1}]
    }).json()
    res = client.patch(f"/orders/{order['id']}/status?status=Preparing")
    assert res.status_code == 200
    assert res.json()["status"] == "Preparing"


def test_update_status_invalid_order():
    res = client.patch("/orders/99999/status?status=Preparing")
    assert res.status_code == 404
