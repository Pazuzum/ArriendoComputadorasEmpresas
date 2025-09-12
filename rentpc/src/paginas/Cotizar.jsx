import React, { useState } from 'react';
import Header from '../componentes/header';


const CotizarForm = () => {
    const [formData, setFormData] = useState({
        'company-name': '',
        'contact-name': '',
        email: '',
        phone: '',
        products: '',
        budget: '',
        comments: '',
    });
    const [successMessage, setSuccessMessage] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({ ...prevData, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setSuccessMessage(true);
        console.log('Formulario de cotización enviado:', formData);
        
        setFormData({
            'company-name': '',
            'contact-name': '',
            email: '',
            phone: '',
            products: '',
            budget: '',
            comments: '',
        });
        
        // Oculta el mensaje de éxito después de 5 segundos
        setTimeout(() => setSuccessMessage(false), 5000);
    };

    return (
        <div>
            <Header />
            <div className="flex justify-center pt-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-50 to-white">
                <div className="bg-white p-8 md:p-12 rounded-2xl shadow-2xl w-full max-w-2xl border-t-4 border-blue-600">
                <div className="text-center mb-10">
                    <h1 className="text-3xl md:text-4xl font-extrabold text-gray-800 mb-2">Solicita una Cotización</h1>
                    <p className="text-gray-500 text-lg">Completa el formulario y nos pondremos en contacto contigo a la brevedad.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Nombre de la Empresa */}
                    <div>
                        <label htmlFor="company-name" className="block text-gray-700 text-sm font-semibold mb-2">Nombre de la Empresa</label>
                        <input
                            type="text" id="company-name" name="company-name"
                            placeholder="Nombre completo de tu empresa"
                            required
                            value={formData['company-name']} onChange={handleChange}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                        />
                    </div>

                    {/* Nombre del Contacto */}
                    <div>
                    <label htmlFor="contact-name" className="block text-gray-700 text-sm font-semibold mb-2">Nombre del Contacto</label>
                    <input
                        type="text" id="contact-name" name="contact-name"
                        placeholder="Tu nombre"
                        required
                        value={formData['contact-name']} onChange={handleChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                    />
                    </div>

                    {/* Correo y Teléfono */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="email" className="block text-gray-700 text-sm font-semibold mb-2">Correo Electrónico</label>
                            <input
                            type="email" id="email" name="email"
                            placeholder="contacto@empresa.com"
                            required
                            value={formData.email} onChange={handleChange}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                            />
                        </div>
                        <div>
                            <label htmlFor="phone" className="block text-gray-700 text-sm font-semibold mb-2">Número de Teléfono</label>
                            <input
                            type="tel" id="phone" name="phone"
                            placeholder="+56 9 1234 5678"
                            required
                            value={formData.phone} onChange={handleChange}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                            />
                        </div>
                    </div>

                    {/* Productos o Servicios */}
                    <div>
                        <label htmlFor="products" className="block text-gray-700 text-sm font-semibold mb-2">Productos o Servicios de Interés</label>
                        <textarea
                            id="products" name="products" rows="4"
                            placeholder="Describe brevemente los productos o servicios que te interesan..."
                            required
                            value={formData.products} onChange={handleChange}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 resize-none"
                        ></textarea>
                    </div>

                    {/* Presupuesto */}
                    <div>
                        <label htmlFor="budget" className="block text-gray-700 text-sm font-semibold mb-2">Presupuesto Estimado</label>
                        <select
                            id="budget" name="budget" required
                            value={formData.budget} onChange={handleChange}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                        >
                            <option value="" disabled>Selecciona un rango de presupuesto</option>
                            <option value="menos_de_5k">Menos de $5,000</option>
                            <option value="5k-10k">$5,000 - $10,000</option>
                            <option value="10k-25k">$10,000 - $25,000</option>
                            <option value="mas_de_25k">$25,000 o más</option>
                            <option value="no_especificado">No estoy seguro/a aún</option>
                        </select>
                    </div>

                    {/* Comentarios Adicionales */}
                    <div>
                        <label htmlFor="comments" className="block text-gray-700 text-sm font-semibold mb-2">Comentarios Adicionales</label>
                        <textarea
                            id="comments" name="comments" rows="3"
                            placeholder="Ingresa cualquier detalle adicional que consideres importante..."
                            value={formData.comments} onChange={handleChange}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 resize-none"
                        ></textarea>
                    </div>

                    {/* Botón */}
                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-200"
                        >
                        Enviar Solicitud
                    </button>
                </form>

                {/* Mensaje de éxito */}
                {successMessage && (
                    <div className="mt-8 text-center bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg animate-fadeIn">
                        <p className="font-semibold text-lg">¡Solicitud enviada con éxito!</p>
                        <p>Gracias por contactarnos. Tu solicitud será revisada por un administrador.</p>
                    </div>
                )}
                </div>
            </div>
        </div>
        );
};

export default CotizarForm;