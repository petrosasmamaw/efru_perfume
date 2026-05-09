import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export async function getPerfumes() {
  const res = await axios.get(`${API_URL}/api/perfumes`);
  return res.data;
}

export async function getPerfume(id) {
  const res = await axios.get(`${API_URL}/api/perfumes/${id}`);
  return res.data;
}

export async function createPerfume(perfumeData) {
  const res = await axios.post(`${API_URL}/api/perfumes`, perfumeData, {
    withCredentials: true,
  });
  return res.data;
}

export async function updatePerfume(id, perfumeData) {
  const res = await axios.put(`${API_URL}/api/perfumes/${id}`, perfumeData, {
    withCredentials: true,
  });
  return res.data;
}

export async function deletePerfume(id) {
  const res = await axios.delete(`${API_URL}/api/perfumes/${id}`, {
    withCredentials: true,
  });
  return res.data;
}
