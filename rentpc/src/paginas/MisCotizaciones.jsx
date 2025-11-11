import { useState, useEffect } from 'react';
import { getMisReservas } from '../api/reservas';
import { Link } from 'react-router-dom';
import Header from '../componentes/Header.jsx';
import { ESTADOS_RESERVA } from '../constants/estadosReserva';

export default function MisCotizaciones() {
  const [reservas, setReservas] = useState([]);
  const [filteredReservas, setFilteredReservas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('todas');
  const [mostrarFiltros, setMostrarFiltros] = useState(false);

  const [filtros, setFiltros] = useState({
    busqueda: '',
    fechaInicio: '',
    fechaFin: '',
    tiposSeleccionados: [],
    marcasSeleccionadas: []
  });

  const [tiposDisponibles, setTiposDisponibles] = useState([]);
  const [marcasDisponibles, setMarcasDisponibles] = useState([]);

  useEffect(() => {
    cargarReservas();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    aplicarFiltros();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reservas, filtros, activeTab]);

  const cargarReservas = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getMisReservas();
      const reservasData = data?.data?.reservas || data?.reservas || data || [];
      setReservas(reservasData);
      
      const tipos = new Set();
      const marcas = new Set();
      
      reservasData.forEach(reserva => {
        reserva.items?.forEach(item => {
          const nombreProducto = item.nombre || item.producto?.nombre || '';
          if (nombreProducto) {
            const nombre = nombreProducto.toUpperCase();
            
            if (nombre.includes('NOTEBOOK')) tipos.add('NOTEBOOK');
            if (nombre.includes('TORRE')) tipos.add('TORRE');
            if (nombre.includes('PC')) tipos.add('PC');
            if (nombre.includes('LAPTOP')) tipos.add('LAPTOP');
            
            const palabras = nombre.split(' ');
            palabras.forEach(palabra => {
              if (['DELL', 'HP', 'ACER', 'LENOVO', 'ASUS', 'APPLE', 'MSI', 'SAMSUNG'].includes(palabra)) {
                marcas.add(palabra);
              }
            });
          }
        });
      });
      
      setTiposDisponibles(Array.from(tipos).sort());
      setMarcasDisponibles(Array.from(marcas).sort());
      
    } catch (err) {
      console.error('Error al cargar reservas:', err);
      setError(err.response?.data?.message || 'Error al cargar cotizaciones');
    } finally {
      setLoading(false);
    }
  };

  const aplicarFiltros = () => {
    let resultado = [...reservas];

    if (activeTab === 'enCurso') {
      resultado = resultado.filter(r => 
        r.estado === ESTADOS_RESERVA.PENDIENTE || 
        r.estado === ESTADOS_RESERVA.CONFIRMADA
      );
    } else if (activeTab === 'historico') {
      resultado = resultado.filter(r => 
        r.estado === ESTADOS_RESERVA.EXPIRADA || 
        r.estado === ESTADOS_RESERVA.CANCELADA
      );
    }

    if (filtros.busqueda) {
      const busqueda = filtros.busqueda.toLowerCase();
      resultado = resultado.filter(r => 
        r._id?.toLowerCase().includes(busqueda) ||
        r.items?.some(item => {
          const nombreProducto = item.nombre || item.producto?.nombre || '';
          return nombreProducto.toLowerCase().includes(busqueda);
        })
      );
    }

    if (filtros.fechaInicio) {
      resultado = resultado.filter(r => 
        new Date(r.createdAt) >= new Date(filtros.fechaInicio)
      );
    }
    if (filtros.fechaFin) {
      const fechaFin = new Date(filtros.fechaFin);
      fechaFin.setHours(23, 59, 59, 999);
      resultado = resultado.filter(r => 
        new Date(r.createdAt) <= fechaFin
      );
    }

    if (filtros.tiposSeleccionados.length > 0) {
      resultado = resultado.filter(r => 
        r.items?.some(item => {
          const nombreProducto = item.nombre || item.producto?.nombre || '';
          const nombre = nombreProducto.toUpperCase();
          return filtros.tiposSeleccionados.some(tipo => nombre.includes(tipo));
        })
      );
    }

    if (filtros.marcasSeleccionadas.length > 0) {
      resultado = resultado.filter(r => 
        r.items?.some(item => {
          const nombreProducto = item.nombre || item.producto?.nombre || '';
          const nombre = nombreProducto.toUpperCase();
          return filtros.marcasSeleccionadas.some(marca => nombre.includes(marca));
        })
      );
    }

    setFilteredReservas(resultado);
  };

  const toggleTipo = (tipo) => {
    setFiltros(prev => ({
      ...prev,
      tiposSeleccionados: prev.tiposSeleccionados.includes(tipo)
        ? prev.tiposSeleccionados.filter(t => t !== tipo)
        : [...prev.tiposSeleccionados, tipo]
    }));
  };

  const toggleMarca = (marca) => {
    setFiltros(prev => ({
      ...prev,
      marcasSeleccionadas: prev.marcasSeleccionadas.includes(marca)
        ? prev.marcasSeleccionadas.filter(m => m !== marca)
        : [...prev.marcasSeleccionadas, marca]
    }));
  };

  const limpiarFiltros = () => {
    setFiltros({
      busqueda: '',
      fechaInicio: '',
      fechaFin: '',
      tiposSeleccionados: [],
      marcasSeleccionadas: []
    });
  };

  const hayFiltrosActivos = () => {
    return filtros.busqueda || filtros.fechaInicio || filtros.fechaFin || 
           filtros.tiposSeleccionados.length > 0 || 
           filtros.marcasSeleccionadas.length > 0;
  };

  const contadorFiltros = () => {
    let count = 0;
    if (filtros.busqueda) count++;
    if (filtros.fechaInicio || filtros.fechaFin) count++;
    count += filtros.tiposSeleccionados.length;
    count += filtros.marcasSeleccionadas.length;
    return count;
  };

  const enCurso = filteredReservas.filter(r => 
    r.estado === ESTADOS_RESERVA.PENDIENTE || r.estado === ESTADOS_RESERVA.CONFIRMADA
  ).length;
  
  const historico = filteredReservas.filter(r => 
    r.estado === ESTADOS_RESERVA.EXPIRADA || r.estado === ESTADOS_RESERVA.CANCELADA
  ).length;

  const getBadgeEstado = (estado) => {
    const badges = {
      [ESTADOS_RESERVA.PENDIENTE]: 'bg-yellow-100 text-yellow-800 border border-yellow-300',
      [ESTADOS_RESERVA.CONFIRMADA]: 'bg-green-100 text-green-800 border border-green-300',
      [ESTADOS_RESERVA.EXPIRADA]: 'bg-gray-100 text-gray-800 border border-gray-300',
      [ESTADOS_RESERVA.CANCELADA]: 'bg-red-100 text-red-800 border border-red-300'
    };
    
    const iconos = {
      [ESTADOS_RESERVA.PENDIENTE]: '⏳',
      [ESTADOS_RESERVA.CONFIRMADA]: '✓',
      [ESTADOS_RESERVA.EXPIRADA]: '⌛',
      [ESTADOS_RESERVA.CANCELADA]: '✕'
    };
    
    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${badges[estado] || 'bg-gray-100 text-gray-800'}`}>
        <span>{iconos[estado]}</span>
        {estado}
      </span>
    );
  };

  if (loading) {
    return (
      <div className='min-h-screen bg-gradient-to-b from-slate-50 to-blue-50'>
        <Header />
        <div className='container mx-auto px-4 py-8'>
          <div className='flex items-center justify-center py-20'>
            <div className='text-center'>
              <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4'></div>
              <p className='text-gray-600'>Cargando cotizaciones...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gradient-to-b from-slate-50 to-blue-50'>
      <Header />
      <div className='container mx-auto px-4 py-8'>
        <div className='mb-8'>
          <div className='inline-block bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-4 py-2 rounded-lg text-sm font-semibold mb-3'>
            <span className='mr-2'>📋</span>
            Historial de Cotizaciones
          </div>
          <h1 className='text-4xl font-bold text-gray-800 mb-2'>Mis Cotizaciones</h1>
          <p className='text-gray-600'>Administra y revisa todas tus solicitudes de arriendo</p>
        </div>

        {error && (
          <div className='mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-lg flex items-start gap-3'>
            <span className='text-red-500 text-xl'>⚠️</span>
            <div>
              <p className='text-red-800 font-medium'>Error</p>
              <p className='text-red-700 text-sm'>{error}</p>
            </div>
          </div>
        )}

        <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-6'>
          <div className='bg-white rounded-xl shadow-md p-6 border-t-4 border-blue-500'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-gray-600 text-sm font-medium'>En Curso</p>
                <p className='text-3xl font-bold text-gray-800'>{enCurso}</p>
              </div>
              <div className='bg-blue-100 p-3 rounded-full'>
                <span className='text-2xl'>📊</span>
              </div>
            </div>
          </div>

          <div className='bg-white rounded-xl shadow-md p-6 border-t-4 border-gray-500'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-gray-600 text-sm font-medium'>Histórico</p>
                <p className='text-3xl font-bold text-gray-800'>{historico}</p>
              </div>
              <div className='bg-gray-100 p-3 rounded-full'>
                <span className='text-2xl'>📁</span>
              </div>
            </div>
          </div>

          <div className='bg-white rounded-xl shadow-md p-6 border-t-4 border-green-500'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-gray-600 text-sm font-medium'>Total</p>
                <p className='text-3xl font-bold text-gray-800'>{filteredReservas.length}</p>
              </div>
              <div className='bg-green-100 p-3 rounded-full'>
                <span className='text-2xl'>📈</span>
              </div>
            </div>
          </div>
        </div>

        <div className='mb-4 flex items-center justify-between'>
          <button
            onClick={() => setMostrarFiltros(!mostrarFiltros)}
            className='flex items-center gap-2 bg-white px-6 py-3 rounded-xl shadow-md hover:shadow-lg transition-all border-2 border-blue-500 text-blue-700 font-semibold'
          >
            <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z' />
            </svg>
            {mostrarFiltros ? 'Ocultar Filtros' : 'Mostrar Filtros'}
            {contadorFiltros() > 0 && (
              <span className='bg-blue-600 text-white px-2.5 py-0.5 rounded-full text-xs font-bold'>
                {contadorFiltros()}
              </span>
            )}
          </button>

          {hayFiltrosActivos() && (
            <button
              onClick={limpiarFiltros}
              className='flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium'
            >
              <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
              </svg>
              Limpiar todos
            </button>
          )}
        </div>

        {mostrarFiltros && (
          <div className='bg-white rounded-2xl shadow-xl p-6 mb-6 border-2 border-blue-200'>
            <div className='space-y-6'>
              <div>
                <label className='block text-sm font-bold text-gray-700 mb-3 flex items-center gap-2'>
                  <svg className='w-5 h-5 text-blue-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z' />
                  </svg>
                  Buscar por ID o nombre de equipo
                </label>
                <input
                  type='text'
                  value={filtros.busqueda}
                  onChange={(e) => setFiltros(prev => ({ ...prev, busqueda: e.target.value }))}
                  placeholder='Ejemplo: DELL, 507f1f77...'
                  className='w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 transition-colors'
                />
              </div>

              <div>
                <label className='block text-sm font-bold text-gray-700 mb-3 flex items-center gap-2'>
                  <svg className='w-5 h-5 text-blue-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' />
                  </svg>
                  Rango de Fechas
                </label>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <div>
                    <label className='block text-xs text-gray-600 mb-2'>Desde</label>
                    <input
                      type='date'
                      value={filtros.fechaInicio}
                      onChange={(e) => setFiltros(prev => ({ ...prev, fechaInicio: e.target.value }))}
                      className='w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500'
                    />
                  </div>
                  <div>
                    <label className='block text-xs text-gray-600 mb-2'>Hasta</label>
                    <input
                      type='date'
                      value={filtros.fechaFin}
                      onChange={(e) => setFiltros(prev => ({ ...prev, fechaFin: e.target.value }))}
                      className='w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500'
                    />
                  </div>
                </div>
              </div>

              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                <div>
                  <label className='block text-sm font-bold text-gray-700 mb-3 flex items-center gap-2'>
                    <svg className='w-5 h-5 text-blue-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' />
                    </svg>
                    Tipo de Equipo
                    {filtros.tiposSeleccionados.length > 0 && (
                      <span className='bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-xs font-bold'>
                        {filtros.tiposSeleccionados.length}
                      </span>
                    )}
                  </label>
                  <div className='space-y-2 bg-gray-50 p-4 rounded-xl border border-gray-200'>
                    {tiposDisponibles.length === 0 ? (
                      <p className='text-sm text-gray-500 italic'>No hay tipos disponibles</p>
                    ) : (
                      tiposDisponibles.map(tipo => (
                        <label key={tipo} className='flex items-center gap-3 p-3 hover:bg-white rounded-lg cursor-pointer transition-colors group'>
                          <input
                            type='checkbox'
                            checked={filtros.tiposSeleccionados.includes(tipo)}
                            onChange={() => toggleTipo(tipo)}
                            className='w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 focus:ring-2 cursor-pointer'
                          />
                          <span className='text-sm font-medium text-gray-700 group-hover:text-blue-700 flex-1'>
                            {tipo}
                          </span>
                          {filtros.tiposSeleccionados.includes(tipo) && (
                            <svg className='w-4 h-4 text-blue-600' fill='currentColor' viewBox='0 0 20 20'>
                              <path fillRule='evenodd' d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z' clipRule='evenodd' />
                            </svg>
                          )}
                        </label>
                      ))
                    )}
                  </div>
                </div>

                <div>
                  <label className='block text-sm font-bold text-gray-700 mb-3 flex items-center gap-2'>
                    <svg className='w-5 h-5 text-blue-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z' />
                    </svg>
                    Marca
                    {filtros.marcasSeleccionadas.length > 0 && (
                      <span className='bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-xs font-bold'>
                        {filtros.marcasSeleccionadas.length}
                      </span>
                    )}
                  </label>
                  <div className='space-y-2 bg-gray-50 p-4 rounded-xl border border-gray-200'>
                    {marcasDisponibles.length === 0 ? (
                      <p className='text-sm text-gray-500 italic'>No hay marcas disponibles</p>
                    ) : (
                      marcasDisponibles.map(marca => (
                        <label key={marca} className='flex items-center gap-3 p-3 hover:bg-white rounded-lg cursor-pointer transition-colors group'>
                          <input
                            type='checkbox'
                            checked={filtros.marcasSeleccionadas.includes(marca)}
                            onChange={() => toggleMarca(marca)}
                            className='w-5 h-5 text-green-600 border-gray-300 rounded focus:ring-green-500 focus:ring-2 cursor-pointer'
                          />
                          <span className='text-sm font-medium text-gray-700 group-hover:text-green-700 flex-1'>
                            {marca}
                          </span>
                          {filtros.marcasSeleccionadas.includes(marca) && (
                            <svg className='w-4 h-4 text-green-600' fill='currentColor' viewBox='0 0 20 20'>
                              <path fillRule='evenodd' d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z' clipRule='evenodd' />
                            </svg>
                          )}
                        </label>
                      ))
                    )}
                  </div>
                </div>
              </div>

              {hayFiltrosActivos() && (
                <div className='p-4 bg-gradient-to-r from-blue-50 to-cyan-50 border-2 border-blue-200 rounded-xl'>
                  <div className='flex items-center gap-3'>
                    <div className='bg-blue-600 p-2 rounded-lg'>
                      <svg className='w-5 h-5 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' />
                      </svg>
                    </div>
                    <div>
                      <p className='text-sm font-bold text-blue-900'>
                        {filteredReservas.length} cotización(es) encontrada(s)
                      </p>
                      <p className='text-xs text-blue-700'>
                        {contadorFiltros()} filtro(s) activo(s)
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        <div className='bg-white rounded-2xl shadow-lg overflow-hidden'>
          <div className='border-b border-gray-200'>
            <div className='flex'>
              <button
                onClick={() => setActiveTab('enCurso')}
                className={`flex-1 px-6 py-4 text-sm font-medium transition-all ${
                  activeTab === 'enCurso'
                    ? 'bg-blue-50 text-blue-700 border-t-4 border-blue-600'
                    : 'text-gray-600 hover:bg-gray-50 border-t-4 border-transparent'
                }`}
              >
                <span className='mr-2'>📊</span>
                En Curso
                <span className='ml-2 px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs'>
                  {enCurso}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('historico')}
                className={`flex-1 px-6 py-4 text-sm font-medium transition-all ${
                  activeTab === 'historico'
                    ? 'bg-gray-50 text-gray-700 border-t-4 border-gray-600'
                    : 'text-gray-600 hover:bg-gray-50 border-t-4 border-transparent'
                }`}
              >
                <span className='mr-2'>📁</span>
                Histórico
                <span className='ml-2 px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs'>
                  {historico}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('todas')}
                className={`flex-1 px-6 py-4 text-sm font-medium transition-all ${
                  activeTab === 'todas'
                    ? 'bg-green-50 text-green-700 border-t-4 border-green-600'
                    : 'text-gray-600 hover:bg-gray-50 border-t-4 border-transparent'
                }`}
              >
                <span className='mr-2'>📈</span>
                Todas
                <span className='ml-2 px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs'>
                  {filteredReservas.length}
                </span>
              </button>

              <button
                onClick={cargarReservas}
                className='px-6 py-4 text-gray-600 hover:bg-gray-50 border-l flex items-center gap-2'
              >
                <span className='text-lg'>🔄</span>
                <span className='text-sm font-medium'>Recargar</span>
              </button>
            </div>
          </div>

          {/* Vista Desktop - Tabla */}
          <div className='hidden lg:block overflow-x-auto'>
            {filteredReservas.length === 0 ? (
              <div className='text-center py-16'>
                <div className='inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4'>
                  <span className='text-3xl'>📋</span>
                </div>
                <h3 className='text-xl font-semibold text-gray-700 mb-2'>
                  {hayFiltrosActivos() ? 'No se encontraron resultados' : 'No hay cotizaciones'}
                </h3>
                <p className='text-gray-500 mb-6'>
                  {hayFiltrosActivos() 
                    ? 'Intenta ajustar los filtros de búsqueda'
                    : activeTab === 'enCurso'
                    ? 'No tienes cotizaciones en curso en este momento'
                    : activeTab === 'historico'
                    ? 'No tienes cotizaciones en el histórico'
                    : 'Aún no has realizado ninguna cotización'}
                </p>
                {!hayFiltrosActivos() && (
                  <Link
                    to='/catalogo'
                    className='inline-block px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:shadow-lg transition-all'
                  >
                    Ver Catálogo
                  </Link>
                )}
              </div>
            ) : (
              <table className='w-full'>
                <thead className='bg-gradient-to-r from-blue-600 to-blue-700 text-white'>
                  <tr>
                    <th className='px-6 py-4 text-left text-sm font-semibold'>Estado</th>
                    <th className='px-6 py-4 text-left text-sm font-semibold'>
                      <span className='mr-2'>📅</span>Fecha
                    </th>
                    <th className='px-6 py-4 text-left text-sm font-semibold'>
                      <span className='mr-2'>⏰</span>Periodo
                    </th>
                    <th className='px-6 py-4 text-left text-sm font-semibold'>Equipos</th>
                    <th className='px-6 py-4 text-right text-sm font-semibold'>Total</th>
                    <th className='px-6 py-4 text-center text-sm font-semibold'>Acciones</th>
                  </tr>
                </thead>
                <tbody className='divide-y divide-gray-200'>
                  {filteredReservas.map((reserva) => (
                    <tr key={reserva._id} className='hover:bg-blue-50/50 transition-colors'>
                      <td className='px-6 py-4'>
                        {getBadgeEstado(reserva.estado)}
                      </td>
                      <td className='px-6 py-4'>
                        <div className='text-sm text-gray-900'>
                          {new Date(reserva.createdAt).toLocaleDateString('es-CL')}
                        </div>
                        <div className='text-xs text-gray-500'>
                          {new Date(reserva.createdAt).toLocaleTimeString('es-CL', { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </div>
                      </td>
                      <td className='px-6 py-4'>
                        <span className='inline-flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium'>
                          <span>📆</span>
                          {typeof reserva.duracion === 'object' 
                            ? `${reserva.duracion.valor} ${reserva.duracion.unidad}` 
                            : `${reserva.duracion} días`}
                        </span>
                      </td>
                      <td className='px-6 py-4'>
                        <span className='inline-flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-800 rounded-full text-sm font-bold'>
                          {reserva.items?.length || 0}
                        </span>
                      </td>
                      <td className='px-6 py-4 text-right'>
                        <span className='text-lg font-bold text-green-600'>
                          ${reserva.total?.toLocaleString('es-CL')}
                        </span>
                      </td>
                      <td className='px-6 py-4 text-center'>
                        <Link
                          to={`/mis-cotizaciones/${reserva._id}`}
                          className='inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:shadow-lg transition-all text-sm font-medium'
                        >
                          Ver detalle
                          <span>→</span>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Vista Móvil y Tablet - Cards */}
          <div className='lg:hidden'>
            {filteredReservas.length === 0 ? (
              <div className='text-center py-16'>
                <div className='inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4'>
                  <span className='text-3xl'>📋</span>
                </div>
                <h3 className='text-xl font-semibold text-gray-700 mb-2'>
                  {hayFiltrosActivos() ? 'No se encontraron resultados' : 'No hay cotizaciones'}
                </h3>
                <p className='text-gray-500 mb-6 px-4'>
                  {hayFiltrosActivos() 
                    ? 'Intenta ajustar los filtros de búsqueda'
                    : activeTab === 'enCurso'
                    ? 'No tienes cotizaciones en curso en este momento'
                    : activeTab === 'historico'
                    ? 'No tienes cotizaciones en el histórico'
                    : 'Aún no has realizado ninguna cotización'}
                </p>
                {!hayFiltrosActivos() && (
                  <Link
                    to='/catalogo'
                    className='inline-block px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:shadow-lg transition-all'
                  >
                    Ver Catálogo
                  </Link>
                )}
              </div>
            ) : (
              <div className='space-y-4'>
                {filteredReservas.map((reserva) => (
                  <div key={reserva._id} className='bg-white border-2 border-gray-200 rounded-xl shadow-md hover:shadow-xl transition-all overflow-hidden'>
                    {/* Header del Card */}
                    <div className='bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-3 flex items-center justify-between'>
                      <div className='flex items-center gap-2'>
                        <span className='text-white text-sm font-bold'>
                          {new Date(reserva.createdAt).toLocaleDateString('es-CL')}
                        </span>
                      </div>
                      {getBadgeEstado(reserva.estado)}
                    </div>

                    {/* Contenido del Card */}
                    <div className='p-4 space-y-3'>
                      {/* Periodo */}
                      <div className='flex items-center justify-between pb-3 border-b border-gray-200'>
                        <span className='text-sm font-semibold text-gray-700 flex items-center gap-2'>
                          <span>⏰</span> Periodo:
                        </span>
                        <span className='inline-flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium'>
                          <span>📆</span>
                          {typeof reserva.duracion === 'object' 
                            ? `${reserva.duracion.valor} ${reserva.duracion.unidad}` 
                            : `${reserva.duracion} días`}
                        </span>
                      </div>

                      {/* Equipos y Total */}
                      <div className='grid grid-cols-2 gap-4'>
                        <div className='text-center p-3 bg-blue-50 rounded-lg'>
                          <div className='text-xs text-gray-600 mb-1'>Equipos</div>
                          <div className='text-2xl font-bold text-blue-700'>{reserva.items?.length || 0}</div>
                        </div>
                        <div className='text-center p-3 bg-green-50 rounded-lg'>
                          <div className='text-xs text-gray-600 mb-1'>Total</div>
                          <div className='text-lg font-bold text-green-600'>
                            ${reserva.total?.toLocaleString('es-CL')}
                          </div>
                        </div>
                      </div>

                      {/* Botón Ver Detalle */}
                      <Link
                        to={`/mis-cotizaciones/${reserva._id}`}
                        className='w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:shadow-lg transition-all text-sm font-bold mt-3'
                      >
                        Ver detalle completo
                        <span>→</span>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}