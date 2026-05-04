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
  const [filtroEstado, setFiltroEstado] = useState('');
  const [filtroBusqueda, setFiltroBusqueda] = useState('');
  const [filtroFechaDesde, setFiltroFechaDesde] = useState('');
  const [filtroFechaHasta, setFiltroFechaHasta] = useState('');

  useEffect(() => {
    let active = true;

    async function loadOrdenes() {
      setLoading(true);
      setError('');

      try {
        const response = await getOrdenes(page, 10, {
          estado: filtroEstado || undefined,
          busqueda: filtroBusqueda || undefined,
          fechaDesde: filtroFechaDesde || undefined,
          fechaHasta: filtroFechaHasta || undefined,
        });
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
  }, [page, filtroEstado, filtroBusqueda, filtroFechaDesde, filtroFechaHasta]);

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

        <div
          style={{
            display: 'flex',
            gap: '12px',
            marginBottom: '16px',
            flexWrap: 'wrap',
            alignItems: 'flex-end',
          }}
        >
          <input
            type="text"
            placeholder="Buscar por nombre o email..."
            value={filtroBusqueda}
            onChange={(e) => {
              setFiltroBusqueda(e.target.value);
              setPage(0);
            }}
            style={{
              height: '40px',
              padding: '0 14px',
              border: '1px solid var(--border2)',
              fontSize: '13px',
              fontFamily: 'var(--font-dm-sans)',
              outline: 'none',
              minWidth: '260px',
              background: '#ffffff',
              color: 'var(--black)',
            }}
          />

          <select
            value={filtroEstado}
            onChange={(e) => {
              setFiltroEstado(e.target.value);
              setPage(0);
            }}
            style={{
              height: '40px',
              padding: '0 12px',
              border: '1px solid var(--border2)',
              fontSize: '13px',
              fontFamily: 'var(--font-dm-sans)',
              outline: 'none',
              background: '#ffffff',
              color: 'var(--black)',
              cursor: 'pointer',
            }}
          >
            <option value="">Todos los estados</option>
            <option value="APROBADO">Aprobado</option>
            <option value="PENDIENTE">Pendiente</option>
            <option value="RECHAZADO">Rechazado</option>
            <option value="CANCELADO">Cancelado</option>
          </select>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <span
              style={{
                fontSize: '11px',
                fontWeight: 600,
                letterSpacing: '1px',
                textTransform: 'uppercase',
                color: 'var(--gray)',
              }}
            >
              Desde
            </span>
            <input
              type="date"
              value={filtroFechaDesde}
              onChange={(e) => {
                setFiltroFechaDesde(e.target.value);
                setPage(0);
              }}
              style={{
                height: '40px',
                padding: '0 12px',
                border: '1px solid var(--border2)',
                fontSize: '13px',
                fontFamily: 'var(--font-dm-sans)',
                outline: 'none',
                background: '#ffffff',
                color: 'var(--black)',
                cursor: 'pointer',
              }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <span
              style={{
                fontSize: '11px',
                fontWeight: 600,
                letterSpacing: '1px',
                textTransform: 'uppercase',
                color: 'var(--gray)',
              }}
            >
              Hasta
            </span>
            <input
              type="date"
              value={filtroFechaHasta}
              onChange={(e) => {
                setFiltroFechaHasta(e.target.value);
                setPage(0);
              }}
              style={{
                height: '40px',
                padding: '0 12px',
                border: '1px solid var(--border2)',
                fontSize: '13px',
                fontFamily: 'var(--font-dm-sans)',
                outline: 'none',
                background: '#ffffff',
                color: 'var(--black)',
                cursor: 'pointer',
              }}
            />
          </div>

          <button
            type="button"
            onClick={() => {
              const hoy = new Date().toISOString().split('T')[0];
              setFiltroFechaDesde(hoy);
              setFiltroFechaHasta(hoy);
              setPage(0);
            }}
            style={{
              height: '40px',
              padding: '0 16px',
              border: '1px solid var(--border2)',
              background: 'transparent',
              color: 'var(--black)',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer',
              fontFamily: 'var(--font-dm-sans)',
              alignSelf: 'flex-end',
            }}
          >
            Hoy
          </button>

          {(filtroEstado || filtroBusqueda || filtroFechaDesde || filtroFechaHasta) && (
            <button
              type="button"
              onClick={() => {
                setFiltroEstado('');
                setFiltroBusqueda('');
                setFiltroFechaDesde('');
                setFiltroFechaHasta('');
                setPage(0);
              }}
              style={{
                height: '40px',
                padding: '0 16px',
                border: '1px solid var(--border2)',
                background: 'transparent',
                color: 'var(--gray)',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer',
                fontFamily: 'var(--font-dm-sans)',
                alignSelf: 'flex-end',
              }}
            >
              Limpiar filtros
            </button>
          )}
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
