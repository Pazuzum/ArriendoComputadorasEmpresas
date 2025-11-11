import axios from './axios.js'

// Obtener las reservas del usuario autenticado
export const getMisReservas = () => axios.get('/reservas/mias')
