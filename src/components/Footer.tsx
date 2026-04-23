export default function Footer() {
  return (
    <>
      <footer style={{
        background: '#f5f5f5', borderTop: '1px solid var(--border)',
        padding: '60px 52px 32px',
        display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '52px',
      }}>
        <div>
          <div style={{
            fontFamily: 'var(--font-playfair)', fontWeight: 900,
            fontSize: '14px', letterSpacing: '4px',
            color: 'var(--white)', textTransform: 'uppercase', marginBottom: '14px',
          }}>
            Rame Indumentaria
          </div>
          <p style={{
            fontSize: '13px', color: 'var(--gray)', lineHeight: 1.7,
            maxWidth: '260px', marginBottom: '24px',
          }}>
            Ropa deportiva para hombre y mujer. Un negocio familiar con las mejores marcas del mercado.
          </p>
          <div style={{ display: 'flex', gap: '8px' }}>
            {[
              <path key="ig" d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>,
              <path key="wa" d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>,
            ].map((icon, i) => (
              <div key={i} style={{
                width: '34px', height: '34px', border: '1px solid var(--border)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'var(--gray)', cursor: 'pointer',
              }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="1.8">
                  {icon}
                </svg>
              </div>
            ))}
          </div>
        </div>

        {[
          { title: 'Tienda', links: ['Mujer', 'Hombre', 'Liquidacion', 'Novedades'] },
          { title: 'Ayuda', links: ['Como comprar', 'Envios y zonas', 'Cambios', 'Preguntas frecuentes'] },
          { title: 'Contacto', links: ['WhatsApp', 'Instagram'] },
        ].map((col) => (
          <div key={col.title}>
            <div style={{
              fontSize: '10px', fontWeight: 700, letterSpacing: '3px',
              textTransform: 'uppercase', color: 'var(--white)', marginBottom: '20px',
            }}>
              {col.title}
            </div>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {col.links.map((link) => (
                <li key={link}>
                  <a href="#" style={{
                    fontSize: '13px', color: 'var(--gray)', textDecoration: 'none',
                  }}>
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </footer>

      <div style={{
        background: '#f5f5f5', padding: '20px 52px',
        borderTop: '1px solid var(--border)',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      }}>
        <span style={{ fontSize: '11px', color: 'var(--gray)', letterSpacing: '0.5px' }}>
          © {new Date().getFullYear()} Rame Indumentaria. Todos los derechos reservados.
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', color: 'var(--gray)' }}>
          <span>Pagos con</span>
          <span style={{
            background: 'var(--card)', color: 'var(--white)', fontWeight: 700,
            fontSize: '10px', padding: '3px 8px', letterSpacing: '1px',
            border: '1px solid var(--border)',
          }}>
            MercadoPago
          </span>
        </div>
      </div>
    </>
  );
}