'use client';

/* eslint-disable @next/next/no-img-element */

import type { CSSProperties, MouseEvent } from 'react';

import type { CartItem } from '@/context/CartContext';

interface CartItemRowProps {
  item: CartItem;
  onUpdateCantidad: (varianteId: number, cantidad: number) => void;
  onRemove: (varianteId: number) => void;
}

const rowColumns = '80px minmax(220px, 1fr) 96px 112px 120px 34px';

const labelStyle: CSSProperties = {
  margin: 0,
  fontSize: '10px',
  fontWeight: 600,
  letterSpacing: '2px',
  textTransform: 'uppercase',
  color: 'var(--gray)',
};

const blockStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
};

function formatPrice(value: number) {
  return `$${value.toLocaleString('es-AR')}`;
}

function handleTrashHover(event: MouseEvent<HTMLButtonElement>) {
  event.currentTarget.style.color = '#cc3333';
  event.currentTarget.style.borderColor = '#cc3333';
}

function handleTrashLeave(event: MouseEvent<HTMLButtonElement>) {
  event.currentTarget.style.color = 'var(--gray)';
  event.currentTarget.style.borderColor = 'var(--border)';
}

export default function CartItemRow({
  item,
  onUpdateCantidad,
  onRemove,
}: CartItemRowProps) {
  const subtotal = item.precio * item.cantidad;

  const handleDecrease = () => {
    const nextCantidad = item.cantidad - 1;

    if (nextCantidad <= 0) {
      onRemove(item.varianteId);
      return;
    }

    onUpdateCantidad(item.varianteId, nextCantidad);
  };

  const handleIncrease = () => {
    onUpdateCantidad(item.varianteId, item.cantidad + 1);
  };

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: rowColumns,
        alignItems: 'center',
        gap: '24px',
        padding: '20px 0',
        borderBottom: '1px solid var(--border)',
      }}
    >
      {item.imagenUrl ? (
        <img
          src={item.imagenUrl}
          alt={item.nombre}
          style={{
            width: '80px',
            height: '80px',
            objectFit: 'cover',
            display: 'block',
            border: '1px solid var(--border)',
            background: 'var(--card)',
          }}
        />
      ) : (
        <div
          style={{
            width: '80px',
            height: '80px',
            border: '1px solid var(--border)',
            background: 'var(--card)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--border2)',
          }}
        >
          <svg
            width="30"
            height="30"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.2"
            aria-hidden="true"
          >
            <path d="M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.57a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.57a2 2 0 0 0-1.34-2.23Z" />
          </svg>
        </div>
      )}

      <div style={{ minWidth: 0 }}>
        <p
          style={{
            margin: 0,
            fontSize: '10px',
            fontWeight: 600,
            letterSpacing: '2px',
            textTransform: 'uppercase',
            color: 'var(--gray)',
          }}
        >
          {item.marca}
        </p>

        <p
          style={{
            margin: '6px 0 0',
            fontSize: '14px',
            fontWeight: 600,
            color: 'var(--white)',
            fontFamily: 'var(--font-dm-sans)',
            lineHeight: 1.35,
          }}
        >
          {item.nombre}
        </p>

        <p
          style={{
            margin: '6px 0 0',
            fontSize: '12px',
            color: 'var(--gray)',
            lineHeight: 1.4,
          }}
        >
          Talle: {item.talle} {'\u00b7'} Color: {item.color}
        </p>
      </div>

      <div style={blockStyle}>
        <p style={labelStyle}>Precio</p>
        <p
          style={{
            margin: 0,
            fontSize: '13px',
            color: 'var(--light)',
          }}
        >
          {formatPrice(item.precio)}
        </p>
      </div>

      <div style={blockStyle}>
        <p style={labelStyle}>Cantidad</p>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <button
            type="button"
            onClick={handleDecrease}
            aria-label={`Reducir cantidad de ${item.nombre}`}
            style={{
              width: '28px',
              height: '28px',
              border: '1px solid var(--border)',
              background: 'transparent',
              color: 'var(--white)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '16px',
              lineHeight: 1,
            }}
          >
            -
          </button>

          <span
            style={{
              minWidth: '32px',
              textAlign: 'center',
              fontSize: '14px',
              color: 'var(--white)',
            }}
          >
            {item.cantidad}
          </span>

          <button
            type="button"
            onClick={handleIncrease}
            aria-label={`Aumentar cantidad de ${item.nombre}`}
            style={{
              width: '28px',
              height: '28px',
              border: '1px solid var(--border)',
              background: 'transparent',
              color: 'var(--white)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '16px',
              lineHeight: 1,
            }}
          >
            +
          </button>
        </div>
      </div>

      <div style={blockStyle}>
        <p style={labelStyle}>Subtotal</p>
        <p
          style={{
            margin: 0,
            fontSize: '14px',
            fontWeight: 700,
            color: 'var(--white)',
            fontFamily: 'var(--font-playfair)',
          }}
        >
          {formatPrice(subtotal)}
        </p>
      </div>

      <button
        type="button"
        onClick={() => onRemove(item.varianteId)}
        onMouseEnter={handleTrashHover}
        onMouseLeave={handleTrashLeave}
        onFocus={handleTrashHover}
        onBlur={handleTrashLeave}
        aria-label={`Eliminar ${item.nombre} del carrito`}
        style={{
          width: '34px',
          height: '34px',
          border: '1px solid var(--border)',
          background: 'transparent',
          color: 'var(--gray)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'color 0.2s ease, border-color 0.2s ease',
        }}
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.7"
          aria-hidden="true"
        >
          <path d="M3 6h18" />
          <path d="M8 6V4h8v2" />
          <path d="M19 6l-1 14H6L5 6" />
          <path d="M10 11v6" />
          <path d="M14 11v6" />
        </svg>
      </button>
    </div>
  );
}
