import React from "react";
import Header from "../componentes/Header.jsx";
import Footer from "../componentes/Footer.jsx";

const Nosotros = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Header />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-900 via-blue-800 to-slate-900 text-white">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-6 py-20 md:py-28">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-blue-600/30 backdrop-blur-sm border border-blue-400/30 rounded-full px-4 py-2 text-sm font-semibold mb-6">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"/>
              </svg>
              Sobre RENTPC
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight mb-6">
              Facilitamos el acceso a
              <span className="block bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
                Tecnología de Calidad
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-blue-100 leading-relaxed mb-8">
              Somos una empresa dedicada al arriendo de equipos computacionales para empresas, 
              ofreciendo soluciones flexibles y accesibles sin comprometer la calidad.
            </p>
          </div>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-6 py-16 space-y-20">
        {/* Misión y Visión */}
        <section className="grid md:grid-cols-2 gap-8">
          <div className="bg-white rounded-2xl shadow-xl p-8 border-t-4 border-blue-600 hover:shadow-2xl transition-shadow duration-300">
            <div className="flex items-center gap-4 mb-6">
              <div className="bg-blue-100 p-4 rounded-xl">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-gray-900">Nuestra Misión</h2>
            </div>
            <p className="text-gray-700 text-lg leading-relaxed">
              Brindar soluciones tecnológicas accesibles mediante el arriendo de computadores, 
              apoyando a las empresas en su transformación digital con servicios de calidad, 
              flexibilidad y soporte continuo.
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8 border-t-4 border-cyan-600 hover:shadow-2xl transition-shadow duration-300">
            <div className="flex items-center gap-4 mb-6">
              <div className="bg-cyan-100 p-4 rounded-xl">
                <svg className="w-8 h-8 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-gray-900">Nuestra Visión</h2>
            </div>
            <p className="text-gray-700 text-lg leading-relaxed">
              Ser líderes en soluciones de arriendo tecnológico en Chile, reconocidos por 
              nuestra innovación, compromiso y excelencia en el servicio al cliente empresarial.
            </p>
          </div>
        </section>

        {/* Nuestros Valores */}
        <section>
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Nuestros Valores
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Principios que guían cada decisión y acción en RENTPC
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Valor 1 */}
            <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 group hover:-translate-y-2">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 w-16 h-16 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Innovación</h3>
              <p className="text-gray-600">
                Buscamos mejorar y actualizar constantemente nuestros servicios para ofrecer 
                las mejores soluciones tecnológicas.
              </p>
            </div>

            {/* Valor 2 */}
            <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 group hover:-translate-y-2">
              <div className="bg-gradient-to-br from-green-500 to-green-600 w-16 h-16 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Compromiso</h3>
              <p className="text-gray-600">
                Acompañamos a nuestros clientes en cada etapa del proceso, garantizando 
                su satisfacción y éxito.
              </p>
            </div>

            {/* Valor 3 */}
            <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 group hover:-translate-y-2">
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 w-16 h-16 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Transparencia</h3>
              <p className="text-gray-600">
                Garantizamos claridad y responsabilidad en cada arriendo, sin costos ocultos 
                ni sorpresas.
              </p>
            </div>

            {/* Valor 4 */}
            <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 group hover:-translate-y-2">
              <div className="bg-gradient-to-br from-teal-500 to-teal-600 w-16 h-16 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Sostenibilidad</h3>
              <p className="text-gray-600">
                Fomentamos el uso eficiente y responsable de recursos tecnológicos, 
                reduciendo el impacto ambiental.
              </p>
            </div>
          </div>
        </section>

        {/* Por qué elegirnos */}
        <section className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          <div className="grid md:grid-cols-2">
            <div className="p-10 md:p-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                ¿Por qué elegir RENTPC?
              </h2>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="bg-blue-100 p-2 rounded-lg flex-shrink-0">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg mb-1">Equipos de Alta Calidad</h3>
                    <p className="text-gray-600">Notebooks y PCs con procesadores Intel Core i5, i7 e i9 de última generación.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-blue-100 p-2 rounded-lg flex-shrink-0">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg mb-1">Flexibilidad Total</h3>
                    <p className="text-gray-600">Arrienda por días, semanas o meses según las necesidades de tu empresa.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-blue-100 p-2 rounded-lg flex-shrink-0">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg mb-1">Soporte Incluido</h3>
                    <p className="text-gray-600">Mantenimiento y soporte técnico completo durante todo el periodo de arriendo.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-blue-100 p-2 rounded-lg flex-shrink-0">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg mb-1">Sin Inversión Inicial</h3>
                    <p className="text-gray-600">Optimiza tu capital de trabajo sin comprometer equipamiento tecnológico.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-600 to-cyan-500 p-10 md:p-12 flex items-center justify-center">
              <div className="text-center text-white">
                <svg className="w-32 h-32 mx-auto mb-6 opacity-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                </svg>
                <h3 className="text-2xl font-bold mb-4">Tecnología al servicio de tu empresa</h3>
                <p className="text-blue-100 text-lg">
                  Confía en RENTPC para equipar tu equipo de trabajo con la mejor tecnología disponible
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Final */}
        <section className="bg-gradient-to-r from-blue-600 via-blue-700 to-cyan-600 rounded-3xl p-12 text-center text-white shadow-2xl">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            ¿Listo para equipar tu empresa?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Solicita una cotización personalizada y descubre cómo podemos ayudarte a optimizar tus recursos tecnológicos
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/catalogo"
              className="bg-white text-blue-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-blue-50 transition-all shadow-lg hover:scale-105 inline-flex items-center justify-center gap-2"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              Ver Catálogo
            </a>
            <a
              href="/register"
              className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-white hover:text-blue-600 transition-all inline-flex items-center justify-center gap-2"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
              Registrar Empresa
            </a>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Nosotros;
