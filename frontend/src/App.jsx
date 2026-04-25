import { useState } from "react";
import axios from "axios";
import "./App.css";

const FOODS = [
  { name: "Pizza", emoji: "🍕" },
  { name: "Sandwich", emoji: "🥪" },
  { name: "Pasta", emoji: "🍝" },
  { name: "Chicken", emoji: "🍗" },
];

export default function App() {
  const [selectedFood, setSelectedFood] = useState(null);
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [orders, setOrders] = useState([]);

  const handleOrder = async () => {
    if (!selectedFood || !phone) {
      setMessage("❌ Please select a food and enter your phone number!");
      return;
    }
    try {
      await axios.post("http://localhost:5000/orders", {
        food: selectedFood,
        phone,
      });
      setMessage(`✅ Order placed! ${selectedFood} will be delivered to ${phone}`);
      setSelectedFood(null);
      setPhone("");
      fetchOrders();
    } catch {
      setMessage("❌ Error placing order. Is the backend running?");
    }
  };

  const fetchOrders = async () => {
    try {
      const res = await axios.get("http://localhost:5000/orders");
      setOrders(res.data);
    } catch {
      console.error("Could not fetch orders");
    }
  };

  return (
    <div className="container">
      <h1>🍽️ Food Order</h1>
      <p className="subtitle">Select your meal and enter your phone number</p>

      <div className="food-grid">
        {FOODS.map((f) => (
          <button
            key={f.name}
            className={`food-btn ${selectedFood === f.name ? "selected" : ""}`}
            onClick={() => setSelectedFood(f.name)}
          >
            <span className="emoji">{f.emoji}</span>
            <span>{f.name}</span>
          </button>
        ))}
      </div>

      <input
        className="phone-input"
        type="tel"
        placeholder="📞 Enter your phone number"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />

      <button className="order-btn" onClick={handleOrder}>
        Place Order
      </button>

      {message && <p className="message">{message}</p>}

      {orders.length > 0 && (
        <div className="orders">
          <h2>📋 Recent Orders</h2>
          {orders.map((o) => (
            <div key={o.id} className="order-item">
              <span>{o.food}</span>
              <span>{o.phone}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}