from datetime import datetime
from enum import Enum as PyEnum
from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime, Enum
from sqlalchemy.orm import relationship
from pydantic import BaseModel, field_validator
from typing import List
from .database import Base

class OrderStatus(str, PyEnum):
    received = "Order Received"
    preparing = "Preparing"
    out_for_delivery = "Out for Delivery"
    delivered = "Delivered"

# SQLAlchemy models
class MenuItem(Base):
    __tablename__ = "menu_items"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    description = Column(String)
    price = Column(Float, nullable=False)
    image = Column(String)

class Order(Base):
    __tablename__ = "orders"
    id = Column(Integer, primary_key=True, index=True)
    customer_name = Column(String, nullable=False)
    address = Column(String, nullable=False)
    phone = Column(String, nullable=False)
    status = Column(Enum(OrderStatus), default=OrderStatus.received)
    created_at = Column(DateTime, default=datetime.utcnow)
    items = relationship("OrderItem", back_populates="order", cascade="all, delete")

class OrderItem(Base):
    __tablename__ = "order_items"
    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(Integer, ForeignKey("orders.id"), nullable=False)
    menu_item_id = Column(Integer, ForeignKey("menu_items.id"), nullable=False)
    quantity = Column(Integer, nullable=False, default=1)
    order = relationship("Order", back_populates="items")
    menu_item = relationship("MenuItem")

# Pydantic schemas
class OrderItemIn(BaseModel):
    menu_item_id: int
    quantity: int

    @field_validator("quantity")
    @classmethod
    def quantity_positive(cls, v):
        if v < 1:
            raise ValueError("Quantity must be at least 1")
        return v

class OrderIn(BaseModel):
    customer_name: str
    address: str
    phone: str
    items: List[OrderItemIn]

    @field_validator("phone")
    @classmethod
    def phone_not_empty(cls, v):
        if not v.strip():
            raise ValueError("Phone cannot be empty")
        return v

class OrderItemOut(BaseModel):
    menu_item_id: int
    quantity: int
    model_config = {"from_attributes": True}

class OrderOut(BaseModel):
    id: int
    customer_name: str
    address: str
    phone: str
    status: OrderStatus
    items: List[OrderItemOut]
    model_config = {"from_attributes": True}

class MenuItemOut(BaseModel):
    id: int
    name: str
    description: str
    price: float
    image: str
    model_config = {"from_attributes": True}