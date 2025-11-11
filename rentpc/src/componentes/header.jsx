import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../Context/authContext.jsx'

// Componente de encabezado con navegación y menú de usuario
const Header = () => {
    const { user, isAuthenticated, logout } = useAuth()
    const [perfilOpen, setPerfilOpen] = useState(false)
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const dropdownRef = useRef(null)
    
    // Verificar si el usuario es administrador
    const isAdmin = user?.role === 'admin' || (Array.isArray(user?.roles) && user.roles.some(r => r.nombre === 'admin' || r.name === 'admin'))

    // Cerrar dropdown al hacer clic fuera
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setPerfilOpen(false)
            }
        }

        if (perfilOpen) {
            document.addEventListener('mousedown', handleClickOutside)
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [perfilOpen])

    return (
        <header className="bg-gray-800 top-0 left-0 w-full py-4 px-4 sm:px-6 lg:px-24 text-white relative">
            <div className="flex items-center justify-between w-full">
                <Link to="/">
                    <h1 className="text-2xl sm:text-3xl lg:text-4xl text-white select-none font-extrabold">💻 RENTPC</h1>
                </Link>
                
                {/* Menú hamburguesa móvil */}
                <button 
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    className="lg:hidden text-white p-2 hover:bg-gray-700 rounded-lg transition"
                >
                    {mobileMenuOpen ? (
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    ) : (
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    )}
                </button>
            </div>
            
            {/* Navegación Desktop */}
            <nav className="hidden lg:flex space-x-8 xl:space-x-12 text-white text-lg font-bold items-center">
                {isAuthenticated ? (
                    <>
                        <a href="/" className="py-2 hover:text-blue-600 transition-colors duration-200">Inicio</a>
                        <a href="/catalogo" className="py-2 hover:text-blue-600 transition-colors duration-200">Catálogo</a>
                        <a href="/mis-cotizaciones" className="py-2 hover:text-blue-600 transition-colors duration-200">Mis cotizaciones</a>
                        <a href="/nosotros" className="py-2 hover:text-blue-600 transition-colors duration-200">Nosotros</a>
                        
                        {/* Menú desplegable de perfil de usuario */}
                        <div className="relative" ref={dropdownRef}>
                            <button 
                                onClick={() => setPerfilOpen(!perfilOpen)}
                                className="flex items-center gap-2 py-2 hover:text-blue-600 transition-colors duration-200"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                                <span>{user?.nombre || user?.username}</span>
                                <svg className={`w-4 h-4 transition-transform ${perfilOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>
                            
                            {/* Menú dropdown */}
                            {perfilOpen && (
                                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-2xl border border-gray-200 py-2 z-50">
                                    <Link 
                                        to="/perfil" 
                                        onClick={() => setPerfilOpen(false)}
                                        className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                        </svg>
                                        Editar mi perfil
                                    </Link>
                                    {isAdmin && (
                                        <Link 
                                            to="/admin" 
                                            onClick={() => setPerfilOpen(false)}
                                            className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                            Panel Admin
                                        </Link>
                                    )}
                                    <div className="border-t border-gray-200 my-2"></div>
                                    <button
                                        onClick={() => {
                                            setPerfilOpen(false)
                                            logout()
                                        }}
                                        className="flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 transition w-full text-left"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                        </svg>
                                        Cerrar sesión
                                    </button>
                                </div>
                            )}
                        </div>
                    </>
                ) : (
                    <>
                        <a href="/" className="py-2 hover:text-blue-600 transition-colors duration-200">Inicio</a>
                        <a href="/catalogo" className="py-2 hover:text-blue-600 transition-colors duration-200">Catálogo</a>
                        <a href="/nosotros" className="py-2 hover:text-blue-600 transition-colors duration-200">Nosotros</a>
                        <Link to="/login" className="ml-12 py-2 px-6 border-2 border-white rounded-xl text-white font-bold hover:bg-white hover:text-gray-800 transition">
                            Iniciar sesión
                        </Link>
                        <Link to="/register" className="ml-12 py-2 px-6 border-2 border-white rounded-xl text-white font-bold hover:bg-white hover:text-gray-800 transition">
                            Registrarse
                        </Link>
                    </>
                )}
            </nav>

            {/* Menú Móvil */}
            {mobileMenuOpen && (
                <div className="lg:hidden absolute top-full left-0 right-0 bg-gray-800 border-t border-gray-700 shadow-lg z-50">
                    <nav className="flex flex-col py-2">
                        {isAuthenticated ? (
                            <>
                                <a href="/" onClick={() => setMobileMenuOpen(false)} className="px-6 py-3 hover:bg-gray-700 transition flex items-center gap-3">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                    </svg>
                                    Inicio
                                </a>
                                <a href="/catalogo" onClick={() => setMobileMenuOpen(false)} className="px-6 py-3 hover:bg-gray-700 transition flex items-center gap-3">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                    Catálogo
                                </a>
                                <a href="/mis-cotizaciones" onClick={() => setMobileMenuOpen(false)} className="px-6 py-3 hover:bg-gray-700 transition flex items-center gap-3">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                    Mis cotizaciones
                                </a>
                                <a href="/nosotros" onClick={() => setMobileMenuOpen(false)} className="px-6 py-3 hover:bg-gray-700 transition flex items-center gap-3">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    Nosotros
                                </a>
                                
                                <div className="border-t border-gray-700 my-2"></div>
                                
                                <div className="px-6 py-2 text-sm text-gray-400 flex items-center gap-2">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                    {user?.nombre || user?.username}
                                </div>
                                
                                <Link to="/perfil" onClick={() => setMobileMenuOpen(false)} className="px-6 py-3 hover:bg-gray-700 transition flex items-center gap-3">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                    Mi perfil
                                </Link>
                                
                                {isAdmin && (
                                    <Link to="/admin" onClick={() => setMobileMenuOpen(false)} className="px-6 py-3 hover:bg-gray-700 transition flex items-center gap-3 text-blue-400">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                        Panel Admin
                                    </Link>
                                )}
                                
                                <button
                                    onClick={() => {
                                        setMobileMenuOpen(false)
                                        logout()
                                    }}
                                    className="px-6 py-3 hover:bg-red-900 transition flex items-center gap-3 text-red-400 mt-2"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                    </svg>
                                    Cerrar sesión
                                </button>
                            </>
                        ) : (
                            <>
                                <a href="/" onClick={() => setMobileMenuOpen(false)} className="px-6 py-3 hover:bg-gray-700 transition">Inicio</a>
                                <a href="/catalogo" onClick={() => setMobileMenuOpen(false)} className="px-6 py-3 hover:bg-gray-700 transition">Catálogo</a>
                                <a href="/nosotros" onClick={() => setMobileMenuOpen(false)} className="px-6 py-3 hover:bg-gray-700 transition">Nosotros</a>
                                
                                <div className="border-t border-gray-700 my-2"></div>
                                
                                <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="mx-6 my-2 py-3 text-center border-2 border-white rounded-xl font-bold hover:bg-white hover:text-gray-800 transition">
                                    Iniciar sesión
                                </Link>
                                <Link to="/register" onClick={() => setMobileMenuOpen(false)} className="mx-6 mb-2 py-3 text-center border-2 border-blue-500 bg-blue-600 rounded-xl font-bold hover:bg-blue-700 transition">
                                    Registrarse
                                </Link>
                            </>
                        )}
                    </nav>
                </div>
            )}
        </header>
    )
}

export default Header
