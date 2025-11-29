import axios from './axios.js'

// Obtener las reservas del usuario autenticado
export const getMisReservas = () => axios.get('/reservas/mias')

// Admin: Obtener todas las reservas del sistema
export const getAllReservas = () => axios.get('/reservas')

// Admin: Cambiar estado de una reserva
export const cambiarEstadoReserva = (id, nuevoEstado) => axios.put(`/reservas/${id}/estado`, { nuevoEstado })

// Admin: Cancelar una reserva
export const cancelarReserva = (id) => axios.post(`/reservas/${id}/cancelar`)
