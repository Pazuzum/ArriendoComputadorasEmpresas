import { Router } from "express";
import { registrarUsuario, loginUsuario, cerrarSesion, activarUsuario, verificarToken, obtenerUsuariosPendientes, obtenerTodosUsuarios, desactivarUsuario } from "../controles/auth.controles.js";
import {authRequired, isAdmin} from "../middlewares/validacionToken.js";

import { validateSchema } from "../middlewares/validacionSchema.js";
import { loginSchema, registerSchema } from "../esquema/auth.esquema.js";

const router= Router();

router.post("/rent/register", validateSchema(registerSchema), registrarUsuario);
router.post("/rent/login", validateSchema(loginSchema), loginUsuario);
router.put("/rent/admin/activar/:id", authRequired ,isAdmin, activarUsuario);
router.put("/rent/admin/desactivar/:id", authRequired ,isAdmin, desactivarUsuario);

// Endpoint para listar usuarios pendientes (solo admin)
router.get("/rent/admin/pending", authRequired, isAdmin, obtenerUsuariosPendientes);
// Endpoint para listar todos los usuarios (solo admin)
router.get("/rent/admin/users", authRequired, isAdmin, obtenerTodosUsuarios);

router.get("/verify",verificarToken);
router.post("/logout", cerrarSesion);

export default router;