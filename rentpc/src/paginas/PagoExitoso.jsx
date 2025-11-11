import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import Header from '../componentes/Header.jsx'

// Página de confirmación de pago exitoso
const PagoExitoso = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { reservaId, total, cardType, lastFour } = location.state || {}

  // Redirigir si no hay datos de reserva
  if (!reservaId) {
    navigate('/')
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-2xl mx-auto p-6 py-12">
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          {/* Icono de éxito */}
          <div className="mb-6">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full">
              <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-2">¡Pago Exitoso!</h1>
          <p className="text-gray-600 mb-8">Tu cotización ha sido confirmada y pagada</p>

          {/* Detalles del pago */}
          <div className="bg-gray-50 rounded-lg p-6 mb-6 space-y-3 text-left">
            <div className="flex justify-between">
              <span className="text-gray-600">ID de Reserva:</span>
              <span className="font-mono text-sm">{reservaId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Monto pagado:</span>
              <span className="font-bold text-green-600">${total}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Método de pago:</span>
              <span>{cardType} •••• {lastFour}</span>
            </div>
          </div>

          {/* Banner de confirmación por email */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 text-sm text-blue-800">
            <p>📧 Recibirás un correo de confirmación con los detalles de tu reserva.</p>
          </div>

          {/* Botones de navegación */}
          <div className="space-y-3">
            <button
              onClick={() => navigate('/mis-cotizaciones')}
              className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Ver mis cotizaciones
            </button>
            <button
              onClick={() => navigate('/catalogo')}
              className="w-full border border-gray-300 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition"
            >
              Volver al catálogo
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}

export default PagoExitoso
