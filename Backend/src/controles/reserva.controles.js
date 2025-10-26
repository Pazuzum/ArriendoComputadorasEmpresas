import Reserva from '../modelos/reserva.modelo.js';
import Usuario from '../modelos/usuario.modelo.js';
import Producto from '../modelos/producto.modelo.js';
import Stripe from 'stripe';

const stripe = process.env.STRIPE_SECRET ? new Stripe(process.env.STRIPE_SECRET, { apiVersion: '2022-11-15' }) : null;

const RESERVA_TTL_HORAS = Number(process.env.RESERVA_TTL_HORAS) || 72; // default 72h

export const crearReserva = async (req, res) => {
  try {
    const { contacto, items, notas, duracion, total: totalFromBody } = req.body;
    if (!items || items.length === 0) return res.status(400).json({ message: 'No hay items en la reserva' });
    // calcular total si no viene
    const computedTotal = items.reduce((acc, it) => acc + (it.precio || 0) * (it.cantidad || 1), 0);
    const total = typeof totalFromBody === 'number' ? totalFromBody : computedTotal;

    // Validar stock básico: asegurarnos que no pedimos más que disponibilidad
    for (const it of items) {
      if (it.productId) {
        const prod = await Producto.findById(it.productId);
        if (!prod) return res.status(400).json({ message: `Producto no encontrado: ${it.nombre}` });
        if ((prod.disponibilidad || 0) < (it.cantidad || 1)) {
          return res.status(400).json({ message: `Stock insuficiente para ${it.nombre}` });
        }
      }
    }

    const expiresAt = new Date(Date.now() + RESERVA_TTL_HORAS * 3600 * 1000);
    const empresaId = req.user?.id || null;
    // Asegurar contacto.email si faltara: usa el email del usuario autenticado
    let contactoFinal = contacto || {};
    if (!contactoFinal.email) {
      try {
        const u = empresaId ? await Usuario.findById(empresaId).select('email') : null;
        if (u?.email) contactoFinal.email = u.email;
      } catch { /* ignore fallback errors */ }
    }
    const nueva = new Reserva({ contacto: contactoFinal, items, total, notas, duracion, expiresAt, empresaId });

    // Si stripe disponible y el cliente solicitó pago immediato, crear PaymentIntent (preautorización)
    if (stripe && req.body.createPaymentIntent) {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(total * 100), // en centavos
        currency: 'usd',
        // puedes agregar metadata con id de items o reserva provisional
        metadata: { purpose: 'reserva', total: String(total) },
      });
      nueva.pago = { provider: 'stripe', intentId: paymentIntent.id, status: paymentIntent.status };
    }

    const saved = await nueva.save();

    // opcional: podríamos decrementar disponibilidad inmediatamente para bloquear stock
    // por simplicidad inicial no decrementamos hasta confirmación. Esto evita problemas si quieres liberar stock al expirar.

    return res.status(201).json({ reserva: saved });
  } catch (error) {
    console.error('Error crearReserva', error);
    return res.status(500).json({ message: 'Error al crear reserva', error });
  }
};

// Confirmar reserva: decrementar stock atómicamente y marcar CONFIRMADA
export const confirmarReserva = async (req, res) => {
  try {
    const { id } = req.params;
    const r = await Reserva.findById(id);
    if (!r) return res.status(404).json({ message: 'Reserva no encontrada' });
    if (r.estado !== 'PENDIENTE') return res.status(400).json({ message: 'Reserva no en estado PENDIENTE' });

    // intentar decrementar stock por cada item con operación atómica
    for (const it of r.items) {
      if (!it.productId) continue;
      const updated = await Producto.findOneAndUpdate(
        { _id: it.productId, disponibilidad: { $gte: it.cantidad } },
        { $inc: { disponibilidad: - it.cantidad } },
        { new: true }
      );
      if (!updated) {
        return res.status(400).json({ message: `Stock insuficiente para ${it.nombre}` });
      }
    }

    r.estado = 'CONFIRMADA';
    await r.save();
    return res.json({ message: 'Reserva confirmada', reserva: r });
  } catch (error) {
    console.error('Error confirmarReserva', error);
    return res.status(500).json({ message: 'Error al confirmar reserva', error });
  }
};

export const obtenerReserva = async (req, res) => {
  try {
    const r = await Reserva.findById(req.params.id);
    if (!r) return res.status(404).json({ message: 'Reserva no encontrada' });
    return res.json({ reserva: r });
  } catch (error) {
    console.error('Error obtenerReserva', error);
    return res.status(500).json({ message: 'Error al obtener reserva', error });
  }
};

export const listarReservas = async (req, res) => {
  try {
    const list = await Reserva.find({}).sort({ createdAt: -1 });
    return res.json({ reservas: list });
  } catch (error) {
    console.error('Error listarReservas', error);
    return res.status(500).json({ message: 'Error al listar reservas', error });
  }
};

export const listarMisReservas = async (req, res) => {
  try {
    const empresaId = req.user?.id;
    if (!empresaId) return res.status(401).json({ message: 'No autenticado' });
    // También intentamos usar el email de contacto del usuario para contemplar reservas antiguas sin empresaId
    const usuario = await Usuario.findById(empresaId).select('email');
    const filterOr = [{ empresaId }];
    if (usuario?.email) filterOr.push({ 'contacto.email': usuario.email });
    const list = await Reserva.find({ $or: filterOr }).sort({ createdAt: -1 });
    return res.json({ reservas: list });
  } catch (error) {
    console.error('Error listarMisReservas', error);
    return res.status(500).json({ message: 'Error al listar mis reservas', error });
  }
};

export const expirarReserva = async (reservaId) => {
  try {
    const r = await Reserva.findById(reservaId);
    if (!r) return null;
    r.estado = 'EXPIRADA';
    await r.save();
    return r;
  } catch (error) {
    console.error('Error expirarReserva', error);
    throw error;
  }
};
