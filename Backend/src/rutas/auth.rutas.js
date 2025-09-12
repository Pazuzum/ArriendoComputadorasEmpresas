import { Router } from "express";
import { registrarUsuario, loginUsuario, cerrarSesion, activarUsuario, verificarToken} from "../controles/auth.controles.js";
import {authRequired, isAdmin} from "../middlewares/validacionToken.js";

import { validateSchema } from "../middlewares/validacionSchema.js";
import { loginSchema, registerSchema } from "../esquema/auth.esquema.js";

const router= Router();

router.post("/rent/register", validateSchema(registerSchema), registrarUsuario);
router.post("/rent/login", validateSchema(loginSchema), loginUsuario);
router.put("/rent/admin/activar/:id", authRequired ,isAdmin, activarUsuario);

router.get("/verify",verificarToken);
router.post("/logout", cerrarSesion);

export default router;