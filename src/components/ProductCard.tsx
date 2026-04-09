'use client';

import Link from 'next/link';

import { Producto } from '@/types';

interface ProductCardProps {
  producto: Producto;
}

export default function ProductCard({ producto }: ProductCardProps) {
  return (
    <div
      style={{
        background: 'var(--card)',
        cursor: 'pointer',
        overflow: 'hidden',
      }}
    >
      <Link
        href={`/productos/${producto.id}`}
        style={{
          display: 'block',
          textDecoration: 'none',
          color: 'inherit',
        }}
      >
        {producto.imagenUrl ? (
          <img
            src={producto.imagenUrl}
            alt={producto.nombre}
            style={{
              width: '100%',
              height: '300px',
              objectFit: 'cover',
              display: 'block',
            }}
          />
        ) : (
          <div
            style={{
              height: '300px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'var(--card)',
            }}
          >
            <svg
              width="88"
              height="88"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#cccccc"
              strokeWidth="1.2"
              opacity={0.3}
            >
              <path d="M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.57a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.57a2 2 0 0 0-1.34-2.23Z" />
            </svg>
          </div>
        )}

        <div style={{ padding: '18px' }}>
          <div
            style={{
              fontSize: '9px',
              fontWeight: 600,
              letterSpacing: '3px',
              textTransform: 'uppercase',
              color: 'var(--gray)',
              marginBottom: '6px',
            }}
          >
            {producto.marca}
          </div>

          <div
            style={{
              fontFamily: 'var(--font-playfair)',
              fontWeight: 700,
              fontSize: '17px',
              color: 'var(--white)',
              marginBottom: '10px',
              lineHeight: 1.2,
            }}
          >
            {producto.nombre}
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingTop: '14px',
              borderTop: '1px solid var(--border)',
              gap: '12px',
            }}
          >
            <span
              style={{
                fontFamily: 'var(--font-playfair)',
                fontWeight: 700,
                fontSize: '19px',
                color: 'var(--white)',
              }}
            >
              ${producto.precio.toLocaleString('es-AR')}
            </span>

            <span
              style={{
                background: 'transparent',
                border: '1px solid var(--border)',
                color: 'var(--light)',
                padding: '7px 14px',
                fontSize: '10px',
                fontWeight: 500,
                letterSpacing: '1.5px',
                textTransform: 'uppercase',
                cursor: 'pointer',
                fontFamily: 'var(--font-dm-sans)',
                whiteSpace: 'nowrap',
              }}
            >
              Ver producto
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
}
