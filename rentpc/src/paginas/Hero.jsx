const Hero = () => {
    return (
        <section className="relative h-screen flex items-center justify-center">
        {/* Fondo con imagen */}
            <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: "url('https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1600&q=80')" }}
            ></div>

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 to-blue-600/80"></div>

        {/* Contenido */}
        <div className="relative z-10 text-center text-white px-6 max-w-3xl">
            <h2 className="text-4xl md:text-6xl font-extrabold mb-6 drop-shadow-lg">
            Arriendo de Notebooks y PCs a empresas
            </h2>
            <p className="text-lg md:text-2xl mb-8 opacity-90">
            Soluciones rápidas y confiables para tu empresa, estudio o evento
            </p>

            <div className="flex flex-col md:flex-row gap-4 justify-center">
                <a
                    href="/catalogo"
                    className="bg-transparent border-2 border-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition shadow-lg"
                >
                    Ver Catálogo
                </a>
                <a
                    href="/cotizar"
                    className="bg-transparent border-2 border-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition shadow-lg"
                >
                    Solicitar Cotización
                </a>
            </div>

            <p className="mt-10 text-sm md:text-base text-gray-200">
                Entregas en todo Santiago y regiones. ¡Contáctanos hoy mismo!
            </p>
        </div>
        </section>
    );
};

export default Hero;