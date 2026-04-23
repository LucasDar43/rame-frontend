'use client';

import type { CSSProperties } from 'react';
import { Suspense, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import useCart from '@/hooks/useCart';
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

const secondaryButtonStyle: CSSProperties = {
  ...primaryButtonStyle,
  background: 'transparent',
  border: '1px solid var(--border)',
  color: 'var(--white)',
};

const MAX_POLLING_ATTEMPTS = 5;

function Spinner() {
  return (
    <svg
      width="40"
      height="40"
      viewBox="0 0 40 40"
      fill="none"
      aria-hidden="true"
      style={{ animation: 'spin 1s linear infinite' }}
    >
      <circle
        cx="20"
        cy="20"
        r="16"
        stroke="var(--border)"
        strokeWidth="4"
      />
      <path
        d="M20 4a16 16 0 0 1 16 16"
        stroke="var(--black)"
        strokeWidth="4"
        strokeLinecap="round"
      />
    </svg>
  );
}

function CheckoutExitosoContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { clearCart } = useCart();
  const cartCleared = useRef(false);

  const externalReference = searchParams.get('external_reference');
  const fallbackOrderId =
    typeof window !== 'undefined' ? sessionStorage.getItem('lastOrderId') : null;
  const rawOrderId = externalReference ?? fallbackOrderId;
  const ordenId = rawOrderId ? Number(rawOrderId) : null;
  const ordenIdValido = ordenId !== null && Number.isFinite(ordenId) && ordenId > 0;

  const { orden, loading, error, pollingActivo, intentos } = useOrdenStatus(
    ordenIdValido ? ordenId : null,
    {
      enablePolling: true,
      maxAttempts: MAX_POLLING_ATTEMPTS,
      intervalMs: 2000,
    }
  );

  useEffect(() => {
    if (!ordenIdValido) {
      router.replace('/');
    }
  }, [ordenIdValido, router]);

  useEffect(() => {
    if (orden?.estado === 'APROBADO' && cartCleared.current === false) {
      clearCart();
      cartCleared.current = true;
    }
  }, [clearCart, orden]);

  if (!ordenIdValido) {
    return null;
  }

  if (pollingActivo) {
    return (
      <main style={layoutStyle}>
        <section style={cardStyle}>
          <Spinner />
          <h1
            style={{
              margin: 0,
              fontFamily: 'var(--font-playfair)',
              fontSize: '32px',
              lineHeight: 1.1,
              color: 'var(--white)',
            }}
          >
            Confirmando tu pago...
          </h1>
        </section>
      </main>
    );
  }

  if (loading) {
    return (
      <main style={layoutStyle}>
        <section style={cardStyle}>
          <Spinner />
          <h1
            style={{
              margin: 0,
              fontFamily: 'var(--font-playfair)',
              fontSize: '32px',
              lineHeight: 1.1,
              color: 'var(--white)',
            }}
          >
            Verificando tu pago...
          </h1>
        </section>
      </main>
    );
  }

  if (error) {
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
              fontSize: '32px',
              lineHeight: 1.1,
              color: 'var(--white)',
            }}
          >
            No pudimos verificar tu pago
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
            Si realizaste el pago, recibirás un email de confirmación. Si el
            problema persiste, contactanos.
          </p>

          <button
            type="button"
            style={primaryButtonStyle}
            onClick={() => router.push('/')}
          >
            Volver al inicio
          </button>
        </section>
      </main>
    );
  }

  if (
    orden?.estado === 'PENDIENTE' &&
    pollingActivo === false &&
    intentos >= MAX_POLLING_ATTEMPTS
  ) {
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
              fontSize: '32px',
              lineHeight: 1.1,
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
            Recibirás un email cuando se confirme el pago. Esto puede demorar
            unos minutos.
          </p>

          <button
            type="button"
            style={primaryButtonStyle}
            onClick={() => router.push('/')}
          >
            Volver al inicio
          </button>
        </section>
      </main>
    );
  }

  if (orden?.estado === 'APROBADO') {
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
            Pago realizado con exito
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
            {`Gracias por tu compra, ${orden.nombreComprador}. Te enviamos los detalles a ${orden.emailComprador}.`}
          </p>

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
              onClick={() => router.push('/')}
            >
              Volver al inicio
            </button>
            <button
              type="button"
              style={secondaryButtonStyle}
              onClick={() => router.push('/productos')}
            >
              Ver mas productos
            </button>
          </div>
        </section>
      </main>
    );
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
            fontSize: '32px',
            lineHeight: 1.1,
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
          Recibirás un email cuando se confirme el pago. Esto puede demorar unos
          minutos.
        </p>

        <button
          type="button"
          style={primaryButtonStyle}
          onClick={() => router.push('/')}
        >
          Volver al inicio
        </button>
      </section>
    </main>
  );
}

export default function CheckoutExitosoPage() {
  return (
    <Suspense
      fallback={
        <div style={layoutStyle}>
          <div style={cardStyle}>Cargando...</div>
        </div>
      }
    >
      <CheckoutExitosoContent />
    </Suspense>
  );
}
