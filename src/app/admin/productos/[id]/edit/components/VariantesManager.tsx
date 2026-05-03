'use client';

import { useState, type CSSProperties } from 'react';
import { actualizarVariante, crearVariante, eliminarVariante } from '@/lib/api';
import { Producto, Variante } from '@/types';

type VariantesManagerProps = {
  productoId: number;
  producto: Producto;
  variantesIniciales: Variante[];
  onVariantesChange?: () => void;
};

type VarianteFormState = {
  talle: string;
  color: string;
  stock: string;
  sku: string;
};

const emptyForm: VarianteFormState = {
  talle: '',
  color: '',
  stock: '',
  sku: '',
};

const tableInputStyle: CSSProperties = {
  border: '1px solid var(--border2)',
  padding: '4px 8px',
  fontSize: '14px',
  width: '100%',
  outline: 'none',
  fontFamily: 'var(--font-dm-sans)',
};

const iconButtonStyle: React.CSSProperties = {
  width: '34px',
  height: '34px',
  border: '1px solid var(--border)',
  background: 'transparent',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
};

function validateVarianteForm(data: VarianteFormState): string {
  if (!data.talle.trim()) {
    return 'El talle es obligatorio.';
  }

  if (!data.color.trim()) {
    return 'El color es obligatorio.';
  }

  if (data.stock.trim() === '') {
    return 'El stock es obligatorio.';
  }

  const stock = Number(data.stock);

  if (!Number.isFinite(stock) || stock < 0) {
    return 'El stock debe ser un número mayor o igual a 0.';
  }

  return '';
}

