const puntos = [
  'Hacemos envíos a todo el país para que puedas recibir tu compra estés donde estés.',
  'Además, contamos con entregas coordinadas mediante envío propio en Nelson, Llambi Campbell, Esperanza y Laguna Paiva.',
  'También podés optar por retiro en el local.',
  'Los costos y tiempos de entrega se informan al momento de finalizar la compra.',
];

export default function EnviosYZonasPage() {
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
          Envíos y zonas
        </h1>
        <p className="max-w-2xl text-base leading-8 text-[var(--gray)] sm:text-lg">
          Coordinamos entregas para que recibas tu compra de la manera más cómoda según tu ubicación.
        </p>

        <div className="mt-12 space-y-4">
          {puntos.map((punto) => (
            <div key={punto} className="border-b border-[var(--border)] py-5">
              <h2
                className="text-xl font-bold text-[var(--black)]"
                style={{ fontFamily: 'var(--font-playfair)' }}
              >
                {punto}
              </h2>
              <p className="mt-2 text-sm leading-7 text-[var(--gray)]">
                La disponibilidad y el valor final se confirman al momento de coordinar tu pedido.
              </p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
