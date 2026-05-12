const pasos = [
  'Explorá el catálogo y elegí tus productos favoritos.',
  'Seleccioná talle y color según disponibilidad.',
  'Agregá los productos al carrito.',
  'Completá tus datos de contacto y envío.',
  'Realizá el pago de forma segura mediante MercadoPago.',
  'Recibirás la confirmación de tu compra una vez aprobado el pago.',
];

export default function ComoComprarPage() {
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
          Cómo comprar
        </h1>
        <p className="max-w-2xl text-base leading-8 text-[var(--gray)] sm:text-lg">
          Comprar en Rame Indumentaria es simple. Seguí estos pasos para completar tu pedido de forma rápida y segura.
        </p>

        <div className="mt-12 space-y-4">
          {pasos.map((paso, index) => (
            <div key={paso} className="border-b border-[var(--border)] py-5">
              <span className="text-xs font-semibold uppercase tracking-[2px] text-[var(--gray)]">
                Paso {index + 1}
              </span>
              <h2
                className="mt-3 text-xl font-bold text-[var(--black)]"
                style={{ fontFamily: 'var(--font-playfair)' }}
              >
                {paso}
              </h2>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
