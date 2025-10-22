import mongoose from 'mongoose';

const itemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Producto' },
  nombre: String,
  precio: Number,
  cantidad: Number,
});

const reservaSchema = new mongoose.Schema({
  empresaId: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: false },
  contacto: {
    nombre: String,
    email: String,
    telefono: String,
  },
  items: [itemSchema],
  total: Number,
  duracion: {
    valor: Number,
    unidad: { type: String, enum: ['dias','semanas','meses'], default: 'dias' }
  },
  estado: { type: String, enum: ['PENDIENTE','RESERVADA','CONFIRMADA','CANCELADA','EXPIRADA'], default: 'PENDIENTE' },
  expiresAt: { type: Date },
  createdAt: { type: Date, default: Date.now },
  notas: String,
  pago: {
    provider: String,
    intentId: String,
    status: String,
  },
}, { versionKey: false });

export default mongoose.model('Reserva', reservaSchema);
