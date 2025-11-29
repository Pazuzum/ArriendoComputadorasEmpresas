import { useEffect, useState } from 'react'
import { useCotizacion } from '../Context/CotizacionContext.jsx'
import { Link } from 'react-router-dom'
import { useToast } from './Toast.jsx'

// Tarjeta de producto con carrusel de imágenes, selector de cantidad y botón de agregar a cotización
const ProductCard = ({ producto }) => {
    const [ImagenActual, setImagenActual] = useState(0)
    const [isHovering, setIsHovering] = useState(false)
    const [added, setAdded] = useState(false)
    const [cantidad, setCantidad] = useState(1)
    const { addToQuote } = useCotizacion()
    const { showToast } = useToast()

    // Carrusel automático de imágenes cada 3 segundos
    useEffect(() => {
        const interval = setInterval(() => {
            setImagenActual((prev) =>
                prev === producto.imgs.length - 1 ? 0 : prev + 1 
            )
        }, 3000)
        return () => clearInterval(interval)
    }, [producto.imgs.length])

    return (
        <div
            className="bg-white rounded-2xl shadow-lg hover:shadow-2xl overflow-hidden transition-all duration-300 transform hover:-translate-y-2 border border-gray-100"
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
        >
            {/* Imagen del producto con carrusel */}
            <div className="relative h-64 w-full overflow-hidden bg-gray-100">
                <img
                    src={producto.imgs[ImagenActual]}
                    alt={producto.nombre}
                    className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
                    onError={(e) => {
                        e.target.onerror = null
                        e.target.src = 'https://via.placeholder.com/600x400?text=Sin+imagen'
                    }}
                />
                <div className="absolute top-3 right-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                    Disponible
                </div>
                {/* Overlay oscuro al hacer hover */}
                {isHovering && (
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
                )}
            </div>

            {/* Indicadores de navegación del carrusel */}
            {producto.imgs.length > 1 && (
                <div className={`absolute top-60 left-1/2 transform -translate-x-1/2 flex gap-2 transition-opacity duration-300 ${isHovering ? 'opacity-100' : 'opacity-0'}`}>
                    {producto.imgs.map((_, index) => (
                        <button
                            key={index}
                            className={`h-2 w-2 rounded-full transition-all ${index === ImagenActual ? 'bg-blue-600 w-6' : 'bg-white/60 hover:bg-white'}`}
                            onClick={() => setImagenActual(index)}
                            aria-label={`Ver imagen ${index + 1}`}
                        />
                    ))}
                </div>
            )}

            {/* Información del producto */}
            <div className="p-6">
                <h3 className="text-xl font-bold mb-2 text-gray-900 line-clamp-1">{producto.nombre}</h3>
                <p className="text-gray-600 mb-4 text-sm line-clamp-2 min-h-[2.5rem]">{producto.descripcion}</p>
                
                {/* Precio del producto */}
                <div className="flex items-baseline gap-2 mb-4">
                    <span className="text-3xl font-bold text-blue-600">${producto.precio}</span>
                    <span className="text-sm text-gray-500">/día</span>
                </div>

                {/* Indicador de disponibilidad con colores dinámicos */}
                <div className="flex items-center gap-2 mb-5 pb-5 border-b border-gray-100">
                    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg ${(producto.disponibilidad ?? 0) > 10 ? 'bg-green-50 text-green-700' : (producto.disponibilidad ?? 0) > 0 ? 'bg-yellow-50 text-yellow-700' : 'bg-red-50 text-red-700'}`}>
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span className="text-xs font-semibold">{producto.disponibilidad ?? 0} unidades</span>
                    </div>
                </div>
                
                <div className="space-y-3">
                    {/* Selector de cantidad con botones */}
                    <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-2">Cantidad</label>
                        <div className="flex items-center border-2 border-gray-200 rounded-xl overflow-hidden bg-gray-50">
                            <button
                                onClick={() => setCantidad((c) => Math.max(1, c - 1))}
                                className="px-4 py-3 bg-white hover:bg-blue-50 transition font-bold text-gray-700"
                                aria-label="Disminuir"
                            >−
                            </button>
                            <input
                                type="number"
                                className="flex-1 text-center px-3 py-3 outline-none font-bold text-gray-900 bg-white border-x-2 border-gray-200"
                                value={cantidad}
                                onChange={(e) => {
                                    const val = e.target.value
                                    if (val === '') {
                                        setCantidad('')
                                    } else {
                                        setCantidad(Number(val) || 1)
                                    }
                                }}
                                onBlur={(e) => {
                                    if (e.target.value === '' || Number(e.target.value) < 1) {
                                        setCantidad(1)
                                    }
                                }}
                                min={1}
                                max={producto.disponibilidad ?? undefined}
                            />
                            <button
                                onClick={() => setCantidad((c) => {
                                    const max = producto.disponibilidad ?? Infinity
                                    const current = Number(c) || 0
                                    return Math.min(max, current + 1)
                                })}
                                className="px-4 py-3 bg-white hover:bg-blue-50 transition font-bold text-gray-700"
                                aria-label="Aumentar"
                            >+
                            </button>
                        </div>
                    </div>

                    {/* Botón para agregar producto a la cotización */}
                    <button
                        onClick={() => {
                            if ((producto.disponibilidad ?? 0) <= 0) {
                                showToast('Este producto está agotado', 'error')
                                return
                            }
                            
                            const qty = Math.max(1, Math.floor(cantidad) || 1)
                            const max = producto.disponibilidad ?? 0
                            
                            // Validar si la cantidad solicitada excede el stock
                            if (qty > max) {
                                showToast(
                                    `Solo hay ${max} unidad${max !== 1 ? 'es' : ''} disponible${max !== 1 ? 's' : ''} de este producto. No puedes agregar ${qty} unidades.`,
                                    'error'
                                )
                                setCantidad(max) // Ajustar al máximo disponible
                                return
                            }
                            
                            addToQuote(producto, qty)
                            if (typeof producto.onReserve === 'function') producto.onReserve(qty)
                            setAdded(true)
                            setTimeout(() => setAdded(false), 2500)
                            setCantidad(1)
                        }}
                        disabled={(producto.disponibilidad ?? 0) <= 0}
                        className={`w-full py-3.5 rounded-xl font-bold transition-all duration-300 flex items-center justify-center gap-2 ${ 
                            (producto.disponibilidad ?? 0) <= 0 
                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                                : added 
                                    ? 'bg-green-500 text-white ring-4 ring-green-200' 
                                    : 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl active:scale-95'
                        }`}
                    >
                        {added ? (
                            <>
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                Agregado a cotización
                            </>
                        ) : (producto.disponibilidad ?? 0) <= 0 ? (
                            'Agotado'
                        ) : (
                            <>
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                                Agregar a cotización
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ProductCard