'use client';

import type { CSSProperties } from 'react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import useCart from '@/hooks/useCart';

const layoutStyle: CSSProperties = {
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: '#ffffff',
  padding: '24px',
};

const cardStyle: CSSProperties = {
  maxWidth: '480px',
  width: '100%',
  background: 'var(--card)',
  border: '1px solid var(--border)',
  padding: '48px 40px',
  textAlign: 'center',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '16px',
};

const primaryButtonStyle: CSSProperties = {
  background: '#111111',
  color: '#ffffff',
  border: 'none',
  padding: '12px 32px',
  fontSize: '12px',
  fontWeight: 600,
  letterSpacing: '1.5px',
  textTransform: 'uppercase',
  cursor: 'pointer',
  fontFamily: 'var(--font-dm-sans)',
};

const secondaryButtonStyle: CSSProperties = {
  ...primaryButtonStyle,
  background: 'transparent',
  border: '1px solid var(--border)',
  color: 'var(--white)',
};

export default function CheckoutExitosoPage() {
  const router = useRouter();
  const { clearCart } = useCart();
  const [orderId, setOrderId] = useState<string | null>(null);

  useEffect(() => {
    clearCart();

    if (typeof window !== 'undefined') {
      const id = localStorage.getItem('lastOrderId');
      setOrderId(id);
    }
  }, []);

  return (
    <main style={layoutStyle}>
      <section style={cardStyle}>
        <svg
          width="72"
          height="72"
          viewBox="0 0 72 72"
          fill="none"
          aria-hidden="true"
        >
          <circle cx="36" cy="36" r="35" fill="#16a34a" fillOpacity="0.12" />
          <circle cx="36" cy="36" r="27" stroke="#16a34a" strokeWidth="2.5" />
          <path
            d="M24 36.5 32 44.5 48 28.5"
            stroke="#16a34a"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>

        <h1
          style={{
            margin: 0,
            fontFamily: 'var(--font-playfair)',
            fontSize: '32px',
            lineHeight: 1.1,
            color: 'var(--white)',
          }}
        >
          ¡Pago realizado con éxito!
        </h1>

        <p
          style={{
            margin: 0,
            fontSize: '14px',
            lineHeight: 1.7,
            color: 'var(--gray)',
            fontFamily: 'var(--font-dm-sans)',
          }}
        >
          Gracias por tu compra. En breve recibirás un email con los detalles.
        </p>

        {orderId ? (
          <p
            style={{
              margin: 0,
              fontSize: '13px',
              lineHeight: 1.6,
              color: 'var(--gray)',
              fontFamily: 'var(--font-dm-sans)',
            }}
          >
            Número de orden: #{orderId}
          </p>
        ) : null}

        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '12px',
            flexWrap: 'wrap',
            marginTop: '8px',
          }}
        >
          <button type="button" style={primaryButtonStyle} onClick={() => router.push('/')}>
            Volver al inicio
          </button>
          <button
            type="button"
            style={secondaryButtonStyle}
            onClick={() => router.push('/productos')}
          >
            Ver productos
          </button>
        </div>
      </section>
    </main>
  );
}
