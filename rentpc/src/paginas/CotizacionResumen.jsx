import React, { useState } from 'react';
import Header from '../componentes/header.jsx';
import { useCotizacion } from '../Context/CotizacionContext.jsx';
import axios from '../api/axios.js';

const CotizacionResumen = () => {
  const { items, total, clear } = useCotizacion();
  const [accepted, setAccepted] = useState(false);
  const [message, setMessage] = useState('');
  const [duracionValor, setDuracionValor] = useState(1);
  const [duracionUnidad, setDuracionUnidad] = useState('dias');
  const [success, setSuccess] = useState(false);

  const handleSubmit = () => {
    if (!accepted) {
      setMessage('Debe aceptar los términos y condiciones para enviar la cotización.');
      return;
    }
    // Enviar al backend
    (async ()=>{
      try{
        const computedTotal = items.reduce((acc, it) => acc + ((it.precio||0) * (it.qty||1)), 0);
        const payload = {
          contacto: { nombre: 'N/A', email: 'N/A', telefono: 'N/A' },
          items: items.map(i=> ({ productId: null, nombre: i.nombre, precio: i.precio, cantidad: i.qty })),
          notas: 'Enviado desde la app',
          duracion: { valor: duracionValor, unidad: duracionUnidad },
          total: computedTotal,
          // payment handled later by admin/flow; no preauthorization from client
        };
  const res = await axios.post('/reservas', payload);
  setMessage('Reserva creada. ID: ' + res.data.reserva._id + ' — Expira: ' + new Date(res.data.reserva.expiresAt).toLocaleString());
        setSuccess(true);
        clear();
      }catch(e){
        console.error(e);
        setMessage('Error al enviar la cotización');
      }
    })();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-4xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">Resumen de Cotización</h1>
        {items.length === 0 ? (
          <p>No hay equipos en la cotización.</p>
        ) : (
          <div className="bg-white p-6 rounded shadow">
            <ul className="space-y-3">
              {items.map((it) => (
                <li key={it.id} className="flex justify-between">
                  <div>
                    <div className="font-semibold">{it.nombre}</div>
                    <div className="text-sm text-gray-600">Cantidad: {it.qty}</div>
                  </div>
                  <div className="text-right">
                    <div>${(it.precio || 0) * it.qty}</div>
                  </div>
                </li>
              ))}
            </ul>
            <div className="mt-4 text-right font-bold">Total: ${total}</div>

            <section className="mt-4">
              <label className="block text-sm font-medium">Tiempo de arriendo</label>
              <div className="flex gap-2 items-center mt-2">
                <input type="number" min={1} value={duracionValor} onChange={(e)=> setDuracionValor(Number(e.target.value) || 1)} className="w-24 px-2 py-1 border rounded" />
                <select value={duracionUnidad} onChange={(e)=> setDuracionUnidad(e.target.value)} className="px-2 py-1 border rounded">
                  <option value="dias">días</option>
                  <option value="semanas">semanas</option>
                  <option value="meses">meses</option>
                </select>
              </div>
            </section>

            <section className="mt-6">
              <h2 className="font-semibold">Términos y condiciones (resumen)</h2>
              <div className="text-sm text-gray-700 mt-2">
                <p>- Plazo de arriendo y condiciones serán definidas en el contrato final.</p>
                <p>- La empresa se compromete a mantener buen trato y cuidado de los equipos.</p>
                <p>- Cualquier daño por mal uso será responsabilidad del arrendatario.</p>
                <p>- La cotización tendrá validez por 7 días.</p>
              </div>
              <label className="flex items-center gap-2 mt-4">
                <input type="checkbox" checked={accepted} onChange={(e)=> setAccepted(e.target.checked)} />
                <span>Acepto los términos y condiciones</span>
              </label>

              {/* La opción de pago inmediato fue removida; las reservas se gestionan desde el backend/admin */}

              {message && <p className={`mt-3 ${success ? 'text-green-600' : 'text-red-600'}`}>{message}</p>}

              <div className="mt-4 flex gap-3">
                <button onClick={handleSubmit} className="bg-blue-600 text-white px-4 py-2 rounded">Enviar cotización</button>
                <button onClick={clear} className="border px-4 py-2 rounded">Vaciar</button>
              </div>
            </section>
          </div>
        )}
      </main>
    </div>
  );
};

export default CotizacionResumen;
