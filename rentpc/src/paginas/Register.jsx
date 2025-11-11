import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useAuth } from '../Context/authContext.jsx'

import Header from '../componentes/Header.jsx'

// Página de registro de empresas con formulario de datos completos
const Register = () => {
    const { register, handleSubmit, formState: { errors } } = useForm()
    const { signup } = useAuth()
    const [message, setMessage] = useState('')

    // Manejar envío del formulario de registro
    const onSubmit = async (data) => {
        const res = await signup(data)
        setMessage(res.message || '')
        // Limpiar el formulario solo si el registro fue exitoso
        if (res.success) {
            document.querySelector('form').reset()
            // Redirigir al login después de 3 segundos
            setTimeout(() => {
                window.location.href = '/login'
            }, 3000)
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
            <Header />
            <div className="flex items-center justify-center px-4 sm:px-6 py-8 sm:py-12">
                <div className="w-full max-w-4xl">
                    {/* Tarjeta principal del formulario */}
                    <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl p-5 sm:p-8 md:p-10 border border-gray-100">
                        {/* Encabezado con icono */}
                        <div className="text-center mb-6 sm:mb-8">
                            <div className="flex justify-center mb-3 sm:mb-4">
                                <div className="bg-blue-100 p-3 sm:p-4 rounded-xl">
                                    <svg className="w-8 h-8 sm:w-10 sm:h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                    </svg>
                                </div>
                            </div>
                            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                                Registro Empresarial
                            </h2>
                            <p className="text-sm sm:text-base text-gray-600">
                                Completa los datos de tu empresa para crear una cuenta
                            </p>
                        </div>

                        {/* Banner informativo */}
                        <div className="bg-blue-50 border-l-4 border-blue-500 p-3 sm:p-4 rounded-lg mb-6 sm:mb-8">
                            <div className="flex items-start gap-3">
                                <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <p className="text-sm text-blue-800">
                                    <span className="font-semibold">Importante:</span> Solo empresas. Tu cuenta será revisada por un administrador antes de ser activada.
                                </p>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 sm:space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
                                {/* Columna izquierda: Datos de acceso */}
                                <div className="space-y-4 sm:space-y-5">
                                    <div className="pb-2 sm:pb-3 border-b-2 border-gray-200 bg-blue-50 -mx-5 sm:-mx-0 px-5 sm:px-0 py-2 sm:py-0 sm:bg-transparent rounded-t-lg sm:rounded-none">
                                        <h3 className="text-base sm:text-lg font-bold text-gray-900 flex items-center gap-2">
                                            <svg className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                            </svg>
                                            Datos de Acceso
                                        </h3>
                                    </div>

                                    {/* Campo nombre completo */}
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Nombre completo *
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="Juan Pérez"
                                            {...register('nombre', { required: 'El nombre es requerido' })}
                                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition"
                                        />
                                        {errors.nombre && <p className="text-sm text-red-600 mt-1.5">{errors.nombre.message}</p>}
                                    </div>

                                    {/* Campo email */}
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Correo electrónico *
                                        </label>
                                        <input
                                            type="email"
                                            placeholder="correo@empresa.com"
                                            {...register('email', { required: 'El correo es requerido' })}
                                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition"
                                        />
                                        {errors.email && <p className="text-sm text-red-600 mt-1.5">{errors.email.message}</p>}
                                    </div>

                                    {/* Campo contraseña */}
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Contraseña *
                                        </label>
                                        <input
                                            type="password"
                                            placeholder="••••••••"
                                            {...register('contra', { required: 'La contraseña es requerida', minLength: { value: 6, message: 'Mínimo 6 caracteres' } })}
                                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition"
                                        />
                                        {errors.contra && <p className="text-sm text-red-600 mt-1.5">{errors.contra.message}</p>}
                                    </div>
                                </div>

                                {/* Columna derecha: Datos de la empresa */}
                                <div className="space-y-4 sm:space-y-5">
                                    <div className="pb-2 sm:pb-3 border-b-2 border-gray-200 bg-cyan-50 -mx-5 sm:-mx-0 px-5 sm:px-0 py-2 sm:py-0 sm:bg-transparent rounded-t-lg sm:rounded-none">
                                        <h3 className="text-base sm:text-lg font-bold text-gray-900 flex items-center gap-2">
                                            <svg className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                            </svg>
                                            Datos de la Empresa
                                        </h3>
                                    </div>

                                    {/* Campo nombre empresa */}
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Nombre de la empresa *
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="Empresa S.A."
                                            {...register('nombreEmpresa', { required: 'El nombre de la empresa es requerido' })}
                                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition"
                                        />
                                        {errors.nombreEmpresa && <p className="text-sm text-red-600 mt-1.5">{errors.nombreEmpresa.message}</p>}
                                    </div>

                                    {/* Campo RUT empresa */}
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            RUT de la empresa *
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="12.345.678-9"
                                            {...register('rutEmpresa', { required: 'El RUT es requerido' })}
                                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition"
                                        />
                                        {errors.rutEmpresa && <p className="text-sm text-red-600 mt-1.5">{errors.rutEmpresa.message}</p>}
                                    </div>

                                    {/* Campo dirección */}
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Dirección *
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="Calle 123, Comuna, Ciudad"
                                            {...register('direccionEmpresa', { required: 'La dirección es requerida' })}
                                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition"
                                        />
                                        {errors.direccionEmpresa && <p className="text-sm text-red-600 mt-1.5">{errors.direccionEmpresa.message}</p>}
                                    </div>
                                </div>
                            </div>

                            {/* Campo teléfono (ancho completo) */}
                            <div className="max-w-md mx-auto bg-gradient-to-r from-green-50 to-emerald-50 p-4 sm:p-5 rounded-xl border-2 border-green-200">
                                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                                    <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                    </svg>
                                    Teléfono de contacto *
                                </label>
                                <input
                                    type="text"
                                    placeholder="+56 9 1234 5678"
                                    {...register('telefonoContacto', { required: 'El teléfono es requerido' })}
                                    className="w-full px-4 py-3 border-2 border-green-300 rounded-xl focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 transition bg-white"
                                />
                                {errors.telefonoContacto && <p className="text-sm text-red-600 mt-1.5">{errors.telefonoContacto.message}</p>}
                            </div>

                            {/* Mensaje de éxito */}
                            {message && (
                                <div className="bg-green-50 border-l-4 border-green-500 p-3 sm:p-4 rounded-lg">
                                    <div className="flex items-center gap-2">
                                        <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <p className="text-sm text-green-700 font-medium">{message}</p>
                                    </div>
                                </div>
                            )}

                            {/* Botón de envío */}
                            <div className="flex justify-center pt-2 sm:pt-4">
                                <button
                                    type="submit"
                                    className="w-full max-w-md bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3.5 sm:py-4 rounded-xl font-bold text-base sm:text-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 active:scale-[0.98]"
                                >
                                    🏢 Crear Cuenta Empresarial
                                </button>
                            </div>
                        </form>

                        {/* Enlace a login */}
                        <div className="mt-6 sm:mt-8 pt-5 sm:pt-6 border-t border-gray-200">
                            <p className="text-center text-gray-600">
                                ¿Ya tienes cuenta?{' '}
                                <a href="/login" className="text-blue-600 hover:text-blue-700 font-semibold hover:underline">
                                    Inicia sesión aquí
                                </a>
                            </p>
                        </div>
                    </div>

                    {/* Información adicional */}
                    <div className="mt-6 text-center">
                        <p className="text-sm text-gray-500">
                            Tu cuenta será revisada en un plazo de 24-48 horas
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Register