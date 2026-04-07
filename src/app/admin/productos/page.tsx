'use client';

import { useEffect, useState } from 'react';
import { eliminarProducto, getProductos } from '@/lib/api';
import { Producto } from '@/types';
import ProductosTable from './components/ProductosTable';
import PaginacionControls from './components/PaginacionControls';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

export default function AdminProductosPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [toastVisible, setToastVisible] = useState(false);

  useEffect(() => {
    let active = true;

    async function loadProductos() {
      setLoading(true);
      setError('');

      try {
        const response = await getProductos(page, 20);
        if (!active) return;
        setProductos(response.content);
        setTotalPages(response.totalPages);
      } catch (err) {
        if (!active) return;
        setError(err instanceof Error ? err.message : 'No se pudieron cargar los productos.');
        setProductos([]);
        setTotalPages(0);
      } finally {
        if (active) setLoading(false);
      }
    }

    loadProductos();
    return () => { active = false; };
  }, [page]);

    useEffect(() => {
      if (searchParams.get('creado') === '1') {
        setToastVisible(true);
        setTimeout(() => {
          setToastVisible(false);
          router.replace('/admin/productos');
        }, 3000);
      }
    }, []);

  const handleEliminar = async (id: number) => {
    const confirmado = window.confirm('¿Eliminar este producto? Esta acción no se puede deshacer.');
    if (!confirmado) return;

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
    <main style={{ minHeight: '100vh', padding: '96px 24px 32px', background: '#fafafa' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>

        <div style={{
          marginBottom: '24px',
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
        }}>
          <div>
            <p style={{
              margin: '0 0 8px',
              fontSize: '12px',
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: 'var(--gray)',
            }}>
              Panel admin
            </p>
            <h1 style={{
              margin: 0,
              fontSize: '32px',
              lineHeight: 1.1,
              fontWeight: 600,
              color: 'var(--black)',
            }}>
              Productos
            </h1>
          </div>

          <Link href="/admin/productos/nuevo" style={{
            display: 'inline-flex',
            alignItems: 'center',
            padding: '10px 20px',
            background: '#111111',
            color: '#ffffff',
            textDecoration: 'none',
            fontSize: '12px',
            fontWeight: 600,
            letterSpacing: '1.5px',
            textTransform: 'uppercase',
          }}>
            Nuevo producto
          </Link>
        </div>

        <section style={{
          border: '1px solid var(--border)',
          background: '#ffffff',
          overflow: 'hidden',
        }}>
          {loading ? (
            <div style={{ padding: '48px 24px', textAlign: 'center', color: 'var(--gray)', fontSize: '15px' }}>
              Cargando productos...
            </div>
          ) : error ? (
            <div style={{ padding: '48px 24px', textAlign: 'center', color: '#b42318', fontSize: '15px' }}>
              {error}
            </div>
          ) : productos.length === 0 ? (
            <div style={{ padding: '48px 24px', textAlign: 'center', color: 'var(--gray)', fontSize: '15px' }}>
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
                onNext={() => setPage((current) => totalPages > 0 ? Math.min(current + 1, totalPages - 1) : current)}
              />
            </>
          )}
        </section>
        {toastVisible && (
                        <div style={{
                          position: 'fixed',
                          bottom: '32px',
                          right: '32px',
                          background: '#111111',
                          color: '#ffffff',
                          padding: '14px 24px',
                          fontSize: '13px',
                          fontWeight: 500,
                          letterSpacing: '0.5px',
                          zIndex: 999,
                          boxShadow: '0 4px 24px rgba(0,0,0,0.18)',
                        }}>
                          Producto creado correctamente
                        </div>
                      )}
      </div>
    </main>
  );
}
