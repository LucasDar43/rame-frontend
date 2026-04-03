const envios = [
  {
    titulo: 'Envio a domicilio',
    texto: 'Precio fijo segun tu zona. Llega en 24 a 72hs.',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="1.5">
        <rect x="1" y="3" width="15" height="13"/>
        <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/>
        <circle cx="5.5" cy="18.5" r="2.5"/>
        <circle cx="18.5" cy="18.5" r="2.5"/>
      </svg>
    ),
  },
  {
    titulo: 'Entrega local',
    texto: 'Zona de 20 km. Te lo llevamos nosotros.',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="1.5">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
        <circle cx="12" cy="10" r="3"/>
      </svg>
    ),
  },
  {
    titulo: 'Retiro en local',
    texto: 'Sin costo. Disponible de lunes a sabado.',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="1.5">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
        <polyline points="9 22 9 12 15 12 15 22"/>
      </svg>
    ),
  },
];

export default function EnviosSection() {
  return (
    <div style={{
      margin: '0 52px 80px',
      display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2px',
    }}>
      {envios.map((e) => (
        <div key={e.titulo} style={{
          background: 'var(--card)', padding: '28px',
          display: 'flex', alignItems: 'flex-start', gap: '18px',
          border: '1px solid var(--border)',
        }}>
          <div style={{
            width: '42px', height: '42px', border: '1px solid var(--border)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0, color: 'var(--white)',
          }}>
            {e.icon}
          </div>
          <div>
            <div style={{
              fontWeight: 600, fontSize: '13px',
              color: 'var(--white)', marginBottom: '4px',
            }}>
              {e.titulo}
            </div>
            <div style={{ fontSize: '12px', color: 'var(--gray)', lineHeight: 1.5 }}>
              {e.texto}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}