import axios from './axios.js'

// Obtener perfil del usuario autenticado
export const getPerfil = () => axios.get('/perfil')

// Actualizar perfil del usuario autenticado
export const updatePerfil = (data) => axios.put('/perfil', data)
