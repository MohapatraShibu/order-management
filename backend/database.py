from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase, sessionmaker

import os

if os.name == "nt":  # Windows
    DATABASE_URL = "sqlite:///./orders.db"
else:  # Linux (Hugging Face)
    DATABASE_URL = "sqlite:////tmp/orders.db"

engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(bind=engine)

class Base(DeclarativeBase):
    pass

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
