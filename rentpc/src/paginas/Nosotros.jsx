import React from "react";
import Header from "../componentes/header.jsx";

const Nosotros = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-gray-100">
      <Header />

      {/* Hero */}
      <header className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-12 flex flex-col md:flex-row items-center gap-8">
          <div className="flex-1">
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight">Potenciamos su empresa con tecnología a su alcance</h1>
            <p className="mt-4 text-gray-700 text-lg">Arriendo de computadores y soluciones tecnológicas diseñadas para empresas que necesitan flexibilidad, soporte y rendimiento sin grandes inversiones iniciales.</p>
            {/* CTA buttons removed as requested */}
          </div>
          <div className="flex-1">
            <div className="bg-gradient-to-br from-blue-50 to-white rounded-xl p-6 shadow-lg">
              <img src="/public/hero-laptop.png" alt="Computador" className="w-full h-56 object-contain" onError={(e)=> e.currentTarget.style.display='none'} />
              {/* Estadísticas eliminadas según solicitud */}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-12">
        {/* Cards Misión / Visión */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <article className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-semibold mb-3">Misión</h2>
            <p className="text-gray-700">Brindar soluciones tecnológicas accesibles mediante el arriendo de computadores, apoyando a las empresas en su transformación digital con servicios de calidad, flexibilidad y soporte continuo.</p>
          </article>
          <article className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-semibold mb-3">Visión</h2>
            <p className="text-gray-700">Ser líderes en soluciones de arriendo tecnológico en Chile, reconocidos por nuestra innovación, compromiso y excelencia en el servicio al cliente.</p>
          </article>
        </section>

        {/* Valores */}
        <section className="bg-white rounded-lg shadow p-6 mb-8">
          <h3 className="text-2xl font-semibold mb-4">Nuestros valores</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start gap-3">
              <div className="bg-blue-600 text-white rounded-full w-10 h-10 flex items-center justify-center">I</div>
              <div>
                <h4 className="font-semibold">Innovación</h4>
                <p className="text-gray-600">Buscamos mejorar y actualizar constantemente nuestros servicios.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="bg-blue-600 text-white rounded-full w-10 h-10 flex items-center justify-center">C</div>
              <div>
                <h4 className="font-semibold">Compromiso</h4>
                <p className="text-gray-600">Acompañamos a nuestros clientes en cada etapa del proceso.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="bg-blue-600 text-white rounded-full w-10 h-10 flex items-center justify-center">T</div>
              <div>
                <h4 className="font-semibold">Transparencia</h4>
                <p className="text-gray-600">Garantizamos claridad y responsabilidad en cada arriendo.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="bg-blue-600 text-white rounded-full w-10 h-10 flex items-center justify-center">S</div>
              <div>
                <h4 className="font-semibold">Sostenibilidad</h4>
                <p className="text-gray-600">Fomentamos el uso eficiente y responsable de recursos tecnológicos.</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA final */}
        <section className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-2xl font-bold">¿Listo para equipar su empresa?</h3>
            <p className="mt-2 text-blue-100">Contacte a nuestro equipo y reciba una cotización personalizada en menos de 24 horas.</p>
          </div>
          {/* CTA buttons removed as requested */}
        </section>
      </main>
    </div>
  );
};

export default Nosotros;
