import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export async function getOrders() {
  const res = await axios.get(`${API_URL}/api/orders`, {
    withCredentials: true,
  });
  return res.data;
}

export async function createOrder(orderData) {
  const res = await axios.post(`${API_URL}/api/orders`, orderData);
  return res.data;
}
