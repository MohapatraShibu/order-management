import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useCart } from "../CartContext";

export default function Navbar() {
  const { cart } = useCart();
  const count = cart.reduce((s, i) => s + i.quantity, 0);
  const { pathname } = useLocation();

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        <span>🍔</span> QuickEats
      </Link>
      <div className="navbar-links">
        <Link to="/" className={`nav-link ${pathname === "/" ? "active" : ""}`}>Menu</Link>
        <Link to="/orders" className={`nav-link ${pathname === "/orders" ? "active" : ""}`}>Orders</Link>
        <Link to="/cart" className="nav-cart">
          🛒 Cart
          {count > 0 && <span className="cart-badge">{count}</span>}
        </Link>
      </div>
    </nav>
  );
}
