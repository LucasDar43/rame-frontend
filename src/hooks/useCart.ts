'use client';

import { useContext } from 'react';
import { CartContext } from '@/context/CartContext';

export default function useCart() {
  const context = useContext(CartContext);

  if (context === undefined) {
    throw new Error('useCart debe usarse dentro de CartProvider');
  }

  return context;
}
