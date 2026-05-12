const preguntas = [
  {
    pregunta: '¿Qué medios de pago aceptan?',
    respuesta: 'Trabajamos con MercadoPago y los medios de pago habilitados por la plataforma..',
  },
  {
    pregunta: '¿Hacen envíos?',
    respuesta: 'Sí, realizamos envíos a todo el pais.',
  },
  {
    pregunta: '¿Cómo elijo el talle correcto?',
    respuesta: 'Cada producto muestra los talles disponibles. Si necesitás ayuda, podés contactarnos.',
  },
  {
    pregunta: '¿Puedo cambiar una prenda?',
    respuesta: 'Sí, aceptamos cambios dentro de los 15 días posteriores a la compra, respetando las condiciones indicadas en la sección Cambios.',
  },
  {
    pregunta: '¿Puedo retirar en local?',
    respuesta: 'Sí, podés elegir retiro en local y coordinamos el horario de entrega.',
  },
];

export default function PreguntasFrecuentesPage() {
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
          Preguntas frecuentes
        </h1>
        <p className="max-w-2xl text-base leading-8 text-[var(--gray)] sm:text-lg">
          Respuestas rápidas sobre pagos, envíos, talles, cambios y retiro en local.
        </p>

        <div className="mt-12 divide-y divide-[var(--border)] border-y border-[var(--border)]">
          {preguntas.map(({ pregunta, respuesta }) => (
            <div key={pregunta} className="py-6">
              <h2
                className="text-xl font-bold text-[var(--black)]"
                style={{ fontFamily: 'var(--font-playfair)' }}
              >
                {pregunta}
              </h2>
              <p className="mt-3 text-sm leading-7 text-[var(--gray)]">{respuesta}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
