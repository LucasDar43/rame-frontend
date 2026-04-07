import ProductoForm from '@/components/admin/ProductoForm';

export default function NuevoProductoPage() {
  return (
    <main
      style={{
        minHeight: '100vh',
        padding: '32px 24px',
        background: '#fafafa',
      }}
    >
      <div style={{ maxWidth: '960px', margin: '50px auto' }}>
        <div style={{ marginBottom: '24px' }}>
          <p
            style={{
              margin: '0 0 8px',
              fontSize: '12px',
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: 'var(--gray)',
            }}
          >
            Panel admin
          </p>

          <h1
            style={{
              margin: '0 0 10px',
              fontSize: '32px',
              lineHeight: 1.1,
              fontWeight: 600,
              color: 'var(--black)',
            }}
          >
            Nuevo producto
          </h1>

          <p
            style={{
              margin: 0,
              fontSize: '15px',
              lineHeight: 1.6,
              color: 'var(--off-white)',
              maxWidth: '680px',
            }}
          >
            Completá los datos del producto.
          </p>
        </div>

        <section
          style={{
            border: '1px solid var(--border)',
            background: '#ffffff',
            overflow: 'hidden',
          }}
        >
          <ProductoForm />
        </section>
      </div>
    </main>
  );
}
