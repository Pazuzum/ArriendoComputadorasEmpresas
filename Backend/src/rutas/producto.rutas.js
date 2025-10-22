import { Router } from 'express';
import Producto from '../modelos/producto.modelo.js';

const router = Router();

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

export default router;
