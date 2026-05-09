import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import sql from '../db.js';
import dotenv from 'dotenv';

dotenv.config();

const router = Router();

function buildCookieOptions() {
  const isProduction = process.env.NODE_ENV === 'production';

  return {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
    maxAge: 24 * 60 * 60 * 1000,
    path: '/',
  };
}

function getTokenFromCookieHeader(cookieHeader) {
  if (!cookieHeader) {
    return null;
  }

  const cookies = cookieHeader.split(';');
  for (const cookie of cookies) {
    const [name, ...rest] = cookie.trim().split('=');
    if (name === 'authToken') {
      return decodeURIComponent(rest.join('='));
    }
  }

  return null;
}

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

    res.cookie('authToken', token, buildCookieOptions());
    res.status(201).json({
      owner: {
        id: inserted[0].id,
        username: inserted[0].username,
      },
    });
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

    res.cookie('authToken', token, buildCookieOptions());
    res.json({
      owner: {
        id: owner[0].id,
        username: owner[0].username,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/session', async (req, res) => {
  const token = getTokenFromCookieHeader(req.headers.cookie);

  if (!token) {
    return res.status(401).json({ error: 'No active session' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    res.json({
      authenticated: true,
      owner: {
        id: decoded.id,
        username: decoded.username,
      },
    });
  } catch {
    res.status(401).json({ error: 'Session expired or invalid' });
  }
});

router.post('/logout', async (req, res) => {
  const isProduction = process.env.NODE_ENV === 'production';

  res.clearCookie('authToken', {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
    path: '/',
  });

  res.json({ message: 'Logged out successfully' });
});

export default router;
