import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/authContext";


const Header = () => {

    const { user, isAuthenticated, logout } = useAuth();
    const [carritoVisible, setCarritoVisible] = useState(false);

    const toggleCarrito = () => {
        setCarritoVisible((prevState) => !prevState);
    };
    return (
        <header className="flex-wrap bg-gray-800 top-0 left-0 w-full py-5 px-24 flex justify-between items-center  text-white p-4">
                <Link to="/">
                    <h1 className="text-4xl text-white select-none font-extrabold">RENTPC</h1>
                </Link> 
            <nav className="flex space-x-12 text-white text-lg font-bold">
                {isAuthenticated ? (
                        <>
                            <a href="/" className="py-2 hover:text-blue-600 transition-colors duration-200">Inicio</a>
                            <a href="/catalogo" className="py-2 hover:text-blue-600 transition-colors duration-200">Catálogo</a>
                            <a href="/nosotros" className="py-2 hover:text-blue-600 transition-colors duration-200">Nosotros</a>
                            <span className="py-2 hover:text-blue-600 transition-colors duration-200">Hola, {user.nombre}</span>
                            <Link onClick={()=>{logout()}} className="relative ml-12 py-2 px-6 border-2 border-white rounded-xl text-white font-bold hover:bg-white hover:text-gray-800 transition" to="/login">Cerrar sesión</Link>

                            <button onClick={toggleCarrito} className="relative ml-4">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth="1.5"
                                    stroke="currentColor"
                                    className="bg-red w-10 h-10 cursor-pointer"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
                                    />
                                </svg>
                                <div className="absolute top-1/2 text-[13px] font-semibold bg-black text-white w-[25px] h-[25px] flex justify-center items-center rounded-[25%]">
                                    <span>{ 0}</span>
                                </div>
                            </button>
                            {carritoVisible && (
                                <div className="absolute top-[70px] right-2 bg-white w-[400px] rounded-[20px] z-[1]">
                                    {0 ? (
                                        <>
                                            <div className="">
                                                <h2 className="text-center text-[20px] font-bold py-5 border-b border-black">Carrito de Compras</h2>
                                            </div>
                                            <div className="flex justify-center items-center py-5 gap-5">
                                                <h3 className="text-[15px] font-bold">Total:</h3>
                                                <span className="text-[20px] font-bold">${0}</span>
                                                <button className="bg-black text-white p-1 rounded-[15%]" >Vaciar</button>
                                            </div>
                                            <div className="flex justify-center items-center py-5 gap-5 border-t border-black">
                                                <button className="w-1/4 h-11 bg-[#afc] rounded-lg border-none font-bold text-lg hover:bg-[#bdc] cursor-pointer" >Solicitar</button>
                                            </div>
                                        </>
                                    ) : (
                                        <p className="p-5 text-[17px] text-[#666] text-center">El carrito se encuentra vacío.</p>
                                    )}
                                </div>
                            )}
                        </>
                    ):(
                        <>
                            <a href="/" className="py-2 hover:text-blue-600 transition-colors duration-200">Inicio</a>
                            <a href="/catalogo" className="py-2 hover:text-blue-600 transition-colors duration-200">Catálogo</a>
                            <a href="/nosotros" className="py-2 hover:text-blue-600 transition-colors duration-200">Nosotros</a>
                            <Link to="/login" className="ml-12 py-2 px-6 border-2 border-white rounded-xl text-white font-bold hover:bg-white hover:text-gray-800 transition">
                                Iniciar Sesion
                            </Link>
                            <Link to="/register" className="ml-12 py-2 px-6 border-2 border-white rounded-xl text-white font-bold hover:bg-white hover:text-gray-800 transition">
                                Registrarse
                            </Link>
                        </>
                    )}
            </nav>
        </header>
    );
}
export default Header;
