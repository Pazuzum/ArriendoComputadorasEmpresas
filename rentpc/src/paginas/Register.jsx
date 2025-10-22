import { useState } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "../context/authContext.jsx";

import Header from "../componentes/header.jsx";

const Register = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const { signup } = useAuth();
    const [message, setMessage] = useState("");

    const onSubmit = async (data) => {
        const res = await signup(data);
        setMessage(res.message || "");
        // Limpiar el formulario después del registro sólo si fue exitoso
        if (res.success) {
            document.querySelector("form").reset();
            // Redirigir al login
            setTimeout(() => {
                window.location.href = "/login";
            }, 3000);
        }
    };

    return (
        <div >
            <Header />
            <div className="mt-10">
                <section className="min-h-screen flex items-center justify-center bg-gray-50">
                    <div className="bg-white shadow-lg rounded-2xl w-full max-w-4xl p-8">
                        <h2 className="text-3xl font-bold text-gray-800 text-center mb-4">
                            Crear Cuenta
                        </h2>
                        {/* Formulario de registro */}
                        <p className="text-sm text-gray-600 mb-6">Nota: Solo se admiten cuentas de empresas. Por favor complete los datos de su empresa para que un administrador pueda validar su solicitud.</p>
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Izquierda: datos de la cuenta */}
                                <div className="space-y-4">
                                    <label className="text-sm font-medium text-gray-700">Datos de la cuenta</label>
                                    <div>
                                        <input
                                            type="text"
                                            placeholder="Nombre"
                                            {...register("nombre", { required: 'El nombre es requerido' })}
                                            className="w-full px-4 py-3 border rounded-lg"
                                        />
                                        {errors.nombre && <p className="text-sm text-red-600 mt-1">{errors.nombre.message}</p>}
                                    </div>
                                    <div>
                                        <input
                                            type="email"
                                            placeholder="Correo"
                                            {...register("email", { required: 'El correo es requerido' })}
                                            className="w-full px-4 py-3 border rounded-lg"
                                        />
                                        {errors.email && <p className="text-sm text-red-600 mt-1">{errors.email.message}</p>}
                                    </div>
                                    <div>
                                        <input
                                            type="password"
                                            placeholder="Contraseña"
                                            {...register("contra", { required: 'La contraseña es requerida' })}
                                            className="w-full px-4 py-3 border rounded-lg"
                                        />
                                        {errors.contra && <p className="text-sm text-red-600 mt-1">{errors.contra.message}</p>}
                                    </div>
                                </div>

                                {/* Derecha: datos de la empresa */}
                                <div className="space-y-4">
                                    <label className="text-sm font-medium text-gray-700">Datos de la empresa</label>
                                    <input
                                        type="text"
                                        placeholder="Nombre de la empresa"
                                        {...register("nombreEmpresa", { required: 'El nombre de la empresa es requerido' })}
                                        className="w-full px-4 py-3 border rounded-lg"
                                    />
                                    <div>
                                        <input
                                            type="text"
                                            placeholder="RUT de la empresa"
                                            {...register("rutEmpresa", { required: 'El RUT de la empresa es requerido' })}
                                            className="w-full px-4 py-3 border rounded-lg"
                                        />
                                        {errors.rutEmpresa && <p className="text-sm text-red-600 mt-1">{errors.rutEmpresa.message}</p>}
                                    </div>
                                    <div>
                                        <input
                                            type="text"
                                            placeholder="Dirección de la empresa"
                                            {...register("direccionEmpresa", { required: 'La dirección de la empresa es requerida' })}
                                            className="w-full px-4 py-3 border rounded-lg"
                                        />
                                        {errors.direccionEmpresa && <p className="text-sm text-red-600 mt-1">{errors.direccionEmpresa.message}</p>}
                                    </div>
                                </div>
                            </div>

                            {/* Teléfono de contacto (empresa) colocado encima del botón para alineación */}
                            <div className="flex justify-center">
                                <div className="w-full md:w-1/2">
                                    <input
                                        type="text"
                                        placeholder="Teléfono de contacto (empresa)"
                                        {...register("telefonoContacto", { required: 'El teléfono de contacto es requerido' })}
                                        className="w-full px-4 py-3 border rounded-lg"
                                    />
                                    {errors.telefonoContacto && <p className="text-sm text-red-600 mt-1">{errors.telefonoContacto.message}</p>}
                                </div>
                            </div>

                            <div className="flex justify-center">
                                <button
                                    type="submit"
                                    className="w-full md:w-1/2 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
                                >
                                    Registrarme
                                </button>
                            </div>
                        </form>
                        {/* Mensajes de éxito o error */}
                        {message && (
                            <p className="text-center text-green-600 font-medium mt-4">{message}</p>
                        )}

                        <p className="text-center text-gray-600 mt-6">
                        ¿Ya tienes cuenta?{" "}
                        <a href="/login" className="text-blue-600 hover:underline">
                            Inicia sesión aquí
                        </a>
                        </p>
                    </div>
                </section>
            </div>
        </div>
        
    );
};

export default Register;