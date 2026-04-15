'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { OrdenResumen } from '@/types';

type OrdenesTableProps = {
  ordenes: OrdenResumen[];
};

const currencyFormatter = new Intl.NumberFormat('es-AR', {
  style: 'currency',
  currency: 'ARS',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

const estadoStyles: Record<
  OrdenResumen['estado'],
  { background: string; color: string }
> = {
  APROBADO: {
    background: 'rgba(18, 183, 106, 0.12)',
    color: '#027a48',
  },
  PENDIENTE: {
    background: 'rgba(234, 179, 8, 0.12)',
    color: '#854d0e',
  },
  RECHAZADO: {
    background: 'rgba(220, 38, 38, 0.12)',
    color: '#dc2626',
  },
  CANCELADO: {
    background: 'rgba(152, 162, 179, 0.18)',
    color: '#475467',
  },
};

export default function OrdenesTable({ ordenes }: OrdenesTableProps) {
  const router = useRouter();
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  if (ordenes.length === 0) {
    return (
      <div
        style={{
          padding: '48px 24px',
          textAlign: 'center',
          color: 'var(--gray)',
          fontSize: '15px',
        }}
      >
        No hay órdenes registradas.
      </div>
    );
  }

  return (
    <div style={{ width: '100%', overflowX: 'auto' }}>
      <table
        style={{
          minWidth: '960px',
          borderCollapse: 'collapse',
          width: '100%',
        }}
      >
        <thead>
          <tr style={{ background: 'var(--card)' }}>
            {['ID', 'Cliente', 'Email', 'Total', 'Estado', 'Fecha', 'Acción'].map((title) => (
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
          {ordenes.map((orden) => {
            const badgeStyle = estadoStyles[orden.estado];
            const isHovered = hoveredId === orden.id;

            return (
              <tr key={orden.id}>
                <td
                  style={{
                    padding: '16px',
                    borderBottom: '1px solid var(--border)',
                    color: 'var(--black)',
                    fontSize: '14px',
                    whiteSpace: 'nowrap',
                  }}
                >
                  #{orden.id}
                </td>
                <td
                  style={{
                    padding: '16px',
                    borderBottom: '1px solid var(--border)',
                    color: 'var(--black)',
                    fontSize: '14px',
                    fontWeight: 500,
                  }}
                >
                  {orden.nombreComprador}
                </td>
                <td
                  style={{
                    padding: '16px',
                    borderBottom: '1px solid var(--border)',
                    color: 'var(--gray)',
                    fontSize: '14px',
                  }}
                >
                  {orden.emailComprador}
                </td>
                <td
                  style={{
                    padding: '16px',
                    borderBottom: '1px solid var(--border)',
                    color: 'var(--black)',
                    fontSize: '14px',
                    fontWeight: 500,
                    whiteSpace: 'nowrap',
                  }}
                >
                  {currencyFormatter.format(orden.total)}
                </td>
                <td
                  style={{
                    padding: '16px',
                    borderBottom: '1px solid var(--border)',
                  }}
                >
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      padding: '6px 10px',
                      borderRadius: '999px',
                      fontSize: '12px',
                      fontWeight: 600,
                      background: badgeStyle.background,
                      color: badgeStyle.color,
                    }}
                  >
                    {orden.estado}
                  </span>
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
                  {new Date(orden.fechaCreacion).toLocaleString('es-AR')}
                </td>
                <td
                  style={{
                    padding: '16px',
                    borderBottom: '1px solid var(--border)',
                  }}
                >
                  <button
                    type="button"
                    onClick={() => router.push(`/admin/ordenes/${orden.id}`)}
                    onMouseEnter={() => setHoveredId(orden.id)}
                    onMouseLeave={() => setHoveredId((current) => (current === orden.id ? null : current))}
                    style={{
                      border: '1px solid var(--border)',
                      background: isHovered ? 'var(--card)' : 'transparent',
                      color: 'var(--black)',
                      height: '34px',
                      padding: '0 14px',
                      cursor: 'pointer',
                      fontSize: '12px',
                      fontWeight: 600,
                      letterSpacing: '0.04em',
                      textTransform: 'uppercase',
                      whiteSpace: 'nowrap',
                      transition: 'background 0.2s ease',
                    }}
                  >
                    Ver detalle
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
