import axios from 'axios';
import { getApiBaseUrl } from './baseUrl.js';

const API_URL = getApiBaseUrl();

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
