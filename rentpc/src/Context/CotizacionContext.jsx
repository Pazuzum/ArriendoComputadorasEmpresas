/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState } from 'react'

// Contexto de cotización
const CotizacionContext = createContext()

// Hook personalizado para usar el contexto de cotización
export const useCotizacion = () => {
    const ctx = useContext(CotizacionContext)
    if (!ctx) {
        throw new Error('useCotizacion debe usarse dentro de CotizacionProvider')
    }
    return ctx
}

// Proveedor del contexto de cotización
export const CotizacionProvider = ({ children }) => {
    // Inicializar items desde localStorage
    const [items, setItems] = useState(() => {
        try {
            const raw = localStorage.getItem('cotizacion')
            return raw ? JSON.parse(raw) : []
        } catch (error) {
            console.error('Error al cargar cotización:', error)
            return []
        }
    })

    // Guardar items en localStorage cuando cambien
    useEffect(() => {
        localStorage.setItem('cotizacion', JSON.stringify(items))
    }, [items])

    // Agregar producto a la cotización
    const addToQuote = (producto, cantidad = 1) => {
        const prodId = producto.id || producto._id
        const withId = { ...producto, id: prodId }
        
        setItems((prev) => {
            const found = prev.find((p) => (p.id || p._id) === prodId)
            if (found) {
                return prev.map((p) => 
                    (p.id || p._id) === prodId ? { ...p, qty: (p.qty || 0) + cantidad } : p
                )
            }
            return [...prev, { ...withId, qty: cantidad }]
        })
    }

    // Eliminar producto de la cotización
    const removeItem = (id) => {
        setItems((prev) => prev.filter((p) => (p.id || p._id) !== id))
    }

    // Actualizar cantidad de un producto
    const updateQty = (id, qty) => {
        setItems((prev) => 
            prev.map((p) => 
                (p.id || p._id) === id ? { ...p, qty: Math.max(1, qty) } : p
            )
        )
    }

    // Limpiar cotización
    const clear = () => {
        setItems([])
    }

    // Calcular total de la cotización
    const total = items.reduce((acc, it) => acc + (it.precio || 0) * (it.qty || 1), 0)

    return (
        <CotizacionContext.Provider value={{ items, addToQuote, removeItem, updateQty, clear, total }}>
            {children}
        </CotizacionContext.Provider>
    )
}

export default CotizacionContext
