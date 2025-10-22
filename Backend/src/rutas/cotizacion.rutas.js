import { Router } from 'express';
import { crearCotizacion, obtenerCotizacion, listarCotizaciones, cambiarEstado } from '../controles/cotizacion.controles.js';
import { authRequired, isAdmin } from '../middlewares/validacionToken.js';

const router = Router();

router.post('/cotizaciones', authRequired, crearCotizacion);
router.get('/cotizaciones/:id', authRequired, obtenerCotizacion);
router.get('/cotizaciones', authRequired, isAdmin, listarCotizaciones);
router.put('/cotizaciones/:id/estado', authRequired, isAdmin, cambiarEstado);

export default router;
