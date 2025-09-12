import { useState } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "../context/authContext.jsx";

import Header from "../componentes/header.jsx";

const Register = () => {
    const { register, handleSubmit } = useForm();
    const { signup } = useAuth();
    const [message, setMessage] = useState("");

    const onSubmit = async (data) => {
        const res = await signup(data);
        setMessage(res.message || "Tu cuenta fue creada con éxito, un administrador debe activarla para poder iniciar sesión.");
        //Limpiar el formulario después del registro
        if (!res.message) {
            document.querySelector("form").reset();
        }
    };

    return (
        <div >
            <Header />
            <div className="mt-10">
                <section className="min-h-screen flex items-center justify-center bg-gray-50">
                    <div className="bg-white shadow-lg rounded-2xl w-full max-w-md p-8">
                        <h2 className="text-3xl font-bold text-gray-800 text-center mb-4">
                            Crear Cuenta
                        </h2>
                        {/* Formulario de registro */}
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                            <input
                                type="text"
                                placeholder="Nombre"
                                {...register("nombre", { required: true })}
                                className="w-full px-4 py-3 border rounded-lg"
                            />
                            <input
                                type="email"
                                placeholder="Correo"
                                {...register("email", { required: true })}
                                className="w-full px-4 py-3 border rounded-lg"
                            />
                            <input
                                type="password"
                                placeholder="Contraseña"
                                {...register("contra", { required: true })}
                                className="w-full px-4 py-3 border rounded-lg"
                            />
                            <input
                                type="text"
                                placeholder="Dirección"
                                {...register("direccion", { required: true })}
                                className="w-full px-4 py-3 border rounded-lg"
                            />
                            <input
                                type="text"
                                placeholder="Teléfono"
                                {...register("telefono", { required: true })}
                                className="w-full px-4 py-3 border rounded-lg"
                            />

                            <button
                                type="submit"
                                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
                            >
                                Registrarme
                            </button>
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