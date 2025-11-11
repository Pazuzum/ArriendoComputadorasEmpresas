import React from "react";
import { useLocation, useParams, Link } from "react-router-dom";
import Header from "../componentes/Header.jsx";
import productosData from "./sampleProductos.js";

const ProductoDetalle = () => {
  const { state } = useLocation();
  const { id } = useParams();

  let producto = state?.producto;

  if (!producto) {
    // fallback: buscar en data local
    producto = productosData.find((p) => String(p.id) === String(id));
  }

  if (!producto) {
    return (
      <div>
        <Header />
        <main className="max-w-4xl mx-auto p-6">
          <p>Producto no encontrado.</p>
          <Link to="/catalogo" className="text-blue-600 underline">Volver al catálogo</Link>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-5xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow p-6 flex flex-col md:flex-row gap-6">
          <div className="md:w-1/2">
            <img src={producto.imgs[0]} alt={producto.nombre} className="w-full h-96 object-cover rounded" />
          </div>
          <div className="md:w-1/2">
            <h1 className="text-2xl font-bold">{producto.nombre}</h1>
            <p className="text-gray-700 mt-2">{producto.descripcion}</p>
            <p className="text-xl font-semibold text-blue-600 mt-4">Precio desde ${producto.precio}/día</p>
            <p className="text-sm text-gray-500 mt-2">Disponibilidad: {producto.disponibilidad ?? 'N/A'} unidades</p>

            <section className="mt-6">
              <h3 className="text-lg font-semibold">Especificaciones</h3>
              <ul className="list-disc list-inside mt-2 text-gray-700">
                {(producto.especificaciones || [
                  "CPU: Intel Core i5",
                  "RAM: 8GB",
                  "Almacenamiento: 256GB SSD",
                  "Sistema operativo: Windows 11",
                ]).map((spec, idx) => (
                  <li key={idx}>{spec}</li>
                ))}
              </ul>
            </section>

            <div className="mt-6 flex gap-4">
              <Link to="/cotizar" className="bg-blue-600 text-white px-4 py-2 rounded">Solicitar cotización</Link>
              <Link to="/catalogo" className="border px-4 py-2 rounded">Volver</Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProductoDetalle;
