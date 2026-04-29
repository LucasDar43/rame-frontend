export default function NosotrosSection() {
  return (
    <div id="nosotros" style={{
      margin: '0 52px 80px',
      display: 'grid', gridTemplateColumns: '0.7fr 1.3fr',
      gap: '0px', overflow: 'hidden',
    }}>
      <div
        style={{
          position: 'relative',
          height: '540px',
          width: '100%',
          overflow: 'hidden',
        }}
      >
        <img
          src="/images/familia.png"
          alt="Foto de la familia"
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center',
          }}
        />

      </div>

      {/* Contenido */}
      <div style={{
        background: '#f5f5f5', padding: '64px 52px',
        display: 'flex', flexDirection: 'column', justifyContent: 'center',
        borderLeft: '1px solid var(--border)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
          <div style={{ width: '24px', height: '1px', background: 'var(--white)', opacity: 0.3 }}/>
          <span style={{
            fontSize: '9px', fontWeight: 600, letterSpacing: '3px',
            textTransform: 'uppercase', color: 'var(--gray)',
          }}>
            Quienes somos
          </span>
        </div>

        <h2 style={{
          fontFamily: 'var(--font-playfair)', fontWeight: 900,
          fontSize: '42px', lineHeight: 1.05, letterSpacing: '-1px',
          marginBottom: '20px', color: 'var(--white)',
        }}>
          Un negocio<br/>
          de <em style={{ fontStyle: 'italic', opacity: 0.6 }}>familia</em>,<br/>
          para todos
        </h2>

        <p style={{
          fontSize: '14px', color: 'var(--light)', lineHeight: 1.8,
          marginBottom: '14px', fontWeight: 300,
        }}>
          Todo empezo con una pasion compartida. Dylan y Luci abrieron las puertas de Rame Indumentaria con el sueño de acercar ropa deportiva de calidad a su pueblo.
        </p>
        <p style={{
          fontSize: '14px', color: 'var(--light)', lineHeight: 1.8,
          marginBottom: '14px', fontWeight: 300,
        }}>
          Hoy seguimos siendo lo mismo de siempre: una familia que ama lo que hace y se preocupa por cada cliente.
        </p>

        {/* Firma */}
        <div style={{
          marginTop: '32px', paddingTop: '24px',
          borderTop: '1px solid var(--border)',
          display: 'flex', alignItems: 'center', gap: '14px',
        }}>
          <div style={{ display: 'flex' }}>
            {[17, 17, 13].map((size, i) => (
              <div key={i} style={{
                width: '38px', height: '38px', borderRadius: '50%',
                background: 'var(--dark)', border: '1px solid var(--border2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginLeft: i === 0 ? 0 : '-10px', color: 'var(--gray)',
              }}>
                <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="1.5">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
              </div>
            ))}
          </div>
          <div style={{ fontSize: '12px', color: 'var(--gray)', lineHeight: 1.5 }}>
            <strong style={{
              display: 'block', color: 'var(--white)',
              fontWeight: 600, fontSize: '13px', marginBottom: '2px',
            }}>
              Dylan, Luci y Gianna
            </strong>
            Fundadores de Rame Indumentaria
          </div>
        </div>
      </div>
    </div>
  );
}
