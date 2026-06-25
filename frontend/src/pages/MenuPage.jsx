import React, { useEffect, useState } from "react";
import { useCart } from "../CartContext";

export default function MenuPage() {
  const [menu, setMenu] = useState([]);
  const [qty, setQty] = useState({});
  const [added, setAdded] = useState({});
  const { addItem } = useCart();

  useEffect(() => {
    fetch("/menu/").then((r) => r.json()).then(setMenu);
  }, []);

  const changeQty = (id, delta) => {
    setQty((prev) => ({ ...prev, [id]: Math.max(1, (prev[id] || 1) + delta) }));
  };

  const handleAdd = (item) => {
    addItem(item, qty[item.id] || 1);
    setAdded((prev) => ({ ...prev, [item.id]: true }));
    setTimeout(() => setAdded((prev) => ({ ...prev, [item.id]: false })), 1500);
  };

  return (
    <div className="container">
      <div className="page-header">
        <h1>Our Menu</h1>
        <p>Authentic flavours, delivered fresh to your door</p>
      </div>
      <div className="menu-grid">
        {menu.map((item) => (
          <div className="menu-card" key={item.id} data-testid="menu-item">
            <img className="menu-card-img" src={item.image} alt={item.name} />
            <div className="menu-card-body">
              <h3>{item.name}</h3>
              <p>{item.description}</p>
              <div className="menu-card-footer">
                <span className="price">${item.price.toFixed(2)}</span>
                {added[item.id] ? (
                  <span className="added-tag">✓ Added</span>
                ) : (
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div className="qty-control">
                      <button className="qty-btn" onClick={() => changeQty(item.id, -1)}>−</button>
                      <input
                        className="qty-value"
                        type="number"
                        min="1"
                        value={qty[item.id] || 1}
                        onChange={(e) => setQty({ ...qty, [item.id]: Math.max(1, Number(e.target.value)) })}
                      />
                      <button className="qty-btn" onClick={() => changeQty(item.id, 1)}>+</button>
                    </div>
                    <button className="add-btn" onClick={() => handleAdd(item)}>Add</button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
