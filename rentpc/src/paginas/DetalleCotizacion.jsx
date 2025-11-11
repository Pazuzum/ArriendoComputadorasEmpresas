import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../componentes/Header.jsx';
import axios from '../api/axios.js';

const Badge = ({ estado }) => {
  const map = {
    PENDIENTE: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    RESERVADA: 'bg-blue-100 text-blue-800 border-blue-300',
    CONFIRMADA: 'bg-green-100 text-green-800 border-green-300',
    CANCELADA: 'bg-red-100 text-red-800 border-red-300',
    EXPIRADA: 'bg-gray-100 text-gray-800 border-gray-300',
  };
  const icons = {
    PENDIENTE: '⏳',
    RESERVADA: '📋',
    CONFIRMADA: '✅',
    CANCELADA: '❌',
    EXPIRADA: '⏰',
  };
  return (
    <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold border-2 ${map[estado] || 'bg-gray-100 text-gray-800 border-gray-300'}`}>
      <span className="text-lg">{icons[estado]}</span>
      {estado}
    </span>
  );
};

const formatDateTime = (date) => {
  if (!date) return '-';
  const d = new Date(date);
  return d.toLocaleString('es-ES', { 
    day: '2-digit', 
    month: 'long', 
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const DetalleCotizacion = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [reserva, setReserva] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchReserva = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`/reservas/${id}`);
        setReserva(res.data.reserva);
      } catch (e) {
        console.error(e);
        setError('No se pudo cargar la cotización. Puede que no exista o no tengas acceso.');
      } finally {
        setLoading(false);
      }
    };
    fetchReserva();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-5xl mx-auto px-6 py-12">
          <div className="flex items-center justify-center py-20">
            <svg className="animate-spin h-12 w-12 text-blue-600" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
            </svg>
          </div>
        </main>
      </div>
    );
  }

  if (error || !reserva) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-5xl mx-auto px-6 py-12">
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-red-100 rounded-full mb-4">
              <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Cotización no encontrada</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <button onClick={() => navigate('/mis-cotizaciones')} className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition">
              Volver a mis cotizaciones
            </button>
          </div>
        </main>
      </div>
    );
  }

  const diasTotales = (() => {
    if (!reserva.duracion) return 1;
    const valor = reserva.duracion.valor || 1;
    switch (reserva.duracion.unidad) {
      case 'semanas': return valor * 7;
      case 'meses': return valor * 30;
      default: return valor;
    }
  })();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <Header />
      <main className="max-w-6xl mx-auto px-6 py-8">
        {/* Header con botón volver */}
        <div className="flex items-center gap-4 mb-6">
          <button onClick={() => navigate('/mis-cotizaciones')} className="flex items-center gap-2 text-gray-600 hover:text-gray-900 font-medium transition">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Volver
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Detalle de Cotización</h1>
        </div>

        {/* Estado y ID */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-gray-100">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <Badge estado={reserva.estado} />
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">ID de Cotización</p>
              <p className="font-mono text-sm font-semibold text-gray-900">{reserva._id}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Columna izquierda: Detalles de fechas y tiempos */}
          <div className="lg:col-span-2 space-y-6">
            {/* Card de fechas */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Información de Fechas
                </h2>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-600 mb-1">Fecha de Creación</p>
                    <p className="text-lg font-bold text-gray-900">{formatDateTime(reserva.createdAt)}</p>
                  </div>
                </div>

                {reserva.expiresAt && (
                  <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
                    <div className="bg-yellow-100 p-3 rounded-lg">
                      <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-gray-600 mb-1">Fecha de Expiración</p>
                      <p className="text-lg font-bold text-gray-900">{formatDateTime(reserva.expiresAt)}</p>
                    </div>
                  </div>
                )}

                {reserva.updatedAt && (
                  <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
                    <div className="bg-green-100 p-3 rounded-lg">
                      <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-gray-600 mb-1">Última Actualización</p>
                      <p className="text-lg font-bold text-gray-900">{formatDateTime(reserva.updatedAt)}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Card de equipos */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                  </svg>
                  Equipos Cotizados
                </h2>
              </div>
              {/* Vista Desktop - Tabla */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b-2 border-gray-200">
                    <tr className="text-gray-700 font-semibold">
                      <th className="px-6 py-3 text-left">Equipo</th>
                      <th className="px-6 py-3 text-center">Cantidad</th>
                      <th className="px-6 py-3 text-right">Precio/día</th>
                      <th className="px-6 py-3 text-right">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {(reserva.items || []).map((item, idx) => (
                      <tr key={idx} className="hover:bg-blue-50 transition">
                        <td className="px-6 py-4 font-medium text-gray-900">{item.nombre}</td>
                        <td className="px-6 py-4 text-center">
                          <span className="inline-flex items-center justify-center bg-blue-100 text-blue-800 font-bold px-3 py-1 rounded-full text-xs">
                            {item.cantidad}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right text-gray-700">${item.precio || 0}</td>
                        <td className="px-6 py-4 text-right font-bold text-blue-600">${(item.precio || 0) * (item.cantidad || 1)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Vista Móvil - Cards */}
              <div className="md:hidden p-4 space-y-3">
                {(reserva.items || []).map((item, idx) => (
                  <div key={idx} className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-4 border border-blue-200">
                    <h3 className="font-bold text-gray-900 mb-3 text-sm">{item.nombre}</h3>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="text-center p-2 bg-white rounded-lg">
                        <div className="text-xs text-gray-600 mb-1">Cantidad</div>
                        <div className="text-lg font-bold text-blue-600">{item.cantidad}</div>
                      </div>
                      <div className="text-center p-2 bg-white rounded-lg">
                        <div className="text-xs text-gray-600 mb-1">Precio/día</div>
                        <div className="text-lg font-bold text-gray-900">${item.precio || 0}</div>
                      </div>
                    </div>
                    <div className="mt-3 pt-3 border-t border-blue-200 flex items-center justify-between">
                      <span className="text-sm font-semibold text-gray-700">Subtotal:</span>
                      <span className="text-xl font-bold text-blue-600">${(item.precio || 0) * (item.cantidad || 1)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Card de contacto */}
            {reserva.contacto && (
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Datos de Contacto
                  </h2>
                </div>
                <div className="p-6 space-y-3">
                  {reserva.contacto.nombre && (
                    <div className="flex items-center gap-3">
                      <span className="text-gray-600 font-medium w-24">Nombre:</span>
                      <span className="text-gray-900 font-semibold">{reserva.contacto.nombre}</span>
                    </div>
                  )}
                  {reserva.contacto.email && (
                    <div className="flex items-center gap-3">
                      <span className="text-gray-600 font-medium w-24">Email:</span>
                      <span className="text-gray-900 font-semibold">{reserva.contacto.email}</span>
                    </div>
                  )}
                  {reserva.contacto.telefono && (
                    <div className="flex items-center gap-3">
                      <span className="text-gray-600 font-medium w-24">Teléfono:</span>
                      <span className="text-gray-900 font-semibold">{reserva.contacto.telefono}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Card de pago si existe */}
            {reserva.pago && (
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
                <div className="bg-gradient-to-r from-green-600 to-green-700 px-6 py-4">
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                    Información de Pago
                  </h2>
                </div>
                <div className="p-6 space-y-3">
                  {reserva.pago.cardType && (
                    <div className="flex items-center gap-3">
                      <span className="text-gray-600 font-medium w-32">Tipo de tarjeta:</span>
                      <span className="text-gray-900 font-semibold">{reserva.pago.cardType}</span>
                    </div>
                  )}
                  {reserva.pago.lastFour && (
                    <div className="flex items-center gap-3">
                      <span className="text-gray-600 font-medium w-32">Últimos 4 dígitos:</span>
                      <span className="text-gray-900 font-semibold">•••• {reserva.pago.lastFour}</span>
                    </div>
                  )}
                  {reserva.pago.cardHolder && (
                    <div className="flex items-center gap-3">
                      <span className="text-gray-600 font-medium w-32">Titular:</span>
                      <span className="text-gray-900 font-semibold">{reserva.pago.cardHolder}</span>
                    </div>
                  )}
                  {reserva.pago.paidAt && (
                    <div className="flex items-center gap-3">
                      <span className="text-gray-600 font-medium w-32">Fecha de pago:</span>
                      <span className="text-gray-900 font-semibold">{formatDateTime(reserva.pago.paidAt)}</span>
                    </div>
                  )}
                  {reserva.pago.status && (
                    <div className="flex items-center gap-3">
                      <span className="text-gray-600 font-medium w-32">Estado:</span>
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-800">
                        {reserva.pago.status === 'succeeded' ? '✓ Exitoso' : reserva.pago.status}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Firma del cliente */}
          {reserva.firmaCliente && (
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
                <div className="bg-gradient-to-r from-purple-600 to-purple-700 px-6 py-4">
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Firma Digital del Contrato
                  </h2>
                </div>
                <div className="p-6">
                  <div className="bg-gray-50 border-2 border-gray-200 rounded-xl p-6 flex flex-col items-center">
                    <p className="text-sm text-gray-600 mb-4 font-medium">Firma del representante legal</p>
                    <img 
                      src={reserva.firmaCliente} 
                      alt="Firma del cliente" 
                      className="max-w-md w-full border-2 border-gray-300 rounded-lg bg-white p-4"
                    />
                    <div className="mt-4 flex items-center gap-2 text-xs text-gray-500">
                      <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                      <span>Firmado digitalmente el {formatDateTime(reserva.createdAt)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Columna derecha: Resumen financiero */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 sticky top-6">
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
                <h2 className="text-xl font-bold text-white">Resumen</h2>
              </div>
              <div className="p-6 space-y-4">
                {reserva.duracion && (
                  <div className="bg-blue-50 rounded-xl p-4 border-2 border-blue-200">
                    <p className="text-sm text-gray-600 mb-1">Periodo de arriendo</p>
                    <p className="text-2xl font-bold text-blue-600">
                      {reserva.duracion.valor} {reserva.duracion.unidad}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">= {diasTotales} día{diasTotales !== 1 ? 's' : ''}</p>
                  </div>
                )}

                <div className="space-y-2 py-4 border-y border-gray-200">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal equipos:</span>
                    <span className="font-semibold text-gray-900">
                      ${(reserva.items || []).reduce((a, b) => a + (b.precio || 0) * (b.cantidad || 1), 0)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Duración:</span>
                    <span className="font-semibold text-gray-900">× {diasTotales} día{diasTotales !== 1 ? 's' : ''}</span>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-4 border-2 border-blue-300">
                  <p className="text-sm text-gray-600 mb-2">Total a Pagar</p>
                  <p className="text-4xl font-extrabold text-blue-600">${reserva.total || 0}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DetalleCotizacion;
