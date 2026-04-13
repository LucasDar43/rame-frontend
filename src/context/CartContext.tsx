'use client';

import { createContext, useEffect, useMemo, useState } from 'react';

export interface CartItem {
  productoId: number;
  varianteId: number;
  nombre: string;
  marca: string;
  imagenUrl?: string;
  talle: string;
  color: string;
  precio: number;
  cantidad: number;
}

interface CartContextValue {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (varianteId: number) => void;
  updateCantidad: (varianteId: number, cantidad: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrecio: number;
}

interface CartProviderProps {
  children: React.ReactNode;
}

const STORAGE_KEY = 'rame_cart';

export const CartContext = createContext<CartContextValue | undefined>(undefined);

export function CartProvider({ children }: CartProviderProps) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    try {
      const storedCart = window.localStorage.getItem(STORAGE_KEY);

      if (storedCart) {
        const parsedCart = JSON.parse(storedCart) as CartItem[];

        if (Array.isArray(parsedCart)) {
          setItems(parsedCart);
        }
      }
    } catch {
      setItems([]);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (!isLoaded || typeof window === 'undefined') {
      return;
    }

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items, isLoaded]);

  const addItem = (item: CartItem) => {
    if (item.cantidad <= 0) {
      return;
    }

    setItems((currentItems) => {
      const existingItem = currentItems.find(
        (currentItem) => currentItem.varianteId === item.varianteId
      );

      if (existingItem) {
        return currentItems.map((currentItem) =>
          currentItem.varianteId === item.varianteId
            ? { ...currentItem, cantidad: currentItem.cantidad + item.cantidad }
            : currentItem
        );
      }

      return [...currentItems, item];
    });
  };

  const removeItem = (varianteId: number) => {
    setItems((currentItems) =>
      currentItems.filter((item) => item.varianteId !== varianteId)
    );
  };

  const updateCantidad = (varianteId: number, cantidad: number) => {
    if (cantidad <= 0) {
      removeItem(varianteId);
      return;
    }

    setItems((currentItems) =>
      currentItems.map((item) =>
        item.varianteId === varianteId ? { ...item, cantidad } : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const totalItems = useMemo(
    () => items.reduce((total, item) => total + item.cantidad, 0),
    [items]
  );

  const totalPrecio = useMemo(
    () => items.reduce((total, item) => total + item.precio * item.cantidad, 0),
    [items]
  );

  const value: CartContextValue = {
    items,
    addItem,
    removeItem,
    updateCantidad,
    clearCart,
    totalItems,
    totalPrecio,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
