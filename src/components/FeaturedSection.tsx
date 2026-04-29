import Link from 'next/link';
import ProductCard from '@/components/ProductCard';
import { Producto } from '@/types';

interface FeaturedSectionProps {
  productos: Producto[];
}

export default function FeaturedSection({ productos }: FeaturedSectionProps) {
  return (
    <section style={{ padding: '80px 52px', borderTop: '1px solid var(--border)' }}>
      <div style={{
        display: 'flex', alignItems: 'baseline',
        justifyContent: 'space-between', marginBottom: '32px',
      }}>
        <h2 style={{
          fontFamily: 'var(--font-playfair)', fontWeight: 700,
          fontSize: '34px', letterSpacing: '-0.5px', color: 'var(--white)',
        }}>
          Productos <em style={{ fontStyle: 'italic', opacity: 0.5 }}>destacados</em>
        </h2>
        <Link href="/productos" style={{
          display: 'flex', alignItems: 'center', gap: '8px',
          fontSize: '11px', fontWeight: 500, letterSpacing: '2px',
          textTransform: 'uppercase', color: 'var(--light)', textDecoration: 'none',
        }}>
          Ver todos
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="1.5">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </Link>
      </div>

      {productos.length === 0 ? (
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '2px',
        }}>
          <div style={{
            gridColumn: '1 / -1',
            minHeight: '420px',
            background: 'var(--card)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--gray)',
            fontSize: '14px',
          }}>
            No hay productos disponibles
          </div>
        </div>
      ) : (
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '2px',
        }}>
          {productos.map((p) => (
            <ProductCard key={p.id} producto={p} />
          ))}
        </div>
      )}
    </section>
  );
}
