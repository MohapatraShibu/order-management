import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

const STEPS = [
  { label: "Order Received", icon: "📋" },
  { label: "Preparing", icon: "👨‍🍳" },
  { label: "Out for Delivery", icon: "🛵" },
  { label: "Delivered", icon: "✅" },
];

const STATUS_BADGE = {
  "Order Received": "badge badge-pending",
  "Preparing": "badge badge-preparing",
  "Out for Delivery": "badge badge-delivery",
  "Delivered": "badge badge-delivered",
};

export default function OrderStatusPage() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [status, setStatus] = useState("Order Received");

  useEffect(() => {
    fetch(`/orders/${id}`).then((r) => r.json()).then((o) => {
      setOrder(o);
      setStatus(o.status);
    });
    const es = new EventSource(`/orders/${id}/stream`);
    es.onmessage = (e) => {
      const { status: s } = JSON.parse(e.data);
      setStatus(s);
      if (s === "Delivered") es.close();
    };
    return () => es.close();
  }, [id]);

  if (!order) return <div className="loading">⏳ Loading order...</div>;

  const currentIndex = STEPS.findIndex((s) => s.label === status);

  return (
    <div className="container" style={{ maxWidth: 720 }}>
      <div className="page-header">
        <h1>Order #{order.id}</h1>
        <p>Placed by {order.customer_name}</p>
      </div>

      <div className="tracker-wrapper">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <span style={{ fontWeight: 600, fontSize: "0.95rem" }}>Live Status</span>
          <span className={STATUS_BADGE[status] || "badge badge-pending"}>{status}</span>
        </div>
        <div className="tracker-steps">
          {STEPS.map((step, i) => (
            <div
              key={step.label}
              className={`tracker-step ${i < currentIndex ? "done" : i === currentIndex ? "active" : ""}`}
              data-testid="status-step"
            >
              <div className="step-dot">{i < currentIndex ? "✓" : step.icon}</div>
              <span className="step-label">{step.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="order-card">
        <div className="section-title" style={{ marginBottom: 14 }}>Delivery Details</div>
        <div className="detail-row"><span className="detail-label">Name</span><span className="detail-value">{order.customer_name}</span></div>
        <div className="detail-row"><span className="detail-label">Address</span><span className="detail-value">{order.address}</span></div>
        <div className="detail-row"><span className="detail-label">Phone</span><span className="detail-value">{order.phone}</span></div>
      </div>

      <div className="order-card">
        <div className="section-title" style={{ marginBottom: 14 }}>Items Ordered</div>
        {order.items.map((item, i) => (
          <div className="detail-row" key={i}>
            <span className="detail-label">Item #{item.menu_item_id}</span>
            <span className="detail-value">× {item.quantity}</span>
          </div>
        ))}
      </div>

      <Link to="/orders"><button className="btn-ghost" style={{ marginTop: 8 }}>← Back to Orders</button></Link>
    </div>
  );
}
