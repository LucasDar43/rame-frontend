'use client';

import type { CSSProperties } from 'react';
import { useRouter } from 'next/navigation';

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

export default function CheckoutFallidoPage() {
  const router = useRouter();

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
          <circle cx="36" cy="36" r="35" fill="#dc2626" fillOpacity="0.12" />
          <circle cx="36" cy="36" r="27" stroke="#dc2626" strokeWidth="2.5" />
          <path
            d="M28.5 28.5 43.5 43.5"
            stroke="#dc2626"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          <path
            d="M43.5 28.5 28.5 43.5"
            stroke="#dc2626"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
        </svg>

        <h1
          style={{
            margin: 0,
            fontFamily: 'var(--font-playfair)',
            fontSize: '28px',
            lineHeight: 1.15,
            color: 'var(--white)',
          }}
        >
          El pago no pudo completarse
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
          Hubo un problema al procesar tu pago. Podés intentarlo nuevamente.
        </p>

        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '12px',
            flexWrap: 'wrap',
            marginTop: '8px',
          }}
        >
          <button
            type="button"
            style={primaryButtonStyle}
            onClick={() => router.push('/checkout')}
          >
            Intentar nuevamente
          </button>
          <button
            type="button"
            style={secondaryButtonStyle}
            onClick={() => router.push('/carrito')}
          >
            Volver al carrito
          </button>
        </div>
      </section>
    </main>
  );
}
