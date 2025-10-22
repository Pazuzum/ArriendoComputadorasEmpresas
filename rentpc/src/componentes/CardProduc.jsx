import { useEffect, useState } from "react";
import { useCotizacion } from "../Context/CotizacionContext.jsx";
import { Link } from "react-router-dom";

const ProductCard = ({ producto }) => {
    const [ImagenActual, setImagenActual] = useState(0);
    const [isHovering, setIsHovering] = useState(false);
    const [added, setAdded] = useState(false);
    const [cantidad, setCantidad] = useState(1);
    const { addToQuote } = useCotizacion();

    useEffect(() => {
        const interval = setInterval(() => {
            setImagenActual((prev) =>
                prev === producto.imgs.length - 1 ? 0 : prev + 1 
            );
        }, 3000);
        return () => clearInterval(interval);
    }, [producto.imgs.length]);

return (
        <div
            className="bg-white rounded-xl shadow-lg hover:shadow-2xl overflow-hidden hover:scale-105 transition transform relative"
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
        >

            {/* Imagen removible */}
            <div className="relative h-80 w-full overflow-hidden">
                    <img
                        src={producto.imgs[ImagenActual]}
                        alt={producto.nombre}
                        className="w-full h-full object-cover transition-all duration-700"
                    />
                <div className="absolute top-2 right-2 bg-blue-600 text-white text-xs px-2 py-1 rounded">
                    Nuevo
                </div>
            </div>
            {/* Los puntos ahora cambian de opacidad al hacer hover */}
            <div className={`absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-2 transition-opacity duration-300 ${isHovering ? 'opacity-100' : 'opacity-0'}`}>
                {producto.imgs.map((_, index) => (
                    <span
                        key={index}
                        className={`h-2 w-6 rounded-full ${index === ImagenActual ? 'bg-blue-600' : 'bg-gray-300'} cursor-pointer`}
                        onClick={() => setImagenActual(index)}
                    ></span>
                ))}
            </div>
            <div className="p-6 text-center">
                <h3 className="text-xl font-semibold mb-2 text-gray-800">{producto.nombre}</h3>
                <p className="text-gray-600 mb-4">{producto.descripcion}</p>
                <p className="text-lg font-bold text-blue-600 mb-4"> Desde ${producto.precio}/día</p>
                <p className="text-sm text-gray-500 mb-4">Disponibilidad: {producto.disponibilidad ?? 'N/A'} unidades</p>
                <div className="flex items-center justify-center gap-4">
                    <div className="flex items-center border rounded-md overflow-hidden">
                        <button
                            onClick={() => setCantidad((c) => Math.max(1, c - 1))}
                            className="px-3 py-2 bg-gray-100"
                            aria-label="Disminuir"
                        >-
                        </button>
                        <input
                            type="number"
                            className="w-20 text-center px-2 py-2 outline-none"
                            value={cantidad}
                            onChange={(e) => setCantidad(Number(e.target.value) || 1)}
                            min={1}
                            max={producto.disponibilidad ?? undefined}
                        />
                        <button
                            onClick={() => setCantidad((c) => {
                                const max = producto.disponibilidad ?? Infinity;
                                return Math.min(max, c + 1);
                            })}
                            className="px-3 py-2 bg-gray-100"
                            aria-label="Aumentar"
                        >+
                        </button>
                    </div>

                    <button
                        onClick={() => {
                            if ((producto.disponibilidad ?? 0) <= 0) return;
                            const qty = Math.max(1, Math.floor(cantidad) || 1);
                            const max = producto.disponibilidad ?? Infinity;
                            const toAdd = Math.min(qty, max);
                            addToQuote(producto, toAdd);
                            if (typeof producto.onReserve === 'function') producto.onReserve(toAdd);
                            setAdded(true);
                            setTimeout(() => setAdded(false), 1500);
                            setCantidad(1);
                        }}
                        disabled={(producto.disponibilidad ?? 0) <= 0}
                        className={`px-4 py-2 rounded font-semibold transition ${ (producto.disponibilidad ?? 0) <= 0 ? 'bg-gray-400 text-white cursor-not-allowed' : 'bg-green-600 text-white hover:bg-green-700 active:scale-95' } ${added ? 'ring-2 ring-green-300' : ''}`}
                    >
                        {added ? 'Agregado' : ( (producto.disponibilidad ?? 0) <= 0 ? 'Agotado' : 'Agregar a cotización' )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;