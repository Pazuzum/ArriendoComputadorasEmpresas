import { Router } from 'express';
import { obtenerPerfil, actualizarPerfil } from '../controles/usuario.controles.js';
import { authRequired } from '../middlewares/validacionToken.js';

const router = Router();

// Obtener perfil del usuario autenticado
router.get('/perfil', authRequired, obtenerPerfil);

// Actualizar perfil del usuario autenticado
router.put('/perfil', authRequired, actualizarPerfil);

export default router;
