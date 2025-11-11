import axios from './axios.js'

// Obtener todos los productos
export const getProductos = () => axios.get('/productos')

// Obtener un producto por ID
export const getProducto = (id) => axios.get(`/productos/${id}`)

// Crear nuevo producto
export const createProducto = (data) => axios.post('/productos', data)

// Actualizar producto existente
export const updateProducto = (id, data) => axios.put(`/productos/${id}`, data)

// Eliminar producto
export const deleteProducto = (id) => axios.delete(`/productos/${id}`)
