import axios from './axios.js';

export const getMisReservas = () => axios.get('/reservas/mias');
