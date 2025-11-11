import ProductCard from "../componentes/CardProduc.jsx";
import Header from "../componentes/Header.jsx";

import { useState, useEffect } from "react";
import { getProductos } from "../api/productos.js";

const Catalogo = () => {
    const [productosState, setProductosState] = useState([]);
    const [filteredProductos, setFilteredProductos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [mostrarFiltros, setMostrarFiltros] = useState(false);

    const [filtros, setFiltros] = useState({
        busqueda: '',
        marcasSeleccionadas: [],
        tiposSeleccionados: [],
        categoriasSeleccionadas: [],
        coloresSeleccionados: []
    });

    const [marcasDisponibles, setMarcasDisponibles] = useState([]);
    const [tiposDisponibles, setTiposDisponibles] = useState([]);
    const [categoriasDisponibles, setCategoriasDisponibles] = useState([]);
    const [coloresDisponibles, setColoresDisponibles] = useState([]);

    // Definir colores con sus códigos hex
    const coloresPaleta = [
        { nombre: 'Negro', valor: 'NEGRO', hex: '#000000' },
        { nombre: 'Blanco', valor: 'BLANCO', hex: '#FFFFFF' },
        { nombre: 'Plateado', valor: 'PLATEADO', hex: '#C0C0C0' },
        { nombre: 'Gris', valor: 'GRIS', hex: '#808080' },
        { nombre: 'Azul', valor: 'AZUL', hex: '#0066CC' },
        { nombre: 'Rojo', valor: 'ROJO', hex: '#DC2626' },
        { nombre: 'Verde', valor: 'VERDE', hex: '#16A34A' },
        { nombre: 'Dorado', valor: 'DORADO', hex: '#D4AF37' },
        { nombre: 'Rosa', valor: 'ROSA', hex: '#EC4899' },
        { nombre: 'Morado', valor: 'MORADO', hex: '#9333EA' },
    ];

    const fetchProductos = async () => {
        setLoading(true);
        try {
            const res = await getProductos();
            const list = (res.data.productos || []).map(p => ({ ...p, id: p._id, imgs: p.imgs && p.imgs.length ? p.imgs : ["https://via.placeholder.com/600x400?text=Sin+imagen"] }));
            list.sort((a,b) => (a.nombre || '').localeCompare(b.nombre || ''));
            setProductosState(list);
            
            // Extraer valores únicos para filtros
            const marcas = new Set();
            const tipos = new Set();
            const categorias = new Set();
            const colores = new Set();
            
            list.forEach(producto => {
                const nombre = (producto.nombre || '').toUpperCase();
                const descripcion = (producto.descripcion || '').toUpperCase();
                const textoCompleto = `${nombre} ${descripcion}`;
                
                // Extraer marcas
                const palabras = nombre.split(' ');
                palabras.forEach(palabra => {
                    if (['DELL', 'HP', 'ACER', 'LENOVO', 'ASUS', 'APPLE', 'MSI', 'SAMSUNG'].includes(palabra)) {
                        marcas.add(palabra);
                    }
                });
                
                // Extraer tipos
                if (nombre.includes('NOTEBOOK') || nombre.includes('LAPTOP')) tipos.add('NOTEBOOK');
                if (nombre.includes('TORRE')) tipos.add('TORRE');
                if (nombre.includes('PC') && !nombre.includes('RENTPC')) tipos.add('PC');
                
                // Extraer categorías
                if (nombre.includes('GAMER') || nombre.includes('GAMING')) categorias.add('GAMER');
                if (nombre.includes('EMPRESARIAL') || nombre.includes('OFFICE')) categorias.add('EMPRESARIAL');
                if (nombre.includes('WORKSTATION')) categorias.add('WORKSTATION');
                
                // Extraer colores desde nombre o descripción
                if (textoCompleto.includes('NEGRO') || textoCompleto.includes('BLACK')) colores.add('NEGRO');
                if (textoCompleto.includes('BLANCO') || textoCompleto.includes('WHITE')) colores.add('BLANCO');
                if (textoCompleto.includes('PLATEADO') || textoCompleto.includes('PLATA') || textoCompleto.includes('SILVER')) colores.add('PLATEADO');
                if (textoCompleto.includes('GRIS') || textoCompleto.includes('GRAY') || textoCompleto.includes('GREY')) colores.add('GRIS');
                if (textoCompleto.includes('AZUL') || textoCompleto.includes('BLUE')) colores.add('AZUL');
                if (textoCompleto.includes('ROJO') || textoCompleto.includes('RED')) colores.add('ROJO');
                if (textoCompleto.includes('VERDE') || textoCompleto.includes('GREEN')) colores.add('VERDE');
                if (textoCompleto.includes('DORADO') || textoCompleto.includes('ORO') || textoCompleto.includes('GOLD')) colores.add('DORADO');
                if (textoCompleto.includes('ROSA') || textoCompleto.includes('PINK')) colores.add('ROSA');
                if (textoCompleto.includes('MORADO') || textoCompleto.includes('PURPLE') || textoCompleto.includes('VIOLETA')) colores.add('MORADO');
            });
            
            setMarcasDisponibles(Array.from(marcas).sort());
            setTiposDisponibles(Array.from(tipos).sort());
            setCategoriasDisponibles(Array.from(categorias).sort());
            setColoresDisponibles(Array.from(colores).sort());
            
        } catch (e) {
            console.error('Error fetching productos', e);
        } finally { setLoading(false); }
    };

    useEffect(()=>{ fetchProductos(); }, []);

    useEffect(() => {
        aplicarFiltros();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [productosState, filtros]);

    const aplicarFiltros = () => {
        let resultado = [...productosState];

        // Filtro por búsqueda de texto
        if (filtros.busqueda) {
            const busqueda = filtros.busqueda.toLowerCase();
            resultado = resultado.filter(p => 
                (p.nombre || '').toLowerCase().includes(busqueda) ||
                (p.descripcion || '').toLowerCase().includes(busqueda)
            );
        }

        // Filtro por marcas
        if (filtros.marcasSeleccionadas.length > 0) {
            resultado = resultado.filter(p => {
                const nombre = (p.nombre || '').toUpperCase();
                return filtros.marcasSeleccionadas.some(marca => nombre.includes(marca));
            });
        }

        // Filtro por tipos
        if (filtros.tiposSeleccionados.length > 0) {
            resultado = resultado.filter(p => {
                const nombre = (p.nombre || '').toUpperCase();
                return filtros.tiposSeleccionados.some(tipo => {
                    if (tipo === 'NOTEBOOK') return nombre.includes('NOTEBOOK') || nombre.includes('LAPTOP');
                    return nombre.includes(tipo);
                });
            });
        }

        // Filtro por categorías
        if (filtros.categoriasSeleccionadas.length > 0) {
            resultado = resultado.filter(p => {
                const nombre = (p.nombre || '').toUpperCase();
                return filtros.categoriasSeleccionadas.some(cat => {
                    if (cat === 'GAMER') return nombre.includes('GAMER') || nombre.includes('GAMING');
                    if (cat === 'EMPRESARIAL') return nombre.includes('EMPRESARIAL') || nombre.includes('OFFICE');
                    return nombre.includes(cat);
                });
            });
        }

        // Filtro por colores
        if (filtros.coloresSeleccionados.length > 0) {
            resultado = resultado.filter(p => {
                const nombre = (p.nombre || '').toUpperCase();
                const descripcion = (p.descripcion || '').toUpperCase();
                const textoCompleto = `${nombre} ${descripcion}`;
                
                return filtros.coloresSeleccionados.some(color => {
                    if (color === 'NEGRO') return textoCompleto.includes('NEGRO') || textoCompleto.includes('BLACK');
                    if (color === 'BLANCO') return textoCompleto.includes('BLANCO') || textoCompleto.includes('WHITE');
                    if (color === 'PLATEADO') return textoCompleto.includes('PLATEADO') || textoCompleto.includes('PLATA') || textoCompleto.includes('SILVER');
                    if (color === 'GRIS') return textoCompleto.includes('GRIS') || textoCompleto.includes('GRAY') || textoCompleto.includes('GREY');
                    if (color === 'AZUL') return textoCompleto.includes('AZUL') || textoCompleto.includes('BLUE');
                    if (color === 'ROJO') return textoCompleto.includes('ROJO') || textoCompleto.includes('RED');
                    if (color === 'VERDE') return textoCompleto.includes('VERDE') || textoCompleto.includes('GREEN');
                    if (color === 'DORADO') return textoCompleto.includes('DORADO') || textoCompleto.includes('ORO') || textoCompleto.includes('GOLD');
                    if (color === 'ROSA') return textoCompleto.includes('ROSA') || textoCompleto.includes('PINK');
                    if (color === 'MORADO') return textoCompleto.includes('MORADO') || textoCompleto.includes('PURPLE') || textoCompleto.includes('VIOLETA');
                    return false;
                });
            });
        }

        setFilteredProductos(resultado);
    };

    const toggleMarca = (marca) => {
        setFiltros(prev => ({
            ...prev,
            marcasSeleccionadas: prev.marcasSeleccionadas.includes(marca)
                ? prev.marcasSeleccionadas.filter(m => m !== marca)
                : [...prev.marcasSeleccionadas, marca]
        }));
    };

    const toggleTipo = (tipo) => {
        setFiltros(prev => ({
            ...prev,
            tiposSeleccionados: prev.tiposSeleccionados.includes(tipo)
                ? prev.tiposSeleccionados.filter(t => t !== tipo)
                : [...prev.tiposSeleccionados, tipo]
        }));
    };

    const toggleCategoria = (categoria) => {
        setFiltros(prev => ({
            ...prev,
            categoriasSeleccionadas: prev.categoriasSeleccionadas.includes(categoria)
                ? prev.categoriasSeleccionadas.filter(c => c !== categoria)
                : [...prev.categoriasSeleccionadas, categoria]
        }));
    };

    const toggleColor = (color) => {
        setFiltros(prev => ({
            ...prev,
            coloresSeleccionados: prev.coloresSeleccionados.includes(color)
                ? prev.coloresSeleccionados.filter(c => c !== color)
                : [...prev.coloresSeleccionados, color]
        }));
    };

    const limpiarFiltros = () => {
        setFiltros({
            busqueda: '',
            marcasSeleccionadas: [],
            tiposSeleccionados: [],
            categoriasSeleccionadas: [],
            coloresSeleccionados: []
        });
    };

    const hayFiltrosActivos = () => {
        return filtros.busqueda || 
               filtros.marcasSeleccionadas.length > 0 || 
               filtros.tiposSeleccionados.length > 0 || 
               filtros.categoriasSeleccionadas.length > 0 ||
               filtros.coloresSeleccionados.length > 0;
    };

    const contadorFiltros = () => {
        let count = 0;
        if (filtros.busqueda) count++;
        count += filtros.marcasSeleccionadas.length;
        count += filtros.tiposSeleccionados.length;
        count += filtros.categoriasSeleccionadas.length;
        count += filtros.coloresSeleccionados.length;
        return count;
    };

    const handleReserve = (productId, quantity = 1) => {
        setProductosState((prev) =>
            prev.map((p) => {
                if (p.id !== productId) return p;
                const nuevaDisp = Math.max(0, (p.disponibilidad ?? 0) - quantity);
                return { ...p, disponibilidad: nuevaDisp };
            })
        );
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-50">
            <Header />
            
            {/* Hero Section mejorado */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16 px-6">
                <div className="container mx-auto max-w-7xl">
                    <div className="text-center">
                        <h1 className="text-5xl md:text-6xl font-extrabold mb-4 drop-shadow-lg">
                            Catálogo de Equipos
                        </h1>
                        <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto mb-8">
                            Encuentra el equipo perfecto para tu empresa. Cotiza ahora y recibe tu equipamiento en tiempo récord.
                        </p>
                        <div className="flex items-center justify-center gap-4 text-sm text-blue-100">
                            <div className="flex items-center gap-2">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                <span>Entrega rápida</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                <span>Soporte técnico</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                <span>Equipos garantizados</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Contenedor principal */}
            <div className="container mx-auto max-w-7xl px-6 py-12">
                
                {/* Barra de información */}
                <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-100">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <div className="bg-blue-100 p-3 rounded-lg">
                                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900">
                                    {hayFiltrosActivos() ? `${filteredProductos.length} de ${productosState.length}` : productosState.length} equipos {hayFiltrosActivos() ? 'encontrados' : 'disponibles'}
                                </h3>
                                <p className="text-sm text-gray-600">Selecciona y cotiza al instante</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <button 
                                onClick={fetchProductos}
                                className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition font-medium text-gray-700"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                                Actualizar
                            </button>
                        </div>
                    </div>
                </div>

                {/* Panel de filtros */}
                <div className="mb-6">
                    <div className="flex items-center justify-between mb-4">
                        <button
                            onClick={() => setMostrarFiltros(!mostrarFiltros)}
                            className="flex items-center gap-2 bg-white px-6 py-3 rounded-xl shadow-md hover:shadow-lg transition-all border-2 border-blue-500 text-blue-700 font-semibold"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                            </svg>
                            {mostrarFiltros ? 'Ocultar Filtros' : 'Mostrar Filtros'}
                            {contadorFiltros() > 0 && (
                                <span className="bg-blue-600 text-white px-2.5 py-0.5 rounded-full text-xs font-bold">
                                    {contadorFiltros()}
                                </span>
                            )}
                        </button>

                        {hayFiltrosActivos() && (
                            <button
                                onClick={limpiarFiltros}
                                className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                                Limpiar filtros
                            </button>
                        )}
                    </div>

                    {mostrarFiltros && (
                        <div className="bg-white rounded-2xl shadow-xl p-6 border-2 border-blue-200">
                            <div className="space-y-6">
                                {/* Búsqueda por texto */}
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                                        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                        </svg>
                                        Buscar equipo
                                    </label>
                                    <input
                                        type="text"
                                        value={filtros.busqueda}
                                        onChange={(e) => setFiltros(prev => ({ ...prev, busqueda: e.target.value }))}
                                        placeholder="Ejemplo: DELL i7, NOTEBOOK HP..."
                                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 transition-colors"
                                    />
                                </div>

                                {/* Grid de filtros */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    {/* Filtro por Marca */}
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                                            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                            </svg>
                                            Marca
                                            {filtros.marcasSeleccionadas.length > 0 && (
                                                <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-xs font-bold">
                                                    {filtros.marcasSeleccionadas.length}
                                                </span>
                                            )}
                                        </label>
                                        <div className="space-y-2 bg-gray-50 p-4 rounded-xl border border-gray-200 max-h-64 overflow-y-auto">
                                            {marcasDisponibles.length === 0 ? (
                                                <p className="text-sm text-gray-500 italic">No hay marcas disponibles</p>
                                            ) : (
                                                marcasDisponibles.map(marca => (
                                                    <label key={marca} className="flex items-center gap-3 p-3 hover:bg-white rounded-lg cursor-pointer transition-colors group">
                                                        <input
                                                            type="checkbox"
                                                            checked={filtros.marcasSeleccionadas.includes(marca)}
                                                            onChange={() => toggleMarca(marca)}
                                                            className="w-5 h-5 text-green-600 border-gray-300 rounded focus:ring-green-500 focus:ring-2 cursor-pointer"
                                                        />
                                                        <span className="text-sm font-medium text-gray-700 group-hover:text-green-700 flex-1">
                                                            {marca}
                                                        </span>
                                                        {filtros.marcasSeleccionadas.includes(marca) && (
                                                            <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                            </svg>
                                                        )}
                                                    </label>
                                                ))
                                            )}
                                        </div>
                                    </div>

                                    {/* Filtro por Tipo */}
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                                            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                            </svg>
                                            Tipo de Equipo
                                            {filtros.tiposSeleccionados.length > 0 && (
                                                <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-xs font-bold">
                                                    {filtros.tiposSeleccionados.length}
                                                </span>
                                            )}
                                        </label>
                                        <div className="space-y-2 bg-gray-50 p-4 rounded-xl border border-gray-200 max-h-64 overflow-y-auto">
                                            {tiposDisponibles.length === 0 ? (
                                                <p className="text-sm text-gray-500 italic">No hay tipos disponibles</p>
                                            ) : (
                                                tiposDisponibles.map(tipo => (
                                                    <label key={tipo} className="flex items-center gap-3 p-3 hover:bg-white rounded-lg cursor-pointer transition-colors group">
                                                        <input
                                                            type="checkbox"
                                                            checked={filtros.tiposSeleccionados.includes(tipo)}
                                                            onChange={() => toggleTipo(tipo)}
                                                            className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 focus:ring-2 cursor-pointer"
                                                        />
                                                        <span className="text-sm font-medium text-gray-700 group-hover:text-blue-700 flex-1">
                                                            {tipo}
                                                        </span>
                                                        {filtros.tiposSeleccionados.includes(tipo) && (
                                                            <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                            </svg>
                                                        )}
                                                    </label>
                                                ))
                                            )}
                                        </div>
                                    </div>

                                    {/* Filtro por Categoría */}
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                                            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                                            </svg>
                                            Categoría
                                            {filtros.categoriasSeleccionadas.length > 0 && (
                                                <span className="bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full text-xs font-bold">
                                                    {filtros.categoriasSeleccionadas.length}
                                                </span>
                                            )}
                                        </label>
                                        <div className="space-y-2 bg-gray-50 p-4 rounded-xl border border-gray-200 max-h-64 overflow-y-auto">
                                            {categoriasDisponibles.length === 0 ? (
                                                <p className="text-sm text-gray-500 italic">No hay categorías disponibles</p>
                                            ) : (
                                                categoriasDisponibles.map(categoria => (
                                                    <label key={categoria} className="flex items-center gap-3 p-3 hover:bg-white rounded-lg cursor-pointer transition-colors group">
                                                        <input
                                                            type="checkbox"
                                                            checked={filtros.categoriasSeleccionadas.includes(categoria)}
                                                            onChange={() => toggleCategoria(categoria)}
                                                            className="w-5 h-5 text-purple-600 border-gray-300 rounded focus:ring-purple-500 focus:ring-2 cursor-pointer"
                                                        />
                                                        <span className="text-sm font-medium text-gray-700 group-hover:text-purple-700 flex-1">
                                                            {categoria}
                                                        </span>
                                                        {filtros.categoriasSeleccionadas.includes(categoria) && (
                                                            <svg className="w-4 h-4 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                            </svg>
                                                        )}
                                                    </label>
                                                ))
                                            )}
                                        </div>
                                    </div>

                                    {/* Filtro por Color */}
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                                            <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                                            </svg>
                                            🎨 Color
                                            {filtros.coloresSeleccionados.length > 0 && (
                                                <span className="bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full text-xs font-bold">
                                                    {filtros.coloresSeleccionados.length}
                                                </span>
                                            )}
                                        </label>
                                        <div className="space-y-2 bg-gradient-to-br from-orange-50 to-amber-50 p-4 rounded-xl border border-orange-200 max-h-80 overflow-y-auto">
                                            {coloresDisponibles.length === 0 ? (
                                                <p className="text-sm text-gray-500 italic">No hay colores disponibles</p>
                                            ) : (
                                                coloresDisponibles.map(colorValor => {
                                                    const colorInfo = coloresPaleta.find(c => c.valor === colorValor);
                                                    return (
                                                        <label key={colorValor} className="flex items-center gap-3 p-3 hover:bg-white rounded-lg cursor-pointer transition-all group shadow-sm hover:shadow-md">
                                                            <input
                                                                type="checkbox"
                                                                checked={filtros.coloresSeleccionados.includes(colorValor)}
                                                                onChange={() => toggleColor(colorValor)}
                                                                className="w-5 h-5 text-orange-600 border-gray-300 rounded focus:ring-orange-500 focus:ring-2 cursor-pointer"
                                                            />
                                                            <div 
                                                                className={`w-8 h-8 rounded-full shadow-md flex-shrink-0 ${colorInfo?.valor === 'BLANCO' ? 'border-2 border-gray-300' : ''}`}
                                                                style={{ backgroundColor: colorInfo?.hex || '#CCCCCC' }}
                                                                title={colorInfo?.nombre || colorValor}
                                                            />
                                                            <span className="text-sm font-medium text-gray-700 group-hover:text-orange-700 flex-1">
                                                                {colorInfo?.nombre || colorValor}
                                                            </span>
                                                            {filtros.coloresSeleccionados.includes(colorValor) && (
                                                                <svg className="w-5 h-5 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                                                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                                </svg>
                                                            )}
                                                        </label>
                                                    );
                                                })
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Resumen de filtros activos */}
                                {hayFiltrosActivos() && (
                                    <div className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 border-2 border-blue-200 rounded-xl">
                                        <div className="flex items-center gap-3">
                                            <div className="bg-blue-600 p-2 rounded-lg">
                                                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-blue-900">
                                                    {filteredProductos.length} equipo(s) encontrado(s)
                                                </p>
                                                <p className="text-xs text-blue-700">
                                                    {contadorFiltros()} filtro(s) activo(s)
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <svg className="animate-spin h-12 w-12 text-blue-600 mb-4" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                        </svg>
                        <p className="text-gray-600 font-medium">Cargando productos...</p>
                    </div>
                ) : productosState.length === 0 ? (
                    <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-4">
                            <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">No hay productos disponibles</h3>
                        <p className="text-gray-600">Vuelve pronto para ver nuestro catálogo actualizado</p>
                    </div>
                ) : filteredProductos.length === 0 ? (
                    <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-yellow-100 rounded-full mb-4">
                            <svg className="w-10 h-10 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">No se encontraron equipos</h3>
                        <p className="text-gray-600 mb-4">Intenta ajustar los filtros de búsqueda</p>
                        <button
                            onClick={limpiarFiltros}
                            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                            Limpiar filtros
                        </button>
                    </div>
                ) : (
                    <>
                        {/* Grid de productos */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                            {filteredProductos.map((p) => (
                                <ProductCard key={p.id} producto={p} onReserve={(qty)=> handleReserve(p.id, qty)} />
                            ))}
                        </div>

                        {/* Call to action fijo en la parte inferior */}
                        <div className="sticky bottom-6 z-10">
                            <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl shadow-2xl p-6">
                                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                                    <div className="text-white">
                                        <h3 className="text-xl font-bold mb-1">¿Ya seleccionaste tus equipos?</h3>
                                        <p className="text-blue-100">Revisa tu cotización y procede al pago</p>
                                    </div>
                                    <a 
                                        href="/cotizar" 
                                        className="flex items-center gap-2 bg-white text-blue-600 px-8 py-3.5 rounded-xl font-bold hover:bg-blue-50 transition shadow-lg whitespace-nowrap"
                                    >
                                        Ver mi cotización
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                        </svg>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default Catalogo;
