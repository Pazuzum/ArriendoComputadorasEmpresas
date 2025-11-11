import { useNavigate, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useAuth } from '../Context/authContext.jsx'
import { useState } from 'react'

import Header from '../componentes/Header.jsx'

// Página de inicio de sesión con formulario de autenticación
const Login = () => {
    const { register, handleSubmit } = useForm()
    const { signin } = useAuth()
    const navigate = useNavigate()
    const [error, setError] = useState('')

    // Manejar envío del formulario de login
    const onSubmit = async (data) => {
        setError('')
        try {
            const res = await signin(data)
            if (res?.success) {
                document.querySelector('form').reset()
                navigate('/')
            } else {
                setError(res?.message || 'Error al iniciar sesión')
            }
        } catch (err) {
            console.error('Error en onSubmit login:', err)
            setError('Error al iniciar sesión')
        }
    }
    // Renderizar formulario de login
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
            <Header />
            <div className="flex items-center justify-center px-6 py-12 md:py-20">
                <div className="w-full max-w-md">
                    {/* Tarjeta del formulario */}
                    <div className="bg-white rounded-2xl shadow-xl p-8 md:p-10 border border-gray-100">
                        {/* Icono de usuario */}
                        <div className="flex justify-center mb-6">
                            <div className="bg-blue-100 p-4 rounded-xl">
                                <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                            </div>
                        </div>

                        <h2 className="text-3xl font-bold text-gray-900 text-center mb-2">
                            Iniciar Sesión
                        </h2>
                        <p className="text-gray-600 text-center mb-8">
                            Ingresa a tu cuenta empresarial
                        </p>

                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                            {/* Campo de correo electrónico */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Correo electrónico
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                                        </svg>
                                    </div>
                                    <input
                                        type="email"
                                        {...register('email', { required: true })}
                                        placeholder="tu@empresa.com"
                                        className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition"
                                    />
                                </div>
                            </div>

                            {/* Campo de contraseña */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Contraseña
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                        </svg>
                                    </div>
                                    <input
                                        type="password"
                                        {...register('contra', { required: true })}
                                        placeholder="••••••••"
                                        className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition"
                                    />
                                </div>
                            </div>

                            {/* Mensaje de error */}
                            {error && (
                                <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
                                    <div className="flex items-center gap-2">
                                        <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <p className="text-sm text-red-700 font-medium">{error}</p>
                                    </div>
                                </div>
                            )}

                            {/* Botón de envío */}
                            <button
                                type="submit"
                                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3.5 rounded-xl font-bold hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                            >
                                Ingresar
                            </button>
                        </form>

                        {/* Enlace a registro */}
                        <div className="mt-6 pt-6 border-t border-gray-200">
                            <p className="text-center text-gray-600">
                                ¿No tienes cuenta?{' '}
                                <Link to="/register" className="text-blue-600 hover:text-blue-700 font-semibold hover:underline">
                                    Regístrate aquí
                                </Link>
                            </p>
                        </div>
                    </div>

                    {/* Información adicional */}
                    <div className="mt-6 text-center">
                        <p className="text-sm text-gray-500">
                            Solo para empresas registradas
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login