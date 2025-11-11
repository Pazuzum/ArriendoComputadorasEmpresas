import React, { useEffect, useState } from 'react';
import Header from '../componentes/Header.jsx';
import { getPendingUsers, getAllUsers, activateUser, deactivateUser } from '../api/auth';
import { getProductos, createProducto, updateProducto, deleteProducto } from '../api/productos';

const AdminPanel = () => {
  const [pending, setPending] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [query, setQuery] = useState('');
  const [activePanel, setActivePanel] = useState(null); // null | 'cuentas' | 'equipos'
  const [cuentasTab, setCuentasTab] = useState('pendientes'); // 'pendientes' | 'todos'
  // Equipos state
  const [productos, setProductos] = useState([]);
  const [prodLoading, setProdLoading] = useState(false);
  const [pForm, setPForm] = useState({ nombre: '', descripcion: '', precio: '', disponibilidad: 0, img: '' });
  const [editingId, setEditingId] = useState(null);

  const fetchPending = async () => {
    try {
      setLoading(true);
      const res = await getPendingUsers();
      setPending(res.data.usuarios || res.data || []);
    } catch {
      setMessage('Error obteniendo cuentas pendientes');
    } finally { setLoading(false); }
  };

  const fetchAll = async () => {
    try {
      setLoading(true);
      const res = await getAllUsers();
      setAllUsers(res.data.usuarios || res.data || []);
    } catch {
      setMessage('Error obteniendo usuarios');
    } finally { setLoading(false); }
  };

  useEffect(() => {
    fetchPending();
    fetchAll();
  }, []);

  useEffect(() => {
    if (activePanel === 'equipos') {
      fetchProductos();
    }
  }, [activePanel]);

  const fetchProductos = async () => {
    try {
      setProdLoading(true);
      const res = await getProductos();
      setProductos(res.data.productos || []);
    } catch {
      setMessage('Error al obtener productos');
    } finally { setProdLoading(false); }
  };

  const handleSubmitProducto = async (e) => {
    e.preventDefault();
    try {
      const payload = { nombre: pForm.nombre, descripcion: pForm.descripcion, precio: Number(pForm.precio), disponibilidad: Number(pForm.disponibilidad), imgs: pForm.img ? [pForm.img] : [] };
      if (editingId) {
        await updateProducto(editingId, payload);
        setMessage('Producto actualizado');
      } else {
        await createProducto(payload);
        setMessage('Producto creado');
      }
      setPForm({ nombre: '', descripcion: '', precio: '', disponibilidad: 0, img: '' });
      setEditingId(null);
      fetchProductos();
    } catch {
      setMessage('Error al guardar producto');
    }
  };
  const handleEditProducto = (p) => {
    setEditingId(p._id);
    setPForm({
      nombre: p.nombre || '',
      descripcion: p.descripcion || '',
      precio: p.precio ?? '',
      disponibilidad: p.disponibilidad ?? 0,
      img: p.imgs && p.imgs.length ? p.imgs[0] : ''
    });
  };

  const handleDeleteProducto = async (id) => {
    if (!window.confirm('¿Eliminar este equipo?')) return;
    try {
      await deleteProducto(id);
      setMessage('Producto eliminado');
      fetchProductos();
    } catch {
      setMessage('Error al eliminar producto');
    }
  };

  const handleActivate = async (id) => {
    try {
      await activateUser(id);
      setMessage('Cuenta activada');
      fetchPending();
      fetchAll();
    } catch {
      setMessage('Error al activar cuenta');
    }
  };

  const handleDeactivate = async (id) => {
    try {
      await deactivateUser(id);
      setMessage('Cuenta desactivada');
      fetchPending();
      fetchAll();
    } catch {
      setMessage('Error al desactivar cuenta');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Header con ícono */}
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center gap-3 sm:gap-4 mb-3">
            <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-2.5 sm:p-3 rounded-xl shadow-lg">
              <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">⚙️ Panel de Administración</h1>
              <p className="text-sm sm:text-base text-gray-600 mt-0.5 sm:mt-1">Gestiona usuarios y equipos del sistema</p>
            </div>
          </div>
          {message && (
            <div className="mt-4 bg-green-50 border-l-4 border-green-500 p-4 rounded-lg shadow-sm">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-sm text-green-700 font-medium">{message}</p>
              </div>
            </div>
          )}
        </div>

        {/* Opciones principales mejoradas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="group bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-start justify-between mb-4">
              <div className="bg-blue-100 p-3 rounded-xl group-hover:bg-blue-600 transition-colors duration-300">
                <svg className="w-7 h-7 text-blue-600 group-hover:text-white transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <span className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                Usuarios
              </span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Gestionar Cuentas</h3>
            <p className="text-sm text-gray-600 mb-4">
              Activa, desactiva y busca cuentas de empresas registradas
            </p>
            <button 
              onClick={() => setActivePanel('cuentas')} 
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white px-5 py-2.5 rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
            >
              Abrir panel
            </button>
          </div>

          <div className="group bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-start justify-between mb-4">
              <div className="bg-green-100 p-3 rounded-xl group-hover:bg-green-600 transition-colors duration-300">
                <svg className="w-7 h-7 text-green-600 group-hover:text-white transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <span className="inline-flex items-center rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
                Inventario
              </span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Gestionar Equipos</h3>
            <p className="text-sm text-gray-600 mb-4">
              Crea, edita y elimina equipos con control de disponibilidad
            </p>
            <button 
              onClick={() => setActivePanel('equipos')} 
              className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white px-5 py-2.5 rounded-xl font-semibold hover:from-green-700 hover:to-green-800 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
            >
              Abrir panel
            </button>
          </div>
        </div>

        {/* Panel Cuentas mejorado */}
        {activePanel === 'cuentas' && (
          <section className="bg-white rounded-2xl shadow-xl border border-gray-100">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-white/20 p-2 rounded-lg">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </div>
                  <h2 className="text-xl font-bold text-white">Gestión de Cuentas</h2>
                </div>
                <button 
                  onClick={() => setActivePanel(null)} 
                  className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all"
                >
                  Cerrar
                </button>
              </div>
            </div>
            <div className="px-6 pt-4 border-b border-gray-200">
              <div className="flex gap-2">
                <button 
                  onClick={() => setCuentasTab('pendientes')} 
                  className={`px-5 py-3 text-sm font-semibold rounded-t-xl transition-all ${cuentasTab==='pendientes' ? 'bg-white text-blue-700 border-t-4 border-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'}`}
                >
                  <span className="flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Pendientes
                  </span>
                </button>
                <button 
                  onClick={() => setCuentasTab('todos')} 
                  className={`px-5 py-3 text-sm font-semibold rounded-t-xl transition-all ${cuentasTab==='todos' ? 'bg-white text-blue-700 border-t-4 border-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'}`}
                >
                  <span className="flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                    </svg>
                    Todos los usuarios
                  </span>
                </button>
              </div>
            </div>
            <div className="p-6">
              {cuentasTab === 'pendientes' ? (
                <div>
                  {loading ? (
                    <div className="flex items-center justify-center py-12">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                      <p className="ml-3 text-gray-600">Cargando...</p>
                    </div>
                  ) : (
                    <>
                      {/* Vista Desktop - Tabla */}
                      <div className="hidden md:block overflow-hidden rounded-xl border border-gray-200 shadow-sm">
                        <div className="max-h-[60vh] overflow-auto">
                          <table className="w-full text-left text-sm">
                            <thead className="bg-gradient-to-r from-gray-50 to-gray-100 sticky top-0 z-10">
                              <tr className="text-gray-700 font-semibold">
                                <th className="px-5 py-4">Nombre</th>
                                <th className="px-5 py-4">Email</th>
                                <th className="px-5 py-4">Empresa</th>
                                <th className="px-5 py-4 text-center">Acciones</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 bg-white">
                              {pending.length === 0 && (
                                <tr>
                                  <td colSpan={4} className="px-5 py-12 text-center">
                                    <div className="flex flex-col items-center gap-3">
                                      <div className="bg-gray-100 p-4 rounded-full">
                                        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                      </div>
                                      <p className="text-gray-600 font-medium">No hay cuentas pendientes</p>
                                    </div>
                                  </td>
                                </tr>
                              )}
                              {pending.map(u => (
                                <tr key={u._id} className="hover:bg-blue-50/50 transition-colors">
                                  <td className="px-5 py-4 font-semibold text-gray-900">{u.nombre}</td>
                                  <td className="px-5 py-4 text-gray-700">{u.email}</td>
                                  <td className="px-5 py-4 text-gray-700">{u.nombreEmpresa || '-'}</td>
                                  <td className="px-5 py-4 text-center">
                                    <button 
                                      onClick={() => handleActivate(u._id)} 
                                      className="bg-gradient-to-r from-green-600 to-green-700 text-white px-4 py-2 rounded-lg text-xs font-semibold hover:from-green-700 hover:to-green-800 transition-all shadow-md hover:shadow-lg"
                                    >
                                      ✓ Activar cuenta
                                    </button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>

                      {/* Vista Móvil - Cards */}
                      <div className="md:hidden space-y-3">
                        {pending.length === 0 ? (
                          <div className="flex flex-col items-center gap-3 py-12">
                            <div className="bg-gray-100 p-4 rounded-full">
                              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            </div>
                            <p className="text-gray-600 font-medium text-center">No hay cuentas pendientes</p>
                          </div>
                        ) : (
                          pending.map(u => (
                            <div key={u._id} className="bg-white border-2 border-blue-100 rounded-xl shadow-md overflow-hidden">
                              <div className="bg-gradient-to-r from-blue-50 to-cyan-50 px-4 py-3 border-b-2 border-blue-100">
                                <h3 className="font-bold text-gray-900 text-sm">{u.nombre}</h3>
                              </div>
                              <div className="p-4 space-y-3">
                                <div className="grid grid-cols-1 gap-2">
                                  <div className="flex items-center gap-2 text-sm">
                                    <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                    <span className="text-gray-700 break-all">{u.email}</span>
                                  </div>
                                  {u.nombreEmpresa && (
                                    <div className="flex items-center gap-2 text-sm">
                                      <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                      </svg>
                                      <span className="text-gray-700">{u.nombreEmpresa}</span>
                                    </div>
                                  )}
                                </div>
                                <button 
                                  onClick={() => handleActivate(u._id)} 
                                  className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white px-4 py-3 rounded-lg font-bold hover:from-green-700 hover:to-green-800 transition-all shadow-lg active:scale-[0.98] flex items-center justify-center gap-2"
                                >
                                  ✓ Activar cuenta
                                </button>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <div>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-5">
                    <div className="relative flex-1 max-w-md">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                      </div>
                      <input 
                        value={query} 
                        onChange={e => setQuery(e.target.value)} 
                        placeholder="Buscar por nombre o email..." 
                        className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition"
                      />
                    </div>
                    <button 
                      onClick={fetchAll} 
                      className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-5 py-3 rounded-xl text-sm font-semibold hover:from-blue-700 hover:to-blue-800 transition-all shadow-md hover:shadow-lg flex items-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      Recargar
                    </button>
                  </div>
                  {/* Vista Desktop - Tabla */}
                  <div className="hidden md:block overflow-hidden rounded-xl border border-gray-200 shadow-sm">
                    <div className="max-h-[65vh] overflow-auto">
                      <table className="w-full text-left text-sm">
                        <thead className="bg-gradient-to-r from-gray-50 to-gray-100 sticky top-0 z-10">
                          <tr className="text-gray-700 font-semibold">
                            <th className="px-5 py-4">Nombre</th>
                            <th className="px-5 py-4">Email</th>
                            <th className="px-5 py-4">Empresa</th>
                            <th className="px-5 py-4 text-center">Estado</th>
                            <th className="px-5 py-4 text-center">Acción</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 bg-white">
                          {allUsers.filter(u => {
                            if (!query) return true;
                            return (u.nombre || '').toLowerCase().includes(query.toLowerCase()) || (u.email || '').toLowerCase().includes(query.toLowerCase());
                          }).map(u => (
                            <tr key={u._id} className="hover:bg-blue-50/50 transition-colors">
                              <td className="px-5 py-4 font-semibold text-gray-900">{u.nombre}</td>
                              <td className="px-5 py-4 text-gray-700">{u.email}</td>
                              <td className="px-5 py-4 text-gray-700">{u.nombreEmpresa || '-'}</td>
                              <td className="px-5 py-4 text-center">
                                <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold ${u.estado==='Activo' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                  {u.estado}
                                </span>
                              </td>
                              <td className="px-5 py-4 text-center">
                                {u.estado !== 'Inactivo' ? (
                                  <button 
                                    onClick={() => handleDeactivate(u._id)} 
                                    className="bg-gradient-to-r from-red-600 to-red-700 text-white px-4 py-2 rounded-lg text-xs font-semibold hover:from-red-700 hover:to-red-800 transition-all shadow-md hover:shadow-lg"
                                  >
                                    ✕ Desactivar
                                  </button>
                                ) : (
                                  <span className="text-xs text-gray-500 font-medium">Desactivado</span>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Vista Móvil - Cards */}
                  <div className="md:hidden space-y-3 max-h-[65vh] overflow-auto">
                    {allUsers.filter(u => {
                      if (!query) return true;
                      return (u.nombre || '').toLowerCase().includes(query.toLowerCase()) || (u.email || '').toLowerCase().includes(query.toLowerCase());
                    }).map(u => (
                      <div key={u._id} className="bg-white border-2 border-gray-200 rounded-xl shadow-md overflow-hidden">
                        <div className="bg-gradient-to-r from-gray-50 to-blue-50 px-4 py-3 border-b-2 border-gray-200 flex items-center justify-between">
                          <h3 className="font-bold text-gray-900 text-sm flex-1">{u.nombre}</h3>
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${u.estado==='Activo' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                            {u.estado}
                          </span>
                        </div>
                        <div className="p-4 space-y-3">
                          <div className="space-y-2">
                            <div className="flex items-start gap-2 text-sm">
                              <svg className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                              </svg>
                              <span className="text-gray-700 break-all">{u.email}</span>
                            </div>
                            {u.nombreEmpresa && u.nombreEmpresa !== '-' && (
                              <div className="flex items-center gap-2 text-sm">
                                <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                </svg>
                                <span className="text-gray-700">{u.nombreEmpresa}</span>
                              </div>
                            )}
                          </div>
                          {u.estado !== 'Inactivo' ? (
                            <button 
                              onClick={() => handleDeactivate(u._id)} 
                              className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white px-4 py-3 rounded-lg font-bold hover:from-red-700 hover:to-red-800 transition-all shadow-lg active:scale-[0.98] flex items-center justify-center gap-2"
                            >
                              ✕ Desactivar cuenta
                            </button>
                          ) : (
                            <div className="w-full bg-gray-100 text-gray-500 px-4 py-3 rounded-lg font-semibold text-center">
                              Cuenta desactivada
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Panel Equipos mejorado */}
        {activePanel === 'equipos' && (
          <section className="bg-white rounded-2xl shadow-xl border border-gray-100">
            <div className="bg-gradient-to-r from-green-600 to-green-700 px-6 py-4 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-white/20 p-2 rounded-lg">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h2 className="text-xl font-bold text-white">Gestión de Equipos</h2>
                </div>
                <button 
                  onClick={() => setActivePanel(null)} 
                  className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all"
                >
                  Cerrar
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Formulario */}
                <div className="lg:col-span-1">
                  <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-xl p-5 border border-green-200">
                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={editingId ? "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" : "M12 4v16m8-8H4"} />
                      </svg>
                      {editingId ? 'Editar Equipo' : 'Nuevo Equipo'}
                    </h3>
                    <form onSubmit={handleSubmitProducto} className="space-y-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Nombre del equipo</label>
                        <input 
                          className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 transition" 
                          placeholder="MacBook Pro M3" 
                          value={pForm.nombre} 
                          onChange={e=> setPForm({...pForm, nombre: e.target.value})} 
                          required 
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Precio diario ($)</label>
                        <input 
                          className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 transition" 
                          placeholder="15000" 
                          value={pForm.precio} 
                          onChange={e=> setPForm({...pForm, precio: e.target.value})} 
                          required 
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Disponibilidad (unidades)</label>
                        <input 
                          className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 transition" 
                          placeholder="10" 
                          value={pForm.disponibilidad} 
                          onChange={e=> setPForm({...pForm, disponibilidad: e.target.value})} 
                          required 
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">URL de imagen</label>
                        <input 
                          className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 transition" 
                          placeholder="https://..." 
                          value={pForm.img} 
                          onChange={e=> setPForm({...pForm, img: e.target.value})} 
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Descripción</label>
                        <textarea 
                          className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 transition" 
                          rows="3" 
                          placeholder="Características del equipo..." 
                          value={pForm.descripcion} 
                          onChange={e=> setPForm({...pForm, descripcion: e.target.value})} 
                        />
                      </div>
                      <div className="flex flex-col gap-2 pt-2">
                        <button 
                          type="submit" 
                          className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white px-5 py-3 rounded-lg font-semibold hover:from-green-700 hover:to-green-800 transition-all shadow-md hover:shadow-lg"
                        >
                          {editingId ? '✓ Actualizar equipo' : '+ Crear equipo'}
                        </button>
                        {editingId && (
                          <button 
                            type="button" 
                            onClick={()=>{ setEditingId(null); setPForm({ nombre:'', descripcion:'', precio:'', disponibilidad:0, img:''}); }} 
                            className="w-full bg-gray-100 text-gray-700 px-5 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-all"
                          >
                            Cancelar
                          </button>
                        )}
                      </div>
                    </form>
                  </div>
                </div>
                
                {/* Tabla */}
                <div className="lg:col-span-2">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                      <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                      </svg>
                      Inventario de Equipos
                    </h3>
                    <button 
                      onClick={fetchProductos} 
                      className="bg-gradient-to-r from-green-600 to-green-700 text-white px-4 py-2.5 rounded-lg text-sm font-semibold hover:from-green-700 hover:to-green-800 transition-all shadow-md hover:shadow-lg flex items-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      Recargar
                    </button>
                  </div>
                  {prodLoading ? (
                    <div className="flex items-center justify-center py-12 bg-white rounded-xl border border-gray-200">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
                      <p className="ml-3 text-gray-600">Cargando...</p>
                    </div>
                  ) : (
                    <>
                      {/* Vista Desktop - Tabla */}
                      <div className="hidden md:block overflow-hidden rounded-xl border border-gray-200 shadow-sm">
                        <div className="max-h-[65vh] overflow-auto">
                          <table className="w-full text-left text-sm">
                            <thead className="bg-gradient-to-r from-gray-50 to-gray-100 sticky top-0 z-10">
                              <tr className="text-gray-700 font-semibold">
                                <th className="px-5 py-4">Nombre</th>
                                <th className="px-5 py-4">Precio/día</th>
                                <th className="px-5 py-4 text-center">Stock</th>
                                <th className="px-5 py-4 text-center">Acciones</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 bg-white">
                              {productos.map(p => (
                                <tr key={p._id} className="hover:bg-green-50/50 transition-colors">
                                  <td className="px-5 py-4 font-semibold text-gray-900">{p.nombre}</td>
                                  <td className="px-5 py-4 text-gray-700 font-medium">${p.precio?.toLocaleString()}</td>
                                  <td className="px-5 py-4 text-center">
                                    <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold ${p.disponibilidad > 5 ? 'bg-green-100 text-green-700' : p.disponibilidad > 0 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
                                      {p.disponibilidad} unidades
                                    </span>
                                  </td>
                                  <td className="px-5 py-4">
                                    <div className="flex items-center justify-center gap-2">
                                      <button 
                                        onClick={() => handleEditProducto(p)} 
                                        className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-3 py-1.5 rounded-lg text-xs font-semibold hover:from-blue-700 hover:to-blue-800 transition-all shadow-sm hover:shadow-md"
                                      >
                                        ✎ Editar
                                      </button>
                                      <button 
                                        onClick={() => handleDeleteProducto(p._id)} 
                                        className="bg-gradient-to-r from-red-600 to-red-700 text-white px-3 py-1.5 rounded-lg text-xs font-semibold hover:from-red-700 hover:to-red-800 transition-all shadow-sm hover:shadow-md"
                                      >
                                        ✕ Eliminar
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                              ))}
                              {productos.length === 0 && (
                                <tr>
                                  <td colSpan={4} className="px-5 py-12 text-center">
                                    <div className="flex flex-col items-center gap-3">
                                      <div className="bg-gray-100 p-4 rounded-full">
                                        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                                        </svg>
                                      </div>
                                      <p className="text-gray-600 font-medium">No hay equipos registrados</p>
                                    </div>
                                  </td>
                                </tr>
                              )}
                            </tbody>
                          </table>
                        </div>
                      </div>

                      {/* Vista Móvil - Cards */}
                      <div className="md:hidden space-y-3 max-h-[65vh] overflow-auto">
                        {productos.length === 0 ? (
                          <div className="flex flex-col items-center gap-3 py-12 bg-white rounded-xl border border-gray-200">
                            <div className="bg-gray-100 p-4 rounded-full">
                              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                              </svg>
                            </div>
                            <p className="text-gray-600 font-medium text-center">No hay equipos registrados</p>
                          </div>
                        ) : (
                          productos.map(p => (
                            <div key={p._id} className="bg-white border-2 border-green-100 rounded-xl shadow-md overflow-hidden">
                              <div className="bg-gradient-to-r from-green-50 to-emerald-50 px-4 py-3 border-b-2 border-green-100">
                                <h3 className="font-bold text-gray-900 text-sm">{p.nombre}</h3>
                              </div>
                              <div className="p-4 space-y-3">
                                <div className="grid grid-cols-2 gap-3">
                                  <div className="bg-green-50 rounded-lg p-3 text-center">
                                    <p className="text-xs text-gray-600 mb-1">Precio/día</p>
                                    <p className="font-bold text-green-600 text-lg">${p.precio?.toLocaleString()}</p>
                                  </div>
                                  <div className="bg-gray-50 rounded-lg p-3 text-center">
                                    <p className="text-xs text-gray-600 mb-1">Stock</p>
                                    <p className={`font-bold text-lg ${p.disponibilidad > 5 ? 'text-green-600' : p.disponibilidad > 0 ? 'text-yellow-600' : 'text-red-600'}`}>
                                      {p.disponibilidad}
                                    </p>
                                  </div>
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                  <button 
                                    onClick={() => handleEditProducto(p)} 
                                    className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-2.5 rounded-lg font-bold hover:from-blue-700 hover:to-blue-800 transition-all shadow-md active:scale-[0.98] flex items-center justify-center gap-1"
                                  >
                                    ✎ Editar
                                  </button>
                                  <button 
                                    onClick={() => handleDeleteProducto(p._id)} 
                                    className="bg-gradient-to-r from-red-600 to-red-700 text-white px-4 py-2.5 rounded-lg font-bold hover:from-red-700 hover:to-red-800 transition-all shadow-md active:scale-[0.98] flex items-center justify-center gap-1"
                                  >
                                    ✕ Eliminar
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  );
};

export default AdminPanel;
