'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { cambiarEstadoOperativo, getOrden } from '@/lib/api';
import { OrdenResponse } from '@/types';
import type { EstadoOperativo } from '@/types';

export default function AdminOrdenDetallePage() {
  const params = useParams();
  const router = useRouter();

  const rawId = Array.isArray(params.id) ? params.id[0] : params.id;
  const ordenId = Number(rawId);

  const [orden, setOrden] = useState<OrdenResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cambiandoEstado, setCambiandoEstado] = useState(false);
  const [errorEstado, setErrorEstado] = useState('');

  useEffect(() => {
    let active = true;

    if (!ordenId) {
      setLoading(false);
      setOrden(null);
      setError('');
      return;
    }

    async function loadOrden() {
      setLoading(true);
      setError('');

      try {
        const response = await getOrden(ordenId);
        if (!active) return;
        setOrden(response);
      } catch (err) {
        if (!active) return;
        setError(err instanceof Error ? err.message : 'No se pudo cargar la orden');
        setOrden(null);
      } finally {
        if (active) setLoading(false);
      }
    }

    loadOrden();

    return () => {
      active = false;
    };
  }, [ordenId]);

  const currencyFormatter = new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

  const estadoStyles: Record<
    OrdenResponse['estado'],
    { background: string; color: string }
  > = {
    APROBADO: { background: 'rgba(18, 183, 106, 0.12)', color: '#027a48' },
    PENDIENTE: { background: 'rgba(234, 179, 8, 0.12)', color: '#854d0e' },
    RECHAZADO: { background: 'rgba(220, 38, 38, 0.12)', color: '#dc2626' },
    CANCELADO: { background: 'rgba(152, 162, 179, 0.18)', color: '#475467' },
  };

  const handleCambiarEstado = async (nuevoEstado: EstadoOperativo) => {
    if (!orden) return;

    const confirmar = window.confirm(
      'Vas a cambiar el estado de esta orden. ¿Confirmás la operación?'
    );
    if (!confirmar) return;

    setCambiandoEstado(true);
    setErrorEstado('');
    try {
      const actualizada = await cambiarEstadoOperativo(orden.id, nuevoEstado);
      setOrden(actualizada);
    } catch (err) {
      setErrorEstado(err instanceof Error ? err.message : 'No se pudo actualizar el estado.');
    } finally {
      setCambiandoEstado(false);
    }
  };

  if (!ordenId) {
    return <div style={{ padding: '32px' }}>Orden inválida</div>;
  }

  if (loading) {
    return <div style={{ padding: '32px' }}>Cargando orden...</div>;
  }

  if (error || !orden) {
    return (
      <div style={{ padding: '32px', color: '#b42318' }}>
        {error || 'No se pudo cargar la orden'}
      </div>
    );
  }

  const badgeStyle = estadoStyles[orden.estado];

  return (
    <main style={{ background: '#fafafa', minHeight: '100vh', padding: '32px 24px' }}>
      <div style={{ maxWidth: '960px', margin: '0 auto' }}>
        <div
          style={{
            marginBottom: '24px',
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            gap: '16px',
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
              Orden #{orden.id}
            </h1>
          </div>

          <button
            type="button"
            onClick={() => router.push('/admin/ordenes')}
            style={{
              border: '1px solid var(--border2)',
              background: 'transparent',
              color: 'var(--black)',
              padding: '10px 20px',
              fontSize: '12px',
              fontWeight: 600,
              letterSpacing: '1.5px',
              textTransform: 'uppercase',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
            }}
          >
            Volver a órdenes
          </button>
        </div>

        <section
          style={{
            border: '1px solid var(--border)',
            background: '#ffffff',
            padding: '24px',
            marginBottom: '24px',
          }}
        >
          <h2
            style={{
              margin: '0 0 20px',
              fontSize: '18px',
              fontWeight: 600,
              color: 'var(--black)',
            }}
          >
            Datos del cliente
          </h2>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '20px',
            }}
          >
            <div>
              <p
                style={{
                  margin: '0 0 6px',
                  fontSize: '12px',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: 'var(--gray)',
                }}
              >
                Nombre
              </p>
              <p style={{ margin: 0, fontSize: '15px', color: 'var(--black)' }}>
                {orden.nombreComprador}
              </p>
            </div>

            <div>
              <p
                style={{
                  margin: '0 0 6px',
                  fontSize: '12px',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: 'var(--gray)',
                }}
              >
                Email
              </p>
              <p style={{ margin: 0, fontSize: '15px', color: 'var(--black)' }}>
                {orden.emailComprador}
              </p>
            </div>

            <div>
              <p
                style={{
                  margin: '0 0 6px',
                  fontSize: '12px',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: 'var(--gray)',
                }}
              >
                Fecha
              </p>
              <p style={{ margin: 0, fontSize: '15px', color: 'var(--black)' }}>
                {new Date(orden.fechaCreacion).toLocaleString('es-AR')}
              </p>
            </div>

            <div>
              <p
                style={{
                  margin: '0 0 6px',
                  fontSize: '12px',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: 'var(--gray)',
                }}
              >
                Estado
              </p>
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
            </div>
          </div>

          <div style={{ marginTop: '24px', paddingTop: '24px', borderTop: '1px solid var(--border)' }}>
            <p style={{
              margin: '0 0 12px',
              fontSize: '12px',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: 'var(--gray)',
            }}>
              Estado operativo
            </p>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {(
                  [
                    { value: 'PENDIENTE_PREPARACION', label: 'Pendiente de preparación' },
                    { value: 'EN_PREPARACION',        label: 'En preparación' },
                    { value: 'LISTO_PARA_ENVIO',      label: 'Listo para envío' },
                    { value: 'ENVIADO',               label: 'Enviado' },
                    { value: 'ENTREGADO',             label: 'Entregado' },
                  ] as const
                ).map((opcion) => {
                  const activo = orden.estadoOperativo === opcion.value;
                  return (
                    <button
                      key={opcion.value}
                      type="button"
                      onClick={() => handleCambiarEstado(opcion.value)}
                      disabled={cambiandoEstado || activo}
                      style={{
                        height: '36px',
                        padding: '0 16px',
                        border: activo ? 'none' : '1px solid var(--border2)',
                        background: activo ? '#111111' : '#ffffff',
                        color: activo ? '#ffffff' : 'var(--black)',
                        fontSize: '12px',
                        fontWeight: activo ? 600 : 400,
                        letterSpacing: '0.04em',
                        cursor: cambiandoEstado || activo ? 'not-allowed' : 'pointer',
                        opacity: cambiandoEstado && !activo ? 0.6 : 1,
                        fontFamily: 'var(--font-dm-sans)',
                        whiteSpace: 'nowrap',
                        transition: 'background 0.15s ease, color 0.15s ease',
                      }}
                    >
                      {opcion.label}
                    </button>
                  );
                })}
              </div>

              {cambiandoEstado && (
                <span style={{ fontSize: '13px', color: 'var(--gray)' }}>Guardando...</span>
              )}

              {errorEstado && (
                <span style={{ fontSize: '13px', color: '#b42318' }}>{errorEstado}</span>
              )}
            </div>
          </div>
        </section>

        <section
          style={{
            border: '1px solid var(--border)',
            background: '#ffffff',
            padding: '24px',
            marginBottom: '24px',
          }}
        >
          <h2
            style={{
              margin: '0 0 20px',
              fontSize: '18px',
              fontWeight: 600,
              color: 'var(--black)',
            }}
          >
            Productos
          </h2>

          <div style={{ width: '100%', overflowX: 'auto' }}>
            <table
              style={{
                width: '100%',
                borderCollapse: 'collapse',
                minWidth: '640px',
              }}
            >
              <thead>
                <tr style={{ background: 'var(--card)' }}>
                  {['Producto', 'Cantidad', 'Precio unitario', 'Subtotal'].map((title) => (
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
                {orden.items?.map((item) => {
                  const subtotal = item.precioUnitario * item.cantidad;

                  return (
                    <tr key={`${item.productoId}-${item.nombreProducto}`}>
                      <td
                        style={{
                          padding: '16px',
                          borderBottom: '1px solid var(--border)',
                          color: 'var(--black)',
                          fontSize: '14px',
                          fontWeight: 500,
                        }}
                      >
                        {item.nombreProducto}
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
                        {item.cantidad}
                      </td>
                      <td
                        style={{
                          padding: '16px',
                          borderBottom: '1px solid var(--border)',
                          color: 'var(--black)',
                          fontSize: '14px',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {currencyFormatter.format(item.precioUnitario)}
                      </td>
                      <td
                        style={{
                          padding: '16px',
                          borderBottom: '1px solid var(--border)',
                          color: 'var(--black)',
                          fontSize: '14px',
                          fontWeight: 600,
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {currencyFormatter.format(subtotal)}
                      </td>
                    </tr>
                  );
                })}

                {orden.items?.length === 0 && (
                  <tr>
                    <td
                      colSpan={4}
                      style={{
                        padding: '24px 16px',
                        textAlign: 'center',
                        color: 'var(--gray)',
                        fontSize: '14px',
                      }}
                    >
                      Esta orden no tiene productos cargados.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        <section
          style={{
            border: '1px solid var(--border)',
            background: '#ffffff',
            padding: '24px',
          }}
        >
          <h2
            style={{
              margin: '0 0 20px',
              fontSize: '18px',
              fontWeight: 600,
              color: 'var(--black)',
            }}
          >
            Resumen
          </h2>

          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
            }}
          >
            <div style={{ textAlign: 'right' }}>
              <p
                style={{
                  margin: '0 0 8px',
                  fontSize: '12px',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: 'var(--gray)',
                }}
              >
                Total
              </p>
              <p
                style={{
                  margin: 0,
                  fontSize: '18px',
                  fontWeight: 700,
                  color: 'var(--black)',
                }}
              >
                {currencyFormatter.format(orden.total)}
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
