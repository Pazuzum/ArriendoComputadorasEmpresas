/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState } from "react";

const CarritoContext = createContext();

export const useCarrito = () => {
  const ctx = useContext(CarritoContext);
  if (!ctx) throw new Error("useCarrito debe usarse dentro de CarritoProvider");
  return ctx;
};

export const CarritoProvider = ({ children }) => {
  const [items, setItems] = useState(() => {
    try {
      const raw = localStorage.getItem("carrito");
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("carrito", JSON.stringify(items));
  }, [items]);

  const addItem = (producto) => {
    setItems((prev) => {
      const found = prev.find((p) => p.id === producto.id);
      if (found) return prev.map((p) => p.id === producto.id ? { ...p, qty: p.qty + 1 } : p);
      return [...prev, { ...producto, qty: 1 }];
    });
  };

  const removeItem = (id) => setItems((prev) => prev.filter((p) => p.id !== id));

  const clear = () => setItems([]);

  const total = items.reduce((acc, it) => acc + (it.precio || 0) * (it.qty || 1), 0);

  return (
    <CarritoContext.Provider value={{ items, addItem, removeItem, clear, total }}>
      {children}
    </CarritoContext.Provider>
  );
};

export default CarritoContext;
