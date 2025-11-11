import { Link } from 'react-router-dom'
import { useState } from 'react'
import { HiMenu, HiX } from 'react-icons/hi'

// Componente de navegación responsiva con menú hamburguesa para móviles
const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <nav className="bg-white shadow-lg fixed w-full top-0 z-50">
            <div className="container mx-auto flex justify-between items-center py-4 px-6">
                {/* Logo de la aplicación */}
                <h1 className="text-2xl md:text-3xl font-extrabold text-blue-600">
                    RentPC para Empresas
                </h1>

                {/* Menú de escritorio */}
                <ul className="hidden md:flex gap-8 text-gray-700 font-medium">
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

                {/* Botón de menú móvil */}
                <div className="md:hidden flex items-center">
                    <button onClick={() => setIsOpen(!isOpen)} className="text-gray-700 focus:outline-none">
                        {isOpen ? <HiX size={28} /> : <HiMenu size={28} />}
                    </button>
                </div>
            </div>

            {/* Menú móvil desplegable */}
            {isOpen && (
                <div className="md:hidden bg-white shadow-lg">
                    <ul className="flex flex-col gap-4 p-6 text-gray-700 font-medium">
                        <li className="hover:text-blue-600 transition-colors duration-200">
                            <Link to="/" onClick={() => setIsOpen(false)}>Inicio</Link>
                        </li>
                        <li className="hover:text-blue-600 transition-colors duration-200">
                            <Link to="/catalogo" onClick={() => setIsOpen(false)}>Catálogo</Link>
                        </li>
                        <li className="hover:text-blue-600 transition-colors duration-200">
                            <Link to="/contacto" onClick={() => setIsOpen(false)}>Contacto</Link>
                        </li>
                    </ul>
                </div>
            )}
        </nav>
    )
}

export default Navbar