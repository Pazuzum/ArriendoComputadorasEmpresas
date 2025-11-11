import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../componentes/Header.jsx';
import { getPerfil, updatePerfil } from '../api/usuario.js';

const Perfil = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [mensaje, setMensaje] = useState({ tipo: '', texto: '' });
  
  const [formData, setFormData] = useState({
    nombre: '',
    nombreEmpresa: '',
    email: '',
    telefono: '',
    telefonoContacto: '',
    direccion: '',
    rutEmpresa: '',
    nombrePropietario: '',
  });

  useEffect(() => {
    cargarPerfil();
  }, []);

  const cargarPerfil = async () => {
    try {
      setLoading(true);
      const res = await getPerfil();
      setFormData({
        nombre: res.data.nombre || '',
        nombreEmpresa: res.data.nombreEmpresa || '',
        email: res.data.email || '',
        telefono: res.data.telefono || '',
        telefonoContacto: res.data.telefonoContacto || '',
        direccion: res.data.direccion || '',
        rutEmpresa: res.data.rutEmpresa || '',
        nombrePropietario: res.data.nombrePropietario || '',
      });
    } catch (error) {
      console.error('Error al cargar perfil:', error);
      setMensaje({ tipo: 'error', texto: 'No se pudo cargar tu perfil. Intenta nuevamente.' });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGuardando(true);
    setMensaje({ tipo: '', texto: '' });

    try {
      // Solo enviar campos editables (sin datos de empresa bloqueados)
      const datosActualizables = {
        nombre: formData.nombre,
        email: formData.email,
        telefono: formData.telefono,
        telefonoContacto: formData.telefonoContacto,
        direccion: formData.direccion,
      };
      
      await updatePerfil(datosActualizables);
      setMensaje({ tipo: 'success', texto: '✓ Perfil actualizado exitosamente' });
      setTimeout(() => setMensaje({ tipo: '', texto: '' }), 3000);
    } catch (error) {
      console.error('Error al actualizar perfil:', error);
      const errorMsg = error.response?.data?.message || 'No se pudo actualizar el perfil. Intenta nuevamente.';
      setMensaje({ tipo: 'error', texto: errorMsg });
    } finally {
      setGuardando(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
        <Header />
        <main className="max-w-4xl mx-auto px-6 py-12">
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <Header />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Header con botón volver */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0 mb-5 sm:mb-6">
          <div className="flex items-center gap-3 sm:gap-4">
            <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-600 hover:text-gray-900 font-medium transition text-sm sm:text-base">
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Volver
            </button>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">👤 Mi Perfil</h1>
          </div>
        </div>

        {/* Mensajes de éxito o error */}
        {mensaje.texto && (
          <div className={`mb-5 sm:mb-6 p-3 sm:p-4 rounded-lg sm:rounded-xl border-2 ${
            mensaje.tipo === 'success' 
              ? 'bg-green-50 border-green-300 text-green-800' 
              : 'bg-red-50 border-red-300 text-red-800'
          }`}>
            <div className="flex items-center gap-2">
              {mensaje.tipo === 'success' ? (
                <svg className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              ) : (
                <svg className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )}
              <span className="font-semibold text-sm sm:text-base">{mensaje.texto}</span>
            </div>
          </div>
        )}

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="bg-white rounded-xl sm:rounded-2xl shadow-lg overflow-hidden border border-gray-100">
          {/* Datos personales */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-4 sm:px-6 py-3 sm:py-4">
            <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
              <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Datos Personales
            </h2>
          </div>
          <div className="p-4 sm:p-6 space-y-3 sm:space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Nombre Completo *
              </label>
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition outline-none"
                placeholder="Tu nombre completo"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition outline-none"
                placeholder="tu@email.com"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Teléfono Personal
              </label>
              <input
                type="tel"
                name="telefono"
                value={formData.telefono}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition outline-none"
                placeholder="+56 9 1234 5678"
              />
            </div>
          </div>

          {/* Datos de la empresa */}
          <div className="bg-gradient-to-r from-gray-600 to-gray-700 px-4 sm:px-6 py-3 sm:py-4">
            <h2 className="text-lg sm:text-xl font-bold text-white flex flex-col sm:flex-row sm:items-center gap-2">
              <span className="flex items-center gap-2">
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                Datos de la Empresa
              </span>
              <span className="text-xs sm:text-sm bg-gray-800 px-2 sm:px-3 py-1 rounded-full self-start sm:self-auto sm:ml-auto">🔒 Solo lectura</span>
            </h2>
          </div>
          <div className="p-4 sm:p-6 bg-gray-50">
            <div className="mb-4 p-3 sm:p-4 bg-yellow-50 border-2 border-yellow-300 rounded-lg flex items-start gap-2 sm:gap-3">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <div className="text-xs sm:text-sm text-yellow-800">
                <p className="font-bold mb-1">Datos fiscales bloqueados por seguridad</p>
                <p className="leading-relaxed">Los datos de la empresa (nombre, RUT y propietario) no pueden ser modificados. Si necesitas actualizar esta información, contacta al administrador del sistema.</p>
              </div>
            </div>
            
            <div className="space-y-3 sm:space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Nombre de la Empresa
                </label>
                <input
                  type="text"
                  name="nombreEmpresa"
                  value={formData.nombreEmpresa}
                  disabled
                  className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 bg-gray-100 text-gray-600 cursor-not-allowed"
                  placeholder="No especificado"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  RUT de la Empresa
                </label>
                <input
                  type="text"
                  name="rutEmpresa"
                  value={formData.rutEmpresa}
                  disabled
                  className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 bg-gray-100 text-gray-600 cursor-not-allowed"
                  placeholder="No especificado"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Nombre del Propietario/Representante Legal
                </label>
                <input
                  type="text"
                  name="nombrePropietario"
                  value={formData.nombrePropietario}
                  disabled
                  className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 bg-gray-100 text-gray-600 cursor-not-allowed"
                  placeholder="No especificado"
                />
              </div>

              <div className="border-t-2 border-gray-300 pt-4 mt-6">
                <p className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Campos editables de contacto:
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Dirección de la Empresa
                </label>
                <input
                  type="text"
                  name="direccion"
                  value={formData.direccion}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition outline-none"
                  placeholder="Calle, número, comuna, ciudad"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Teléfono de Contacto Empresa
                </label>
                <input
                  type="tel"
                  name="telefonoContacto"
                  value={formData.telefonoContacto}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition outline-none"
                  placeholder="+56 2 1234 5678"
                />
              </div>
            </div>
          </div>

          {/* Botones de acción */}
          <div className="px-4 sm:px-6 py-4 bg-gray-50 border-t border-gray-200 flex flex-col-reverse sm:flex-row sm:justify-end gap-3 sm:gap-4">
            <button
              type="button"
              onClick={() => cargarPerfil()}
              disabled={guardando}
              className="w-full sm:w-auto px-5 sm:px-6 py-3 rounded-lg border-2 border-gray-300 text-gray-700 font-semibold hover:bg-gray-100 transition disabled:opacity-50 active:scale-[0.98]"
            >
              ↺ Cancelar cambios
            </button>
            <button
              type="submit"
              disabled={guardando}
              className="w-full sm:w-auto px-5 sm:px-6 py-3 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold hover:from-blue-700 hover:to-blue-800 transition disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl active:scale-[0.98]"
            >
              {guardando ? (
                <>
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                  </svg>
                  Guardando...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Guardar cambios
                </>
              )}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default Perfil;
