import { Router } from 'express';
import sql from '../db.js';
import { verifyAuth } from '../middleware/auth.js';

const router = Router();

// GET all perfumes (public)
router.get('/', async (req, res) => {
  try {
    const perfumes = await sql`SELECT * FROM perfumes ORDER BY created_at DESC`;
    res.json(perfumes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// GET single perfume (public)
router.get('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const perfume = await sql`SELECT * FROM perfumes WHERE id = ${id}`;

    if (perfume.length === 0) {
      return res.status(404).json({ error: 'Perfume not found' });
    }

    res.json(perfume[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// POST create perfume (protected)
router.post('/', verifyAuth, async (req, res) => {
  const { name, category, description, price, image_url, available } = req.body;

  if (!name || !category || !price) {
    return res.status(400).json({ error: 'Name, category, and price are required' });
  }

  try {
    const result = await sql`
      INSERT INTO perfumes (name, category, description, price, image_url, available)
      VALUES (${name}, ${category}, ${description || null}, ${price}, ${image_url || null}, ${available !== false})
      RETURNING *
    `;

    res.status(201).json(result[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// PUT update perfume (protected)
router.put('/:id', verifyAuth, async (req, res) => {
  const { id } = req.params;
  const { name, category, description, price, image_url, available } = req.body;

  if (!name || !category || price === undefined) {
    return res.status(400).json({ error: 'Name, category, and price are required' });
  }

  try {
    const result = await sql`
      UPDATE perfumes 
      SET name = ${name}, 
          category = ${category}, 
          description = ${description || null}, 
          price = ${price}, 
          image_url = ${image_url || null}, 
          available = ${available !== false}
      WHERE id = ${id}
      RETURNING *
    `;

    if (result.length === 0) {
      return res.status(404).json({ error: 'Perfume not found' });
    }

    res.json(result[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// DELETE perfume (protected)
router.delete('/:id', verifyAuth, async (req, res) => {
  const { id } = req.params;

  try {
    const result = await sql`DELETE FROM perfumes WHERE id = ${id} RETURNING id`;

    if (result.length === 0) {
      return res.status(404).json({ error: 'Perfume not found' });
    }

    res.json({ message: 'Perfume deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

export default router;
