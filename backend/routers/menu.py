from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from backend.database import get_db
from backend.models import MenuItem, MenuItemOut

router = APIRouter(prefix="/menu", tags=["menu"])


@router.get("/", response_model=List[MenuItemOut])
def get_menu(db: Session = Depends(get_db)):
    return db.query(MenuItem).all()
