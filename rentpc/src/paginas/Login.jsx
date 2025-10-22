import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useAuth } from "../context/authContext.jsx";
import { useState } from "react";

import Header from "../componentes/header.jsx";

const Login = () => {
    const { register, handleSubmit } = useForm();
    const { signin } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState("");

    const onSubmit =  async (data) => {
        setError("");
        try {
            const res = await signin(data);
            if (res?.success) {
                document.querySelector("form").reset();
                navigate("/");
            } else {
                setError(res?.message || "Error al iniciar sesión");
            }
        } catch (err) {
            console.error("Error en onSubmit login:", err);
            setError("Error al iniciar sesión");
        }
    };

    
    // JSX del formulario de login
    return (
        <div>
            <Header />
            <div className="mt-10">
                <section className="min-h-screen flex items-center justify-center bg-gray-50">
                    <div className="bg-white shadow-lg rounded-2xl w-full max-w-md p-8">
                        <h2 className="text-3xl font-bold text-gray-800 text-center mb-4">
                            Iniciar Sesión
                        </h2>
                        <p className="text-gray-600 text-center mb-8">
                            Accede a tu cuenta para cotizar y gestionar tus equipos
                        </p>
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                            <div>
                                <label className="block text-left text-gray-700 mb-2">Correo</label>
                                <input
                                type="email"
                                {...register("email", { required: true })}
                                placeholder="ejemplo@email.com"
                                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                                />
                            </div>
                            <div>
                                <label className="block text-left text-gray-700 mb-2">Contraseña</label>
                                <input
                                type="password"
                                {...register("contra", { required: true })}
                                placeholder="********"
                                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                                />
                            </div>

                            {error && (
                                <p className="text-center text-red-600 font-medium">{error}</p>
                            )}

                            <button
                                type="submit"
                                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
                            >
                                Ingresar
                            </button>
                        </form>
                        <p className="text-center text-gray-600 mt-6">
                                ¿No tienes cuenta?{" "}
                            <Link to="/register" className="text-blue-600 hover:underline">
                                Regístrate aquí
                            </Link>
                        </p>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default Login;