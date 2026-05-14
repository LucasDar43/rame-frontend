'use client'

import { useEffect, useState, CSSProperties } from 'react'
import { getZonasEnvio, actualizarZonaEnvio } from '@/lib/api'
import { ZonaEnvio } from '@/types'

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
}

export default function ZonasPage() {
  const [zonas, setZonas] = useState<ZonaEnvio[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [editingId, setEditingId] = useState<number | null>(null)
  const [saving, setSaving] = useState(false)
  const [formCosto, setFormCosto] = useState('')
  const [formDescripcion, setFormDescripcion] = useState('')
  const [formError, setFormError] = useState('')

  useEffect(() => {
    getZonasEnvio()
      .then(setZonas)
      .catch(() => setError('No se pudieron cargar las zonas.'))
      .finally(() => setLoading(false))
  }, [])

  function handleEditar(zona: ZonaEnvio) {
    setEditingId(zona.id)
    setFormCosto(String(zona.costo))
    setFormDescripcion(zona.descripcion ?? '')
    setFormError('')
  }

  function handleCancelar() {
    setEditingId(null)
    setFormCosto('')
    setFormDescripcion('')
    setFormError('')
  }

  async function handleGuardar(id: number) {
    const costoNum = Number(formCosto)

    if (formCosto.trim() === '' || !Number.isFinite(costoNum) || costoNum < 0) {
      setFormError('El costo debe ser un número mayor o igual a 0.')
      return
    }

    setSaving(true)
    setFormError('')

    try {
      const actualizada = await actualizarZonaEnvio(id, {
        costo: costoNum,
        descripcion: formDescripcion.trim() || undefined,
      })
      setZonas(prev => prev.map(z => z.id === id ? actualizada : z))
      setEditingId(null)
      setFormCosto('')
      setFormDescripcion('')
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'No se pudo guardar.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <main style={{ minHeight: '100vh', padding: '96px 24px 32px', background: '#fafafa' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <p style={{ fontSize: '12px', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--gray)', margin: '0 0 8px' }}>
          Panel admin
        </p>
        <h1 style={{ fontSize: '32px', lineHeight: 1.1, fontWeight: 600, color: 'var(--black)', margin: '0 0 8px' }}>
          Zonas de envío
        </h1>
        <p style={{ fontSize: '14px', color: 'var(--gray)', margin: '0 0 24px' }}>
          Configurá el precio de envío para cada zona. La lógica de asignación por código postal no cambia.
        </p>

        <section style={{ border: '1px solid var(--border)', background: '#fff', overflow: 'hidden' }}>
          {loading && (
            <div style={{ padding: '48px 24px', textAlign: 'center', color: 'var(--gray)' }}>
              Cargando zonas...
            </div>
          )}

          {error && !loading && (
            <div style={{ padding: '48px 24px', textAlign: 'center', color: '#b42318' }}>
              {error}
            </div>
          )}

          {!loading && !error && (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead style={{ background: 'var(--card)' }}>
                <tr>
                  {['Zona', 'Descripción', 'Costo actual', 'Acciones'].map(column => (
                    <th
                      key={column}
                      style={{
                        padding: '16px',
                        textAlign: 'left',
                        fontSize: '12px',
                        letterSpacing: '0.08em',
                        textTransform: 'uppercase',
                        color: 'var(--gray)',
                        borderBottom: '1px solid var(--border)',
                      }}
                    >
                      {column}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {zonas.map(zona => (
                  editingId === zona.id ? (
                    <tr key={zona.id}>
                      <td style={{ padding: '16px', borderBottom: '1px solid var(--border)' }}>
                        <div style={{ fontWeight: 600, fontSize: '14px', color: 'var(--black)' }}>
                          {zona.nombre}
                        </div>
                        <div style={{ fontSize: '11px', color: 'var(--gray)', marginTop: '4px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                          {zona.codigo}
                        </div>
                      </td>
                      <td style={{ padding: '16px', borderBottom: '1px solid var(--border)' }}>
                        <input
                          style={inputStyle}
                          value={formDescripcion}
                          onChange={e => setFormDescripcion(e.target.value)}
                          disabled={saving}
                          placeholder="Descripción de la zona"
                        />
                      </td>
                      <td style={{ padding: '16px', borderBottom: '1px solid var(--border)' }}>
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                          <span style={{ fontSize: '14px', color: 'var(--gray)' }}>$</span>
                          <input
                            type="number"
                            min="0"
                            step="1"
                            style={{ ...inputStyle, maxWidth: '140px' }}
                            value={formCosto}
                            onChange={e => { setFormCosto(e.target.value); setFormError('') }}
                            disabled={saving}
                            placeholder="0"
                          />
                        </div>
                        {formError && (
                          <p style={{ fontSize: '12px', color: '#b42318', margin: '6px 0 0' }}>
                            {formError}
                          </p>
                        )}
                      </td>
                      <td style={{ padding: '16px', borderBottom: '1px solid var(--border)' }}>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button
                            type="button"
                            onClick={() => handleGuardar(zona.id)}
                            disabled={saving}
                            style={{
                              height: '36px',
                              padding: '0 16px',
                              border: 'none',
                              background: 'var(--accent)',
                              color: '#fff',
                              fontSize: '12px',
                              fontWeight: 600,
                              cursor: 'pointer',
                              opacity: saving ? 0.7 : 1,
                            }}
                          >
                            Guardar
                          </button>
                          <button
                            type="button"
                            onClick={handleCancelar}
                            disabled={saving}
                            style={{
                              height: '36px',
                              padding: '0 16px',
                              border: '1px solid var(--border2)',
                              background: 'transparent',
                              color: 'var(--black)',
                              fontSize: '12px',
                              fontWeight: 600,
                              cursor: 'pointer',
                            }}
                          >
                            Cancelar
                          </button>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    <tr key={zona.id}>
                      <td style={{ padding: '16px', borderBottom: '1px solid var(--border)' }}>
                        <div style={{ fontWeight: 600, fontSize: '14px', color: 'var(--black)' }}>
                          {zona.nombre}
                        </div>
                        <div style={{ fontSize: '11px', color: 'var(--gray)', marginTop: '4px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                          {zona.codigo}
                        </div>
                      </td>
                      <td style={{ padding: '16px', borderBottom: '1px solid var(--border)' }}>
                        <span style={{ fontSize: '14px', color: 'var(--gray)' }}>{zona.descripcion || '—'}</span>
                      </td>
                      <td style={{ padding: '16px', borderBottom: '1px solid var(--border)' }}>
                        <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--black)' }}>
                          ${zona.costo.toLocaleString('es-AR')}
                        </span>
                      </td>
                      <td style={{ padding: '16px', borderBottom: '1px solid var(--border)' }}>
                        <button
                          type="button"
                          onClick={() => handleEditar(zona)}
                          disabled={editingId !== null}
                          style={{
                            border: '1px solid var(--border)',
                            background: 'transparent',
                            color: 'var(--black)',
                            height: '34px',
                            padding: '0 14px',
                            cursor: editingId !== null ? 'not-allowed' : 'pointer',
                            fontSize: '12px',
                            fontWeight: 600,
                            letterSpacing: '0.04em',
                            textTransform: 'uppercase',
                            opacity: editingId !== null ? 0.5 : 1,
                          }}
                        >
                          Editar
                        </button>
                      </td>
                    </tr>
                  )
                ))}
              </tbody>
            </table>
          )}
        </section>
      </div>
    </main>
  )
}
