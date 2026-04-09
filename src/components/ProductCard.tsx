import Link from 'next/link';

import { Producto } from '@/types';

interface ProductCardProps {
  producto: Producto;
}

export default function ProductCard({ producto }: ProductCardProps) {
  return (
    <Link
      href={`/productos/${producto.id}`}
      style={{ textDecoration: 'none', color: 'inherit' }}
    >
      <div style={{
        background: 'var(--card)',
        position: 'relative',
        cursor: 'pointer',
        overflow: 'hidden',
      }}>
        <div style={{ height: '300px', position: 'relative', overflow: 'hidden' }}>
          {producto.imagenUrl ? (
            <img
              src={producto.imagenUrl}
              alt={producto.nombre}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                display: 'block',
              }}
            />
          ) : (
            <div style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(145deg, #141414, #1e1e1e)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <svg
                width="72"
                height="72"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#000000"
                strokeWidth="0.6"
                opacity={0.08}
              >
                <path d="M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.57a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.57a2 2 0 0 0-1.34-2.23z" />
              </svg>
            </div>
          )}

          {producto.activo && (
            <span style={{
              position: 'absolute',
              top: '14px',
              left: '14px',
              zIndex: 2,
              fontSize: '9px',
              fontWeight: 700,
              letterSpacing: '2px',
              textTransform: 'uppercase',
              padding: '4px 10px',
              background: 'var(--white)',
              color: '#000000',
            }}>
              Nuevo
            </span>
          )}
        </div>

        <div style={{ padding: '18px 18px 20px' }}>
          <div style={{
            fontSize: '9px',
            fontWeight: 600,
            letterSpacing: '3px',
            textTransform: 'uppercase',
            color: 'var(--gray)',
            marginBottom: '5px',
          }}>
            {producto.marca}
          </div>

          <div style={{
            fontFamily: 'var(--font-playfair)',
            fontWeight: 700,
            fontSize: '17px',
            color: 'var(--white)',
            marginBottom: '10px',
            lineHeight: 1.2,
          }}>
            {producto.nombre}
          </div>

          <div style={{ display: 'flex', gap: '4px', marginBottom: '14px', flexWrap: 'wrap' }}>
            {['S', 'M', 'L', 'XL'].map((talle) => (
              <span
                key={talle}
                style={{
                  fontSize: '10px',
                  fontWeight: 500,
                  color: 'var(--gray)',
                  border: '1px solid var(--border)',
                  padding: '2px 7px',
                  letterSpacing: '0.5px',
                  cursor: 'pointer',
                }}
              >
                {talle}
              </span>
            ))}
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingTop: '14px',
            borderTop: '1px solid var(--border)',
          }}>
            <span style={{
              fontFamily: 'var(--font-playfair)',
              fontWeight: 700,
              fontSize: '19px',
              color: 'var(--white)',
            }}>
              ${producto.precio.toLocaleString('es-AR')}
            </span>

            <button
              type="button"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                background: 'transparent',
                border: '1px solid var(--border)',
                color: 'var(--light)',
                padding: '7px 14px',
                fontFamily: 'var(--font-dm-sans)',
                fontSize: '10px',
                fontWeight: 500,
                letterSpacing: '1.5px',
                textTransform: 'uppercase',
                cursor: 'pointer',
              }}
            >
              <svg
                width="11"
                height="11"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              Agregar
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}
