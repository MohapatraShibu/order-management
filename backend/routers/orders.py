import asyncio
import json
from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from typing import List
from backend.database import get_db
from backend.models import Order, OrderItem, MenuItem, OrderIn, OrderOut, OrderStatus

router = APIRouter(prefix="/orders", tags=["orders"])

STATUS_FLOW = [
    OrderStatus.received,
    OrderStatus.preparing,
    OrderStatus.out_for_delivery,
    OrderStatus.delivered,
]

@router.post("/", response_model=OrderOut, status_code=201)
def place_order(payload: OrderIn, db: Session = Depends(get_db)):
    for item in payload.items:
        if not db.query(MenuItem).filter(MenuItem.id == item.menu_item_id).first():
            raise HTTPException(status_code=404, detail=f"Menu item {item.menu_item_id} not found")

    order = Order(
        customer_name=payload.customer_name,
        address=payload.address,
        phone=payload.phone,
    )
    db.add(order)
    db.flush()

    for item in payload.items:
        db.add(OrderItem(order_id=order.id, menu_item_id=item.menu_item_id, quantity=item.quantity))

    db.commit()
    db.refresh(order)
    return order

@router.get("/", response_model=List[OrderOut])
def list_orders(db: Session = Depends(get_db)):
    return db.query(Order).all()

@router.get("/{order_id}", response_model=OrderOut)
def get_order(order_id: int, db: Session = Depends(get_db)):
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    return order

@router.patch("/{order_id}/status", response_model=OrderOut)
def update_status(order_id: int, status: OrderStatus, db: Session = Depends(get_db)):
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    order.status = status
    db.commit()
    db.refresh(order)
    return order

@router.get("/{order_id}/stream")
async def stream_status(order_id: int, db: Session = Depends(get_db)):
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    async def event_generator():
        for status in STATUS_FLOW:
            data = json.dumps({"status": status.value})
            yield f"data: {data}\n\n"
            if status == OrderStatus.delivered:
                break
            await asyncio.sleep(5)

    return StreamingResponse(event_generator(), media_type="text/event-stream")
