'use client';

import { useEffect, useState } from 'react';
import { getOrdenes } from '@/lib/api';
import { OrdenResumen } from '@/types';
import OrdenesTable from './components/OrdenesTable';
import PaginacionControls from '@/app/admin/productos/components/PaginacionControls';

export default function AdminOrdenesPage() {
  const [ordenes, setOrdenes] = useState<OrdenResumen[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    let active = true;

    async function loadOrdenes() {
      setLoading(true);
      setError('');

      try {
        const response = await getOrdenes(page, 10);
        if (!active) return;
        setOrdenes(response.content);
        setTotalPages(response.totalPages);
      } catch (err) {
        if (!active) return;
        setError(err instanceof Error ? err.message : 'No se pudieron cargar las órdenes.');
        setOrdenes([]);
        setTotalPages(0);
      } finally {
        if (active) setLoading(false);
      }
    }

    loadOrdenes();

    return () => {
      active = false;
    };
  }, [page]);

  return (
    <main style={{ minHeight: '100vh', padding: '96px 24px 32px', background: '#fafafa' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        <div
          style={{
            marginBottom: '24px',
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
          }}
        >
          <div>
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
              Órdenes
            </h1>
          </div>
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
              Cargando órdenes...
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
          ) : (
            <>
              <OrdenesTable ordenes={ordenes} />
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
