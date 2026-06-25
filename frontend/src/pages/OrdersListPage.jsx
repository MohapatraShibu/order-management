import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const STATUS_BADGE = {
  "Order Received": "badge badge-pending",
  "Preparing": "badge badge-preparing",
  "Out for Delivery": "badge badge-delivery",
  "Delivered": "badge badge-delivered",
};

export default function OrdersListPage() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetch("/orders/").then((r) => r.json()).then(setOrders);
  }, []);

  if (orders.length === 0) {
    return (
      <div className="container">
        <div className="empty-state">
          <div className="empty-icon">📋</div>
          <h3>No orders yet</h3>
          <p>Your order history will appear here.</p>
          <Link to="/"><button className="btn-primary">Order Now</button></Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ maxWidth: 720 }}>
      <div className="page-header">
        <h1>Your Orders</h1>
        <p>{orders.length} order{orders.length !== 1 ? "s" : ""} placed</p>
      </div>
      {[...orders].reverse().map((o) => (
        <div className="order-card" key={o.id}>
          <div className="order-card-header">
            <div>
              <strong style={{ fontSize: "1rem" }}>Order #{o.id}</strong>
              <div className="order-meta">{o.customer_name} · {o.address}</div>
            </div>
            <span className={STATUS_BADGE[o.status] || "badge badge-pending"}>{o.status}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 12 }}>
            <span style={{ fontSize: "0.83rem", color: "var(--text-muted)" }}>
              {o.items.length} item{o.items.length !== 1 ? "s" : ""}
            </span>
            <Link to={`/orders/${o.id}`}>
              <button className="btn-ghost" style={{ fontSize: "0.83rem", padding: "6px 14px" }}>Track Order →</button>
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}
