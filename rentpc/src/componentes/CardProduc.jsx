import { useEffect, useState } from "react";

const ProductCard = ({ producto }) => {
    const [ImagenActual, setImagenActual] = useState(0);
    const [isHovering, setIsHovering] = useState(false);

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
                        className={`h-2 w-6 rounded-full ${index === ImagenActual ? 'bg-blue-600' : 'bg-gray-300'}`} cursor-pointer
                        onClick={() => setImagenActual(index)}
                    ></span>
                ))}
            </div>
            <div className="p-6 text-center">
                <h3 className="text-xl font-semibold mb-2 text-gray-800">{producto.nombre}</h3>
                <p className="text-gray-600 mb-4">{producto.descripcion}</p>
                <p className="text-lg font-bold text-blue-600 mb-4"> Desde ${producto.precio}/día</p>
            </div>
        </div>
    );
};

export default ProductCard;