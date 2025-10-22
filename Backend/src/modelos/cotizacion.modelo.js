import mongoose from 'mongoose';

const itemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Producto' },
  nombre: String,
  precio: Number,
  cantidad: Number,
});

const cotizacionSchema = new mongoose.Schema({
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
  estado: { type: String, enum: ['PENDIENTE','ACEPTADA','RECHAZADA'], default: 'PENDIENTE' },
  notas: String,
}, { timestamps: true, versionKey: false });

export default mongoose.model('Cotizacion', cotizacionSchema);
