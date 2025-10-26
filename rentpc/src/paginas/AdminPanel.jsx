import React, { useEffect, useState } from 'react';
import Header from '../componentes/header.jsx';
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
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight">Panel de Administración</h1>
          {message && (
            <p className="mt-2 inline-block rounded bg-green-50 px-3 py-1 text-green-700 text-sm">{message}</p>
          )}
        </div>

        {/* Opciones principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-xl font-semibold">Gestionar cuentas</h3>
                <p className="mt-1 text-sm text-gray-600">Activa, desactiva y busca cuentas de empresa.</p>
              </div>
              <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700">Cuentas</span>
            </div>
            <div className="mt-4">
              <button onClick={() => setActivePanel('cuentas')} className="rounded-md bg-blue-600 text-white px-4 py-2 text-sm hover:bg-blue-700">Ver</button>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-xl font-semibold">Gestionar equipos</h3>
                <p className="mt-1 text-sm text-gray-600">Crea, edita y elimina equipos con disponibilidad.</p>
              </div>
              <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700">Equipos</span>
            </div>
            <div className="mt-4">
              <button onClick={() => setActivePanel('equipos')} className="rounded-md bg-blue-600 text-white px-4 py-2 text-sm hover:bg-blue-700">Ver</button>
            </div>
          </div>
        </div>

        {/* Panel Cuentas */}
        {activePanel === 'cuentas' && (
          <section className="bg-white rounded-2xl shadow-sm ring-1 ring-gray-100">
            <div className="border-b border-gray-100 px-4 sm:px-6 pt-4">
              <div className="flex items-center justify-between">
                <div className="flex gap-1">
                  <button onClick={() => setCuentasTab('pendientes')} className={`px-4 py-2 text-sm font-medium rounded-t-md border-b-2 ${cuentasTab==='pendientes' ? 'border-blue-600 text-blue-700' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>Pendientes</button>
                  <button onClick={() => setCuentasTab('todos')} className={`px-4 py-2 text-sm font-medium rounded-t-md border-b-2 ${cuentasTab==='todos' ? 'border-blue-600 text-blue-700' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>Todos</button>
                </div>
                <button onClick={() => setActivePanel(null)} className="rounded-md border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm hover:bg-gray-50">Ocultar</button>
              </div>
            </div>
            <div className="p-4 sm:p-6">
              {cuentasTab === 'pendientes' ? (
                <div>
                  {loading ? <p className="text-gray-500">Cargando...</p> : (
                    <div className="overflow-hidden rounded-xl ring-1 ring-gray-100">
                      <div className="max-h-[60vh] overflow-auto">
                        <table className="w-full text-left text-sm">
                          <thead className="bg-gray-50 sticky top-0 z-10">
                            <tr className="text-gray-600">
                              <th className="px-4 py-3">Nombre</th>
                              <th className="px-4 py-3">Email</th>
                              <th className="px-4 py-3">Empresa</th>
                              <th className="px-4 py-3">Acciones</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100">
                            {pending.length === 0 && (
                              <tr>
                                <td colSpan={4} className="px-4 py-8 text-center text-gray-500">No hay cuentas pendientes.</td>
                              </tr>
                            )}
                            {pending.map(u => (
                              <tr key={u._id} className="hover:bg-gray-50">
                                <td className="px-4 py-3 font-medium text-gray-900">{u.nombre}</td>
                                <td className="px-4 py-3">{u.email}</td>
                                <td className="px-4 py-3">{u.nombreEmpresa || '-'}</td>
                                <td className="px-4 py-3">
                                  <button onClick={() => handleActivate(u._id)} className="rounded-md bg-green-600 text-white px-3 py-1.5 text-xs hover:bg-green-700">Activar</button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                    <h2 className="text-lg font-semibold">Todos los usuarios</h2>
                    <div className="flex gap-2">
                      <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Buscar por nombre o email" className="px-3 py-2 border rounded-md text-sm w-64" />
                      <button onClick={fetchAll} className="rounded-md border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm hover:bg-gray-50">Recargar</button>
                    </div>
                  </div>
                  <div className="overflow-hidden rounded-xl ring-1 ring-gray-100">
                    <div className="max-h-[65vh] overflow-auto">
                      <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 sticky top-0 z-10">
                          <tr className="text-gray-600">
                            <th className="px-4 py-3">Nombre</th>
                            <th className="px-4 py-3">Email</th>
                            <th className="px-4 py-3">Empresa</th>
                            <th className="px-4 py-3">Estado</th>
                            <th className="px-4 py-3">Acción</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {allUsers.filter(u => {
                            if (!query) return true;
                            return (u.nombre || '').toLowerCase().includes(query.toLowerCase()) || (u.email || '').toLowerCase().includes(query.toLowerCase());
                          }).map(u => (
                            <tr key={u._id} className="hover:bg-gray-50">
                              <td className="px-4 py-3 font-medium text-gray-900">{u.nombre}</td>
                              <td className="px-4 py-3">{u.email}</td>
                              <td className="px-4 py-3">{u.nombreEmpresa || '-'}</td>
                              <td className="px-4 py-3">
                                <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${u.estado==='Activo' ? 'bg-green-50 text-green-700' : 'bg-yellow-50 text-yellow-700'}`}>{u.estado}</span>
                              </td>
                              <td className="px-4 py-3">
                                {u.estado !== 'Inactivo' ? (
                                  <button onClick={() => handleDeactivate(u._id)} className="rounded-md bg-red-600 text-white px-3 py-1.5 text-xs hover:bg-red-700">Desactivar</button>
                                ) : (
                                  <span className="text-xs text-gray-500">Desactivado</span>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Panel Equipos */}
        {activePanel === 'equipos' && (
          <section className="mt-6 bg-white rounded-2xl shadow-sm ring-1 ring-gray-100 p-4 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Gestionar equipos</h2>
              <button onClick={() => setActivePanel(null)} className="rounded-md border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm hover:bg-gray-50">Ocultar</button>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1">
                <h3 className="text-base font-semibold mb-3">{editingId ? 'Editar equipo' : 'Crear equipo'}</h3>
                <form onSubmit={handleSubmitProducto} className="space-y-3">
                  <input className="w-full p-2 border rounded-md" placeholder="Nombre" value={pForm.nombre} onChange={e=> setPForm({...pForm, nombre: e.target.value})} required />
                  <input className="w-full p-2 border rounded-md" placeholder="Precio" value={pForm.precio} onChange={e=> setPForm({...pForm, precio: e.target.value})} required />
                  <input className="w-full p-2 border rounded-md" placeholder="Disponibilidad" value={pForm.disponibilidad} onChange={e=> setPForm({...pForm, disponibilidad: e.target.value})} required />
                  <input className="w-full p-2 border rounded-md" placeholder="URL imagen" value={pForm.img} onChange={e=> setPForm({...pForm, img: e.target.value})} />
                  <textarea className="w-full p-2 border rounded-md" rows="3" placeholder="Descripción" value={pForm.descripcion} onChange={e=> setPForm({...pForm, descripcion: e.target.value})} />
                  <div className="flex items-center gap-2">
                    <button type="submit" className="rounded-md bg-blue-600 text-white px-4 py-2 text-sm hover:bg-blue-700">{editingId ? 'Actualizar' : 'Crear'}</button>
                    {editingId && (
                      <button type="button" onClick={()=>{ setEditingId(null); setPForm({ nombre:'', descripcion:'', precio:'', disponibilidad:0, img:''}); }} className="rounded-md border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm hover:bg-gray-50">Cancelar</button>
                    )}
                  </div>
                </form>
              </div>
              <div className="lg:col-span-2">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-base font-semibold">Listado de equipos</h3>
                  <button onClick={fetchProductos} className="rounded-md border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm hover:bg-gray-50">Recargar</button>
                </div>
                <div className="overflow-hidden rounded-xl ring-1 ring-gray-100">
                  {prodLoading ? (
                    <p className="p-4 text-gray-500">Cargando...</p>
                  ) : (
                    <div className="max-h-[65vh] overflow-auto">
                      <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 sticky top-0 z-10">
                          <tr className="text-gray-600">
                            <th className="px-4 py-3">Nombre</th>
                            <th className="px-4 py-3">Precio</th>
                            <th className="px-4 py-3">Disp.</th>
                            <th className="px-4 py-3">Acciones</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {productos.map(p => (
                            <tr key={p._id} className="hover:bg-gray-50">
                              <td className="px-4 py-3 font-medium text-gray-900">{p.nombre}</td>
                              <td className="px-4 py-3">{`$${p.precio}`}</td>
                              <td className="px-4 py-3">{p.disponibilidad}</td>
                              <td className="px-4 py-3">
                                <button onClick={() => handleEditProducto(p)} className="rounded-md bg-yellow-500 text-white px-3 py-1.5 text-xs hover:bg-yellow-600 mr-2">Editar</button>
                                <button onClick={() => handleDeleteProducto(p._id)} className="rounded-md bg-red-600 text-white px-3 py-1.5 text-xs hover:bg-red-700">Eliminar</button>
                              </td>
                            </tr>
                          ))}
                          {productos.length === 0 && (
                            <tr>
                              <td colSpan={4} className="px-4 py-8 text-center text-gray-500">No hay equipos registrados.</td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
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
