import axios from 'axios';
import { getApiBaseUrl } from './baseUrl.js';

const API_URL = getApiBaseUrl();

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
