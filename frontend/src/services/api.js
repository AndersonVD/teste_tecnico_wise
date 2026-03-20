import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
});

export const productApi = {
  getProducts: (category) => api.get('/products', { params: { category } }),
  getProduct: (id) => api.get(`/products/${id}`),
};

export const cartApi = {
  getCart: () => api.get('/cart'),
  addItem: (product_id, quantity) => api.post('/cart/items', { product_id, quantity }),
  updateItem: (item_id, quantity) => api.patch(`/cart/items/${item_id}`, { quantity }),
  removeItem: (item_id) => api.delete(`/cart/items/${item_id}`),
  applyCoupon: (code) => api.post('/cart/coupon', { code }),
};

export default api;
