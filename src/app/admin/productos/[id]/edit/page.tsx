'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getProducto, getVariantes } from '@/lib/api';
import { Producto, Variante } from '@/types';
import ProductoEditForm from './components/ProductoEditForm';
import VariantesManager from './components/VariantesManager';

export default function EditProductoPage() {
  const params = useParams();
  const router = useRouter();
  const productoId = Number(params.id);

  const [producto, setProducto] = useState<Producto | null>(null);
  const [variantes, setVariantes] = useState<Variante[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    async function loadData() {
      if (!Number.isFinite(productoId) || productoId <= 0) {
        setError('ID de producto invalido.');
        setLoading(false);
        return;
      }

      setLoading(true);
      setError('');

      try {
        const [productoData, variantesData] = await Promise.all([
          getProducto(productoId),
          getVariantes(productoId),
        ]);

        if (!active) return;

        setProducto(productoData);
        setVariantes(variantesData);
      } catch (err) {
        if (!active) return;
        setError(err instanceof Error ? err.message : 'No se pudo cargar el producto.');
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadData();

    return () => {
      active = false;
    };
  }, [productoId]);

  return (
    <main
      style={{
        background: '#fafafa',
        minHeight: '100vh',
        padding: '32px 24px',
      }}
    >
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
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
              margin: '0 0 12px',
              fontSize: '32px',
              lineHeight: 1.1,
              fontWeight: 600,
              color: 'var(--black)',
            }}
          >
            {loading ? 'Cargando...' : producto?.nombre ?? 'Editar producto'}
          </h1>

          <button
            type="button"
            onClick={() => router.push('/admin/productos')}
            style={{
              border: '1px solid var(--border)',
              background: 'transparent',
              color: 'var(--black)',
              padding: '10px 16px',
              fontSize: '12px',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              cursor: 'pointer',
            }}
          >
            Volver a productos
          </button>
        </div>

        {loading ? (
          <section
            style={{
              border: '1px solid var(--border)',
              background: '#ffffff',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                padding: '48px 24px',
                textAlign: 'center',
                color: 'var(--gray)',
                fontSize: '15px',
              }}
            >
              Cargando...
            </div>
          </section>
        ) : error ? (
          <section
            style={{
              border: '1px solid var(--border)',
              background: '#ffffff',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                padding: '48px 24px',
                textAlign: 'center',
                color: '#b42318',
                fontSize: '15px',
              }}
            >
              {error}
            </div>
          </section>
        ) : producto ? (
          <>
            <section
              style={{
                border: '1px solid var(--border)',
                background: '#ffffff',
                overflow: 'hidden',
                marginBottom: '24px',
              }}
            >
              <ProductoEditForm producto={producto} />
            </section>

            <section
              style={{
                border: '1px solid var(--border)',
                background: '#ffffff',
                overflow: 'hidden',
              }}
            >
              <VariantesManager
                productoId={productoId}
                producto={producto}
                variantesIniciales={variantes}
              />
            </section>
          </>
        ) : (
          <section
            style={{
              border: '1px solid var(--border)',
              background: '#ffffff',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                padding: '48px 24px',
                textAlign: 'center',
                color: '#b42318',
                fontSize: '15px',
              }}
            >
              No se encontro el producto.
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
