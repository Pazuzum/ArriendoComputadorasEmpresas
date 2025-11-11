// Componente de pie de página con derechos de autor
const Footer = () => {
    return (
        <footer className="bg-gray-800 text-white py-8 sm:py-12 mt-12 sm:mt-16">
            <div className="container mx-auto px-4 sm:px-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mb-8">
                    {/* Logo y descripción */}
                    <div className="text-center sm:text-left">
                        <h3 className="text-2xl sm:text-3xl font-extrabold mb-3 sm:mb-4">💻 RENTPC</h3>
                        <p className="text-sm text-gray-400 leading-relaxed">
                            Soluciones de arriendo de equipos informáticos para empresas.
                        </p>
                    </div>

                    {/* Enlaces rápidos */}
                    <div className="text-center sm:text-left">
                        <h4 className="text-lg font-bold mb-3 sm:mb-4">Enlaces Rápidos</h4>
                        <ul className="space-y-2 text-sm">
                            <li><a href="/" className="text-gray-400 hover:text-white transition">Inicio</a></li>
                            <li><a href="/catalogo" className="text-gray-400 hover:text-white transition">Catálogo</a></li>
                            <li><a href="/nosotros" className="text-gray-400 hover:text-white transition">Nosotros</a></li>
                        </ul>
                    </div>

                    {/* Servicios */}
                    <div className="text-center sm:text-left">
                        <h4 className="text-lg font-bold mb-3 sm:mb-4">Servicios</h4>
                        <ul className="space-y-2 text-sm">
                            <li className="text-gray-400">Arriendo de PCs</li>
                            <li className="text-gray-400">Arriendo de Notebooks</li>
                            <li className="text-gray-400">Soporte Técnico</li>
                        </ul>
                    </div>

                    {/* Contacto */}
                    <div className="text-center sm:text-left">
                        <h4 className="text-lg font-bold mb-3 sm:mb-4">Contacto</h4>
                        <ul className="space-y-2 text-sm text-gray-400">
                            <li className="flex items-center justify-center sm:justify-start gap-2">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                                info@rentpc.cl
                            </li>
                            <li className="flex items-center justify-center sm:justify-start gap-2">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                </svg>
                                +56 2 1234 5678
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-gray-700 pt-6 sm:pt-8">
                    <p className="text-center text-xs sm:text-sm text-gray-400">
                        &copy; {new Date().getFullYear()} RentPC. Todos los derechos reservados. | Arriendo de equipos informáticos para empresas.
                    </p>
                </div>
            </div>
        </footer>
    )
}

export default Footer