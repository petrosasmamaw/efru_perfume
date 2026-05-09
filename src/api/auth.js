import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export async function loginOwner(username, password) {
  const res = await axios.post(`${API_URL}/api/auth/login`, { username, password });
  return res.data;
}
