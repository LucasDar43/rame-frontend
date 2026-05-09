'use client';

/* eslint-disable @next/next/no-img-element */

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';

import useCart from '@/hooks/useCart';
import CartItemRow from './components/CartItemRow';
import CartSummary from './components/CartSummary';

const tableColumns = '80px minmax(220px, 1fr) 96px 112px 120px 34px';
const tableMinWidth = '782px';

function formatPrice(value: number) {
  return `$${value.toLocaleString('es-AR')}`;
}

export default function CarritoPage() {
  const { items, updateCantidad, removeItem, clearCart, totalItems, totalPrecio } = useCart();
  const [isMobile, setIsMobile] = useState(false);
  const resizeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const updateIsMobile = () => {
      setIsMobile(window.innerWidth < 1024);
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
        padding: isMobile ? '16px' : '52px',
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
            {isMobile ? (
              <div style={{ display: 'grid', gap: '14px' }}>
                {items.map((item) => (
                  <article
                    key={item.varianteId}
                    style={{
                      border: '1px solid var(--border)',
                      background: '#ffffff',
                      padding: '14px',
                    }}
                  >
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '80px minmax(0, 1fr)',
                        gap: '14px',
                        alignItems: 'start',
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
                        <p
                          style={{
                            margin: '8px 0 0',
                            fontSize: '13px',
                            color: 'var(--light)',
                          }}
                        >
                          {formatPrice(item.precio)}
                        </p>
                      </div>
                    </div>

                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '12px',
                        marginTop: '14px',
                        paddingTop: '14px',
                        borderTop: '1px solid var(--border)',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                        }}
                      >
                        <button
                          type="button"
                          onClick={() => {
                            const nextCantidad = item.cantidad - 1;
                            if (nextCantidad <= 0) {
                              removeItem(item.varianteId);
                              return;
                            }
                            updateCantidad(item.varianteId, nextCantidad);
                          }}
                          aria-label={`Reducir cantidad de ${item.nombre}`}
                          style={{
                            width: '36px',
                            height: '36px',
                            border: '1px solid var(--border)',
                            background: 'transparent',
                            color: 'var(--white)',
                            cursor: 'pointer',
                            fontSize: '18px',
                            lineHeight: 1,
                          }}
                        >
                          -
                        </button>
                        <span
                          style={{
                            minWidth: '34px',
                            textAlign: 'center',
                            fontSize: '14px',
                            color: 'var(--white)',
                          }}
                        >
                          {item.cantidad}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateCantidad(item.varianteId, item.cantidad + 1)}
                          aria-label={`Aumentar cantidad de ${item.nombre}`}
                          style={{
                            width: '36px',
                            height: '36px',
                            border: '1px solid var(--border)',
                            background: 'transparent',
                            color: 'var(--white)',
                            cursor: 'pointer',
                            fontSize: '18px',
                            lineHeight: 1,
                          }}
                        >
                          +
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeItem(item.varianteId)}
                        aria-label={`Eliminar ${item.nombre} del carrito`}
                        style={{
                          height: '36px',
                          padding: '0 14px',
                          border: '1px solid var(--border)',
                          background: 'transparent',
                          color: 'var(--gray)',
                          cursor: 'pointer',
                          fontSize: '10px',
                          fontWeight: 600,
                          letterSpacing: '1.5px',
                          textTransform: 'uppercase',
                          fontFamily: 'var(--font-dm-sans)',
                        }}
                      >
                        Eliminar
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div style={{ overflowX: 'visible' }}>
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
            )}
          </div>

          <div
            style={{
              position: isMobile ? 'sticky' : 'static',
              bottom: isMobile ? 0 : undefined,
              height: 'auto',
              zIndex: isMobile ? 2 : undefined,
            }}
          >
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
