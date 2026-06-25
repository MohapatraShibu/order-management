import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useCart } from "../CartContext";

const EMPTY_FORM = { customer_name: "", address: "", phone: "" };

export default function CartPage() {
  const { cart, updateQuantity, removeItem, clearCart, total } = useCart();
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validate = () => {
    const e = {};
    if (!form.customer_name.trim()) e.customer_name = "Name is required";
    if (!form.address.trim()) e.address = "Address is required";
    if (!/^\d{7,15}$/.test(form.phone.trim())) e.phone = "Enter a valid phone number";
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) return setErrors(errs);
    setLoading(true);
    const res = await fetch("/orders/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        items: cart.map((i) => ({ menu_item_id: i.id, quantity: i.quantity })),
      }),
    });
    setLoading(false);
    if (res.ok) {
      const order = await res.json();
      clearCart();
      navigate(`/orders/${order.id}`);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="container">
        <div className="empty-state">
          <div className="empty-icon">🛒</div>
          <h3>Your cart is empty</h3>
          <p>Looks like you haven't added anything yet.</p>
          <Link to="/"><button className="btn-primary">Browse Menu</button></Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="page-header">
        <h1>Checkout</h1>
        <p>Review your order and enter delivery details</p>
      </div>
      <div className="cart-layout">
        {/* Left — cart items + delivery form */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div className="cart-section">
            <div className="section-title">Your Items</div>
            {cart.map((item) => (
              <div className="cart-item" key={item.id} data-testid="cart-item">
                <div className="cart-item-info">
                  <strong>{item.name}</strong>
                  <span>${item.price.toFixed(2)} each</span>
                </div>
                <div className="cart-item-right">
                  <div className="qty-control">
                    <button className="qty-btn" onClick={() => updateQuantity(item.id, item.quantity - 1)}>−</button>
                    <span className="qty-value" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>{item.quantity}</span>
                    <button className="qty-btn" onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                  </div>
                  <span className="cart-item-total">${(item.price * item.quantity).toFixed(2)}</span>
                  <button className="btn-danger" onClick={() => removeItem(item.id)}>✕</button>
                </div>
              </div>
            ))}
          </div>

          <div className="cart-section">
            <div className="section-title">Delivery Details</div>
            <form onSubmit={handleSubmit} data-testid="checkout-form">
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input
                  className={`form-input ${errors.customer_name ? "error" : ""}`}
                  value={form.customer_name}
                  onChange={(e) => setForm({ ...form, customer_name: e.target.value })}
                  placeholder="e.g. Rahul Sharma"
                />
                {errors.customer_name && <span className="form-error">{errors.customer_name}</span>}
              </div>
              <div className="form-group">
                <label className="form-label">Delivery Address</label>
                <input
                  className={`form-input ${errors.address ? "error" : ""}`}
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  placeholder="e.g. 42 MG Road, Bangalore"
                />
                {errors.address && <span className="form-error">{errors.address}</span>}
              </div>
              <div className="form-group">
                <label className="form-label">Phone Number</label>
                <input
                  className={`form-input ${errors.phone ? "error" : ""}`}
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="e.g. 9876543210"
                />
                {errors.phone && <span className="form-error">{errors.phone}</span>}
              </div>
              <button className="btn-primary" type="submit" style={{ width: "100%", padding: "13px", fontSize: "0.95rem", marginTop: 4 }} disabled={loading}>
                {loading ? "Placing Order…" : "Place Order →"}
              </button>
            </form>
          </div>
        </div>

        {/* Right — order summary */}
        <div className="cart-section" style={{ position: "sticky", top: 84 }}>
          <div className="section-title">Order Summary</div>
          {cart.map((item) => (
            <div className="cart-summary-row" key={item.id}>
              <span>{item.name} × {item.quantity}</span>
              <span>${(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
          <div className="cart-summary-row">
            <span>Delivery</span><span style={{ color: "#16a34a", fontWeight: 600 }}>Free</span>
          </div>
          <div className="cart-summary-total">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
