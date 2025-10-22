import Reserva from '../modelos/reserva.modelo.js';

const POLL_INTERVAL_MS = Number(process.env.RESERVA_POLL_MS) || 60 * 1000; // 1 min

export function startReservaWorker() {
  setInterval(async () => {
    try {
      const now = new Date();
      const expired = await Reserva.find({ estado: 'PENDIENTE', expiresAt: { $lt: now } });
      if (!expired.length) return;
      for (const r of expired) {
        r.estado = 'EXPIRADA';
        await r.save();
        console.log('Reserva expirada:', r._id.toString());
      }
    } catch (err) {
      console.error('Error in reservaWorker', err);
    }
  }, POLL_INTERVAL_MS);
}
