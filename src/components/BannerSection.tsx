import Link from 'next/link';

export default function BannerSection() {
  return (
    <div style={{
      margin: '0 52px 80px', background: 'var(--white)',
      padding: '52px 60px', display: 'flex',
      alignItems: 'center', justifyContent: 'space-between',
      position: 'relative', overflow: 'hidden',
    }}>
      {/* Texto de fondo decorativo */}
      <div style={{
        position: 'absolute', right: '30px', top: '50%',
        transform: 'translateY(-50%)',
        fontFamily: 'var(--font-playfair)', fontWeight: 900,
        fontSize: '180px', color: 'rgba(255,255,255,0.08)',
        lineHeight: 1, pointerEvents: 'none', userSelect: 'none',
      }}>
        SALE
      </div>

      <div style={{ position: 'relative', zIndex: 1 }}>
        <div style={{
          fontSize: '9px', fontWeight: 700, letterSpacing: '3px',
          textTransform: 'uppercase', color: '#999', marginBottom: '10px',
        }}>
          Liquidacion de temporada
        </div>
        <h2 style={{
          fontFamily: 'var(--font-playfair)', fontWeight: 900,
          fontSize: '48px', lineHeight: 0.95, letterSpacing: '-1px',
          color: '#ffffff', marginBottom: '10px',
        }}>
          Hasta 40% off<br/>
          en <em style={{ fontStyle: 'italic', opacity: 0.6 }}>productos</em><br/>
          seleccionados
        </h2>
        <p style={{ fontSize: '13px', color: '#aaa', fontWeight: 300 }}>
          Solo por tiempo limitado. Stock disponible.
        </p>
      </div>

      <Link href="/productos?categoria=Liquidacion" style={{
        background: '#ffffff',
        color: 'var(--white)',
        display: 'inline-block',
        padding: '16px 44px',
        fontFamily: 'var(--font-dm-sans)',
        fontWeight: 600,
        fontSize: '11px',
        letterSpacing: '2.5px',
        textTransform: 'uppercase',
        cursor: 'pointer',
        position: 'relative',
        zIndex: 1,
        flexShrink: 0,
        textDecoration: 'none',
      }}>
        Ver liquidacion
      </Link>
    </div>
  );
}
