/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState } from "react";

const CotizacionContext = createContext();

export const useCotizacion = () => {
  const ctx = useContext(CotizacionContext);
  if (!ctx) throw new Error("useCotizacion debe usarse dentro de CotizacionProvider");
  return ctx;
};

export const CotizacionProvider = ({ children }) => {
  const [items, setItems] = useState(() => {
    try {
      const raw = localStorage.getItem("cotizacion");
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("cotizacion", JSON.stringify(items));
  }, [items]);

  const addToQuote = (producto, cantidad = 1) => {
    const prodId = producto.id || producto._id;
    const withId = { ...producto, id: prodId };
    setItems((prev) => {
      const found = prev.find((p) => (p.id || p._id) === prodId);
      if (found) return prev.map((p) => (p.id || p._id) === prodId ? { ...p, qty: (p.qty || 0) + cantidad } : p);
      return [...prev, { ...withId, qty: cantidad }];
    });
  };

  const removeItem = (id) => setItems((prev) => prev.filter((p) => (p.id || p._id) !== id));

  const updateQty = (id, qty) => setItems((prev) => prev.map((p) => (p.id || p._id) === id ? { ...p, qty: Math.max(1, qty) } : p));

  const clear = () => setItems([]);

  const total = items.reduce((acc, it) => acc + (it.precio || 0) * (it.qty || 1), 0);

  return (
    <CotizacionContext.Provider value={{ items, addToQuote, removeItem, updateQty, clear, total }}>
      {children}
    </CotizacionContext.Provider>
  );
};

export default CotizacionContext;
