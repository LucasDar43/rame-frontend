'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';

import useCart from '@/hooks/useCart';
import CartItemRow from './components/CartItemRow';
import CartSummary from './components/CartSummary';

const tableColumns = '80px minmax(220px, 1fr) 96px 112px 120px 34px';
const tableMinWidth = '782px';

export default function CarritoPage() {
  const { items, updateCantidad, removeItem, clearCart, totalItems, totalPrecio } = useCart();
  const [isMobile, setIsMobile] = useState(false);
  const resizeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const updateIsMobile = () => {
      setIsMobile(window.innerWidth < 1100);
    };

    const handleResize = () => {
      if (resizeTimeoutRef.current !== null) {
        clearTimeout(resizeTimeoutRef.current);
      }

      resizeTimeoutRef.current = setTimeout(() => {
        updateIsMobile();
      }, 120);
    };

    updateIsMobile();
    window.addEventListener('resize', handleResize);

    return () => {
      if (resizeTimeoutRef.current !== null) {
        clearTimeout(resizeTimeoutRef.current);
      }

      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <main
      style={{
        marginTop: '62px',
        minHeight: '100vh',
        background: '#ffffff',
        padding: isMobile ? '52px 20px 40px' : '52px',
      }}
    >
      <section style={{ marginBottom: '40px' }}>
        <h1
          style={{
            margin: 0,
            fontFamily: 'var(--font-playfair)',
            fontSize: '34px',
            fontWeight: 700,
            letterSpacing: '-0.5px',
            color: 'var(--white)',
          }}
        >
          Tu carrito
        </h1>

        {items.length > 0 && (
          <p
            style={{
              margin: '8px 0 0',
              fontSize: '13px',
              color: 'var(--gray)',
            }}
          >
            {totalItems} producto(s) en tu carrito
          </p>
        )}
      </section>

      {items.length === 0 ? (
        <section
          style={{
            minHeight: 'calc(100vh - 260px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            padding: '20px 0 40px',
          }}
        >
          <div style={{ maxWidth: '420px' }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                color: 'var(--border2)',
              }}
            >
              <svg
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.4"
                aria-hidden="true"
              >
                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                <path d="M3 6h18" />
                <path d="M16 10a4 4 0 0 1-8 0" />
              </svg>
            </div>

            <p
              style={{
                margin: '20px 0 0',
                fontSize: '18px',
                fontWeight: 600,
                color: 'var(--white)',
              }}
            >
              {'Tu carrito est\u00e1 vac\u00edo'}
            </p>

            <p
              style={{
                margin: '10px 0 0',
                fontSize: '14px',
                color: 'var(--gray)',
                lineHeight: 1.6,
              }}
            >
              {'Explor\u00e1 nuestros productos y encontr\u00e1 lo que busc\u00e1s'}
            </p>

            <Link
              href="/productos"
              style={{
                display: 'inline-block',
                marginTop: '24px',
                background: '#111111',
                color: '#ffffff',
                padding: '12px 32px',
                fontSize: '11px',
                fontWeight: 600,
                letterSpacing: '2px',
                textTransform: 'uppercase',
                textDecoration: 'none',
                fontFamily: 'var(--font-dm-sans)',
              }}
            >
              {'Ver cat\u00e1logo'}
            </Link>
          </div>
        </section>
      ) : (
        <section
          style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : 'minmax(0, 1fr) 380px',
            gap: '52px',
            alignItems: 'start',
          }}
        >
          <div style={{ minWidth: 0 }}>
            <div style={{ overflowX: isMobile ? 'auto' : 'visible' }}>
              <div style={{ minWidth: tableMinWidth }}>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: tableColumns,
                    gap: '24px',
                    alignItems: 'end',
                    paddingBottom: '16px',
                    borderBottom: '2px solid var(--border)',
                    fontSize: '10px',
                    fontWeight: 600,
                    letterSpacing: '2px',
                    textTransform: 'uppercase',
                    color: 'var(--gray)',
                  }}
                >
                  <div style={{ gridColumn: 'span 2' }}>Producto</div>
                  <div>Precio</div>
                  <div>Cantidad</div>
                  <div>Subtotal</div>
                  <div />
                </div>

                {items.map((item) => (
                  <CartItemRow
                    key={item.varianteId}
                    item={item}
                    onUpdateCantidad={updateCantidad}
                    onRemove={removeItem}
                  />
                ))}
              </div>
            </div>
          </div>

          <div>
            <CartSummary
              totalItems={totalItems}
              totalPrecio={totalPrecio}
              onClearCart={clearCart}
            />
          </div>
        </section>
      )}
    </main>
  );
}
