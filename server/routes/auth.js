import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import sql from '../db.js';
import dotenv from 'dotenv';

dotenv.config();

const router = Router();

// Signup route - create new owner account
router.post('/signup', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password required' });
  }

  try {
    const existing = await sql`SELECT id FROM owner WHERE username = ${username}`;
    if (existing.length > 0) {
      return res.status(409).json({ error: 'User already exists' });
    }

    const hashed = await bcrypt.hash(password, 10);
    const inserted = await sql`INSERT INTO owner (username, password) VALUES (${username}, ${hashed}) RETURNING *`;

    const token = jwt.sign(
      { id: inserted[0].id, username: inserted[0].username },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password required' });
  }

  try {
    const owner = await sql`SELECT * FROM owner WHERE username = ${username}`;

    if (owner.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const validPassword = await bcrypt.compare(password, owner[0].password);

    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: owner[0].id, username: owner[0].username },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
