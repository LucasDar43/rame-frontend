'use client';

import { useEffect, useState } from 'react';
import { getAuditLogs } from '@/lib/api';
import { AuditLogResponseDTO } from '@/types';

const tableHeaders = ['Fecha', 'Usuario', 'Acción', 'Entidad', 'ID', 'IP', 'Detalle'];

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '-';

  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');

  return `${day}/${month}/${year} ${hours}:${minutes}`;
}

export default function AdminAuditLogsPage() {
  const [logs, setLogs] = useState<AuditLogResponseDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    let active = true;

    async function loadAuditLogs() {
      setLoading(true);
      setError('');

      try {
        const response = await getAuditLogs(page, 20);
        if (!active) return;
        setLogs(response.content);
        setTotalPages(response.totalPages);
      } catch (err) {
        if (!active) return;
        setError(err instanceof Error ? err.message : 'No se pudieron cargar los registros de auditoría.');
        setLogs([]);
        setTotalPages(0);
      } finally {
        if (active) setLoading(false);
      }
    }

    loadAuditLogs();

    return () => {
      active = false;
    };
  }, [page]);

  const isFirstPage = page === 0;
  const isLastPage = totalPages === 0 || page >= totalPages - 1;

  return (
    <main style={{ minHeight: '100vh', padding: '96px 24px 32px', background: 'var(--card)' }}>
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
                color: 'var(--white)',
              }}
            >
              Auditoría del sistema
            </h1>
          </div>
        </div>

        <section
          style={{
            border: '1px solid var(--border)',
            background: 'var(--card)',
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
              Cargando...
            </div>
          ) : error ? (
            <div
              style={{
                padding: '48px 24px',
                textAlign: 'center',
                color: 'var(--accent)',
                fontSize: '15px',
              }}
            >
              {error}
            </div>
          ) : (
            <>
              <div style={{ width: '100%', overflowX: 'auto' }}>
                <table
                  style={{
                    minWidth: '1040px',
                    width: '100%',
                    borderCollapse: 'collapse',
                  }}
                >
                  <thead>
                    <tr style={{ background: 'var(--card)' }}>
                      {tableHeaders.map((title) => (
                        <th
                          key={title}
                          style={{
                            padding: '16px',
                            textAlign: 'left',
                            fontSize: '12px',
                            letterSpacing: '0.08em',
                            textTransform: 'uppercase',
                            color: 'var(--gray)',
                            borderBottom: '1px solid var(--border)',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {title}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {logs.length === 0 ? (
                      <tr>
                        <td
                          colSpan={tableHeaders.length}
                          style={{
                            padding: '48px 24px',
                            textAlign: 'center',
                            color: 'var(--gray)',
                            fontSize: '15px',
                            borderBottom: '1px solid var(--border)',
                          }}
                        >
                          No hay registros de auditoría para mostrar.
                        </td>
                      </tr>
                    ) : (
                      logs.map((log) => (
                        <tr key={log.id}>
                          <td
                            style={{
                              padding: '16px',
                              borderBottom: '1px solid var(--border)',
                              color: 'var(--white)',
                              fontSize: '14px',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            {formatDate(log.fecha)}
                          </td>
                          <td
                            style={{
                              padding: '16px',
                              borderBottom: '1px solid var(--border)',
                              color: 'var(--white)',
                              fontSize: '14px',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            {log.usuarioEmail}
                          </td>
                          <td
                            style={{
                              padding: '16px',
                              borderBottom: '1px solid var(--border)',
                              color: 'var(--white)',
                              fontSize: '14px',
                              fontWeight: 600,
                              whiteSpace: 'nowrap',
                            }}
                          >
                            {log.accion}
                          </td>
                          <td
                            style={{
                              padding: '16px',
                              borderBottom: '1px solid var(--border)',
                              color: 'var(--white)',
                              fontSize: '14px',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            {log.entidad}
                          </td>
                          <td
                            style={{
                              padding: '16px',
                              borderBottom: '1px solid var(--border)',
                              color: 'var(--gray)',
                              fontSize: '14px',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            {log.entidadId ?? '-'}
                          </td>
                          <td
                            style={{
                              padding: '16px',
                              borderBottom: '1px solid var(--border)',
                              color: 'var(--gray)',
                              fontSize: '14px',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            {log.ip}
                          </td>
                          <td
                            style={{
                              padding: '16px',
                              borderBottom: '1px solid var(--border)',
                              color: 'var(--gray)',
                              fontSize: '13px',
                              maxWidth: '360px',
                              whiteSpace: 'pre-wrap',
                              wordBreak: 'break-word',
                            }}
                          >
                            {log.metadataJson ?? '-'}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '16px',
                  padding: '18px 20px',
                  borderTop: '1px solid var(--border)',
                  background: 'var(--card)',
                }}
              >
                <button
                  type="button"
                  onClick={() => setPage((current) => Math.max(current - 1, 0))}
                  disabled={isFirstPage}
                  style={{
                    minWidth: '120px',
                    height: '42px',
                    border: '1px solid var(--border)',
                    background: 'var(--card)',
                    color: 'var(--white)',
                    fontSize: '14px',
                    fontWeight: 600,
                    cursor: isFirstPage ? 'not-allowed' : 'pointer',
                    opacity: isFirstPage ? 0.5 : 1,
                  }}
                >
                  Anterior
                </button>

                <span
                  style={{
                    flex: 1,
                    textAlign: 'center',
                    color: 'var(--gray)',
                    fontSize: '14px',
                  }}
                >
                  Página {totalPages === 0 ? 0 : page + 1} de {totalPages}
                </span>

                <button
                  type="button"
                  onClick={() =>
                    setPage((current) =>
                      totalPages > 0 ? Math.min(current + 1, totalPages - 1) : current
                    )
                  }
                  disabled={isLastPage}
                  style={{
                    minWidth: '120px',
                    height: '42px',
                    border: 'none',
                    background: 'var(--accent)',
                    color: 'var(--card)',
                    fontSize: '14px',
                    fontWeight: 600,
                    cursor: isLastPage ? 'not-allowed' : 'pointer',
                    opacity: isLastPage ? 0.5 : 1,
                  }}
                >
                  Siguiente
                </button>
              </div>
            </>
          )}
        </section>
      </div>
    </main>
  );
}
