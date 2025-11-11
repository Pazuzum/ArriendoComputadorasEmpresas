import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../Context/authContext.jsx'

// HOC para proteger rutas que requieren permisos de administrador
const ProtectedAdmin = ({ children }) => {
  const { isAuthenticated, loading, user } = useAuth()

  // Mostrar cargando mientras se verifica autenticación
  if (loading) return <div className="p-6">Cargando...</div>

  // Log para debugging de permisos
  console.log('ProtectedAdmin user:', user, 'isAuthenticated:', isAuthenticated)

  // Redirigir a login si no está autenticado
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  // Verificar si el usuario tiene rol de administrador
  const isAdmin =
    user?.role === 'admin' ||
    (Array.isArray(user?.roles) && user.roles.some((r) => r.nombre === 'admin' || r.name === 'admin' || r === 'admin'))

  // Mostrar mensaje de acceso denegado si no es admin
  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
        <div className="max-w-xl w-full bg-white shadow-md rounded-lg p-8 text-center">
          <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-red-100">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="mt-6 text-2xl font-semibold text-gray-800">Acceso denegado</h2>
          <p className="mt-4 text-gray-600">No dispone de permisos de administrador para ver esta sección. Si cree que debería tener acceso, solicite a un administrador que active su cuenta o revise sus permisos.</p>
          <div className="mt-6 flex justify-center gap-4">
            <a href="/" className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">Volver al inicio</a>
            <a href="/contacto" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Contactar al administrador</a>
          </div>
        </div>
      </div>
    )
  }

  // Permitir acceso si es administrador
  return children
}

export default ProtectedAdmin
