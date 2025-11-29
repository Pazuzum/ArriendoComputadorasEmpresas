import Reserva from '../modelos/reserva.modelo.js'
import Usuario from '../modelos/usuario.modelo.js'
import Producto from '../modelos/producto.modelo.js'
import { ESTADOS_RESERVA } from '../constantes/estadosReserva.js'
import Stripe from 'stripe'

const stripe = process.env.STRIPE_SECRET ? new Stripe(process.env.STRIPE_SECRET, { apiVersion: '2022-11-15' }) : null
const RESERVA_TTL_HORAS = Number(process.env.RESERVA_TTL_HORAS) || 72

export const crearReserva = async (req, res) => {
    try {
        const { contacto, items, notas, duracion, total: totalFromBody, fechaInicio, fechaFin } = req.body
        
        if (!items || items.length === 0) {
            return res.status(400).json({ message: 'No hay items en la reserva' })
        }

        // Validar fechas si están presentes
        if (fechaInicio && fechaFin) {
            const inicio = new Date(fechaInicio)
            const fin = new Date(fechaFin)
            if (inicio >= fin) {
                return res.status(400).json({ message: 'La fecha de inicio debe ser anterior a la fecha de fin' })
            }
        }

        const computedTotal = items.reduce((acc, it) => acc + (it.precio || 0) * (it.cantidad || 1), 0)
        const total = typeof totalFromBody === 'number' ? totalFromBody : computedTotal

        // Validar stock disponible antes de crear la reserva
        for (const it of items) {
            if (it.productId) {
                const prod = await Producto.findById(it.productId)
                if (!prod) {
                    return res.status(400).json({ message: `Producto no encontrado: ${it.nombre}` })
                }
                if ((prod.disponibilidad || 0) < (it.cantidad || 1)) {
                    return res.status(400).json({ 
                        message: `Stock insuficiente para ${it.nombre}. Disponible: ${prod.disponibilidad}, Solicitado: ${it.cantidad}` 
                    })
                }
            }
        }

        const expiresAt = new Date(Date.now() + RESERVA_TTL_HORAS * 3600 * 1000)
        const empresaId = req.user?.id || null
        
        let contactoFinal = contacto || {}
        if (!contactoFinal.email) {
            try {
                const u = empresaId ? await Usuario.findById(empresaId).select('email') : null
                if (u?.email) contactoFinal.email = u.email
            } catch (err) {
                console.error('Error al obtener email del usuario:', err)
            }
        }

        const nueva = new Reserva({ 
            contacto: contactoFinal, 
            items, 
            total, 
            notas, 
            duracion, 
            expiresAt, 
            empresaId, 
            estado: ESTADOS_RESERVA.CONFIRMADA 
        })

        if (stripe && req.body.createPaymentIntent) {
            const paymentIntent = await stripe.paymentIntents.create({
                amount: Math.round(total * 100),
                currency: 'usd',
                metadata: { purpose: 'reserva', total: String(total) },
            })
            nueva.pago = { provider: 'stripe', intentId: paymentIntent.id, status: paymentIntent.status }
        }

        const saved = await nueva.save()

        // Descontar stock inmediatamente al crear la reserva
        console.log('📦 Descontando stock de', saved.items.length, 'productos...')
        for (const it of saved.items) {
            if (!it.productId) {
                console.log(`⚠️ SALTANDO - productId es null/undefined para ${it.nombre}`)
                continue
            }
            
            console.log(`  - Producto ${it.nombre}: descontando ${it.cantidad} unidades`)
            
            const updated = await Producto.findOneAndUpdate(
                { _id: it.productId, disponibilidad: { $gte: it.cantidad } },
                { $inc: { disponibilidad: -it.cantidad } },
                { new: true }
            )
            
            if (!updated) {
                console.log(`  ❌ ERROR: Stock insuficiente para ${it.nombre}`)
                // Si falla, cancelar la reserva y retornar error
                await Reserva.findByIdAndUpdate(saved._id, { estado: ESTADOS_RESERVA.CANCELADA })
                return res.status(400).json({ message: `Stock insuficiente para ${it.nombre}` })
            }
            
            console.log(`  ✅ Stock actualizado: ${it.nombre} - Nueva disponibilidad: ${updated.disponibilidad}`)
        }

        return res.status(201).json({ reserva: saved })
    } catch (error) {
        console.error('Error crearReserva:', error)
        return res.status(500).json({ message: 'Error al crear reserva', error: error.message })
    }
}

