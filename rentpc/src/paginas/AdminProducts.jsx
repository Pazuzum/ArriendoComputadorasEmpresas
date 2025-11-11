import React, { useEffect, useState } from 'react';
import Header from '../componentes/Header.jsx';
import { getProductos, createProducto, updateProducto, deleteProducto } from '../api/productos';

const AdminProducts = () => {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ nombre: '', descripcion: '', precio: '', disponibilidad: 0, img: '', color: '' });
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState('');

  // Colores disponibles
  const coloresDisponibles = [
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
      const payload = { 
        nombre: form.nombre, 
        descripcion: form.descripcion, 
        precio: Number(form.precio), 
        disponibilidad: Number(form.disponibilidad), 
        imgs: form.img ? [form.img] : [],
        color: form.color || ''
      };
      if (editingId) {
        await updateProducto(editingId, payload);
        setMessage('Producto actualizado');
      } else {
        await createProducto(payload);
        setMessage('Producto creado');
      }
      setForm({ nombre: '', descripcion: '', precio: '', disponibilidad: 0, img: '', color: '' });
      setEditingId(null);
      fetch();
    } catch {
      setMessage('Error al guardar producto');
    }
  };

  const handleEdit = (p) => {
    setEditingId(p._id);
    setForm({ 
      nombre: p.nombre || '', 
      descripcion: p.descripcion || '', 
      precio: p.precio || '', 
      disponibilidad: p.disponibilidad || 0, 
      img: (p.imgs && p.imgs[0]) || '',
      color: p.color || ''
    });
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

        <section className="bg-white p-6 rounded-lg shadow-lg mb-6">
          <h2 className="text-xl font-bold mb-4 text-gray-800">
            {editingId ? '✏️ Editar Producto' : '➕ Crear Nuevo Producto'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre *</label>
                <input 
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                  placeholder="Ej: NOTEBOOK DELL CORE I5" 
                  value={form.nombre} 
                  onChange={e=> setForm({...form, nombre: e.target.value})} 
                  required 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Precio por día *</label>
                <input 
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                  placeholder="1800" 
                  type="number"
                  value={form.precio} 
                  onChange={e=> setForm({...form, precio: e.target.value})} 
                  required 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Disponibilidad *</label>
                <input 
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                  placeholder="40" 
                  type="number"
                  value={form.disponibilidad} 
                  onChange={e=> setForm({...form, disponibilidad: e.target.value})} 
                  required 
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                <textarea 
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                  placeholder="Descripción detallada del producto" 
                  rows="3"
                  value={form.descripcion} 
                  onChange={e=> setForm({...form, descripcion: e.target.value})} 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">URL de imagen</label>
                <input 
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                  placeholder="https://ejemplo.com/imagen.jpg" 
                  value={form.img} 
                  onChange={e=> setForm({...form, img: e.target.value})} 
                />
              </div>
            </div>

            {/* ============ SELECTOR DE COLOR ============ */}
            <div className="mt-6 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border-2 border-purple-200">
              <label className="block text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
                🎨 Color del Equipo
                <span className="text-sm font-normal text-gray-600">(Opcional)</span>
              </label>
              <div className="grid grid-cols-5 sm:grid-cols-10 gap-3">
                {coloresDisponibles.map(color => (
                  <button
                    key={color.valor}
                    type="button"
                    onClick={() => setForm({...form, color: color.valor})}
                    className={`relative group flex flex-col items-center gap-1 p-2 rounded-lg border-2 transition-all ${
                      form.color === color.valor 
                        ? 'border-blue-600 bg-blue-50 shadow-lg' 
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                    title={color.nombre}
                  >
                    <div 
                      className={`w-8 h-8 rounded-full shadow-md ${color.valor === 'BLANCO' ? 'border-2 border-gray-300' : ''}`}
                      style={{ backgroundColor: color.hex }}
                    />
                    <span className="text-xs font-medium text-gray-700">{color.nombre}</span>
                    {form.color === color.valor && (
                      <div className="absolute -top-1 -right-1 bg-blue-600 text-white rounded-full w-5 h-5 flex items-center justify-center">
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                  </button>
                ))}
              </div>
              {form.color && (
                <div className="mt-2 flex items-center gap-2">
                  <span className="text-sm text-gray-600">Color seleccionado:</span>
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                    {coloresDisponibles.find(c => c.valor === form.color)?.nombre || form.color}
                  </span>
                  <button
                    type="button"
                    onClick={() => setForm({...form, color: ''})}
                    className="text-red-600 hover:text-red-700 text-sm font-medium"
                  >
                    ✕ Quitar
                  </button>
                </div>
              )}
            </div>

            <div className="flex gap-3 justify-end pt-4 border-t">
              {editingId && (
                <button 
                  type="button"
                  onClick={() => {
                    setEditingId(null);
                    setForm({ nombre: '', descripcion: '', precio: '', disponibilidad: 0, img: '', color: '' });
                  }}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition"
                >
                  Cancelar
                </button>
              )}
              <button 
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold transition shadow-md" 
                type="submit"
              >
                {editingId ? '💾 Actualizar Producto' : '➕ Crear Producto'}
              </button>
            </div>
          </form>
        </section>

        <section className="bg-white p-4 md:p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-bold mb-4 text-gray-800">📦 Listado de Productos</h2>
          {loading ? (
            <div className="text-center py-8">
              <p className="text-gray-500">Cargando productos...</p>
            </div>
          ) : (
            <>
              {/* Vista Desktop - Tabla */}
              <div className="hidden lg:block overflow-x-auto">
                <table className="min-w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-100 border-b-2 border-gray-300">
                    <th className="px-4 py-3 font-semibold text-gray-700">Nombre</th>
                    <th className="px-4 py-3 font-semibold text-gray-700">Precio/día</th>
                    <th className="px-4 py-3 font-semibold text-gray-700">Stock</th>
                    <th className="px-4 py-3 font-semibold text-gray-700">Color</th>
                    <th className="px-4 py-3 font-semibold text-gray-700 text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {productos.map(p => (
                    <tr key={p._id} className="border-b hover:bg-gray-50 transition">
                      <td className="px-4 py-3 font-medium text-gray-800">{p.nombre}</td>
                      <td className="px-4 py-3 text-green-600 font-semibold">${p.precio}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          p.disponibilidad > 20 ? 'bg-green-100 text-green-700' : 
                          p.disponibilidad > 5 ? 'bg-yellow-100 text-yellow-700' : 
                          'bg-red-100 text-red-700'
                        }`}>
                          {p.disponibilidad} unidades
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {p.color ? (
                          <div className="flex items-center gap-2">
                            <div 
                              className={`w-6 h-6 rounded-full shadow-md ${p.color === 'BLANCO' ? 'border-2 border-gray-300' : ''}`}
                              style={{ 
                                backgroundColor: coloresDisponibles.find(c => c.valor === p.color)?.hex || '#CCCCCC' 
                              }}
                              title={coloresDisponibles.find(c => c.valor === p.color)?.nombre || p.color}
                            />
                            <span className="text-sm text-gray-700">
                              {coloresDisponibles.find(c => c.valor === p.color)?.nombre || p.color}
                            </span>
                          </div>
                        ) : (
                          <span className="text-gray-400 text-sm italic">Sin especificar</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <button 
                          onClick={() => handleEdit(p)} 
                          className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-1.5 rounded-lg mr-2 font-medium transition shadow-sm"
                        >
                          ✏️ Editar
                        </button>
                        <button 
                          onClick={() => handleDelete(p._id)} 
                          className="bg-red-600 hover:bg-red-700 text-white px-4 py-1.5 rounded-lg font-medium transition shadow-sm"
                        >
                          🗑️ Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Vista Móvil - Cards */}
            <div className="lg:hidden space-y-4">
              {productos.map(p => (
                <div key={p._id} className="bg-white border-2 border-gray-200 rounded-xl shadow-md overflow-hidden">
                  {/* Header */}
                  <div className="bg-gradient-to-r from-blue-50 to-cyan-50 px-4 py-3 border-b">
                    <h3 className="font-bold text-gray-900 text-sm line-clamp-2">{p.nombre}</h3>
                  </div>

                  {/* Contenido */}
                  <div className="p-4 space-y-3">
                    {/* Precio y Stock */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="text-center p-3 bg-green-50 rounded-lg">
                        <div className="text-xs text-gray-600 mb-1">Precio/día</div>
                        <div className="text-xl font-bold text-green-600">${p.precio}</div>
                      </div>
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <div className="text-xs text-gray-600 mb-1">Stock</div>
                        <div className={`text-xl font-bold ${
                          p.disponibilidad > 20 ? 'text-green-600' : 
                          p.disponibilidad > 5 ? 'text-yellow-600' : 
                          'text-red-600'
                        }`}>
                          {p.disponibilidad}
                        </div>
                      </div>
                    </div>

                    {/* Color */}
                    {p.color && (
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm font-semibold text-gray-700">Color:</span>
                        <div className="flex items-center gap-2">
                          <div 
                            className={`w-6 h-6 rounded-full shadow-md ${p.color === 'BLANCO' ? 'border-2 border-gray-300' : ''}`}
                            style={{ 
                              backgroundColor: coloresDisponibles.find(c => c.valor === p.color)?.hex || '#CCCCCC' 
                            }}
                          />
                          <span className="text-sm font-medium text-gray-700">
                            {coloresDisponibles.find(c => c.valor === p.color)?.nombre || p.color}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Botones de acción */}
                    <div className="grid grid-cols-2 gap-2 pt-2">
                      <button 
                        onClick={() => handleEdit(p)} 
                        className="flex items-center justify-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2.5 rounded-lg font-medium transition shadow-sm"
                      >
                        ✏️ Editar
                      </button>
                      <button 
                        onClick={() => handleDelete(p._id)} 
                        className="flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2.5 rounded-lg font-medium transition shadow-sm"
                      >
                        🗑️ Eliminar
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
          )}
        </section>
      </main>
    </div>
  );
};

export default AdminProducts;
