import axios from './axios.js'

// Registrar nuevo usuario
export const registerAPI = (user) => axios.post('/rent/register', user)

// Iniciar sesión
export const loginAPI = (user) => axios.post('/rent/login', user)

// Verificar token de autenticación
export const verificarTokenRequest = () => axios.get('/verify')

// Cerrar sesión
export const logoutAPI = () => axios.post('/logout')

// Obtener usuarios pendientes de activación
export const getPendingUsers = () => axios.get('/rent/admin/pending')

// Activar usuario por ID
export const activateUser = (id) => axios.put(`/rent/admin/activar/${id}`)

// Obtener todos los usuarios
export const getAllUsers = () => axios.get('/rent/admin/users')

// Desactivar usuario por ID
export const deactivateUser = (id) => axios.put(`/rent/admin/desactivar/${id}`)