export const confirmarReserva = async (req, res) => {
    try {
        const { id } = req.params
        const { pagoData } = req.body
        
        console.log('🔵 CONFIRMANDO PAGO DE RESERVA:', id)
        
        const r = await Reserva.findById(id)
        if (!r) {
            return res.status(404).json({ message: 'Reserva no encontrada' })
        }
        if (r.estado !== ESTADOS_RESERVA.CONFIRMADA) {
            return res.status(400).json({ message: 'Reserva no está en estado CONFIRMADA' })
        }

        // Revalidar stock disponible (por si cambió desde la creación)
        console.log('🔍 Revalidando disponibilidad de stock...')
        for (const it of r.items) {
            if (it.productId) {
                const prod = await Producto.findById(it.productId)
                if (!prod) {
                    return res.status(400).json({ message: `Producto no encontrado: ${it.nombre}` })
                }
                if ((prod.disponibilidad || 0) < (it.cantidad || 1)) {
                    return res.status(400).json({ 
                        message: `Stock insuficiente para ${it.nombre}. Disponible: ${prod.disponibilidad}, Necesario: ${it.cantidad}` 
                    })
                }
            }
        }

        // Guardar datos de pago
        if (pagoData) {
            r.pago = {
                provider: 'simulado',
                cardType: pagoData.cardType,
                lastFour: pagoData.lastFour,
                cardHolder: pagoData.cardHolder,
                status: 'succeeded',
                paidAt: new Date()
            }
        }

        await r.save()
        
        console.log('✅ PAGO REGISTRADO EXITOSAMENTE')
        
        return res.json({ 
            message: 'Reserva confirmada exitosamente', 
            reserva: r 
        })
    } catch (error) {
        console.error('Error confirmarReserva:', error)
        return res.status(500).json({ message: 'Error al confirmar reserva', error: error.message })
    }
}

export const obtenerReserva = async (req, res) => {
    try {
        const r = await Reserva.findById(req.params.id)
        
        if (!r) {
            return res.status(404).json({ message: 'Reserva no encontrada' })
        }
        
        return res.json({ reserva: r })
    } catch (error) {
        console.error('Error obtenerReserva:', error)
        return res.status(500).json({ message: 'Error al obtener reserva', error: error.message })
    }
}

export const listarReservas = async (req, res) => {
    try {
        const list = await Reserva.find({})
            .populate('empresaId', 'nombre email direccion nombreEmpresa rutEmpresa telefonoContacto telefono')
            .sort({ createdAt: -1 })
        
        return res.json({ reservas: list })
    } catch (error) {
        console.error('Error listarReservas:', error)
        return res.status(500).json({ message: 'Error al listar reservas', error: error.message })
    }
}

// Admin: Cambiar estado de una reserva (simplificado)
export const cambiarEstadoReserva = async (req, res) => {
    try {
        const { id } = req.params
        const { nuevoEstado } = req.body

        if (!Object.values(ESTADOS_RESERVA).includes(nuevoEstado)) {
            return res.status(400).json({ message: 'Estado no válido' })
        }

        const reserva = await Reserva.findById(id)
        if (!reserva) {
            return res.status(404).json({ message: 'Reserva no encontrada' })
        }

        console.log(`🔄 ADMIN: Cambiando estado de reserva ${id}: ${reserva.estado} → ${nuevoEstado}`)

        reserva.estado = nuevoEstado
        await reserva.save()

        console.log(`✅ Estado actualizado exitosamente`)

        return res.json({ 
            message: 'Estado actualizado', 
            reserva: await Reserva.findById(id).populate('empresaId', 'nombre email nombreEmpresa rutEmpresa nombrePropietario telefonoContacto telefono direccion') 
        })
    } catch (error) {
        console.error('❌ Error cambiarEstadoReserva:', error)
        return res.status(500).json({ message: 'Error al cambiar estado', error: error.message })
    }
}

