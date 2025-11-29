import Cotizacion from '../modelos/cotizacion.modelo.js'
import Producto from '../modelos/producto.modelo.js'

export const crearCotizacion = async (req, res) => {
    try {
        const { contacto, items, notas, duracion, total: totalFromBody } = req.body
        const computedTotal = (items || []).reduce((acc, it) => acc + (it.precio || 0) * (it.cantidad || 1), 0)
        const total = typeof totalFromBody === 'number' ? totalFromBody : computedTotal
        
        const nueva = new Cotizacion({ contacto, items, total, notas, duracion })
        const saved = await nueva.save()
        
        return res.status(201).json({ cotizacion: saved })
    } catch (error) {
        console.error('Error crearCotizacion:', error)
        return res.status(500).json({ message: 'Error al crear cotización', error: error.message })
    }
}

export const obtenerCotizacion = async (req, res) => {
    try {
        const cot = await Cotizacion.findById(req.params.id)
        
        if (!cot) {
            return res.status(404).json({ message: 'Cotización no encontrada' })
        }
        
        return res.json({ cotizacion: cot })
    } catch (error) {
        console.error('Error obtenerCotizacion:', error)
        return res.status(500).json({ message: 'Error al obtener cotización', error: error.message })
    }
}

export const listarCotizaciones = async (req, res) => {
    try {
        const list = await Cotizacion.find({}).sort({ createdAt: -1 })
        
        return res.json({ cotizaciones: list })
    } catch (error) {
        console.error('Error listarCotizaciones:', error)
        return res.status(500).json({ message: 'Error al listar cotizaciones', error: error.message })
    }
}

export const cambiarEstado = async (req, res) => {
    try {
        const { estado } = req.body
        const cot = await Cotizacion.findById(req.params.id)
        
        if (!cot) {
            return res.status(404).json({ message: 'Cotización no encontrada' })
        }

        if (estado === 'ACEPTADA') {
            for (const it of cot.items) {
                if (!it.productId) continue
                
                const prod = await Producto.findById(it.productId)
                if (!prod) {
                    return res.status(400).json({ message: `Producto no encontrado: ${it.nombre}` })
                }
                
                if ((prod.disponibilidad || 0) < (it.cantidad || 1)) {
                    return res.status(400).json({ message: `Stock insuficiente para ${it.nombre}` })
                }
            }

            for (const it of cot.items) {
                if (!it.productId) continue
                await Producto.findByIdAndUpdate(it.productId, { $inc: { disponibilidad: -(it.cantidad || 1) } })
            }
        }

        cot.estado = estado
        await cot.save()
        
        return res.json({ message: 'Estado actualizado', cotizacion: cot })
    } catch (error) {
        console.error('Error cambiarEstado:', error)
        return res.status(500).json({ message: 'Error al cambiar estado', error: error.message })
    }
}