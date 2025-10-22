import express from "express"
import morgan from "morgan";
import cookieParser from "cookie-parser";
import cors from "cors";

import authRoutes from "./rutas/auth.rutas.js";
import cotizacionRoutes from "./rutas/cotizacion.rutas.js";
import productoRoutes from "./rutas/producto.rutas.js";
import { crearRoles, crearProductosIniciales } from "./libs/initial.js";
import reservaRoutes from './rutas/reserva.rutas.js';
import { startReservaWorker } from './libs/reservaWorker.js';

const app = express()
crearRoles();
crearProductosIniciales();

// Permitir el origen del frontend y el envío de credenciales (cookies).
// Si despliegas a producción, actualiza el origen y establece secure: true en las cookies.
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || "http://localhost:5173";
app.use(cors({
    origin: FRONTEND_ORIGIN,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser());



app.use("/api",authRoutes);
app.use("/api", cotizacionRoutes);
app.use("/api", productoRoutes);
app.use('/api', reservaRoutes);

// start background worker to expire reservas
startReservaWorker();

export default app;