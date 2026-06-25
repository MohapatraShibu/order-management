# Order Management App

Food delivery order management - built with FastAPI + React (Vite). 

## Stack
- **Backend**: Python, FastAPI, SQLite (via SQLAlchemy)
- **Frontend**: React 18, Vite, React Router
- **Real-time**: Server-Sent Events (SSE)
- **Tests**: pytest (backend), vitest + Testing Library (frontend)

---

## Setup

### Prerequisites
- Python 3.10+
- Node.js 18+ (for frontend)

### Backend

```bash
# From order_management/
python -m venv venv

# Windows
venv\Scripts\activate

# Mac/Linux
source venv/bin/activate

pip install -r backend/requirements.txt

# Run server
uvicorn backend.main:app --reload
```

API runs at: http://localhost:8000  
Swagger docs: http://localhost:8000/docs

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at: http://localhost:5173

---

## Running Tests

### Backend
```bash
# From order_management/ with venv activated
pytest backend/tests/ -v
```

### Frontend
```bash
cd frontend
npm test
```

---

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | /menu/ | List all menu items |
| POST | /orders/ | Place a new order |
| GET | /orders/ | List all orders |
| GET | /orders/{id} | Get order by ID |
| PATCH | /orders/{id}/status | Update order status |
| GET | /orders/{id}/stream | SSE stream for real-time status |

## Project Structure

```
order_management/
├── venv/                        # Python virtual environment
├── backend/
│   ├── main.py                  # FastAPI app + CORS + startup
│   ├── database.py              # SQLite engine + session
│   ├── models.py                # SQLAlchemy models + Pydantic schemas
│   ├── seed.py                  # Menu seed data
│   ├── requirements.txt
│   ├── routers/
│   │   ├── menu.py              # GET /menu/
│   │   └── orders.py            # CRUD + SSE /orders/
│   └── tests/
│       └── test_api.py          # pytest tests
└── frontend/
    ├── index.html
    ├── vite.config.js
    ├── package.json
    └── src/
        ├── App.jsx
        ├── main.jsx
        ├── index.css
        ├── CartContext.jsx
        ├── components/
        │   └── Navbar.jsx
        ├── pages/
        │   ├── MenuPage.jsx
        │   ├── CartPage.jsx
        │   ├── OrderStatusPage.jsx
        │   └── OrdersListPage.jsx
        └── __tests__/
            ├── handlers.js
            └── components.test.jsx
```
