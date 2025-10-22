import mongoose from 'mongoose';

const productoSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  descripcion: { type: String },
  precio: { type: Number, required: true },
  imgs: [{ type: String }],
  disponibilidad: { type: Number, default: 40 },
}, { timestamps: true, versionKey: false });

export default mongoose.model('Producto', productoSchema);
