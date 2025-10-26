import ProductCard from "../componentes/CardProduc.jsx";
import Header from "../componentes/header.jsx";

import { useState, useEffect } from "react";
import { getProductos } from "../api/productos.js";

const Catalogo = () => {
    const [productosState, setProductosState] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchProductos = async () => {
        setLoading(true);
        try {
            const res = await getProductos();
            const list = (res.data.productos || []).map(p => ({ ...p, id: p._id, imgs: p.imgs && p.imgs.length ? p.imgs : ["https://via.placeholder.com/600x400?text=Sin+imagen"] }));
            list.sort((a,b) => (a.nombre || '').localeCompare(b.nombre || ''));
            setProductosState(list);
        } catch (e) {
            console.error('Error fetching productos', e);
        } finally { setLoading(false); }
    };

    useEffect(()=>{ fetchProductos(); }, []);

    const handleReserve = (productId, quantity = 1) => {
        setProductosState((prev) =>
            prev.map((p) => {
                if (p.id !== productId) return p;
                const nuevaDisp = Math.max(0, (p.disponibilidad ?? 0) - quantity);
                return { ...p, disponibilidad: nuevaDisp };
            })
        );
    };

    return (
        <div>
            <Header />
        <div>
            {/* Hero Section */}
            <div className="bg-gray-50 min-h-screen py-10">
                
                <div className="text-center mb-16 px-6">
                    <h2 className="text-4xl md:text-5xl font-extrabold text-gray-800">
                        Equipos a Cotizar
                    </h2>
                    <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
                        Selecciona el tipo de equipo que se ajusta a tus necesidades y solicita una cotización.
                    </p>
                </div>

                                {loading && (
                                    <div className="container mx-auto px-6 mb-6 text-center text-gray-600">Cargando productos…</div>
                                )}
                                <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-10">
                    {productosState.map((p) => (
                    <ProductCard key={p.id} producto={p} onReserve={(qty)=> handleReserve(p.id, qty)} />
                    ))}
                </div>
                
                <div className="container mx-auto px-6 mt-10 text-center">
                    <a href="/cotizar" className="inline-block bg-sky-600 text-white px-6 py-3 rounded-md font-semibold hover:bg-sky-700">Ir a la cotización</a>
                </div>
            </div>
        </div>
        </div>
    );
};

export default Catalogo;
