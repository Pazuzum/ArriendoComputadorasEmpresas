import React, { useEffect, useMemo, useState } from 'react';
import Header from '../componentes/header.jsx';
import { getMisReservas } from '../api/reservas.js';

const Badge = ({ estado }) => {
  const map = {
    PENDIENTE: 'bg-yellow-50 text-yellow-700',
    RESERVADA: 'bg-blue-50 text-blue-700',
    CONFIRMADA: 'bg-green-50 text-green-700',
    CANCELADA: 'bg-red-50 text-red-700',
    EXPIRADA: 'bg-gray-100 text-gray-700',
  };
  return <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${map[estado] || 'bg-gray-100 text-gray-700'}`}>{estado}</span>;
};

const formatDate = (v) => v ? new Date(v).toLocaleString() : '-';

const MisCotizaciones = () => {
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [tab, setTab] = useState('enCurso'); // enCurso | historico | todas

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await getMisReservas();
      setReservas(res.data.reservas || []);
    } catch (e) {
      console.error(e);
      setError('No se pudieron cargar tus cotizaciones.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const { enCurso, historico } = useMemo(() => {
    const now = Date.now();
    const enCurso = reservas.filter(r => ['PENDIENTE','RESERVADA'].includes(r.estado) && new Date(r.expiresAt).getTime() > now);
    const historico = reservas.filter(r => !enCurso.includes(r));
    return { enCurso, historico };
  }, [reservas]);

  const list = tab === 'enCurso' ? enCurso : tab === 'historico' ? historico : reservas;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-6xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Mis cotizaciones</h1>
          <button onClick={fetchData} className="rounded-md border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm hover:bg-gray-50">Recargar</button>
        </div>

        <div className="border-b border-gray-200 mb-4">
          <nav className="-mb-px flex gap-4">
            <button onClick={()=> setTab('enCurso')} className={`px-3 py-2 text-sm font-medium border-b-2 ${tab==='enCurso' ? 'border-blue-600 text-blue-700' : 'border-transparent text-gray-600 hover:text-gray-800'}`}>En curso</button>
            <button onClick={()=> setTab('historico')} className={`px-3 py-2 text-sm font-medium border-b-2 ${tab==='historico' ? 'border-blue-600 text-blue-700' : 'border-transparent text-gray-600 hover:text-gray-800'}`}>Histórico</button>
            <button onClick={()=> setTab('todas')} className={`px-3 py-2 text-sm font-medium border-b-2 ${tab==='todas' ? 'border-blue-600 text-blue-700' : 'border-transparent text-gray-600 hover:text-gray-800'}`}>Todas</button>
          </nav>
        </div>

        {loading ? (
          <p className="text-gray-600">Cargando…</p>
        ) : error ? (
          <p className="text-red-600">{error}</p>
        ) : (
          <div className="overflow-hidden rounded-xl ring-1 ring-gray-100 bg-white">
            <div className="max-h-[70vh] overflow-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 sticky top-0 z-10">
                  <tr className="text-gray-600">
                    <th className="px-4 py-3">Estado</th>
                    <th className="px-4 py-3">Creada</th>
                    <th className="px-4 py-3">Expira</th>
                    <th className="px-4 py-3">Periodo</th>
                    <th className="px-4 py-3">Items</th>
                    <th className="px-4 py-3">Total</th>
                    <th className="px-4 py-3"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {list.length === 0 && (
                    <tr>
                      <td colSpan={7} className="px-4 py-8 text-center text-gray-500">No hay cotizaciones para mostrar.</td>
                    </tr>
                  )}
                  {list.map((r) => (
                    <tr key={r._id} className="hover:bg-gray-50">
                      <td className="px-4 py-3"><Badge estado={r.estado} /></td>
                      <td className="px-4 py-3">{formatDate(r.createdAt)}</td>
                      <td className="px-4 py-3">{formatDate(r.expiresAt)}</td>
                      <td className="px-4 py-3">{r.duracion ? `${r.duracion.valor} ${r.duracion.unidad}` : '-'}</td>
                      <td className="px-4 py-3">{Array.isArray(r.items) ? r.items.reduce((a,b)=> a + (b.cantidad||0), 0) : 0}</td>
                      <td className="px-4 py-3 font-semibold">${r.total || 0}</td>
                      <td className="px-4 py-3 text-right">
                        <a className="text-blue-600 hover:underline" href={`/mis-cotizaciones/${r._id}`}>Ver detalle</a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default MisCotizaciones;
