import { Router } from 'express';
import Producto from '../modelos/producto.modelo.js';
import { authRequired, isAdmin } from '../middlewares/validacionToken.js';

const router = Router();

// Public
router.get('/productos', async (req, res) => {
  try {
    const list = await Producto.find({});
    res.json({ productos: list });
  } catch (error) {
    res.status(500).json({ message: 'Error al listar productos', error });
  }
});

router.get('/productos/:id', async (req, res) => {
  try {
    const prod = await Producto.findById(req.params.id);
    if (!prod) return res.status(404).json({ message: 'Producto no encontrado' });
    res.json({ producto: prod });
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener producto', error });
  }
});

// Admin - CRUD
router.post('/productos', authRequired, isAdmin, async (req, res) => {
  try {
    const { nombre, descripcion, precio, imgs, disponibilidad } = req.body;
    const p = new Producto({ nombre, descripcion, precio, imgs: imgs || [], disponibilidad: disponibilidad ?? 0 });
    const saved = await p.save();
    res.status(201).json({ producto: saved });
  } catch (error) {
    console.error('Error crear producto', error);
    res.status(500).json({ message: 'Error al crear producto', error });
  }
});

router.put('/productos/:id', authRequired, isAdmin, async (req, res) => {
  try {
    const updates = req.body;
    const updated = await Producto.findByIdAndUpdate(req.params.id, updates, { new: true });
    if (!updated) return res.status(404).json({ message: 'Producto no encontrado' });
    res.json({ producto: updated });
  } catch (error) {
    console.error('Error actualizar producto', error);
    res.status(500).json({ message: 'Error al actualizar producto', error });
  }
});

router.delete('/productos/:id', authRequired, isAdmin, async (req, res) => {
  try {
    const deleted = await Producto.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Producto no encontrado' });
    res.json({ message: 'Producto eliminado' });
  } catch (error) {
    console.error('Error eliminar producto', error);
    res.status(500).json({ message: 'Error al eliminar producto', error });
  }
});

export default router;
