import express from "express"
import morgan from "morgan";
import cookieParser from "cookie-parser";
import cors from "cors";

import authRoutes from "./rutas/auth.rutas.js";
import { crearRoles } from "./libs/initial.js";

const app = express()
crearRoles();

app.use(cors({
    origin:"http://localhost:5173",
    credentials:true
}))
app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser());



app.use("/api",authRoutes);

export default app;