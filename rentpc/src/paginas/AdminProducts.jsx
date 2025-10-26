import React, { useEffect, useState } from 'react';
import Header from '../componentes/header.jsx';
import { getProductos, createProducto, updateProducto, deleteProducto } from '../api/productos';

const AdminProducts = () => {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ nombre: '', descripcion: '', precio: '', disponibilidad: 0, img: '' });
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState('');

  const fetch = async () => {
    setLoading(true);
    try {
      const res = await getProductos();
      setProductos(res.data.productos || []);
    } catch {
      setMessage('Error al obtener productos');
    } finally { setLoading(false); }
  };

  useEffect(() => { fetch(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { nombre: form.nombre, descripcion: form.descripcion, precio: Number(form.precio), disponibilidad: Number(form.disponibilidad), imgs: form.img ? [form.img] : [] };
      if (editingId) {
        await updateProducto(editingId, payload);
        setMessage('Producto actualizado');
      } else {
        await createProducto(payload);
        setMessage('Producto creado');
      }
      setForm({ nombre: '', descripcion: '', precio: '', disponibilidad: 0, img: '' });
      setEditingId(null);
      fetch();
    } catch {
      setMessage('Error al guardar producto');
    }
  };

  const handleEdit = (p) => {
    setEditingId(p._id);
    setForm({ nombre: p.nombre || '', descripcion: p.descripcion || '', precio: p.precio || '', disponibilidad: p.disponibilidad || 0, img: (p.imgs && p.imgs[0]) || '' });
  };

  const handleDelete = async (id) => {
    if (!confirm('Eliminar producto?')) return;
    try {
      await deleteProducto(id);
      setMessage('Producto eliminado');
      fetch();
    } catch {
      setMessage('Error al eliminar');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-6xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">Gestión de Equipos</h1>
        {message && <p className="text-green-600 mb-4">{message}</p>}

        <section className="bg-white p-4 rounded shadow mb-6">
          <h2 className="text-lg font-semibold mb-2">Crear / Editar producto</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <input className="p-2 border" placeholder="Nombre" value={form.nombre} onChange={e=> setForm({...form, nombre: e.target.value})} required />
            <input className="p-2 border" placeholder="Precio" value={form.precio} onChange={e=> setForm({...form, precio: e.target.value})} required />
            <input className="p-2 border" placeholder="Disponibilidad" value={form.disponibilidad} onChange={e=> setForm({...form, disponibilidad: e.target.value})} required />
            <input className="p-2 border md:col-span-2" placeholder="Descripción" value={form.descripcion} onChange={e=> setForm({...form, descripcion: e.target.value})} />
            <input className="p-2 border" placeholder="URL imagen" value={form.img} onChange={e=> setForm({...form, img: e.target.value})} />
            <div className="md:col-span-3 text-right">
              <button className="bg-blue-600 text-white px-4 py-2 rounded" type="submit">{editingId ? 'Actualizar' : 'Crear'}</button>
            </div>
          </form>
        </section>

        <section className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-semibold mb-2">Listado de productos</h2>
          {loading ? <p>Cargando...</p> : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-left">
                <thead>
                  <tr>
                    <th className="px-4 py-2">Nombre</th>
                    <th className="px-4 py-2">Precio</th>
                    <th className="px-4 py-2">Disponibilidad</th>
                    <th className="px-4 py-2">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {productos.map(p => (
                    <tr key={p._id} className="border-t">
                      <td className="px-4 py-2">{p.nombre}</td>
                      <td className="px-4 py-2">${p.precio}</td>
                      <td className="px-4 py-2">{p.disponibilidad}</td>
                      <td className="px-4 py-2">
                        <button onClick={() => handleEdit(p)} className="bg-yellow-500 text-white px-3 py-1 rounded mr-2">Editar</button>
                        <button onClick={() => handleDelete(p._id)} className="bg-red-600 text-white px-3 py-1 rounded">Eliminar</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default AdminProducts;
