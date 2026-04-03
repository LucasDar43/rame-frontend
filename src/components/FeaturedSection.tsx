const productos = [
  { marca: 'Nike', nombre: 'Camiseta Dri-FIT', precio: '$24.990', badge: 'Nuevo', badgeType: 'new', bg: 'linear-gradient(145deg, #141414, #1e1e1e)' },
  { marca: 'Adidas', nombre: 'Zapatilla Ultraboost', precio: '$89.990', precioOld: '$110.000', badge: '-18%', badgeType: 'off', bg: 'linear-gradient(145deg, #121212, #1c1c1c)' },
  { marca: 'Puma', nombre: 'Buzo Essentials', precio: '$58.990', badge: 'Nuevo', badgeType: 'new', bg: 'linear-gradient(145deg, #161616, #222222)' },
  { marca: 'Under Armour', nombre: 'Short Running', precio: '$18.990', precioOld: '$23.990', badge: '-20%', badgeType: 'off', bg: 'linear-gradient(145deg, #181818, #202020)' },
];

export default function FeaturedSection() {
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
        <a href="#" style={{
          display: 'flex', alignItems: 'center', gap: '8px',
          fontSize: '11px', fontWeight: 500, letterSpacing: '2px',
          textTransform: 'uppercase', color: 'var(--light)', textDecoration: 'none',
        }}>
          Ver todos
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="1.5">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </a>
      </div>

      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '2px',
      }}>
        {productos.map((p) => (
          <div key={p.nombre} style={{
            background: 'var(--card)', position: 'relative',
            cursor: 'pointer', overflow: 'hidden',
          }}>
            {/* Imagen placeholder */}
            <div style={{ height: '300px', position: 'relative', overflow: 'hidden' }}>
              <div style={{
                position: 'absolute', inset: 0, background: p.bg,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <svg width="72" height="72" viewBox="0 0 24 24" fill="none"
                  stroke="#000000" strokeWidth="0.6" opacity={0.08}>
                  <path d="M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.57a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.57a2 2 0 0 0-1.34-2.23z"/>
                </svg>
              </div>

              {/* Badge */}
              <span style={{
                position: 'absolute', top: '14px', left: '14px', zIndex: 2,
                fontSize: '9px', fontWeight: 700, letterSpacing: '2px',
                textTransform: 'uppercase', padding: '4px 10px',
                background: p.badgeType === 'new' ? 'var(--white)' : 'transparent',
                color: p.badgeType === 'new' ? '#000000' : 'var(--white)',
                border: p.badgeType === 'off' ? '1px solid var(--border2)' : 'none',
              }}>
                {p.badge}
              </span>
            </div>

            {/* Info */}
            <div style={{ padding: '18px 18px 20px' }}>
              <div style={{
                fontSize: '9px', fontWeight: 600, letterSpacing: '3px',
                textTransform: 'uppercase', color: 'var(--gray)', marginBottom: '5px',
              }}>
                {p.marca}
              </div>
              <div style={{
                fontFamily: 'var(--font-playfair)', fontWeight: 700,
                fontSize: '17px', color: 'var(--white)',
                marginBottom: '10px', lineHeight: 1.2,
              }}>
                {p.nombre}
              </div>

              {/* Talles */}
              <div style={{ display: 'flex', gap: '4px', marginBottom: '14px', flexWrap: 'wrap' }}>
                {['S', 'M', 'L', 'XL'].map((t) => (
                  <span key={t} style={{
                    fontSize: '10px', fontWeight: 500, color: 'var(--gray)',
                    border: '1px solid var(--border)', padding: '2px 7px',
                    letterSpacing: '0.5px', cursor: 'pointer',
                  }}>
                    {t}
                  </span>
                ))}
              </div>

              {/* Footer */}
              <div style={{
                display: 'flex', alignItems: 'center',
                justifyContent: 'space-between',
                paddingTop: '14px', borderTop: '1px solid var(--border)',
              }}>
                <div>
                  <span style={{
                    fontFamily: 'var(--font-playfair)', fontWeight: 700,
                    fontSize: '19px', color: 'var(--white)',
                  }}>
                    {p.precio}
                  </span>
                  {p.precioOld && (
                    <span style={{
                      fontSize: '12px', color: 'var(--gray)',
                      textDecoration: 'line-through', marginLeft: '6px',
                    }}>
                      {p.precioOld}
                    </span>
                  )}
                </div>
                <button style={{
                  display: 'flex', alignItems: 'center', gap: '6px',
                  background: 'transparent', border: '1px solid var(--border)',
                  color: 'var(--light)', padding: '7px 14px',
                  fontFamily: 'var(--font-dm-sans)', fontSize: '10px',
                  fontWeight: 500, letterSpacing: '1.5px',
                  textTransform: 'uppercase', cursor: 'pointer',
                }}>
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="2.5">
                    <line x1="12" y1="5" x2="12" y2="19"/>
                    <line x1="5" y1="12" x2="19" y2="12"/>
                  </svg>
                  Agregar
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}