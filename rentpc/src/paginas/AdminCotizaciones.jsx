import { useState, useEffect } from 'react';
import { getAllReservas, cambiarEstadoReserva, cancelarReserva } from '../api/reservas';
import axios from '../api/axios';
import { Link } from 'react-router-dom';
import Header from '../componentes/Header.jsx';
import { ESTADOS_RESERVA } from '../constants/estadosReserva';

export default function AdminCotizaciones() {
  const [reservas, setReservas] = useState([]);
  const [filteredReservas, setFilteredReservas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('todas');
  const [busqueda, setBusqueda] = useState('');
  
  // Estadísticas
  const [stats, setStats] = useState({
    total: 0,
    confirmadas: 0,
    canceladas: 0,
    devueltas: 0,
    ingresoTotal: 0,
    ingresoMes: 0
  });

  useEffect(() => {
    cargarReservas();
  }, []);

  useEffect(() => {
    aplicarFiltros();
    calcularEstadisticas();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reservas, activeTab, busqueda]);

  const cargarReservas = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAllReservas();
      const reservasData = data?.data?.reservas || data?.reservas || data || [];
      setReservas(reservasData);
    } catch (err) {
      console.error('Error al cargar reservas:', err);
      setError('Error al cargar las cotizaciones');
    } finally {
      setLoading(false);
    }
  };

  const aplicarFiltros = () => {
    let filtered = [...reservas];

    // Filtro por tab
    if (activeTab !== 'todas') {
      filtered = filtered.filter(r => {
        if (activeTab === 'confirmadas') return r.estado === ESTADOS_RESERVA.CONFIRMADA;
        if (activeTab === 'canceladas') return r.estado === ESTADOS_RESERVA.CANCELADA;
        if (activeTab === 'devueltas') return r.estado === ESTADOS_RESERVA.DEVUELTA;
        return true;
      });
    }

    // Filtro por búsqueda
    if (busqueda.trim()) {
      const searchLower = busqueda.toLowerCase();
      filtered = filtered.filter(r => {
        const empresa = r.empresaId?.nombreEmpresa?.toLowerCase() || '';
        const nombre = r.empresaId?.nombre?.toLowerCase() || '';
        const email = r.contacto?.email?.toLowerCase() || '';
        const id = r._id?.toLowerCase() || '';
        return empresa.includes(searchLower) || nombre.includes(searchLower) || email.includes(searchLower) || id.includes(searchLower);
      });
    }

    setFilteredReservas(filtered);
  };

  const calcularEstadisticas = () => {
    const now = new Date();
    const inicioMes = new Date(now.getFullYear(), now.getMonth(), 1);
    
    const stats = {
      total: reservas.length,
      confirmadas: reservas.filter(r => r.estado === ESTADOS_RESERVA.CONFIRMADA).length,
      canceladas: reservas.filter(r => r.estado === ESTADOS_RESERVA.CANCELADA).length,
      devueltas: reservas.filter(r => r.estado === ESTADOS_RESERVA.DEVUELTA).length,
      ingresoTotal: reservas
        .filter(r => r.estado === ESTADOS_RESERVA.CONFIRMADA || r.estado === ESTADOS_RESERVA.DEVUELTA)
        .reduce((sum, r) => sum + (r.total || 0), 0),
      ingresoMes: reservas
        .filter(r => {
          const fechaReserva = new Date(r.createdAt);
          return (r.estado === ESTADOS_RESERVA.CONFIRMADA || r.estado === ESTADOS_RESERVA.DEVUELTA) && fechaReserva >= inicioMes;
        })
        .reduce((sum, r) => sum + (r.total || 0), 0)
    };
    
    setStats(stats);
  };

  const handleCambiarEstado = async (reservaId, nuevoEstado) => {
    if (!window.confirm(`¿Cambiar estado de la reserva a ${nuevoEstado}?`)) return;
    
    try {
      await cambiarEstadoReserva(reservaId, nuevoEstado);
      alert('✅ Estado actualizado correctamente');
      cargarReservas();
    } catch (err) {
      console.error('Error al cambiar estado:', err);
      alert('❌ Error al cambiar el estado: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleCancelar = async (reservaId) => {
    if (!window.confirm('¿Está seguro de cancelar esta reserva?')) return;
    
    try {
      await cancelarReserva(reservaId);
      alert('✅ Reserva cancelada correctamente');
      cargarReservas();
    } catch (err) {
      console.error('Error al cancelar:', err);
      alert('❌ Error al cancelar: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleDevolver = async (reservaId) => {
    if (!window.confirm('¿Marcar equipos como devueltos y restaurar stock?')) return;
    
    try {
      await axios.post(`/reservas/${reservaId}/devolver`);
      alert('✅ Equipos devueltos correctamente');
      cargarReservas();
    } catch (err) {
      console.error('Error al devolver:', err);
      alert('❌ Error al devolver equipos: ' + (err.response?.data?.message || err.message));
    }
  };

  const getEstadoBadge = (estado) => {
    const badges = {
      [ESTADOS_RESERVA.CONFIRMADA]: { bg: 'bg-green-100', text: 'text-green-800', label: 'Confirmada', icon: '✓' },
      [ESTADOS_RESERVA.CANCELADA]: { bg: 'bg-red-100', text: 'text-red-800', label: 'Cancelada', icon: '✕' },
      [ESTADOS_RESERVA.DEVUELTA]: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Completada - Stock Restaurado', icon: '✓' }
    };
    
    const badge = badges[estado] || badges[ESTADOS_RESERVA.CONFIRMADA];
    return (
      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold ${badge.bg} ${badge.text}`}>
        <span>{badge.icon}</span>
        {badge.label}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <Header />
        <main className="max-w-7xl mx-auto p-6 py-8">
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="ml-4 text-gray-600 text-lg">Cargando cotizaciones...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <Header />
      <main className="max-w-7xl mx-auto p-6 py-8">
        {/* Encabezado */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl shadow-lg">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <div>
              <h1 className="text-4xl font-extrabold text-gray-900">Gestión de Cotizaciones</h1>
              <p className="text-gray-600 text-lg mt-1">Panel administrativo para gestionar todas las reservas del sistema</p>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg shadow-sm">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-sm text-red-700 font-medium">{error}</p>
              </div>
            </div>
          )}
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-blue-100">
            <div className="flex items-center justify-between mb-3">
              <div className="p-3 bg-blue-100 rounded-xl">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </div>
            <p className="text-sm text-gray-600 font-semibold mb-1">Total Cotizaciones</p>
            <p className="text-3xl font-black text-gray-900">{stats.total}</p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-green-100">
            <div className="flex items-center justify-between mb-3">
              <div className="p-3 bg-green-100 rounded-xl">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <p className="text-sm text-gray-600 font-semibold mb-1">Confirmadas</p>
            <p className="text-3xl font-black text-green-600">{stats.confirmadas}</p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-purple-100">
            <div className="flex items-center justify-between mb-3">
              <div className="p-3 bg-purple-100 rounded-xl">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <p className="text-sm text-gray-600 font-semibold mb-1">Ingresos Totales</p>
            <p className="text-2xl font-black text-purple-600">${stats.ingresoTotal.toLocaleString('es-CL')}</p>
          </div>
        </div>

        {/* Filtros y búsqueda */}
        <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 mb-6">
          <div className="p-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div className="flex-1 max-w-md">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <input 
                    value={busqueda} 
                    onChange={e => setBusqueda(e.target.value)} 
                    placeholder="Buscar por empresa, email o ID..." 
                    className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition"
                  />
                </div>
              </div>
              <button 
                onClick={cargarReservas} 
                className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-xl font-bold hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg hover:shadow-xl active:scale-95 flex items-center gap-2 justify-center"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Recargar
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-t border-gray-200 px-6">
            <div className="flex gap-2 overflow-x-auto">
              {[
                { id: 'todas', label: 'Todas', count: stats.total },
                { id: 'confirmadas', label: 'Confirmadas', count: stats.confirmadas },
                { id: 'devueltas', label: 'Completadas', count: stats.devueltas },
                { id: 'canceladas', label: 'Canceladas', count: stats.canceladas }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-5 py-3 text-sm font-bold rounded-t-xl transition-all whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'bg-white text-blue-700 border-t-4 border-blue-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  {tab.label} ({tab.count})
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Tabla de cotizaciones */}
        <div className="bg-white rounded-2xl shadow-xl border-2 border-gray-100 overflow-hidden">
          {/* Vista Desktop */}
          <div className="hidden lg:block">
            <div className="overflow-x-auto">
              <div className="max-h-[calc(100vh-500px)] overflow-y-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-gradient-to-r from-gray-50 to-gray-100 sticky top-0 z-10">
                    <tr className="text-gray-700 font-bold">
                      <th className="px-5 py-4">ID</th>
                      <th className="px-5 py-4">Empresa / Cliente</th>
                      <th className="px-5 py-4">Contacto</th>
                      <th className="px-5 py-4 text-right">Total</th>
                      <th className="px-5 py-4 text-center">Estado</th>
                      <th className="px-5 py-4">Fecha</th>
                      <th className="px-5 py-4 text-center">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredReservas.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="px-5 py-12 text-center">
                          <div className="flex flex-col items-center gap-3">
                            <div className="bg-gray-100 p-4 rounded-full">
                              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                            </div>
                            <p className="text-gray-600 font-medium">No hay cotizaciones que mostrar</p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      filteredReservas.map(reserva => (
                        <tr key={reserva._id} className="hover:bg-blue-50/50 transition-colors">
                          <td className="px-5 py-4">
                            <code className="text-xs bg-gray-100 px-2 py-1 rounded font-mono">
                              {reserva._id.slice(-8)}
                            </code>
                          </td>
                          <td className="px-5 py-4">
                            <div>
                              <p className="font-bold text-gray-900">{reserva.empresaId?.nombreEmpresa || '-'}</p>
                              <p className="text-xs text-gray-600">{reserva.empresaId?.nombre || '-'}</p>
                            </div>
                          </td>
                          <td className="px-5 py-4">
                            <div>
                              <p className="text-sm text-gray-700">{reserva.contacto?.email || '-'}</p>
                              <p className="text-xs text-gray-500">{reserva.contacto?.telefono || '-'}</p>
                            </div>
                          </td>
                          <td className="px-5 py-4 text-right">
                            <span className="font-bold text-lg text-green-600">
                              ${(reserva.total || 0).toLocaleString('es-CL')}
                            </span>
                          </td>
                          <td className="px-5 py-4 text-center">
                            {getEstadoBadge(reserva.estado)}
                          </td>
                          <td className="px-5 py-4">
                            <div className="text-sm">
                              <p className="text-gray-700">{new Date(reserva.createdAt).toLocaleDateString('es-CL')}</p>
                              <p className="text-xs text-gray-500">{new Date(reserva.createdAt).toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' })}</p>
                            </div>
                          </td>
                          <td className="px-5 py-4">
                            <div className="flex items-center justify-center gap-2">
                              <Link
                                to={`/mis-cotizaciones/${reserva._id}`}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-sm hover:shadow-md"
                                title="Ver detalle"
                              >
                                Ver
                              </Link>
                              
                              {reserva.estado === ESTADOS_RESERVA.CONFIRMADA && (
                                <button
                                  onClick={() => handleDevolver(reserva._id)}
                                  className="bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-sm hover:shadow-md"
                                  title="Marcar equipos como devueltos y restaurar stock"
                                >
                                  Devolver Equipos
                                </button>
                              )}
                              
                              {reserva.estado === ESTADOS_RESERVA.CONFIRMADA && (
                                <button
                                  onClick={() => handleCancelar(reserva._id)}
                                  className="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-sm hover:shadow-md"
                                  title="Cancelar reserva"
                                >
                                  Cancelar
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Vista Móvil - Cards */}
          <div className="lg:hidden p-4 space-y-4 max-h-[calc(100vh-500px)] overflow-y-auto">
            {filteredReservas.length === 0 ? (
              <div className="flex flex-col items-center gap-3 py-12">
                <div className="bg-gray-100 p-4 rounded-full">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <p className="text-gray-600 font-medium text-center">No hay cotizaciones</p>
              </div>
            ) : (
              filteredReservas.map(reserva => (
                <div key={reserva._id} className="bg-gradient-to-br from-white to-gray-50 border-2 border-gray-200 rounded-xl shadow-lg overflow-hidden">
                  <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-3 flex items-center justify-between">
                    <div className="flex-1">
                      <p className="font-bold text-white text-sm">{reserva.empresaId?.nombreEmpresa || 'Sin empresa'}</p>
                      <code className="text-xs text-blue-100 font-mono">ID: {reserva._id.slice(-8)}</code>
                    </div>
                    {getEstadoBadge(reserva.estado)}
                  </div>
                  <div className="p-4 space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-green-50 rounded-lg p-3 text-center border border-green-200">
                        <p className="text-xs text-gray-600 mb-1">Total</p>
                        <p className="font-black text-green-600 text-lg">${(reserva.total || 0).toLocaleString('es-CL')}</p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-3 text-center border border-gray-200">
                        <p className="text-xs text-gray-600 mb-1">Fecha</p>
                        <p className="font-bold text-gray-900 text-sm">{new Date(reserva.createdAt).toLocaleDateString('es-CL')}</p>
                      </div>
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        <span className="text-gray-700">{reserva.contacto?.email || '-'}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-2 pt-2">
                      <Link
                        to={`/mis-cotizaciones/${reserva._id}`}
                        className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-3 rounded-lg font-bold hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg active:scale-95 text-center"
                      >
                        Ver Detalle Completo
                      </Link>
                      
                      {reserva.estado === ESTADOS_RESERVA.CONFIRMADA && (
                        <button
                          onClick={() => handleDevolver(reserva._id)}
                          className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-4 py-3 rounded-lg font-bold hover:from-green-700 hover:to-emerald-700 transition-all shadow-lg active:scale-95"
                        >
                          📦 Marcar como Devueltos
                        </button>
                      )}
                      
                      {reserva.estado === ESTADOS_RESERVA.CONFIRMADA && (
                        <button
                          onClick={() => handleCancelar(reserva._id)}
                          className="bg-gradient-to-r from-red-600 to-rose-600 text-white px-4 py-3 rounded-lg font-bold hover:from-red-700 hover:to-rose-700 transition-all shadow-lg active:scale-95"
                        >
                          ✕ Cancelar Reserva
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
