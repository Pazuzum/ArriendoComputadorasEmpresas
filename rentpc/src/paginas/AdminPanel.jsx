import React, { useEffect, useState } from "react";
import Header from "../componentes/header.jsx";
import { useAuth } from "../context/authContext.jsx";
import { getPendingUsers, activateUser, getAllUsers, deactivateUser } from "../api/auth.js";

const AdminPanel = () => {
  const { user } = useAuth();
  const [pending, setPending] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [allUsers, setAllUsers] = useState([]);
  const [query, setQuery] = useState("");

  const fetchAllUsers = async () => {
    try {
      const res = await getAllUsers();
      setAllUsers(res.data.usuarios || []);
    } catch {
      setMessage("Error al obtener todos los usuarios");
    }
  };

  const handleDeactivate = async (id) => {
    try {
      const res = await deactivateUser(id);
      setMessage(res.data.message || "Usuario desactivado");
      // actualizar la lista
      setAllUsers((prev) => prev.map(u => u._id === id ? {...u, estado: 'Inactivo'} : u));
    } catch {
      setMessage("Error al desactivar usuario");
    }
  }

  const fetchPending = async () => {
    setLoading(true);
    try {
      const res = await getPendingUsers();
      setPending(res.data.usuarios || []);
    } catch {
      setMessage("Error al obtener usuarios pendientes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPending();
    fetchAllUsers();
  }, []);

  const handleActivate = async (id) => {
    try {
      const res = await activateUser(id);
      setMessage(res.data.message || "Usuario activado");
      // actualizar la lista
      setPending((prev) => prev.filter((u) => u._id !== id));
    } catch {
      setMessage("Error al activar usuario");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <main className="max-w-6xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-4">Panel de Administración</h1>
  <p className="text-gray-700 mb-6">Bienvenido, {user?.nombre || user?.username}.</p>

        <section className="bg-white p-4 rounded-lg shadow mb-6">
          <h2 className="text-2xl font-semibold mb-4">Cuentas pendientes de activación</h2>
          {message && <p className="text-center text-green-600 mb-4">{message}</p>}
          {loading ? (
            <p>Cargando...</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-left">
                <thead>
                  <tr>
                    <th className="px-4 py-2">ID</th>
                    <th className="px-4 py-2">Nombre</th>
                    <th className="px-4 py-2">Email</th>
                    <th className="px-4 py-2">Teléfono</th>
                    <th className="px-4 py-2">Empresa</th>
                    <th className="px-4 py-2">RUT</th>
                    <th className="px-4 py-2">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {pending.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-4 py-6 text-center text-gray-600">No hay cuentas pendientes.</td>
                    </tr>
                  )}
                  {pending.map((u) => (
                    <tr key={u._id} className="border-t">
                      <td className="px-4 py-2">{u._id}</td>
                      <td className="px-4 py-2">{u.nombre}</td>
                      <td className="px-4 py-2">{u.email}</td>
                      <td className="px-4 py-2">{u.telefono}</td>
                      <td className="px-4 py-2">{u.nombreEmpresa || '-'}</td>
                      <td className="px-4 py-2">{u.rutEmpresa || '-'}</td>
                      <td className="px-4 py-2">
                        <button onClick={() => handleActivate(u._id)} className="bg-green-600 text-white px-3 py-1 rounded mr-2">Activar</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

          <section className="bg-white p-4 rounded-lg shadow">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold">Todos los usuarios</h2>
              <div className="flex gap-2">
                <input value={query} onChange={e=> setQuery(e.target.value)} placeholder="Buscar por nombre o email" className="px-3 py-1 border rounded" />
                <button onClick={fetchAllUsers} className="bg-blue-600 text-white px-3 py-1 rounded">Recargar</button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full text-left">
                <thead>
                  <tr>
                    <th className="px-4 py-2">ID</th>
                    <th className="px-4 py-2">Nombre</th>
                    <th className="px-4 py-2">Email</th>
                    <th className="px-4 py-2">Teléfono</th>
                    <th className="px-4 py-2">Empresa</th>
                    <th className="px-4 py-2">RUT</th>
                    <th className="px-4 py-2">Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {allUsers.filter(u => {
                    if (!query) return true;
                    return (u.nombre || "").toLowerCase().includes(query.toLowerCase()) || (u.email || "").toLowerCase().includes(query.toLowerCase())
                  }).map(u => (
                    <tr key={u._id} className="border-t">
                      <td className="px-4 py-2">{u._id}</td>
                      <td className="px-4 py-2">{u.nombre}</td>
                      <td className="px-4 py-2">{u.email}</td>
                      <td className="px-4 py-2">{u.telefono}</td>
                      <td className="px-4 py-2">{u.nombreEmpresa || '-'}</td>
                      <td className="px-4 py-2">{u.rutEmpresa || '-'}</td>
                      <td className="px-4 py-2">{u.estado}</td>
                      <td className="px-4 py-2">
                        {u.estado !== 'Inactivo' ? (
                          <button onClick={() => handleDeactivate(u._id)} className="bg-red-600 text-white px-3 py-1 rounded">Desactivar</button>
                        ) : (
                          <span className="text-sm text-gray-600">Desactivado</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
      </main>
    </div>
  );
};

export default AdminPanel;
