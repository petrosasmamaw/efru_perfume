import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export async function loginOwner(username, password) {
  const res = await axios.post(
    `${API_URL}/api/auth/login`,
    { username, password },
    { withCredentials: true }
  );
  return res.data;
}

export async function checkOwnerSession() {
  const res = await axios.get(`${API_URL}/api/auth/session`, {
    withCredentials: true,
  });
  return res.data;
}

export async function logoutOwner() {
  const res = await axios.post(
    `${API_URL}/api/auth/logout`,
    {},
    { withCredentials: true }
  );
  return res.data;
}
