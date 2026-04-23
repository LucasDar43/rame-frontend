import Link from 'next/link';

export default function CategoriesSection() {
  const categorias = [
    { label: 'Coleccion', name: 'Mujer', count: '124 productos', bg: 'linear-gradient(145deg, #2a2a2a, #1a1a1a)', span: true, href: '/productos?categoria=Mujer' },
    { label: 'Coleccion', name: 'Hombre', count: '98 productos', bg: 'linear-gradient(145deg, #242424, #181818)', span: false, href: '/productos?categoria=Hombre' },
    { label: 'Temporada', name: 'Liquidacion', count: '43 productos', bg: 'linear-gradient(145deg, #202020, #141414)', span: false, href: '/productos?categoria=Liquidacion' },
    { label: 'Lo ultimo', name: 'Novedades', count: '31 productos', bg: 'linear-gradient(145deg, #2c2c2c, #1e1e1e)', span: false, href: '/productos?categoria=Novedades' },
  ];

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
          Explorar <em style={{ fontStyle: 'italic', opacity: 0.5 }}>categorias</em>
        </h2>
        <a href="#" style={{
          display: 'flex', alignItems: 'center', gap: '8px',
          fontSize: '11px', fontWeight: 500, letterSpacing: '2px',
          textTransform: 'uppercase', color: 'var(--light)', textDecoration: 'none',
        }}>
          Ver todo
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="1.5">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </a>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '2fr 1fr 1fr',
        gridTemplateRows: '240px 240px',
        gap: '2px',
      }}>
        {categorias.map((cat, i) => (
          <Link key={cat.name} href={cat.href} style={{
            position: 'relative', overflow: 'hidden', cursor: 'pointer',
            background: cat.bg,
            gridRow: cat.span ? 'span 2' : undefined,
            textDecoration: 'none',
            display: 'block',
          }}>
            {/* Patrón de puntos */}
            <div style={{
              position: 'absolute', inset: 0, opacity: 0.03,
              backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)',
              backgroundSize: '22px 22px',
            }}/>

            {/* Overlay */}
            <div style={{
              position: 'absolute', inset: 0,
              background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, transparent 55%)',
            }}/>

            {/* Contenido */}
            <div style={{
              position: 'absolute', bottom: 0, left: 0, right: 0,
              padding: '22px', zIndex: 2,
            }}>
              <div style={{
                fontSize: '9px', fontWeight: 600, letterSpacing: '3px',
                textTransform: 'uppercase', color: 'var(--gray)', marginBottom: '5px',
              }}>
                {cat.label}
              </div>
              <div style={{
                fontFamily: 'var(--font-playfair)', fontWeight: 700,
                fontSize: cat.span ? '42px' : '26px',
                color: '#f5f5f5', lineHeight: 1,
              }}>
                {cat.name}
              </div>
              <div style={{
                fontSize: '11px', color: 'var(--gray)',
                marginTop: '5px', letterSpacing: '0.5px',
              }}>
                {cat.count}
              </div>
            </div>

            {/* Flecha */}
            <div style={{
              position: 'absolute', top: '18px', right: '18px',
              width: '34px', height: '34px', border: '1px solid var(--border2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              zIndex: 2, color: '#f5f5f5',
            }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="1.5">
                <path d="M7 17L17 7M7 7h10v10"/>
              </svg>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
