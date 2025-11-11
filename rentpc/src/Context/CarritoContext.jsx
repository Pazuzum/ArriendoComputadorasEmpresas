/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState } from 'react'

// Contexto del carrito de compras
const CarritoContext = createContext()

// Hook personalizado para usar el contexto del carrito
export const useCarrito = () => {
    const ctx = useContext(CarritoContext)
    if (!ctx) {
        throw new Error('useCarrito debe usarse dentro de CarritoProvider')
    }
    return ctx
}

// Proveedor del contexto del carrito
export const CarritoProvider = ({ children }) => {
    // Inicializar items desde localStorage
    const [items, setItems] = useState(() => {
        try {
            const raw = localStorage.getItem('carrito')
            return raw ? JSON.parse(raw) : []
        } catch (error) {
            console.error('Error al cargar carrito:', error)
            return []
        }
    })

    // Guardar items en localStorage cuando cambien
    useEffect(() => {
        localStorage.setItem('carrito', JSON.stringify(items))
    }, [items])

    // Agregar producto al carrito
    const addItem = (producto) => {
        setItems((prev) => {
            const found = prev.find((p) => p.id === producto.id)
            if (found) {
                return prev.map((p) => 
                    p.id === producto.id ? { ...p, qty: p.qty + 1 } : p
                )
            }
            return [...prev, { ...producto, qty: 1 }]
        })
    }

    // Eliminar producto del carrito
    const removeItem = (id) => {
        setItems((prev) => prev.filter((p) => p.id !== id))
    }

    // Limpiar carrito
    const clear = () => {
        setItems([])
    }

    // Calcular total del carrito
    const total = items.reduce((acc, it) => acc + (it.precio || 0) * (it.qty || 1), 0)

    return (
        <CarritoContext.Provider value={{ items, addItem, removeItem, clear, total }}>
            {children}
        </CarritoContext.Provider>
    )
}

export default CarritoContext
