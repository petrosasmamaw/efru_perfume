import { Router } from 'express';
import sql from '../db.js';
import { verifyAuth } from '../middleware/auth.js';

const router = Router();

// POST create order (public)
router.post('/', async (req, res) => {
  const { perfume_id, perfume_name, price, customer_name, customer_phone, customer_address } = req.body;

  if (!perfume_id || !perfume_name || !price || !customer_name || !customer_phone || !customer_address) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const result = await sql`
      INSERT INTO orders (perfume_id, perfume_name, price, customer_name, customer_phone, customer_address)
      VALUES (${perfume_id}, ${perfume_name}, ${price}, ${customer_name}, ${customer_phone}, ${customer_address})
      RETURNING *
    `;

    res.status(201).json(result[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// GET all orders (protected)
router.get('/', verifyAuth, async (req, res) => {
  try {
    const orders = await sql`
      SELECT 
        o.id,
        o.perfume_id,
        o.perfume_name,
        o.price,
        o.customer_name,
        o.customer_phone,
        o.customer_address,
        o.created_at
      FROM orders o
      ORDER BY o.created_at DESC
    `;

    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

export default router;
