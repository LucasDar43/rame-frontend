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

export default function CheckoutPendientePage() {
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
          <circle cx="36" cy="36" r="35" fill="#d97706" fillOpacity="0.12" />
          <circle cx="36" cy="36" r="27" stroke="#d97706" strokeWidth="2.5" />
          <path
            d="M36 22.5V36l8 5"
            stroke="#d97706"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="36" cy="36" r="1.8" fill="#d97706" />
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
          Tu pago está siendo procesado
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
          Esto puede demorar unos minutos. Te avisaremos por email cuando se
          confirme.
        </p>

        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            marginTop: '8px',
          }}
        >
          <button type="button" style={primaryButtonStyle} onClick={() => router.push('/')}>
            Volver al inicio
          </button>
        </div>
      </section>
    </main>
  );
}
