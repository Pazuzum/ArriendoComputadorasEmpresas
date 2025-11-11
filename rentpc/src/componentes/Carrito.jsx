import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useCarrito } from '../Context/CarritoContext.jsx'

// Componente de carrito de compras con header y visualización de items
const Carrito = () => {
    const [carritoVisible, setCarritoVisible] = useState(false)
    const { items, removeItem, clear, total } = useCarrito()

    // Alternar visibilidad del carrito
    const toggleCarrito = () => {
        setCarritoVisible((prevState) => !prevState)
    }

    return (
        <div>
            <header className="flex-wrap top-0 left-0 w-full py-5 px-24 flex justify-between items-center border-b-4 border-black z-50 bg-gray-400">
                <Link to="/">
                    <h1 className="text-4xl text-black select-none font-extrabold">rentpc</h1>
                </Link>
                <div className="flex space-x-12 text-lg font-bold">
                    {/* Menú de navegación */}
                    <ul className="hidden md:flex gap-8 text-white font-medium">
                        <li className="hover:text-blue-600 transition-colors duration-200">
                            <Link to="/">Inicio</Link>
                        </li>
                        <li className="hover:text-blue-600 transition-colors duration-200">
                            <Link to="/catalogo">Catálogo</Link>
                        </li>
                        <li className="hover:text-blue-600 transition-colors duration-200">
                            <Link to="/contacto">Contacto</Link>
                        </li>
                    </ul>
                    
                    {/* Botón del carrito con contador */}
                    <button onClick={toggleCarrito} className="relative ml-4">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="currentColor"
                            className="bg-white w-10 h-10 cursor-pointer"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
                            />
                        </svg>
                        <div className="absolute top-1/2 text-[13px] font-semibold bg-black text-white w-[25px] h-[25px] flex justify-center items-center rounded-[25%]">
                            <span>{items.length}</span>
                        </div>
                    </button>
                    
                    {/* Panel desplegable del carrito */}
                    {carritoVisible && (
                        <div className="absolute top-[70px] right-2 bg-white w-[400px] rounded-[20px] z-[1]">
                            {items.length > 0 ? (
                                <>
                                    <div className="">
                                        <h2 className="text-center text-[20px] font-bold py-5 border-b border-black">Carrito de Compras</h2>
                                    </div>
                                    {/* Lista de items en el carrito */}
                                    <div className="p-4 space-y-2">
                                        {items.map(it => (
                                            <div key={it.id} className="flex justify-between items-center">
                                                <div>
                                                    <div className="font-semibold">{it.nombre}</div>
                                                    <div className="text-sm text-gray-600">{it.qty} x ${it.precio}</div>
                                                </div>
                                                <div className="flex gap-2">
                                                    <button onClick={() => removeItem(it.id)} className="text-red-600">Eliminar</button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    {/* Total y botón de vaciar */}
                                    <div className="flex justify-center items-center py-5 gap-5">
                                        <h3 className="text-[15px] font-bold">Total:</h3>
                                        <span className="text-[20px] font-bold">${total}</span>
                                        <button onClick={clear} className="bg-black text-white p-1 rounded-[15%]">Vaciar</button>
                                    </div>
                                    {/* Botón para ir a cotizar */}
                                    <div className="flex justify-center items-center py-5 gap-5 border-t border-black">
                                        <Link to="/cotizar" className="w-1/2 h-11 bg-[#0b74da] text-white rounded-lg border-none font-bold text-lg hover:bg-[#005fa3] flex items-center justify-center">Cotizar</Link>
                                    </div>
                                </>
                            ) : (
                                <p className="p-5 text-[17px] text-[#666] text-center">El carrito se encuentra vacío.</p>
                            )}
                        </div>
                    )}
                </div>
            </header>
        </div>
    )
}

export default Carrito