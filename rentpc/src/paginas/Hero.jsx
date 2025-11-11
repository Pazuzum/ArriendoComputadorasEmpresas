import { useAuth } from "../Context/authContext.jsx";
import Header from "../componentes/Header.jsx";
import Footer from "../componentes/Footer.jsx";

const Hero = () => {
    const { user, isAuthenticated } = useAuth();

    const isAdmin =
        user?.role === "admin" ||
        (Array.isArray(user?.roles) && user.roles.some(r => r.nombre === "admin" || r.name === "admin" || r === "admin"));

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
            <Header />
            
            {/* Hero Section */}
            <section className="relative overflow-hidden">
                {/* Fondo con patrón corporativo */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-blue-800 to-slate-900"></div>
                
                {/* Patrón de fondo */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute inset-0" style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                    }}></div>
                </div>

                {/* Contenido Principal */}
                <div className="relative z-10 max-w-7xl mx-auto px-6 py-20 md:py-32">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        {/* Lado izquierdo - Texto */}
                        <div className="text-white space-y-8">
                            <div className="inline-flex items-center gap-2 bg-blue-600/30 backdrop-blur-sm border border-blue-400/30 rounded-full px-4 py-2 text-sm font-semibold">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z"/>
                                </svg>
                                Soluciones Tecnológicas Empresariales
                            </div>
                            
                            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight">
                                Equipos de
                                <span className="block bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
                                    Calidad Profesional
                                </span>
                                para tu Empresa
                            </h1>
                            
                            <p className="text-xl md:text-2xl text-blue-100 leading-relaxed">
                                Arriendo flexible de notebooks y PCs de última generación. Optimiza costos operativos sin comprometer el rendimiento de tu equipo.
                            </p>

                            {/* Botones CTA */}
                            <div className="flex flex-col sm:flex-row gap-4 pt-4">
                                <a
                                    href="/catalogo"
                                    className="group relative bg-white text-blue-900 px-8 py-4 rounded-xl font-bold text-lg shadow-2xl hover:shadow-cyan-500/50 transition-all duration-300 overflow-hidden"
                                >
                                    <span className="relative z-10 flex items-center justify-center gap-2">
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                        </svg>
                                        Ver Equipos Disponibles
                                    </span>
                                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-400 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
                                </a>
                                
                                {isAuthenticated ? (
                                    <a
                                        href="/mis-cotizaciones"
                                        className="bg-transparent border-2 border-white/50 backdrop-blur-sm text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-white hover:text-blue-900 transition-all duration-300 flex items-center justify-center gap-2"
                                    >
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                        Mis Cotizaciones
                                    </a>
                                ) : (
                                    <a
                                        href="/register"
                                        className="bg-transparent border-2 border-white/50 backdrop-blur-sm text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-white hover:text-blue-900 transition-all duration-300 flex items-center justify-center gap-2"
                                    >
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                                        </svg>
                                        Registrar Empresa
                                    </a>
                                )}
                            </div>
                        </div>

                        {/* Lado derecho - Imagen/Ilustración */}
                        <div className="relative hidden md:block">
                            <div className="relative">
                                <img 
                                    src="https://vizito.eu/images/blog/employees_meeting_at_the_office.png" 
                                    alt="Reunión de empleados en oficina"
                                    className="rounded-2xl shadow-2xl transform hover:scale-105 transition-transform duration-500"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Sección de Beneficios */}
            <section className="py-20 px-6 max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                        ¿Por qué elegir <span className="text-blue-600">RENTPC</span>?
                    </h2>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Soluciones tecnológicas diseñadas para empresas que buscan flexibilidad y rendimiento
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {/* Beneficio 1 */}
                    <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-2xl transition-all duration-300 border-t-4 border-blue-600 group hover:-translate-y-2">
                        <div className="bg-blue-100 w-16 h-16 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                            <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-3">Ahorro de Costos</h3>
                        <p className="text-gray-600">
                            Elimina inversiones grandes en equipos. Paga solo por lo que necesitas y el tiempo que lo uses.
                        </p>
                    </div>

                    {/* Beneficio 2 */}
                    <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-2xl transition-all duration-300 border-t-4 border-green-600 group hover:-translate-y-2">
                        <div className="bg-green-100 w-16 h-16 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-3">Mantenimiento Incluido</h3>
                        <p className="text-gray-600">
                            Olvídate de reparaciones y actualizaciones. Nosotros nos encargamos del soporte técnico completo.
                        </p>
                    </div>

                    {/* Beneficio 3 */}
                    <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-2xl transition-all duration-300 border-t-4 border-purple-600 group hover:-translate-y-2">
                        <div className="bg-purple-100 w-16 h-16 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                            <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-3">Tecnología Actualizada</h3>
                        <p className="text-gray-600">
                            Accede siempre a equipos de última generación con procesadores Intel Core i5/i7 y i9.
                        </p>
                    </div>

                    {/* Beneficio 4 */}
                    <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-2xl transition-all duration-300 border-t-4 border-orange-600 group hover:-translate-y-2">
                        <div className="bg-orange-100 w-16 h-16 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                            <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-3">Flexibilidad Total</h3>
                        <p className="text-gray-600">
                            Arriendos por días, semanas o meses. Ajusta la cantidad de equipos según tus necesidades.
                        </p>
                    </div>
                </div>
            </section>

            {/* Casos de Uso */}
            <section className="py-20 px-6 bg-gradient-to-br from-blue-900 to-slate-900 text-white">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold mb-4">
                            Ideal para Todo Tipo de Empresas
                        </h2>
                        <p className="text-xl text-blue-200">
                            Soluciones adaptadas a diferentes necesidades corporativas
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 hover:bg-white/20 transition-all">
                            <div className="text-5xl mb-4">🏢</div>
                            <h3 className="text-2xl font-bold mb-3">Startups & PyMEs</h3>
                            <p className="text-blue-100">
                                Equipa a tu equipo sin comprometer capital inicial. Escala rápido según crezca tu empresa.
                            </p>
                        </div>

                        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 hover:bg-white/20 transition-all">
                            <div className="text-5xl mb-4">🎯</div>
                            <h3 className="text-2xl font-bold mb-3">Proyectos Temporales</h3>
                            <p className="text-blue-100">
                                Equipos para eventos, capacitaciones, proyectos específicos o temporadas de alta demanda.
                            </p>
                        </div>

                        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 hover:bg-white/20 transition-all">
                            <div className="text-5xl mb-4">🎓</div>
                            <h3 className="text-2xl font-bold mb-3">Instituciones Educativas</h3>
                            <p className="text-blue-100">
                                Laboratorios completos, aulas digitales y equipamiento para programas de capacitación.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Final */}
            <section className="py-20 px-6 bg-gradient-to-r from-blue-600 to-cyan-500">
                <div className="max-w-4xl mx-auto text-center text-white">
                    <h2 className="text-4xl md:text-5xl font-bold mb-6">
                        ¿Listo para Optimizar tu Infraestructura TI?
                    </h2>
                    <p className="text-xl mb-8 opacity-90">
                        Solicita una cotización personalizada en minutos. Sin compromisos, sin letras chicas.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <a
                            href="/catalogo"
                            className="bg-white text-blue-600 px-10 py-4 rounded-xl font-bold text-lg shadow-2xl hover:scale-105 transition-transform"
                        >
                            Ver Catálogo Completo
                        </a>
                        {!isAuthenticated && (
                            <a
                                href="/register"
                                className="bg-transparent border-2 border-white text-white px-10 py-4 rounded-xl font-bold text-lg hover:bg-white hover:text-blue-600 transition-all"
                            >
                                Registrar Empresa
                            </a>
                        )}
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default Hero;