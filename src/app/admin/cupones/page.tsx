'use client';

import { CSSProperties, useEffect, useState } from 'react';
import {
  getCupones,
  crearCupon,
  toggleCupon,
  eliminarCupon,
} from '@/lib/api';
import { CuponResponse } from '@/types';

const inputStyle: CSSProperties = {
  width: '100%',
  minHeight: '46px',
  padding: '12px 14px',
  border: '1px solid var(--border2)',
  outline: 'none',
  background: '#ffffff',
  color: 'var(--black)',
  fontSize: '14px',
  fontFamily: 'inherit',
};

export default function AdminCuponesPage() {
  const [cupones, setCupones] = useState<CuponResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [codigo, setCodigo] = useState('');
  const [porcentaje, setPorcentaje] = useState('');
  const [creando, setCreando] = useState(false);
  const [errorForm, setErrorForm] = useState('');
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [togglingId, setTogglingId] = useState<number | null>(null);

  useEffect(() => {
    cargarCupones();
  }, []);

  async function cargarCupones() {
    setLoading(true);
    setError('');
    try {
      const data = await getCupones();
      setCupones(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudieron cargar los cupones.');
    } finally {
      setLoading(false);
    }
  }

  async function handleCrear() {
    const codigoTrim = codigo.trim().toUpperCase();
    const porcentajeNum = Number(porcentaje);

    if (!codigoTrim) {
      setErrorForm('El código es obligatorio.');
      return;
    }
    if (!porcentaje || porcentajeNum < 1 || porcentajeNum > 100) {
      setErrorForm('El porcentaje debe ser entre 1 y 100.');
      return;
    }

    setCreando(true);
    setErrorForm('');
    try {
      const nuevo = await crearCupon({
        codigo: codigoTrim,
        porcentaje: porcentajeNum,
        activo: true,
      });
      setCupones((prev) => [nuevo, ...prev]);
      setCodigo('');
      setPorcentaje('');
    } catch (err) {
      setErrorForm(err instanceof Error ? err.message : 'No se pudo crear el cupón.');
    } finally {
      setCreando(false);
    }
  }

  async function handleToggle(id: number) {
    setTogglingId(id);
    try {
      const actualizado = await toggleCupon(id);
      setCupones((prev) =>
        prev.map((c) => (c.id === id ? actualizado : c))
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo actualizar el cupón.');
    } finally {
      setTogglingId(null);
    }
  }

  async function handleEliminar(id: number) {
    const confirmado = window.confirm('¿Eliminar este cupón? Esta acción no se puede deshacer.');
    if (!confirmado) return;
    setDeletingId(id);
    try {
      await eliminarCupon(id);
      setCupones((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo eliminar el cupón.');
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <main style={{ minHeight: '100vh', padding: '96px 24px 32px', background: '#fafafa' }}>
      <div style={{ maxWidth: '960px', margin: '0 auto' }}>
        <div style={{ marginBottom: '24px' }}>
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
            Cupones
          </h1>
        </div>

        <section style={{
          border: '1px solid var(--border)',
          background: '#ffffff',
          padding: '24px',
          marginBottom: '24px',
        }}>
          <p style={{
            margin: '0 0 16px',
            fontSize: '12px',
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: 'var(--gray)',
            fontWeight: 600,
          }}>
            Nuevo cupón
          </p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 160px auto',
            gap: '12px',
            alignItems: 'end',
          }}>
            <div style={{ display: 'grid', gap: '8px' }}>
              <label style={{
                fontSize: '12px',
                fontWeight: 600,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: 'var(--gray)',
              }}>
                Código *
              </label>
              <input
                type="text"
                value={codigo}
                onChange={(e) => {
                  setCodigo(e.target.value.toUpperCase());
                  setErrorForm('');
                }}
                disabled={creando}
                style={inputStyle}
                placeholder="Ej. VERANO20"
              />
            </div>

            <div style={{ display: 'grid', gap: '8px' }}>
              <label style={{
                fontSize: '12px',
                fontWeight: 600,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: 'var(--gray)',
              }}>
                Descuento % *
              </label>
              <input
                type="number"
                min="1"
                max="100"
                value={porcentaje}
                onChange={(e) => {
                  setPorcentaje(e.target.value);
                  setErrorForm('');
                }}
                disabled={creando}
                style={inputStyle}
                placeholder="20"
              />
            </div>

            <button
              type="button"
              onClick={handleCrear}
              disabled={creando}
              style={{
                height: '46px',
                padding: '0 24px',
                border: 'none',
                background: 'var(--accent)',
                color: '#ffffff',
                fontSize: '13px',
                fontWeight: 600,
                cursor: creando ? 'not-allowed' : 'pointer',
                opacity: creando ? 0.7 : 1,
                whiteSpace: 'nowrap',
              }}
            >
              {creando ? 'Creando...' : 'Crear cupón'}
            </button>
          </div>

          {errorForm && (
            <p style={{ margin: '10px 0 0', fontSize: '13px', color: '#b42318' }}>
              {errorForm}
            </p>
          )}
        </section>

        <section style={{
          border: '1px solid var(--border)',
          background: '#ffffff',
          overflow: 'hidden',
        }}>
          {loading ? (
            <div style={{
              padding: '48px 24px',
              textAlign: 'center',
              color: 'var(--gray)',
              fontSize: '15px',
            }}>
              Cargando cupones...
            </div>
          ) : error ? (
            <div style={{
              padding: '48px 24px',
              textAlign: 'center',
              color: '#b42318',
              fontSize: '15px',
            }}>
              {error}
            </div>
          ) : cupones.length === 0 ? (
            <div style={{
              padding: '48px 24px',
              textAlign: 'center',
              color: 'var(--gray)',
              fontSize: '15px',
            }}>
              No hay cupones creados.
            </div>
          ) : (
            <div style={{ width: '100%', overflowX: 'auto' }}>
              <table style={{
                width: '100%',
                borderCollapse: 'collapse',
                minWidth: '600px',
              }}>
                <thead>
                  <tr style={{ background: 'var(--card)' }}>
                    {['Código', 'Descuento', 'Estado', 'Creado', 'Acciones'].map((title) => (
                      <th key={title} style={{
                        padding: '16px',
                        textAlign: 'left',
                        fontSize: '12px',
                        letterSpacing: '0.08em',
                        textTransform: 'uppercase',
                        color: 'var(--gray)',
                        borderBottom: '1px solid var(--border)',
                        whiteSpace: 'nowrap',
                      }}>
                        {title}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {cupones.map((cupon) => (
                    <tr key={cupon.id}>
                      <td style={{
                        padding: '16px',
                        borderBottom: '1px solid var(--border)',
                        fontSize: '14px',
                        fontWeight: 600,
                        color: 'var(--black)',
                      }}>
                        {cupon.codigo}
                      </td>
                      <td style={{
                        padding: '16px',
                        borderBottom: '1px solid var(--border)',
                        fontSize: '14px',
                        color: 'var(--black)',
                      }}>
                        {cupon.porcentaje}%
                      </td>
                      <td style={{
                        padding: '16px',
                        borderBottom: '1px solid var(--border)',
                      }}>
                        <span style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          padding: '6px 10px',
                          fontSize: '12px',
                          fontWeight: 600,
                          background: cupon.activo
                            ? 'rgba(18, 183, 106, 0.12)'
                            : 'rgba(152, 162, 179, 0.18)',
                          color: cupon.activo ? '#027a48' : '#475467',
                        }}>
                          {cupon.activo ? 'Activo' : 'Inactivo'}
                        </span>
                      </td>
                      <td style={{
                        padding: '16px',
                        borderBottom: '1px solid var(--border)',
                        fontSize: '14px',
                        color: 'var(--gray)',
                        whiteSpace: 'nowrap',
                      }}>
                        {new Date(cupon.fechaCreacion).toLocaleDateString('es-AR')}
                      </td>
                      <td style={{
                        padding: '16px',
                        borderBottom: '1px solid var(--border)',
                      }}>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button
                            type="button"
                            onClick={() => handleToggle(cupon.id)}
                            disabled={togglingId === cupon.id}
                            style={{
                              border: '1px solid var(--border2)',
                              background: 'transparent',
                              color: 'var(--black)',
                              padding: '6px 14px',
                              fontSize: '12px',
                              fontWeight: 600,
                              cursor: togglingId === cupon.id ? 'not-allowed' : 'pointer',
                              opacity: togglingId === cupon.id ? 0.6 : 1,
                              whiteSpace: 'nowrap',
                            }}
                          >
                            {cupon.activo ? 'Desactivar' : 'Activar'}
                          </button>
                          <button
                            type="button"
                            onClick={() => handleEliminar(cupon.id)}
                            disabled={deletingId === cupon.id}
                            style={{
                              border: '1px solid var(--border)',
                              background: 'transparent',
                              color: deletingId === cupon.id ? 'var(--gray)' : '#cc3333',
                              width: '34px',
                              height: '34px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              cursor: deletingId === cupon.id ? 'not-allowed' : 'pointer',
                              opacity: deletingId === cupon.id ? 0.5 : 1,
                            }}
                          >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                              stroke="currentColor" strokeWidth="1.8">
                              <polyline points="3 6 5 6 21 6" />
                              <path d="M19 6l-1 14H6L5 6" />
                              <path d="M10 11v6M14 11v6" />
                              <path d="M9 6V4h6v2" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
