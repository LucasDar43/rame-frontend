'use client';

import { useEffect, useState } from 'react';
import { eliminarProducto, getProductos } from '@/lib/api';
import { Producto } from '@/types';
import ProductosTable from './components/ProductosTable';
import PaginacionControls from './components/PaginacionControls';

export default function AdminProductosPage() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  useEffect(() => {
    let active = true;

    async function loadProductos() {
      setLoading(true);
      setError('');

      try {
        const response = await getProductos(page, 20);

        if (!active) {
          return;
        }

        setProductos(response.content);
        setTotalPages(response.totalPages);
      } catch (err) {
        if (!active) {
          return;
        }

        setError(
          err instanceof Error ? err.message : 'No se pudieron cargar los productos.'
        );
        setProductos([]);
        setTotalPages(0);
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadProductos();

    return () => {
      active = false;
    };
  }, [page]);

  const handleEliminar = async (id: number) => {
    const confirmado = window.confirm(
      '\u00BFEliminar este producto? Esta acci\u00F3n no se puede deshacer.'
    );

    if (!confirmado) {
      return;
    }

    setDeletingId(id);

    try {
      await eliminarProducto(id);
      setProductos((prev) => prev.filter((producto) => producto.id !== id));
    } catch (error: unknown) {
      alert(error instanceof Error ? error.message : 'Error al eliminar el producto');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <main
      style={{
        minHeight: '100vh',
        padding: '32px 24px',
        background: '#fafafa',
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
              margin: 0,
              fontSize: '32px',
              lineHeight: 1.1,
              fontWeight: 600,
              color: 'var(--black)',
            }}
          >
            Productos
          </h1>
        </div>

        <section
          style={{
            border: '1px solid var(--border)',
            background: '#ffffff',
            overflow: 'hidden',
          }}
        >
          {loading ? (
            <div
              style={{
                padding: '48px 24px',
                textAlign: 'center',
                color: 'var(--gray)',
                fontSize: '15px',
              }}
            >
              Cargando productos...
            </div>
          ) : error ? (
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
          ) : productos.length === 0 ? (
            <div
              style={{
                padding: '48px 24px',
                textAlign: 'center',
                color: 'var(--gray)',
                fontSize: '15px',
              }}
            >
              No hay productos para mostrar.
            </div>
          ) : (
            <>
              <ProductosTable
                productos={productos}
                onEliminar={handleEliminar}
                deletingId={deletingId}
              />
              <PaginacionControls
                page={page}
                totalPages={totalPages}
                onPrev={() => setPage((current) => Math.max(current - 1, 0))}
                onNext={() =>
                  setPage((current) =>
                    totalPages > 0 ? Math.min(current + 1, totalPages - 1) : current
                  )
                }
              />
            </>
          )}
        </section>
      </div>
    </main>
  );
}
