'use client';

import { useRouter } from 'next/navigation';

interface CartSummaryProps {
  totalItems: number;
  totalPrecio: number;
  onClearCart: () => void;
}

function formatPrice(value: number) {
  return `$${value.toLocaleString('es-AR')}`;
}

export default function CartSummary({
  totalItems,
  totalPrecio,
  onClearCart,
}: CartSummaryProps) {
  const router = useRouter();
  const isEmpty = totalItems === 0;

  return (
    <aside
      style={{
        border: '1px solid var(--border)',
        padding: '28px',
        background: 'var(--card)',
        position: 'sticky',
        top: '82px',
      }}
    >
      <p
        style={{
          margin: 0,
          fontSize: '12px',
          fontWeight: 600,
          letterSpacing: '3px',
          textTransform: 'uppercase',
          color: 'var(--gray)',
        }}
      >
        Resumen del pedido
      </p>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
          marginTop: '22px',
          fontSize: '14px',
        }}
      >
        <span style={{ color: 'var(--light)' }}>Productos</span>
        <span style={{ color: 'var(--white)' }}>{totalItems}</span>
      </div>

      <div
        style={{
          borderTop: '1px solid var(--border)',
          margin: '16px 0',
        }}
      />

      <div
        style={{
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          gap: '16px',
        }}
      >
        <span
          style={{
            fontSize: '13px',
            fontWeight: 600,
            textTransform: 'uppercase',
            color: 'var(--white)',
            letterSpacing: '1.5px',
          }}
        >
          Total
        </span>

        <span
          style={{
            fontFamily: 'var(--font-playfair)',
            fontWeight: 700,
            fontSize: '24px',
            color: 'var(--white)',
            lineHeight: 1,
          }}
        >
          {formatPrice(totalPrecio)}
        </span>
      </div>

      <div
        style={{
          borderTop: '1px solid var(--border)',
          margin: '16px 0 20px',
        }}
      />

      <button
        type="button"
        onClick={() => router.push('/checkout')}
        disabled={isEmpty}
        style={{
          width: '100%',
          height: '50px',
          background: 'var(--accent)',
          color: '#ffffff',
          fontSize: '11px',
          fontWeight: 600,
          letterSpacing: '2.5px',
          textTransform: 'uppercase',
          border: 'none',
          cursor: isEmpty ? 'not-allowed' : 'pointer',
          opacity: isEmpty ? 0.45 : 1,
          fontFamily: 'var(--font-dm-sans)',
        }}
      >
        Finalizar compra
      </button>

      {totalItems > 0 && (
        <button
          type="button"
          onClick={onClearCart}
          style={{
            display: 'block',
            margin: '12px auto 0',
            background: 'transparent',
            border: 'none',
            color: 'var(--gray)',
            fontSize: '12px',
            cursor: 'pointer',
            fontFamily: 'var(--font-dm-sans)',
          }}
        >
          Vaciar carrito
        </button>
      )}
    </aside>
  );
}
