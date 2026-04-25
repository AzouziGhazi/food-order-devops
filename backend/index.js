const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

let orders = [];

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.get('/metrics', (req, res) => {
  res.set('Content-Type', 'text/plain');
  res.send(`# HELP orders_total Total number of orders\n# TYPE orders_total counter\norders_total ${orders.length}\n`);
});

app.get('/orders', (req, res) => {
  res.json(orders);
});

app.post('/orders', (req, res) => {
  const { food, phone } = req.body;
  if (!food || !phone) {
    return res.status(400).json({ error: 'Food and phone are required' });
  }
  const order = {
    id: orders.length + 1,
    food,
    phone,
    createdAt: new Date().toISOString()
  };
  orders.push(order);
  res.status(201).json(order);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});