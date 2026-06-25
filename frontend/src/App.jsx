import React from "react";
import { Routes, Route } from "react-router-dom";
import { CartProvider } from "./CartContext";
import Navbar from "./components/Navbar";
import MenuPage from "./pages/MenuPage";
import CartPage from "./pages/CartPage";
import OrderStatusPage from "./pages/OrderStatusPage";
import OrdersListPage from "./pages/OrdersListPage";

export default function App() {
  return (
    <CartProvider>
      <Navbar />
      <Routes>
        <Route path="/" element={<MenuPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/orders" element={<OrdersListPage />} />
        <Route path="/orders/:id" element={<OrderStatusPage />} />
      </Routes>
    </CartProvider>
  );
}
