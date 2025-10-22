import axios from "./axios.js"

export const registerAPI= (user) => axios.post(`/rent/register`, user)

export const loginAPI=(user) => axios.post(`/rent/login`, user)

export const verificarTokenRequest=() => axios.get("/verify")

export const logoutAPI = () => axios.post('/logout')

export const getPendingUsers = () => axios.get(`/rent/admin/pending`)

export const activateUser = (id) => axios.put(`/rent/admin/activar/${id}`)

export const getAllUsers = () => axios.get(`/rent/admin/users`)
export const deactivateUser = (id) => axios.put(`/rent/admin/desactivar/${id}`)