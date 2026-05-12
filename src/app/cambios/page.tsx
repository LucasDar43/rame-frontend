const condiciones = [
  'Los cambios pueden solicitarse dentro de los 15 días posteriores a la compra.',
  'Para realizar un cambio, la prenda debe encontrarse sin uso, en perfectas condiciones y con sus etiquetas originales.',
  'En caso de falla de fábrica, el cambio se realizará sin costo.',
];

export default function CambiosPage() {
  return (
    <main className="min-h-screen bg-white pt-24">
      <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <p className="mb-4 text-[11px] font-semibold uppercase tracking-[3px] text-[var(--gray)]">
          Ayuda
        </p>
        <h1
          className="mb-6 text-4xl font-bold leading-tight text-[var(--black)] sm:text-5xl"
          style={{ fontFamily: 'var(--font-playfair)' }}
        >
          Cambios
        </h1>
        <p className="max-w-2xl text-base leading-8 text-[var(--gray)] sm:text-lg">
          Queremos que estés conforme con tu compra. Revisá estas condiciones antes de solicitar un cambio.
        </p>

        <ul className="mt-12 space-y-4">
          {condiciones.map((condicion) => (
            <li key={condicion} className="border-b border-[var(--border)] py-5">
              <h2
                className="text-xl font-bold text-[var(--black)]"
                style={{ fontFamily: 'var(--font-playfair)' }}
              >
                {condicion}
              </h2>
              <p className="mt-2 text-sm leading-7 text-[var(--gray)]">
                Contactanos para coordinar la revisión y confirmar la disponibilidad del cambio.
              </p>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
