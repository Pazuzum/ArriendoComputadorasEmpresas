import React, { useMemo, useState } from 'react';
import Header from '../componentes/header.jsx';
import { useCotizacion } from '../Context/CotizacionContext.jsx';
import axios from '../api/axios.js';
import { generarContratoPDF } from '../utils/contratoPdf.js';
import { useAuth } from '../context/authContext.jsx';
import { useNavigate } from 'react-router-dom';

const CotizacionResumen = () => {
  const { items, clear, updateQty, removeItem } = useCotizacion();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [accepted, setAccepted] = useState(false);
  const [message, setMessage] = useState('');
  const [duracionValor, setDuracionValor] = useState(1);
  const [duracionUnidad, setDuracionUnidad] = useState('dias');
  const [success, setSuccess] = useState(false);
  const [showContrato, setShowContrato] = useState(false);
  const [pdfUrl, setPdfUrl] = useState('');

  const totalCalculado = useMemo(() => items.reduce((acc, it) => acc + ((it.precio||0) * (it.qty||1)), 0), [items]);

  const handleSubmit = () => {
    if (!accepted) {
      setMessage('Debe aceptar los términos y condiciones para enviar la cotización.');
      return;
    }
    // Enviar al backend
    (async ()=>{
      try{
        const payload = {
          contacto: {
            nombre: user?.nombre || user?.nombrePropietario || 'N/A',
            email: user?.email || 'N/A',
            telefono: user?.telefono || user?.telefonoContacto || 'N/A'
          },
          items: items.map(i=> ({ productId: null, nombre: i.nombre, precio: i.precio, cantidad: i.qty })),
          notas: 'Enviado desde la app',
          duracion: { valor: duracionValor, unidad: duracionUnidad },
          total: totalCalculado,
          // payment handled later by admin/flow; no preauthorization from client
        };
  const res = await axios.post('/reservas', payload);
  setMessage('Cotización creada con éxito. Puedes revisar su estado en Mis cotizaciones. ID: ' + res.data.reserva._id + ' — Expira: ' + new Date(res.data.reserva.expiresAt).toLocaleString());
    setSuccess(true);
    setShowContrato(false);
    clear();
      }catch(e){
        console.error(e);
        setMessage('Error al enviar la cotización, Porfavor inicie su sesión.');
      }
    })();
  };

  const handleGenerarContrato = () => {
    try {
      // Arrendador = usuario logueado (empresa del cliente)
      const arrendador = {
        razonSocial: user?.nombreEmpresa || user?.nombre || 'N/A',
        rut: user?.rutEmpresa || 'N/A',
        domicilio: user?.direccion || 'N/A',
        contacto: {
          nombre: user?.nombre || user?.nombrePropietario || 'N/A',
          email: user?.email || 'N/A',
          telefono: user?.telefono || user?.telefonoContacto || 'N/A',
        }
      };
      // Arrendatario = Datos provisionales del desarrollador, solicitados por el usuario
      const arrendatario = {
        razonSocial: 'Desarrollador',
        rut: '21080205-3',
        domicilio: 'Hanga Roa 1249',
        contacto: { nombre: 'Desarrollador', email: 'N/A', telefono: '954476887' }
      };
      const url = generarContratoPDF({ items, total: totalCalculado, duracion: { valor: duracionValor, unidad: duracionUnidad }, arrendador, arrendatario });
      setPdfUrl(url);
      setShowContrato(true);
      setMessage('');
    } catch (e) {
      console.error(e);
      setMessage('No se pudo generar el contrato en PDF.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-5xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-2">Resumen de Cotización</h1>
        {message && (
          <div className={`mb-4 rounded-md px-4 py-3 text-sm ${success ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
            <div className="flex items-center justify-between gap-3">
              <span>{message}</span>
              {success && (
                <button onClick={() => navigate('/mis-cotizaciones')} className="shrink-0 rounded-md bg-blue-600 text-white px-3 py-1.5 text-xs hover:bg-blue-700">Ver estado ahora</button>
              )}
            </div>
          </div>
        )}
        {items.length === 0 ? (
          <div className="bg-white rounded-xl p-8 shadow text-center text-gray-600">No hay equipos en la cotización.</div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white rounded-xl shadow p-6">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-gray-50">
                    <tr className="text-gray-600">
                      <th className="px-4 py-3">Equipo</th>
                      <th className="px-4 py-3">Precio</th>
                      <th className="px-4 py-3">Cantidad</th>
                      <th className="px-4 py-3">Subtotal</th>
                      <th className="px-4 py-3"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {items.map((it) => (
                      <tr key={it.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 font-medium text-gray-900">{it.nombre}</td>
                        <td className="px-4 py-3">${it.precio}</td>
                        <td className="px-4 py-3 w-40">
                          <div className="flex items-center gap-2">
                            <button className="px-2 py-1 border rounded" onClick={()=> updateQty(it.id, (it.qty||1) - 1)}>-</button>
                            <input type="number" className="w-16 text-center border rounded py-1" value={it.qty||1} min={1} onChange={(e)=> updateQty(it.id, Number(e.target.value)||1)} />
                            <button className="px-2 py-1 border rounded" onClick={()=> updateQty(it.id, (it.qty||1) + 1)}>+</button>
                          </div>
                        </td>
                        <td className="px-4 py-3 font-semibold">${(it.precio||0) * (it.qty||1)}</td>
                        <td className="px-4 py-3">
                          <button className="text-red-600" onClick={()=> removeItem(it.id)}>Eliminar</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <aside className="lg:col-span-1 bg-white rounded-xl shadow p-6 h-fit">
              <h2 className="text-lg font-semibold mb-4">Detalles</h2>
              <div className="space-y-3">
                <div className="flex justify-between"><span>Total equipos</span><span className="font-medium">${totalCalculado}</span></div>
                <div>
                  <label className="block text-sm font-medium">Tiempo de arriendo</label>
                  <div className="flex gap-2 items-center mt-2">
                    <input type="number" min={1} value={duracionValor} onChange={(e)=> setDuracionValor(Number(e.target.value) || 1)} className="w-24 px-2 py-1 border rounded" />
                    <select value={duracionUnidad} onChange={(e)=> setDuracionUnidad(e.target.value)} className="px-2 py-1 border rounded">
                      <option value="dias">días</option>
                      <option value="semanas">semanas</option>
                      <option value="meses">meses</option>
                    </select>
                  </div>
                </div>
                <div className="pt-2 border-t mt-2 text-sm text-gray-600">
                  La cotización no incluye envío o instalación. Válida por 7 días.
                </div>
              </div>

              <div className="mt-6 space-y-3">
                <button onClick={handleGenerarContrato} className="w-full bg-gray-800 text-white px-4 py-2 rounded hover:bg-black">Generar y ver contrato (PDF)</button>
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={accepted} onChange={(e)=> setAccepted(e.target.checked)} />
                  <span>Acepto los términos y condiciones</span>
                </label>
                <button onClick={handleSubmit} className="w-full bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50" disabled={!accepted}>Confirmar y enviar</button>
                <button onClick={clear} className="w-full border px-4 py-2 rounded">Vaciar</button>
              </div>
            </aside>
          </div>
        )}
      </main>

      {showContrato && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white w-[95vw] max-w-5xl h-[85vh] rounded-xl shadow-xl overflow-hidden flex flex-col">
            <div className="px-4 py-3 border-b flex items-center justify-between">
              <h3 className="font-semibold">Contrato de arriendo (vista previa PDF)</h3>
              <button className="text-sm text-gray-600 hover:text-gray-900" onClick={()=> setShowContrato(false)}>Cerrar</button>
            </div>
            <div className="flex-1">
              {pdfUrl ? (
                <iframe title="Contrato PDF" src={pdfUrl} className="w-full h-full" />
              ) : (
                <div className="p-6">Generando PDF…</div>
              )}
            </div>
            <div className="px-4 py-3 border-t text-right">
              <a href={pdfUrl} download={`contrato-rentpc.pdf`} className="inline-block bg-gray-200 px-4 py-2 rounded mr-2">Descargar</a>
              <button onClick={()=> setShowContrato(false)} className="inline-block bg-blue-600 text-white px-4 py-2 rounded">Continuar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CotizacionResumen;
