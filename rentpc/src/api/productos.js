import axios from './axios.js';

export const getProductos = () => axios.get('/productos');
export const getProducto = (id) => axios.get(`/productos/${id}`);
export const createProducto = (data) => axios.post('/productos', data);
export const updateProducto = (id, data) => axios.put(`/productos/${id}`, data);
export const deleteProducto = (id) => axios.delete(`/productos/${id}`);
