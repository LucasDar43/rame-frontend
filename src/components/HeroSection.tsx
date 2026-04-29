import Link from 'next/link';
import { getConteosCategorias } from '@/lib/api';

export default async function HeroSection() {
  let totalProductos = 500;

  try {
    const conteos = await getConteosCategorias();
    const suma = Object.values(conteos).reduce((acc, n) => acc + n, 0);
    if (suma > 0) totalProductos = suma;
  } catch {
  }

  const statsProductos = totalProductos >= 1000
    ? `${Math.floor(totalProductos / 100) * 100}+`
    : `${totalProductos}+`;

  return (
    <section style={{
      height: '100vh', position: 'relative',
      display: 'flex', alignItems: 'flex-end', overflow: 'hidden',
    }}>
      {/* Fondo */}
      <div style={{ position: 'absolute', inset: 0, background: '#f5f5f5', overflow: 'hidden' }}>

        {/* Ilustración familia */}
        <svg style={{
          position: 'absolute', bottom: 0, left: '50%',
          transform: 'translateX(-50%)', width: '100%',
          maxWidth: '1000px', height: '88%',
        }} viewBox="0 0 1000 640" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMax meet">
          <defs>
            <radialGradient id="glow" cx="50%" cy="100%" r="50%">
              <stop offset="0%" stopColor="#000000" stopOpacity="0.06"/>
              <stop offset="100%" stopColor="#000000" stopOpacity="0"/>
            </radialGradient>
            <linearGradient id="figGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#555555"/>
              <stop offset="100%" stopColor="#333333"/>
            </linearGradient>
            <linearGradient id="figGrad2" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#444444"/>
              <stop offset="100%" stopColor="#222222"/>
            </linearGradient>
          </defs>
          <ellipse cx="500" cy="640" rx="520" ry="160" fill="url(#glow)"/>
          <line x1="80" y1="635" x2="920" y2="635" stroke="#ffffff" strokeOpacity="0.04" strokeWidth="1"/>
          {/* Papá */}
          <g transform="translate(190, 60)">
            <circle cx="85" cy="54" r="40" fill="url(#figGrad)"/>
            <rect x="50" y="96" width="70" height="140" rx="14" fill="url(#figGrad)"/>
            <rect x="50" y="226" width="32" height="170" rx="10" fill="url(#figGrad2)"/>
            <rect x="88" y="226" width="32" height="170" rx="10" fill="url(#figGrad2)"/>
            <rect x="12" y="98" width="30" height="118" rx="12" fill="url(#figGrad2)"/>
            <rect x="128" y="98" width="30" height="118" rx="12" fill="url(#figGrad2)"/>
            <ellipse cx="66" cy="397" rx="24" ry="10" fill="#111"/>
            <ellipse cx="104" cy="397" rx="24" ry="10" fill="#111"/>
          </g>
          {/* Mamá */}
          <g transform="translate(390, 80)">
            <circle cx="90" cy="50" r="37" fill="url(#figGrad)"/>
            <ellipse cx="90" cy="32" rx="42" ry="22" fill="url(#figGrad2)"/>
            <path d="M58 88 L42 238 L138 238 L122 88 Z" fill="url(#figGrad)"/>
            <rect x="54" y="228" width="30" height="152" rx="9" fill="url(#figGrad2)"/>
            <rect x="94" y="228" width="30" height="152" rx="9" fill="url(#figGrad2)"/>
            <rect x="18" y="90" width="28" height="108" rx="12" fill="url(#figGrad2)"/>
            <rect x="134" y="90" width="28" height="108" rx="12" fill="url(#figGrad2)"/>
            <ellipse cx="69" cy="382" rx="22" ry="9" fill="#111"/>
            <ellipse cx="109" cy="382" rx="22" ry="9" fill="#111"/>
          </g>
          {/* Hija */}
          <g transform="translate(600, 140)">
            <circle cx="72" cy="46" r="32" fill="url(#figGrad)"/>
            <ellipse cx="72" cy="28" rx="36" ry="20" fill="url(#figGrad2)"/>
            <ellipse cx="105" cy="38" rx="16" ry="9" fill="url(#figGrad2)"/>
            <rect x="43" y="80" width="58" height="118" rx="12" fill="url(#figGrad)"/>
            <rect x="43" y="190" width="26" height="140" rx="8" fill="url(#figGrad2)"/>
            <rect x="75" y="190" width="26" height="140" rx="8" fill="url(#figGrad2)"/>
            <rect x="12" y="82" width="24" height="96" rx="10" fill="url(#figGrad2)"/>
            <rect x="108" y="82" width="24" height="96" rx="10" fill="url(#figGrad2)"/>
            <ellipse cx="56" cy="332" rx="20" ry="8" fill="#111"/>
            <ellipse cx="88" cy="332" rx="20" ry="8" fill="#111"/>
          </g>
        </svg>

        {/* Gradiente y scanlines */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse 70% 50% at 50% 100%, rgba(0,0,0,0.04) 0%, transparent 60%), linear-gradient(to top, rgba(255,255,255,1) 0%, rgba(255,255,255,0.7) 35%, rgba(255,255,255,0.1) 100%)',
        }}/>
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.015) 3px, rgba(0,0,0,0.015) 4px)',
        }}/>
      </div>

      {/* Contenido */}
      <div style={{
        position: 'relative', zIndex: 2, padding: '0 52px 72px',
        width: '100%', display: 'flex',
        alignItems: 'flex-end', justifyContent: 'space-between',
      }}>
        <div style={{ maxWidth: '580px' }}>
          {/* Tag */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '10px',
            marginBottom: '22px', animation: 'fadeUp 0.6s ease 0.2s both',
          }}>
            <div style={{ width: '28px', height: '1px', background: '#111111' }}/>
            <span style={{
              fontSize: '10px', fontWeight: 500, letterSpacing: '3px',
              textTransform: 'uppercase', color: 'var(--light)',
            }}>
              Familia — Pasion — Deporte
            </span>
          </div>

          {/* Título */}
          <h1 style={{
            fontFamily: 'var(--font-playfair)', fontWeight: 900,
            fontSize: '80px', lineHeight: 0.9, letterSpacing: '-2px',
            marginBottom: '22px', color: 'var(--white)',
            animation: 'fadeUp 0.6s ease 0.35s both',
          }}>
            Vestite con<br/>
            la <em style={{ fontStyle: 'italic', color: 'var(--off-white)', opacity: 0.7 }}>energia</em><br/>
            de los nuestros
          </h1>

          {/* Descripción */}
          <p style={{
            fontSize: '15px', color: 'var(--light)', lineHeight: 1.75,
            maxWidth: '420px', marginBottom: '36px', fontWeight: 300,
            animation: 'fadeUp 0.6s ease 0.5s both',
          }}>
            Somos Dylan, Luci y Gianna. Un negocio familiar que nacio del amor al deporte y crecio con cada cliente. Ropa deportiva para que des lo mejor de vos.
          </p>

          {/* CTAs */}
          <div style={{
            display: 'flex', gap: '12px', alignItems: 'center',
            animation: 'fadeUp 0.6s ease 0.65s both',
          }}>
            <Link href="/productos" style={{
              background: '#111111', color: '#ffffff', border: 'none',
              padding: '14px 36px', fontFamily: 'var(--font-dm-sans)',
              fontWeight: 600, fontSize: '11px', letterSpacing: '2.5px',
              textTransform: 'uppercase', cursor: 'pointer',
              display: 'inline-block',
              textDecoration: 'none',
            }}>
              Ver Catalogo
            </Link>
            <Link href="/#nosotros" style={{
              background: 'transparent', color: 'var(--white)',
              border: '1px solid var(--border2)', padding: '14px 36px',
              fontFamily: 'var(--font-dm-sans)', fontWeight: 500,
              fontSize: '11px', letterSpacing: '2.5px',
              textTransform: 'uppercase', cursor: 'pointer',
              display: 'inline-block',
              textDecoration: 'none',
            }}>
              Nuestra Historia
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div style={{ animation: 'fadeUp 0.6s ease 0.8s both' }}>
          <div style={{ display: 'flex', gap: '44px', justifyContent: 'flex-end' }}>
            {[
              { num: statsProductos, label: 'Productos' },
              { num: '3', label: 'Años' },
              { num: '100%', label: 'Familiar' },
            ].map((stat) => (
              <div key={stat.label} style={{ textAlign: 'right' }}>
                <div style={{
                  fontFamily: 'var(--font-playfair)', fontWeight: 700,
                  fontSize: '30px', color: 'var(--white)', lineHeight: 1,
                }}>
                  {stat.num}
                </div>
                <div style={{
                  fontSize: '10px', letterSpacing: '2px',
                  textTransform: 'uppercase', color: 'var(--gray)', marginTop: '5px',
                }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll hint */}
      <div style={{
        position: 'absolute', bottom: '26px', left: '50%',
        transform: 'translateX(-50%)', display: 'flex',
        flexDirection: 'column', alignItems: 'center', gap: '8px',
        zIndex: 3, animation: 'bounce 2s infinite',
      }}>
        <span style={{
          fontSize: '9px', letterSpacing: '3px',
          textTransform: 'uppercase', color: 'var(--gray)',
        }}>
          Scroll
        </span>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="1.5" color="var(--gray)">
          <polyline points="6 9 12 15 18 9"/>
        </svg>
      </div>
    </section>
  );
}
