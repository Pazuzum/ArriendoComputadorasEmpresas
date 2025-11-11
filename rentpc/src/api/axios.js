import axios from 'axios'

// Instancia de axios configurada para la aplicación
// Usa URL base relativa para que el proxy del servidor de desarrollo reenvíe las peticiones /api y evitar CORS
const instance = axios.create({
    baseURL: '/api',
    withCredentials: true
})

export default instance