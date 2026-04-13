'use client';

import Link from 'next/link';

export default function CheckoutPage() {
  return (
    <main
      style={{
        marginTop: '62px',
        minHeight: '100vh',
        background: '#ffffff',
        padding: '52px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <section
        style={{
          width: '100%',
          maxWidth: '520px',
          border: '1px solid var(--border)',
          background: 'var(--card)',
          padding: '40px',
          textAlign: 'center',
        }}
      >
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
          Checkout
        </h1>

        <p
          style={{
            margin: '12px 0 0',
            fontSize: '14px',
            color: 'var(--gray)',
          }}
        >
          {'Pr\u00f3ximamente'}
        </p>

        <Link
          href="/carrito"
          style={{
            display: 'inline-block',
            marginTop: '24px',
            background: '#111111',
            color: '#ffffff',
            padding: '12px 28px',
            fontSize: '11px',
            fontWeight: 600,
            letterSpacing: '2px',
            textTransform: 'uppercase',
            textDecoration: 'none',
            fontFamily: 'var(--font-dm-sans)',
          }}
        >
          Volver al carrito
        </Link>
      </section>
    </main>
  );
}
