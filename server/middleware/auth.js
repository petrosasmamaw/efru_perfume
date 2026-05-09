import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

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

export function verifyAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  const cookieToken = getTokenFromCookieHeader(req.headers.cookie);

  let token = cookieToken;

  // Keep Bearer support for compatibility.
  if (!token && authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.slice(7);
  }

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized: Missing or invalid token' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.owner = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Unauthorized: Invalid token' });
  }
}
