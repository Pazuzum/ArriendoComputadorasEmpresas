import React, { useMemo, useState } from 'react';
import Header from '../componentes/Header.jsx';
import FirmaCanvas from '../componentes/FirmaCanvas.jsx';
import { useCotizacion } from '../Context/CotizacionContext.jsx';
import axios from '../api/axios.js';
import { generarContratoPDF } from '../utils/contratoPdf.js';
import { useAuth } from '../Context/authContext.jsx';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../componentes/Toast.jsx';

const CotizacionResumen = () => {
  const { items, clear, updateQty, removeItem } = useCotizacion();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { showToast, ToastContainer } = useToast();
  const [accepted, setAccepted] = useState(false);
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [success, setSuccess] = useState(false);
  const [showContrato, setShowContrato] = useState(false);
  const [showFirma, setShowFirma] = useState(false);
  const [firmaCliente, setFirmaCliente] = useState(null);
  const [pdfUrl, setPdfUrl] = useState('');

  const totalCalculado = useMemo(() => items.reduce((acc, it) => acc + ((it.precio||0) * (it.qty||1)), 0), [items]);

  // Calcular días entre fechas
  const diasTotales = useMemo(() => {
    if (!fechaInicio || !fechaFin) return 1;
    const inicio = new Date(fechaInicio);
    const fin = new Date(fechaFin);
    const diferencia = Math.ceil((fin - inicio) / (1000 * 60 * 60 * 24));
    return diferencia > 0 ? diferencia : 1;
  }, [fechaInicio, fechaFin]);

  // Total final = total de equipos * días
  const totalFinal = useMemo(() => totalCalculado * diasTotales, [totalCalculado, diasTotales]);

  // Obtener fecha mínima (hoy)
  const getFechaMinima = () => {
    const hoy = new Date();
    return hoy.toISOString().split('T')[0];
  };

  // Validar que fecha fin sea después de fecha inicio
  const handleFechaInicioChange = (e) => {
    const nuevaFecha = e.target.value;
    setFechaInicio(nuevaFecha);
    // Si la fecha fin es anterior a la nueva fecha inicio, limpiarla
    if (fechaFin && nuevaFecha > fechaFin) {
      setFechaFin('');
    }
  };

  const handleSubmit = () => {
    if (!accepted) {
      showToast('Debe aceptar los términos y condiciones para enviar la cotización.', 'warning');
      return;
    }
    if (!fechaInicio || !fechaFin) {
      showToast('Debe seleccionar las fechas de inicio y fin del arriendo.', 'warning');
      return;
    }
    // Mostrar modal de firma en lugar de enviar directamente
    setShowFirma(true);
  };

  const handleConfirmarConFirma = async () => {
    if (!firmaCliente) {
      showToast('Debe firmar el contrato antes de continuar.', 'warning');
      return;
    }

    try {
      const payload = {
        contacto: {
          nombre: user?.nombre || user?.nombrePropietario || 'N/A',
          email: user?.email || 'N/A',
          telefono: user?.telefono || user?.telefonoContacto || 'N/A'
        },
        items: items.map(i=> ({ productId: i.id, nombre: i.nombre, precio: i.precio, cantidad: i.qty })),
        notas: `Arriendo desde ${fechaInicio} hasta ${fechaFin}`,
        duracion: { valor: diasTotales, unidad: 'dias' },
        total: totalFinal,
        firmaCliente: firmaCliente, // Guardar la firma
      };
      
      const res = await axios.post('/reservas', payload);
      
      showToast('✓ Cotización creada exitosamente. Redirigiendo al pago...', 'success');
      
      // Redirigir a página de pago
      setTimeout(() => {
        navigate('/pago', { 
          state: { 
            reservaId: res.data.reserva._id, 
            total: totalFinal,
            fechaInicio,
            fechaFin
          } 
        });
        clear();
      }, 1500);
    } catch(e) {
      console.error(e);
      const errorMsg = e.response?.data?.message || 'Error al enviar la cotización. Por favor, inicie sesión e intente nuevamente.';
      showToast(errorMsg, 'error');
      setShowFirma(false);
    }
  };

  const handleGenerarContrato = () => {
    try {
      // Arrendatario = usuario logueado (empresa cliente que arrienda los equipos)
      const arrendatario = {
        razonSocial: user?.nombreEmpresa || user?.nombre || 'N/A',
        rut: user?.rutEmpresa || 'N/A',
        domicilio: user?.direccion || 'N/A',
        contacto: {
          nombre: user?.nombrePropietario || user?.nombre || 'N/A',
          email: user?.email || 'N/A',
          telefono: user?.telefonoContacto || user?.telefono || 'N/A',
        }
      };
      // Arrendador = RENTPC (empresa que presta los equipos)
      const arrendador = {
        razonSocial: 'RENTPC - Arriendo de Equipos Computacionales',
        rut: '21.080.205-3',
        domicilio: 'Hanga Roa 1249, Valparaíso, Chile',
        contacto: { 
          nombre: 'Departamento de Ventas', 
          email: 'contacto@rentpc.cl', 
          telefono: '+56 9 5447 6887' 
        }
      };
      const url = generarContratoPDF({ items, total: totalFinal, duracion: { valor: diasTotales, unidad: 'dias' }, arrendador, arrendatario });
      setPdfUrl(url);
      setShowContrato(true);
      showToast('✓ Contrato generado exitosamente', 'success');
    } catch (e) {
      console.error(e);
      showToast('No se pudo generar el contrato en PDF. Por favor, intente nuevamente.', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <ToastContainer />
      <Header />
      <main className="max-w-7xl mx-auto p-6 py-8">
        {/* Encabezado mejorado */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-3 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl shadow-lg">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <h1 className="text-4xl font-extrabold text-gray-900">Resumen de Cotización</h1>
              <p className="text-gray-600 text-lg mt-1">Revisa los detalles y procede con el pago seguro</p>
            </div>
          </div>
        </div>

        {items.length === 0 ? (
          <div className="bg-white rounded-3xl p-16 shadow-2xl text-center border-2 border-gray-100">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl mb-6 shadow-lg">
              <svg className="w-14 h-14 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">No hay equipos seleccionados</h3>
            <p className="text-gray-600 text-lg mb-8 max-w-md mx-auto">Comienza agregando equipos desde nuestro catálogo para crear tu cotización</p>
            <button 
              onClick={() => navigate('/catalogo')} 
              className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-4 rounded-xl font-bold text-lg hover:from-blue-700 hover:to-blue-800 transition shadow-xl hover:shadow-2xl active:scale-95"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
              Explorar catálogo
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Tabla de productos */}
            <div className="lg:col-span-2 bg-white rounded-2xl shadow-2xl overflow-hidden border-2 border-gray-100">
              <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 px-6 py-5">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">Equipos Seleccionados</h2>
                    <p className="text-blue-100 text-sm">{items.length} producto{items.length !== 1 ? 's' : ''} en tu cotización</p>
                  </div>
                </div>
              </div>
              <div className="p-4 sm:p-6">
                {/* Vista Desktop - Tabla */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 border-b-2 border-gray-200">
                      <tr className="text-gray-700 font-semibold">
                        <th className="px-4 py-3">Equipo</th>
                        <th className="px-4 py-3">Precio/día</th>
                        <th className="px-4 py-3">Cantidad</th>
                        <th className="px-4 py-3">Subtotal</th>
                        <th className="px-4 py-3"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {items.map((it) => (
                        <tr key={it.id} className="hover:bg-blue-50 transition">
                          <td className="px-4 py-4 font-medium text-gray-900">{it.nombre}</td>
                          <td className="px-4 py-4 text-gray-700">${it.precio}</td>
                          <td className="px-4 py-4 w-40">
                            <div className="flex items-center gap-2">
                              <button className="px-3 py-1.5 border-2 border-gray-200 rounded-lg hover:bg-gray-100 transition font-semibold" onClick={()=> updateQty(it.id, (it.qty||1) - 1)}>−</button>
                              <input type="number" className="w-16 text-center border-2 border-gray-200 rounded-lg py-1.5 font-semibold focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none" value={it.qty||1} min={1} onChange={(e)=> updateQty(it.id, Number(e.target.value)||1)} />
                              <button className="px-3 py-1.5 border-2 border-gray-200 rounded-lg hover:bg-gray-100 transition font-semibold" onClick={()=> updateQty(it.id, (it.qty||1) + 1)}>+</button>
                            </div>
                          </td>
                          <td className="px-4 py-4 font-bold text-blue-600">${(it.precio||0) * (it.qty||1)}</td>
                          <td className="px-4 py-4">
                            <button className="text-red-600 hover:text-red-700 font-medium hover:underline transition" onClick={()=> removeItem(it.id)}>Eliminar</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Vista Móvil - Cards */}
                <div className="md:hidden space-y-3">
                  {items.map((it) => (
                    <div key={it.id} className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-4 border-2 border-blue-100">
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="font-bold text-gray-900 text-sm flex-1 pr-2">{it.nombre}</h3>
                        <button 
                          className="text-red-600 hover:text-red-700 font-medium text-sm flex items-center gap-1 flex-shrink-0" 
                          onClick={()=> removeItem(it.id)}
                        >
                          🗑️ <span className="hidden xs:inline">Eliminar</span>
                        </button>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3 mb-3">
                        <div className="bg-white rounded-lg p-2 text-center">
                          <p className="text-xs text-gray-600 mb-1">Precio/día</p>
                          <p className="font-bold text-green-600">${it.precio}</p>
                        </div>
                        <div className="bg-white rounded-lg p-2 text-center">
                          <p className="text-xs text-gray-600 mb-1">Subtotal</p>
                          <p className="font-bold text-blue-600">${(it.precio||0) * (it.qty||1)}</p>
                        </div>
                      </div>

                      <div className="bg-white rounded-lg p-3">
                        <p className="text-xs text-gray-600 mb-2 text-center">Cantidad</p>
                        <div className="flex items-center justify-center gap-3">
                          <button 
                            className="w-10 h-10 border-2 border-gray-200 rounded-lg hover:bg-gray-100 active:bg-gray-200 transition font-bold text-lg flex items-center justify-center" 
                            onClick={()=> updateQty(it.id, (it.qty||1) - 1)}
                          >
                            −
                          </button>
                          <input 
                            type="number" 
                            className="w-16 h-10 text-center border-2 border-gray-200 rounded-lg font-bold text-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none" 
                            value={it.qty||1} 
                            min={1} 
                            onChange={(e)=> updateQty(it.id, Number(e.target.value)||1)} 
                          />
                          <button 
                            className="w-10 h-10 border-2 border-gray-200 rounded-lg hover:bg-gray-100 active:bg-gray-200 transition font-bold text-lg flex items-center justify-center" 
                            onClick={()=> updateQty(it.id, (it.qty||1) + 1)}
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Panel lateral de detalles */}
            <aside className="lg:col-span-1 space-y-6">
              {/* Card de resumen */}
              <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border-2 border-gray-100">
                <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 px-6 py-5">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <h2 className="text-xl font-bold text-white">Resumen</h2>
                  </div>
                </div>
                <div className="p-6 space-y-5">
                  <div className="flex justify-between items-center pb-5 border-b-2 border-gray-200">
                    <div>
                      <span className="text-gray-600 font-semibold text-sm block mb-1">Subtotal equipos</span>
                      <span className="text-xs text-gray-500">Precio base por día</span>
                    </div>
                    <div className="text-right">
                      <span className="text-2xl font-extrabold text-gray-900">${totalCalculado.toLocaleString('es-CL')}</span>
                      <span className="text-xs text-gray-500 block mt-1">/día</span>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
                      <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      Periodo de arriendo
                    </label>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Fecha de inicio</label>
                        <input 
                          type="date" 
                          value={fechaInicio} 
                          onChange={handleFechaInicioChange}
                          min={getFechaMinima()}
                          className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-lg font-medium focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Fecha de fin</label>
                        <input 
                          type="date" 
                          value={fechaFin} 
                          onChange={(e) => setFechaFin(e.target.value)}
                          min={fechaInicio || getFechaMinima()}
                          disabled={!fechaInicio}
                          className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-lg font-medium focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
                          required
                        />
                      </div>
                    </div>
                    {fechaInicio && fechaFin && (
                      <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border-2 border-blue-200 shadow-inner">
                        <div className="flex items-center gap-3 text-blue-900">
                          <div className="p-2 bg-blue-200 rounded-lg">
                            <svg className="w-5 h-5 text-blue-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                          <div>
                            <p className="text-sm font-bold">
                              {diasTotales} día{diasTotales !== 1 ? 's' : ''} de arriendo
                            </p>
                            <p className="text-xs text-blue-700">
                              {new Date(fechaInicio).toLocaleDateString('es-CL')} - {new Date(fechaFin).toLocaleDateString('es-CL')}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="pt-5 border-t-2 border-gray-300 bg-gradient-to-br from-blue-600 to-indigo-700 -mx-6 px-6 py-6 rounded-b-2xl shadow-lg">
                    <div className="flex justify-between items-center mb-2">
                      <div>
                        <p className="text-sm text-blue-100 font-semibold mb-1">Total a pagar</p>
                        <p className="text-xs text-blue-200">${totalCalculado.toLocaleString('es-CL')} × {diasTotales} día{diasTotales !== 1 ? 's' : ''}</p>
                      </div>
                      <div className="text-right">
                        <div className="bg-white/20 backdrop-blur-sm rounded-xl px-4 py-2">
                          <span className="text-4xl font-black text-white drop-shadow-lg">${totalFinal.toLocaleString('es-CL')}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>
              </div>

              {/* Card de acciones */}
              <div className="bg-white rounded-2xl shadow-2xl p-6 space-y-4 border-2 border-gray-100">
                <button 
                  onClick={handleGenerarContrato} 
                  className="w-full bg-gradient-to-r from-gray-800 via-gray-900 to-black text-white px-6 py-4 rounded-xl font-bold text-base hover:from-gray-900 hover:via-black hover:to-gray-900 transition-all shadow-xl hover:shadow-2xl active:scale-95 flex items-center justify-center gap-3 group"
                >
                  <div className="p-2 bg-white/10 rounded-lg group-hover:bg-white/20 transition">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <span>Ver Contrato PDF</span>
                </button>
                
                <label className="flex items-center gap-3 p-5 border-2 border-gray-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 cursor-pointer transition-all group bg-gradient-to-r from-gray-50 to-gray-100">
                  <input 
                    type="checkbox" 
                    checked={accepted} 
                    onChange={(e)=> setAccepted(e.target.checked)} 
                    className="w-6 h-6 text-blue-600 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 cursor-pointer" 
                  />
                  <span className="text-sm font-bold text-gray-800 group-hover:text-blue-800 transition">Acepto los términos y condiciones del contrato</span>
                </label>
                
                <button 
                  onClick={handleSubmit} 
                  className="w-full bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 text-white px-6 py-4 rounded-xl font-black text-base hover:from-blue-700 hover:via-blue-800 hover:to-indigo-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-xl hover:shadow-2xl active:scale-95 flex items-center justify-center gap-3 group" 
                  disabled={!accepted}
                >
                  <div className="p-2 bg-white/20 rounded-lg group-hover:bg-white/30 transition">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                  </div>
                  <span>Firmar y Proceder al Pago</span>
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </button>
                
                <button 
                  onClick={clear} 
                  className="w-full border-2 border-gray-300 px-6 py-3.5 rounded-xl font-bold hover:bg-red-50 hover:border-red-300 hover:text-red-700 transition-all text-gray-700 active:scale-95"
                >
                  Vaciar cotización
                </button>
              </div>
            </aside>
          </div>
        )}
      </main>

      {showContrato && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4">
          <div className="bg-white w-full sm:w-[95vw] max-w-5xl h-[90vh] sm:h-[85vh] rounded-xl sm:rounded-2xl shadow-2xl overflow-hidden flex flex-col">
            <div className="px-4 sm:px-6 py-3 sm:py-4 border-b bg-gradient-to-r from-blue-600 to-blue-700 flex items-center justify-between">
              <h3 className="font-bold text-white text-sm sm:text-base md:text-lg">📄 Contrato de arriendo (vista previa PDF)</h3>
              <button className="text-white hover:text-gray-200 transition p-1.5 sm:p-2 hover:bg-white/10 rounded-lg" onClick={()=> setShowContrato(false)}>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="flex-1 bg-gray-100">
              {pdfUrl ? (
                <iframe title="Contrato PDF" src={pdfUrl} className="w-full h-full" />
              ) : (
                <div className="p-6 flex items-center justify-center h-full">
                  <div className="text-center">
                    <svg className="animate-spin h-12 w-12 text-blue-600 mx-auto mb-4" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                    </svg>
                    <p className="text-gray-600 font-medium">Generando PDF…</p>
                  </div>
                </div>
              )}
            </div>
            <div className="px-4 sm:px-6 py-3 sm:py-4 border-t bg-gray-50 flex flex-col sm:flex-row justify-end gap-2 sm:gap-3">
              <a href={pdfUrl} download={`contrato-rentpc.pdf`} className="inline-flex items-center justify-center gap-2 bg-gray-200 hover:bg-gray-300 px-4 sm:px-5 py-2.5 rounded-lg font-semibold transition text-sm sm:text-base active:scale-[0.98]">
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Descargar
              </a>
              <button onClick={()=> setShowContrato(false)} className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 sm:px-5 py-2.5 rounded-lg font-semibold transition text-sm sm:text-base shadow-lg active:scale-[0.98]">
                Continuar
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Firma Digital */}
      {showFirma && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4">
          <div className="bg-white w-full max-w-2xl rounded-xl sm:rounded-2xl shadow-2xl overflow-hidden max-h-[95vh] overflow-y-auto">
            <div className="px-4 sm:px-6 py-3 sm:py-4 border-b bg-gradient-to-r from-blue-600 to-blue-700 sticky top-0 z-10">
              <h3 className="font-bold text-white text-lg sm:text-xl flex items-center gap-2">
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                <span className="hidden sm:inline">Firma Digital del Contrato</span>
                <span className="sm:hidden">Firmar Contrato</span>
              </h3>
            </div>
            
            <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
              <div className="bg-blue-50 border-l-4 border-blue-500 p-3 sm:p-4 rounded">
                <div className="flex items-start gap-2 sm:gap-3">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div className="text-xs sm:text-sm text-blue-800">
                    <p className="font-semibold mb-1">Firma Electrónica Requerida</p>
                    <p className="leading-relaxed">Al firmar este documento, confirmas que has leído y aceptas todos los términos del contrato de arriendo. Tu firma tiene validez legal.</p>
                  </div>
                </div>
              </div>

              <div className="space-y-3 sm:space-y-4">
                <div className="grid grid-cols-2 gap-3 sm:gap-4 p-3 sm:p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-xs text-gray-600">Periodo</p>
                    <p className="font-semibold text-gray-900">{fechaInicio} - {fechaFin}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Duración</p>
                    <p className="font-semibold text-gray-900">{diasTotales} día{diasTotales !== 1 ? 's' : ''}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Total de equipos</p>
                    <p className="font-semibold text-gray-900">{items.length} producto{items.length !== 1 ? 's' : ''}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Total a pagar</p>
                    <p className="font-bold text-blue-600 text-lg">${totalFinal}</p>
                  </div>
                </div>

                <FirmaCanvas 
                  onFirmaGuardada={setFirmaCliente}
                  label="✍️ Firma del cliente (representante legal)"
                />

                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-start gap-2 text-xs text-gray-600">
                    <svg className="w-4 h-4 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    <p>Tu firma será encriptada y almacenada de forma segura. Una vez firmado, recibirás una copia del contrato por email.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="px-6 py-4 border-t bg-gray-50 flex justify-end gap-3">
              <button 
                onClick={() => {
                  setShowFirma(false);
                  setFirmaCliente(null);
                }}
                className="px-6 py-2.5 rounded-lg border-2 border-gray-300 font-semibold hover:bg-gray-100 transition"
              >
                Cancelar
              </button>
              <button 
                onClick={handleConfirmarConFirma}
                disabled={!firmaCliente}
                className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Confirmar y Proceder al Pago
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CotizacionResumen;
