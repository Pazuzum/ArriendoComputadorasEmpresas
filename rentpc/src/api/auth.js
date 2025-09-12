import axios from "./axios.js"

export const registerAPI= (user) => axios.post(`/rent/register`, user)

export const loginAPI=(user) => axios.post(`/rent/login`, user)

export const verificarTokenRequest=() => axios.get("/verify")