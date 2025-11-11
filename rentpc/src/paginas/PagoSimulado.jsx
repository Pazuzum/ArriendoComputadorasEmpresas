import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '../componentes/Header.jsx';
import axios from '../api/axios.js';

const detectCardType = (number) => {
  const cleaned = number.replace(/\s/g, '');
  if (/^4/.test(cleaned)) return { type: 'Visa', icon: '�', color: 'blue' };
  if (/^5[1-5]/.test(cleaned)) return { type: 'MasterCard', icon: '�', color: 'orange' };
  if (/^3[47]/.test(cleaned)) return { type: 'American Express', icon: '�', color: 'green' };
  return { type: 'Desconocida', icon: '❓', color: 'gray' };
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
    if (cvv.length < 3 || cvv.length > 4) {
      setError('CVV inválido');
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

      // Llamar al backend para confirmar la reserva
      await axios.post(`/reservas/${reservaId}/confirm`, { pagoData });

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
      console.error(err);
      setError('Error al procesar el pago. Intente nuevamente.');
      setProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-2xl mx-auto p-4 sm:p-6 py-8 sm:py-12">
        <div className="bg-white rounded-xl shadow-lg p-4 sm:p-8">
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">💳 Pago Simulado</h1>
          <p className="text-sm sm:text-base text-gray-600 mb-6">Complete los datos de su tarjeta para procesar el pago</p>

          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border-2 border-blue-200 rounded-xl p-4 sm:p-6 mb-6 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <span className="text-sm sm:text-base font-semibold text-gray-700">Total a pagar:</span>
              <span className="text-3xl sm:text-4xl font-bold text-blue-600">${total}</span>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 text-red-700 rounded-lg p-4 mb-6 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">
                💳 Número de tarjeta
              </label>
              <div className="relative">
                <input
                  type="text"
                  inputMode="numeric"
                  value={cardNumber}
                  onChange={handleCardNumberChange}
                  placeholder="1234 5678 9012 3456"
                  className="w-full px-4 py-3 sm:py-3.5 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none pr-10 sm:pr-32 text-base sm:text-lg font-mono transition-all"
                  required
                  maxLength={19}
                  title="Solo números (16 dígitos)"
                />
                <div className={`absolute right-3 top-1/2 -translate-y-1/2 hidden sm:flex items-center gap-2 text-${cardInfo.color}-600`}>
                  <span className="text-3xl">{cardInfo.icon}</span>
                  <span className="text-sm font-medium">{cardInfo.type}</span>
                </div>
                <div className={`absolute right-3 top-1/2 -translate-y-1/2 sm:hidden text-${cardInfo.color}-600`}>
                  <span className="text-2xl">{cardInfo.icon}</span>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-2 bg-gray-50 rounded p-2">
                💡 Prueba: 4xxx (Visa), 5xxx (MasterCard), 3xxx (Amex)
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">
                👤 Nombre del titular
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
                placeholder="JUAN PÉREZ"
                className="w-full px-4 py-3 sm:py-3.5 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-base sm:text-lg uppercase transition-all"
                required
                minLength={3}
                pattern="[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+"
                title="Solo se permiten letras y espacios"
              />
              <p className="text-xs text-gray-500 mt-2">
                Solo letras (sin números ni símbolos)
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">
                  📅 Vencimiento
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  value={expiry}
                  onChange={handleExpiryChange}
                  placeholder="MM/AA"
                  className="w-full px-4 py-3 sm:py-3.5 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-base sm:text-lg font-mono text-center transition-all"
                  required
                  maxLength={5}
                  pattern="\d{2}/\d{2}"
                  title="Formato: MM/AA (ejemplo: 12/25)"
                />
                <p className="text-xs text-gray-500 mt-1.5">Formato: MM/AA</p>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">
                  🔒 CVV
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  value={cvv}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, '');
                    if (val.length <= 4) setCvv(val);
                  }}
                  placeholder="123"
                  maxLength={4}
                  className="w-full px-4 py-3 sm:py-3.5 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-base sm:text-lg font-mono text-center transition-all"
                  required
                  minLength={3}
                  pattern="\d{3,4}"
                  title="Código de seguridad de 3 o 4 dígitos"
                />
                <p className="text-xs text-gray-500 mt-1.5">3-4 dígitos</p>
              </div>
            </div>

            <div className="pt-4 sm:pt-6 space-y-3">
              <button
                type="submit"
                disabled={processing}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3.5 sm:py-4 rounded-lg font-bold text-base sm:text-lg hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl active:scale-[0.98]"
              >
                {processing ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                    </svg>
                    Procesando pago...
                  </span>
                ) : (
                  `💳 Pagar $${total}`
                )}
              </button>
              <button
                type="button"
                onClick={() => navigate('/cotizar')}
                disabled={processing}
                className="w-full border-2 border-gray-300 px-6 py-3 sm:py-3.5 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 hover:border-gray-400 disabled:opacity-50 transition-all active:scale-[0.98]"
              >
                Cancelar
              </button>
            </div>
          </form>

          <div className="mt-8 pt-6 border-t text-center text-xs text-gray-500">
            <p>🔒 Esta es una simulación de pago. No se realizará ningún cargo real.</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PagoSimulado;
