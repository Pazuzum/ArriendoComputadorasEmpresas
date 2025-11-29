import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '../componentes/Header.jsx';
import axios from '../api/axios.js';

const detectCardType = (number) => {
  const cleaned = number.replace(/\s/g, '');
  if (/^4/.test(cleaned)) return { type: 'Visa', icon: '💳', color: 'blue', cvvLength: 3 };
  if (/^5[1-5]/.test(cleaned)) return { type: 'MasterCard', icon: '💳', color: 'orange', cvvLength: 3 };
  if (/^3[47]/.test(cleaned)) return { type: 'American Express', icon: '💳', color: 'green', cvvLength: 4 };
  return { type: 'Desconocida', icon: '💳', color: 'gray', cvvLength: 3 };
};

const formatCardNumber = (value) => {
  const cleaned = value.replace(/\D/g, '');
  const groups = cleaned.match(/.{1,4}/g);
  return groups ? groups.join(' ') : cleaned;
};

const PagoSimulado = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const reservaId = location.state?.reservaId;
  const total = location.state?.total || 0;

  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');
  const [cardInfo, setCardInfo] = useState(detectCardType(''));

  useEffect(() => {
    if (!reservaId) {
      navigate('/cotizar');
    }
  }, [reservaId, navigate]);

  useEffect(() => {
    setCardInfo(detectCardType(cardNumber));
  }, [cardNumber]);

  const handleCardNumberChange = (e) => {
    const formatted = formatCardNumber(e.target.value);
    if (formatted.replace(/\s/g, '').length <= 16) {
      setCardNumber(formatted);
    }
  };

  const handleExpiryChange = (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length >= 2) {
      value = value.slice(0, 2) + '/' + value.slice(2, 4);
    }
    if (value.length <= 5) {
      setExpiry(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validaciones básicas
    const cleanCard = cardNumber.replace(/\s/g, '');
    if (cleanCard.length < 13 || cleanCard.length > 16) {
      setError('Número de tarjeta inválido');
      return;
    }
    if (!cardName.trim()) {
      setError('Ingrese el nombre del titular');
      return;
    }
    // Validar que el nombre solo contenga letras y espacios
    if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/.test(cardName.trim())) {
      setError('El nombre del titular solo debe contener letras');
      return;
    }
    // Validar que tenga al menos nombre y apellido
    if (cardName.trim().split(/\s+/).length < 2) {
      setError('Ingrese nombre y apellido del titular');
      return;
    }
    if (!/^\d{2}\/\d{2}$/.test(expiry)) {
      setError('Fecha de vencimiento inválida (MM/AA)');
      return;
    }
    // Validar que la fecha sea válida (mes entre 01-12)
    const [month, year] = expiry.split('/').map(Number);
    if (month < 1 || month > 12) {
      setError('Mes inválido (debe ser entre 01 y 12)');
      return;
    }
    // Validar que la tarjeta no esté vencida
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear() % 100; // Últimos 2 dígitos del año
    const currentMonth = currentDate.getMonth() + 1;
    if (year < currentYear || (year === currentYear && month < currentMonth)) {
      setError('La tarjeta está vencida');
      return;
    }
    const expectedCvvLength = cardInfo.cvvLength || 3;
    if (cvv.length !== expectedCvvLength) {
      setError(`CVV inválido (debe tener ${expectedCvvLength} dígitos para ${cardInfo.type})`);
      return;
    }

    setProcessing(true);

    // Simular delay de procesamiento
    await new Promise(resolve => setTimeout(resolve, 2000));

    try {
      // Simular pago exitoso y confirmar reserva en backend
      const pagoData = {
        cardType: cardInfo.type,
        lastFour: cleanCard.slice(-4),
        cardHolder: cardName,
      };

      console.log('💳 Procesando pago para reserva:', reservaId);

      // Llamar al backend para confirmar la reserva
      const response = await axios.post(`/reservas/${reservaId}/confirm`, { pagoData });
      
      console.log('✅ Reserva confirmada:', response.data);

      // Redirigir a página de éxito
      navigate('/pago-exitoso', { 
        state: { 
          reservaId, 
          total, 
          cardType: cardInfo.type,
          lastFour: cleanCard.slice(-4)
        } 
      });
    } catch (err) {
      console.error('❌ Error al confirmar reserva:', err);
      console.error('Detalles:', err.response?.data);
      setError('Error al procesar el pago. Intente nuevamente.');
      setProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      <Header />
      <main className="max-w-2xl mx-auto p-4 sm:p-6 py-8 sm:py-12">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100">
          {/* Header con gradiente */}
          <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 px-6 sm:px-8 py-6 sm:py-8">
            <div className="flex items-center justify-center gap-3 mb-3">
              <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
              </div>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white text-center mb-2">Método de Pago</h1>
            <p className="text-sm sm:text-base text-blue-100 text-center">Ingresa los datos de tu tarjeta para procesar la transacción</p>
          </div>

          <div className="p-6 sm:p-8">
            {/* Total a pagar destacado */}
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-200 rounded-2xl p-6 mb-8 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <span className="text-sm font-medium text-gray-600 block mb-1">Total a pagar</span>
                  <span className="text-4xl sm:text-5xl font-extrabold text-blue-700">${total.toLocaleString('es-CL')}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-blue-700 bg-white/80 px-4 py-2 rounded-lg">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.018.636l2.107-2.107a2.121 2.121 0 00-3-3L12 10.586 8.879 7.464a2.121 2.121 0 00-3 3l2.107 2.107M9 12l2 2 4-4m0 0l6-6" />
                  </svg>
                  <span className="font-semibold">Pago seguro</span>
                </div>
              </div>
            </div>

          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 text-red-800 rounded-lg p-4 mb-6 flex items-start gap-3">
              <svg className="w-6 h-6 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-sm font-medium">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-bold mb-3 text-gray-800 flex items-center gap-2">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
                Número de tarjeta
              </label>
              <div className="relative">
                <input
                  type="text"
                  inputMode="numeric"
                  value={cardNumber}
                  onChange={handleCardNumberChange}
                  placeholder="1234 5678 9012 3456"
                  className="w-full px-4 py-4 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none pr-32 text-lg font-mono transition-all shadow-sm hover:border-blue-400"
                  required
                  maxLength={19}
                  title="Solo números (16 dígitos)"
                />
                <div className={`absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2 text-${cardInfo.color}-600`}>
                  <span className="text-3xl">{cardInfo.icon}</span>
                  <span className="text-sm font-bold hidden sm:inline">{cardInfo.type}</span>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold mb-3 text-gray-800 flex items-center gap-2">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Nombre del titular
              </label>
              <input
                type="text"
                value={cardName}
                onChange={(e) => {
                  // Solo permitir letras, espacios y caracteres con tilde
                  const value = e.target.value;
                  if (/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]*$/.test(value)) {
                    setCardName(value.toUpperCase());
                  }
                }}
                placeholder="JUAN PÉREZ GONZÁLEZ"
                className="w-full px-4 py-4 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-lg uppercase transition-all shadow-sm hover:border-blue-400"
                required
                minLength={3}
                pattern="[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+"
                title="Solo se permiten letras y espacios"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold mb-3 text-gray-800 flex items-center gap-2">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Vencimiento
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  value={expiry}
                  onChange={handleExpiryChange}
                  placeholder="MM/AA"
                  className="w-full px-4 py-4 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-lg font-mono text-center transition-all shadow-sm hover:border-blue-400"
                  required
                  maxLength={5}
                  pattern="\d{2}/\d{2}"
                  title="Formato: MM/AA (ejemplo: 12/25)"
                />
              </div>
              <div>
                <label className="block text-sm font-bold mb-3 text-gray-800 flex items-center gap-2">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  CVV
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  value={cvv}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, '');
                    const maxLength = cardInfo.cvvLength || 3;
                    if (val.length <= maxLength) setCvv(val);
                  }}
                  placeholder={cardInfo.cvvLength === 4 ? "1234" : "123"}
                  maxLength={cardInfo.cvvLength || 3}
                  className="w-full px-4 py-4 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-lg font-mono text-center transition-all shadow-sm hover:border-blue-400"
                  required
                  minLength={cardInfo.cvvLength || 3}
                  pattern={cardInfo.cvvLength === 4 ? "\\d{4}" : "\\d{3}"}
                  title={`Código de seguridad de ${cardInfo.cvvLength || 3} dígitos`}
                />
              </div>
            </div>

            <div className="pt-6 space-y-3 border-t border-gray-200">
              <button
                type="submit"
                disabled={processing}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-4 rounded-xl font-bold text-lg hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl active:scale-[0.98] flex items-center justify-center gap-3"
              >
                {processing ? (
                  <>
                    <svg className="animate-spin h-6 w-6" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                    </svg>
                    <span>Procesando transacción...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.018.636l2.107-2.107a2.121 2.121 0 00-3-3L12 10.586 8.879 7.464a2.121 2.121 0 00-3 3l2.107 2.107M9 12l2 2 4-4m0 0l6-6" />
                    </svg>
                    <span>Confirmar Pago - ${total.toLocaleString('es-CL')}</span>
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() => navigate('/cotizar')}
                disabled={processing}
                className="w-full border-2 border-gray-300 px-6 py-3.5 rounded-xl font-semibold text-gray-700 hover:bg-gray-50 hover:border-gray-400 disabled:opacity-50 transition-all active:scale-[0.98]"
              >
                Cancelar
              </button>
            </div>
          </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PagoSimulado;
