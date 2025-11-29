import express from 'express';
import { crearReserva, obtenerReserva, listarReservas, confirmarReserva, listarMisReservas, devolverEquipos, cambiarEstadoReserva, cancelarReserva } from '../controles/reserva.controles.js';
import bodyParser from 'body-parser';
import { authRequired, isAdmin } from '../middlewares/validacionToken.js';

const router = express.Router();

router.post('/reservas', authRequired, crearReserva);
// Importante: rutas específicas antes que rutas con parámetros
router.get('/reservas/mias', authRequired, listarMisReservas);
router.get('/reservas/:id', authRequired, obtenerReserva);
router.get('/reservas', authRequired, isAdmin, listarReservas);
router.post('/reservas/:id/confirm', authRequired, confirmarReserva); // Permitir que usuario confirme con pago
router.post('/reservas/:id/devolver', authRequired, isAdmin, devolverEquipos); // Admin devuelve equipos
router.put('/reservas/:id/estado', authRequired, isAdmin, cambiarEstadoReserva); // Admin cambia estado
router.post('/reservas/:id/cancelar', authRequired, isAdmin, cancelarReserva); // Admin cancela reserva

// Stripe webhook endpoint (needs raw body) - optional
router.post('/webhooks/stripe', bodyParser.raw({ type: 'application/json' }), async (req, res) => {
	const stripeSig = req.headers['stripe-signature'];
	const payload = req.body;
	// If you configure webhook secret, verify here and parse event
	// For now, do a best-effort parse
	let evt;
	try {
		evt = JSON.parse(payload.toString());
	} catch (e) {
		console.error('Invalid webhook payload', e);
		return res.status(400).end();
	}
	if (evt.type === 'payment_intent.succeeded') {
		const pi = evt.data.object;
		// buscar reserva asociada por intentId
		const ReservaModel = (await import('../modelos/reserva.modelo.js')).default;
		const r = await ReservaModel.findOne({ 'pago.intentId': pi.id });
		if (r) {
			// llamar a confirmación (simple)
			await (await import('../controles/reserva.controles.js')).confirmarReserva({ params: { id: r._id } }, { json: ()=>{} , status: ()=>({json:()=>{}}) });
		}
	}
	res.json({ received: true });
});

export default router;
