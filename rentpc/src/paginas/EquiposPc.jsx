import ProductCard from "../componentes/CardProduc.jsx";
import Header from "../componentes/header.jsx";


import { useState } from "react";

const initialProductos = [
    {
        id: 1,
        nombre: "NOTEBOOK DELL CORE I5",
        descripcion: "8GB RAM, 256GB SSD, Windows 11",
        precio: 45000,
        imgs: [
            "https://media.falabella.com/falabellaCL/135678583_01/w=100,h=100,fit=pad",
            "https://media.falabella.com/falabellaCL/135678583_02/w=100,h=100,fit=pad",
            "https://media.falabella.com/falabellaCL/135678583_03/w=100,h=100,fit=pad",
            "https://media.falabella.com/falabellaCL/135678583_04/w=100,h=100,fit=pad",
            "https://media.falabella.com/falabellaCL/135678583_05/w=100,h=100,fit=pad",
        ],
        disponibilidad: 40,
    },
    {
        id: 2,
        nombre: "NOTEBOOK HP",
        descripcion: "8GB RAM, 256GB SSD, Windows 11",
        precio: 40000,
        imgs: [
            "https://media.falabella.com/falabellaCL/113288081_01/w=100,h=100,fit=pad",
        ],
        disponibilidad: 40,
    },
    {
        id: 3,
        nombre: "TORRE GAMING",
        descripcion: "16GB RAM, 1TB SSD, Windows 11",
        precio: 65000,
        imgs: [
            "https://media.falabella.com/falabellaCL/135678583_01/w=100,h=100,fit=pad",
        ],
        disponibilidad: 40,
    },
];



const Catalogo = () => {
    const [productosState, setProductosState] = useState(initialProductos);

    const handleReserve = (productId, quantity = 1) => {
        setProductosState((prev) =>
            prev.map((p) => {
                if (p.id !== productId) return p;
                const nuevaDisp = Math.max(0, (p.disponibilidad ?? 40) - quantity);
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