export default function VariantesManager({
  productoId,
  producto,
  variantesIniciales,
  onVariantesChange,
}: VariantesManagerProps) {
  const [variantes, setVariantes] = useState<Variante[]>(variantesIniciales);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [newRow, setNewRow] = useState<VarianteFormState>(emptyForm);
  const [editForm, setEditForm] = useState<VarianteFormState>(emptyForm);

  const handleCrear = async () => {
    const validationError = validateVarianteForm(newRow);

    if (validationError) {
      setError(validationError);
      return;
    }

    setSaving(true);

    try {
      const created = await crearVariante(productoId, {
        talle: newRow.talle.trim(),
        color: newRow.color.trim(),
        stock: Number(newRow.stock),
        sku: newRow.sku.trim() || undefined,
      });

      setVariantes((prev) => [...prev, created]);
      onVariantesChange?.();
      setNewRow(emptyForm);
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo crear la variante.');
    } finally {
      setSaving(false);
    }
  };

  const handleActualizar = async (varianteId: number) => {
    const validationError = validateVarianteForm(editForm);

    if (validationError) {
      setError(validationError);
      return;
    }

    setSaving(true);

    try {
      const updated = await actualizarVariante(productoId, varianteId, {
        talle: editForm.talle.trim(),
        color: editForm.color.trim(),
        stock: Number(editForm.stock),
        sku: editForm.sku.trim() || undefined,
      });

      setVariantes((prev) =>
        prev.map((variante) => (variante.id === varianteId ? updated : variante)),
      );
      setEditingId(null);
      setEditForm(emptyForm);
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo actualizar la variante.');
    } finally {
      setSaving(false);
    }
  };

  const handleEliminar = async (varianteId: number) => {
    const confirmed = window.confirm('¿Eliminar esta variante? Esta acción no se puede deshacer.');

    if (!confirmed) {
      return;
    }

    setDeletingId(varianteId);

    try {
      await eliminarVariante(productoId, varianteId);
      setVariantes((prev) => prev.filter((variante) => variante.id !== varianteId));
      onVariantesChange?.();

      if (editingId === varianteId) {
        setEditingId(null);
        setEditForm(emptyForm);
      }

      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo eliminar la variante.');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ marginBottom: '16px' }}>
        <p
          style={{
            margin: '0 0 8px',
            fontSize: '12px',
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: 'var(--gray)',
          }}
        >
          Variantes
        </p>

        <p
          style={{
            margin: 0,
            fontSize: '14px',
            color: 'var(--off-white)',
          }}
        >
          Gestioná las variantes de {producto.nombre}.
        </p>
      </div>

      {error !== '' && (
        <div
          style={{
            color: '#b42318',
            fontSize: '13px',
            marginBottom: '12px',
          }}
        >
          {error}
        </div>
      )}

      <div style={{ width: '100%', overflowX: 'auto' }}>
        <table
          style={{
            borderCollapse: 'collapse',
            width: '100%',
            minWidth: '760px',
          }}
        >
          <thead>
            <tr style={{ background: 'var(--card)' }}>
              {['Talle', 'Color', 'Stock', 'SKU', 'Acciones'].map((title) => (
                <th
                  key={title}
                  style={{
                    padding: '12px 14px',
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
            {variantes.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  style={{
                    padding: '20px 14px',
                    textAlign: 'center',
                    color: 'var(--gray)',
                    borderBottom: '1px solid var(--border)',
                    fontSize: '14px',
                  }}
                >
                  Sin variantes cargadas
                </td>
              </tr>
            )}

            {variantes.map((variante) => {
              const isEditing = editingId === variante.id;
              const isDeleting = deletingId === variante.id;

              return (
                <tr key={variante.id}>
                  <td style={{ padding: '12px 14px', borderBottom: '1px solid var(--border)' }}>
                    {isEditing ? (
                      <input
                        value={editForm.talle}
                        onChange={(event) =>
                          setEditForm((prev) => ({ ...prev, talle: event.target.value }))
                        }
                        style={tableInputStyle}
                      />
                    ) : (
                      <span style={{ fontSize: '14px', color: 'var(--black)' }}>
                        {variante.talle}
                      </span>
                    )}
                  </td>

                  <td style={{ padding: '12px 14px', borderBottom: '1px solid var(--border)' }}>
                    {isEditing ? (
                      <input
                        value={editForm.color}
                        onChange={(event) =>
                          setEditForm((prev) => ({ ...prev, color: event.target.value }))
                        }
                        style={tableInputStyle}
                      />
                    ) : (
                      <span style={{ fontSize: '14px', color: 'var(--black)' }}>
                        {variante.color}
                      </span>
                    )}
                  </td>

                  <td style={{ padding: '12px 14px', borderBottom: '1px solid var(--border)' }}>
                    {isEditing ? (
                      <input
                        type="number"
                        min={0}
                        value={editForm.stock}
                        onChange={(event) =>
                          setEditForm((prev) => ({ ...prev, stock: event.target.value }))
                        }
                        style={tableInputStyle}
                      />
                    ) : (
                      <span style={{ fontSize: '14px', color: 'var(--black)' }}>
                        {variante.stock}
                      </span>
                    )}
                  </td>

                  <td style={{ padding: '12px 14px', borderBottom: '1px solid var(--border)' }}>
                    {isEditing ? (
                      <input
                        value={editForm.sku}
                        onChange={(event) =>
                          setEditForm((prev) => ({ ...prev, sku: event.target.value }))
                        }
                        style={tableInputStyle}
                      />
                    ) : (
                      <span style={{ fontSize: '14px', color: 'var(--black)' }}>
                        {variante.sku || '-'}
                      </span>
                    )}
                  </td>

                  <td style={{ padding: '12px 14px', borderBottom: '1px solid var(--border)' }}>
                    {isEditing ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <button
                          type="button"
                          onClick={() => handleActualizar(variante.id)}
                          disabled={saving}
                          style={{
                            background: 'var(--accent)',
                            color: '#ffffff',
                            border: 'none',
                            padding: '6px 14px',
                            fontSize: '12px',
                            cursor: saving ? 'not-allowed' : 'pointer',
                            opacity: saving ? 0.7 : 1,
                          }}
                        >
                          Guardar
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setEditingId(null);
                            setEditForm(emptyForm);
                            setError('');
                          }}
                          disabled={saving}
                          style={{
                            background: 'transparent',
                            border: '1px solid var(--border)',
                            padding: '6px 14px',
                            fontSize: '12px',
                            cursor: saving ? 'not-allowed' : 'pointer',
                            opacity: saving ? 0.7 : 1,
                          }}
                        >
                          Cancelar
                        </button>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <button
                          type="button"
                          onClick={() => {
                            setEditingId(variante.id);
                            setEditForm({
                              talle: variante.talle,
                              color: variante.color,
                              stock: String(variante.stock),
                              sku: variante.sku ?? '',
                            });
                            setError('');
                          }}
                          title="Editar variante"
                          disabled={saving || deletingId !== null}
                          style={{
                            ...iconButtonStyle,
                            opacity: saving || deletingId !== null ? 0.6 : 1,
                            cursor: saving || deletingId !== null ? 'not-allowed' : 'pointer',
                          }}
                        >
                          <svg
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.8"
                          >
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                          </svg>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleEliminar(variante.id)}
                          title="Eliminar variante"
                          disabled={isDeleting || saving}
                          style={{
                            ...iconButtonStyle,
                            color: isDeleting ? 'var(--gray)' : '#cc3333',
                            opacity: isDeleting || saving ? 0.6 : 1,
                            cursor: isDeleting || saving ? 'not-allowed' : 'pointer',
                          }}
                        >
                          <svg
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.8"
                          >
                            <polyline points="3 6 5 6 21 6" />
                            <path d="M19 6l-1 14H6L5 6" />
                            <path d="M10 11v6M14 11v6" />
                            <path d="M9 6V4h6v2" />
                          </svg>
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}

            <tr>
              <td style={{ padding: '12px 14px', borderBottom: '1px solid var(--border)' }}>
                <input
                  value={newRow.talle}
                  onChange={(event) =>{
                    setError('');
                    setNewRow((prev) => ({ ...prev, talle: event.target.value }))
                  }}
                  disabled={saving || editingId !== null}
                  style={tableInputStyle}
                  placeholder="Talle"
                />
              </td>

              <td style={{ padding: '12px 14px', borderBottom: '1px solid var(--border)' }}>
                <input
                  value={newRow.color}
                  onChange={(event) =>{
                    setError('');
                    setNewRow((prev) => ({ ...prev, color: event.target.value }))
                  }}
                  style={tableInputStyle}
                  disabled={saving || editingId !== null}
                  placeholder="Color"
                />
              </td>

              <td style={{ padding: '12px 14px', borderBottom: '1px solid var(--border)' }}>
                <input
                  type="number"
                  min={0}
                  value={newRow.stock}
                  onChange={(event) =>{
                    setError('');
                    setNewRow((prev) => ({ ...prev, stock: event.target.value }))
                  }}
                  disabled={saving || editingId !== null}
                  style={tableInputStyle}
                  placeholder="Stock"
                />
              </td>

              <td style={{ padding: '12px 14px', borderBottom: '1px solid var(--border)' }}>
                <input
                  value={newRow.sku}
                  onChange={(event) =>{
                    setError('');
                    setNewRow((prev) => ({ ...prev, sku: event.target.value }))
                  }}
                  disabled={saving || editingId !== null}
                  style={tableInputStyle}
                  placeholder="SKU"
                />
              </td>

              <td style={{ padding: '12px 14px', borderBottom: '1px solid var(--border)' }}>
                <button
                  type="button"
                  onClick={handleCrear}
                  disabled={saving || editingId !== null}
                  style={{
                    background: 'var(--accent)',
                    color: '#ffffff',
                    border: 'none',
                    padding: '6px 14px',
                    fontSize: '12px',
                    cursor: saving || editingId !== null ? 'not-allowed' : 'pointer',
                    opacity: saving || editingId !== null ? 0.7 : 1,
                  }}
                >
                  Agregar
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
