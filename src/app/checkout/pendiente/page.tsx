'use client';

import type { CSSProperties } from 'react';
import { Suspense, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import { useOrdenStatus } from '@/hooks/useOrdenStatus';

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

function CheckoutPendienteContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const externalReference = searchParams.get('external_reference');
  const fallbackOrderId =
    typeof window !== 'undefined' ? sessionStorage.getItem('lastOrderId') : null;
  const rawOrderId = externalReference ?? fallbackOrderId;
  const ordenId = rawOrderId ? Number(rawOrderId) : null;
  const ordenIdValido = ordenId !== null && Number.isFinite(ordenId) && ordenId > 0;

  const { orden } = useOrdenStatus(ordenIdValido ? ordenId : null);

  useEffect(() => {
    if (!ordenIdValido) {
      router.replace('/');
    }
  }, [ordenIdValido, router]);

  if (!ordenIdValido) {
    return null;
  }

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

        {orden ? (
          <p
            style={{
              margin: 0,
              fontSize: '13px',
              lineHeight: 1.6,
              color: 'var(--gray)',
              fontFamily: 'var(--font-dm-sans)',
            }}
          >
            Orden #{orden.id}
          </p>
        ) : null}

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
          <button
            type="button"
            style={primaryButtonStyle}
            onClick={() => router.push('/')}
          >
            Volver al inicio
          </button>
        </div>
      </section>
    </main>
  );
}

export default function CheckoutPendientePage() {
  return (
    <Suspense
      fallback={
        <div style={layoutStyle}>
          <div style={cardStyle}>Cargando...</div>
        </div>
      }
    >
      <CheckoutPendienteContent />
    </Suspense>
  );
}