// Admin: Cancelar una reserva
export const cancelarReserva = async (req, res) => {
    try {
        const { id } = req.params

        const reserva = await Reserva.findById(id)
        if (!reserva) {
            return res.status(404).json({ message: 'Reserva no encontrada' })
        }

        console.log(`❌ ADMIN: Cancelando reserva ${id} - Estado actual: ${reserva.estado}`)

        // Si la reserva está CONFIRMADA, restaurar el stock antes de cancelar
        if (reserva.estado === ESTADOS_RESERVA.CONFIRMADA) {
            console.log('🔄 Restaurando stock al cancelar reserva confirmada...')
            for (const it of reserva.items) {
                if (!it.productId) continue
                
                console.log(`  + Producto ${it.nombre}: devolviendo ${it.cantidad} unidades`)
                
                const updated = await Producto.findByIdAndUpdate(
                    it.productId,
                    { $inc: { disponibilidad: it.cantidad } },
                    { new: true }
                )
                
                if (updated) {
                    console.log(`  ✅ Stock restaurado: ${it.nombre} - Nueva disponibilidad: ${updated.disponibilidad}`)
                } else {
                    console.log(`  ⚠️ No se pudo actualizar el producto ${it.nombre}`)
                }
            }
        }

        reserva.estado = ESTADOS_RESERVA.CANCELADA
        await reserva.save()

        console.log(`✅ Reserva cancelada exitosamente`)

        return res.json({ 
            message: 'Reserva cancelada y stock restaurado', 
            reserva: await Reserva.findById(id).populate('empresaId', 'nombre email nombreEmpresa') 
        })
    } catch (error) {
        console.error('❌ Error cancelarReserva:', error)
        return res.status(500).json({ message: 'Error al cancelar reserva', error: error.message })
    }
}

export const listarMisReservas = async (req, res) => {
    try {
        const empresaId = req.user?.id
        
        if (!empresaId) {
            return res.status(401).json({ message: 'No autenticado' })
        }

        const usuario = await Usuario.findById(empresaId).select('email')
        const filterOr = [{ empresaId }]
        
        if (usuario?.email) {
            filterOr.push({ 'contacto.email': usuario.email })
        }

        const list = await Reserva.find({ $or: filterOr })
            .populate('empresaId', 'nombre email direccion nombreEmpresa')
            .sort({ createdAt: -1 })
        
        return res.json({ reservas: list })
    } catch (error) {
        console.error('Error listarMisReservas:', error)
        return res.status(500).json({ message: 'Error al listar mis reservas', error: error.message })
    }
}

export const devolverEquipos = async (req, res) => {
    try {
        const { id } = req.params
        
        console.log('📦 DEVOLVIENDO EQUIPOS - Reserva:', id)
        
        const r = await Reserva.findById(id)
        if (!r) {
            return res.status(404).json({ message: 'Reserva no encontrada' })
        }
        
        if (r.estado !== ESTADOS_RESERVA.CONFIRMADA) {
            return res.status(400).json({ message: 'Solo se pueden devolver reservas confirmadas' })
        }

        // Restaurar stock de cada producto
        console.log('🔄 Restaurando stock de', r.items.length, 'productos...')
        for (const it of r.items) {
            if (!it.productId) continue
            
            console.log(`  + Producto ${it.nombre}: devolviendo ${it.cantidad} unidades`)
            
            const updated = await Producto.findByIdAndUpdate(
                it.productId,
                { $inc: { disponibilidad: it.cantidad } },
                { new: true }
            )
            
            if (updated) {
                console.log(`  ✅ Stock restaurado: ${it.nombre} - Nueva disponibilidad: ${updated.disponibilidad}`)
            } else {
                console.log(`  ⚠️ No se pudo actualizar el producto ${it.nombre}`)
            }
        }

        r.estado = ESTADOS_RESERVA.DEVUELTA
        await r.save()
        
        console.log('✅ EQUIPOS DEVUELTOS EXITOSAMENTE:', id)
        
        return res.json({ 
            message: 'Equipos devueltos exitosamente', 
            reserva: r 
        })
    } catch (error) {
        console.error('Error devolverEquipos:', error)
        return res.status(500).json({ message: 'Error al devolver equipos', error: error.message })
    }
}

export const expirarReserva = async (reservaId) => {
    try {
        const r = await Reserva.findById(reservaId)
        
        if (!r) {
            return null
        }

        r.estado = ESTADOS_RESERVA.EXPIRADA
        await r.save()
        
        return r
    } catch (error) {
        console.error('Error expirarReserva:', error)
        throw error
    }
}