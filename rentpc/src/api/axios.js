import axios from "axios";

const instance = axios.create({
    // Usar URL base relativa para que el proxy del servidor de desarrollo reenvíe las peticiones /api y evitar CORS
    baseURL: '/api',
    withCredentials: true
});

export default instance