'use client';

import { useEffect, useState, type FormEvent } from 'react';
import { actualizarProducto } from '@/lib/api';
import { Producto } from '@/types';

type ProductoEditFormProps = {
  producto: Producto;
  onGuardado?: () => void;
};

type FormState = {
  nombre: string;
  descripcion: string;
  precio: string;
  precioOriginal: string;
  marca: string;
  categoria: string;
  subcategoria: string;
};

const CATEGORIAS = ['Mujer', 'Hombre', 'Liquidacion', 'Novedades'];

const inputStyle: React.CSSProperties = {
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

function getInitialFormState(producto: Producto): FormState {
  return {
    nombre: producto.nombre,
    descripcion: producto.descripcion ?? '',
    precio: String(producto.precio),
    precioOriginal: producto.precioOriginal ? String(producto.precioOriginal) : '',
    marca: producto.marca,
    categoria: producto.categoria,
    subcategoria: producto.subcategoria ?? '',
  };
}

export default function ProductoEditForm({
  producto,
  onGuardado,
}: ProductoEditFormProps) {
  const [form, setForm] = useState<FormState>(() => getInitialFormState(producto));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [exito, setExito] = useState(false);

  useEffect(() => {
    setForm({
      nombre: producto.nombre,
      descripcion: producto.descripcion ?? '',
      precio: String(producto.precio),
      precioOriginal: producto.precioOriginal ? String(producto.precioOriginal) : '',
      marca: producto.marca,
      categoria: producto.categoria,
      subcategoria: producto.subcategoria ?? '',
    });
  }, [producto]);

  useEffect(() => {
    if (!exito) {
      return;
    }

    const timeoutId = window.setTimeout(() => setExito(false), 3000);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [exito]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (form.nombre.trim() === '') {
      setError('El nombre es obligatorio.');
      return;
    }

    if (form.marca.trim() === '') {
      setError('La marca es obligatoria.');
      return;
    }

    const precioNumerico = Number(form.precio);

    if (isNaN(precioNumerico) || precioNumerico <= 0) {
      setError('El precio debe ser mayor a 0.');
      return;
    }

    setLoading(true);
    setError('');
    setExito(false);

    try {
      await actualizarProducto(producto.id, {
        nombre: form.nombre.trim(),
        descripcion: form.descripcion.trim(),
        precio: precioNumerico,
        precioOriginal: form.precioOriginal
          ? Number(form.precioOriginal)
          : undefined,
        marca: form.marca.trim(),
        categoria: form.categoria,
        subcategoria: form.subcategoria.trim() || undefined,
      });

      setExito(true);
      onGuardado?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo guardar el producto.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ padding: '24px' }}>
        <p
          style={{
            margin: '0 0 16px',
            fontSize: '12px',
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: 'var(--gray)',
            fontWeight: 600,
          }}
        >
          Datos del producto
        </p>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '24px',
            alignItems: 'start',
          }}
        >
          <Field label="Nombre" required>
            <input
              type="text"
              value={form.nombre}
              onChange={(event) =>
                setForm((current) => ({ ...current, nombre: event.target.value }))
              }
              required
              disabled={loading}
              style={inputStyle}
            />
          </Field>

          <Field label="Descripcion">
            <textarea
              value={form.descripcion}
              onChange={(event) =>
                setForm((current) => ({ ...current, descripcion: event.target.value }))
              }
              rows={4}
              disabled={loading}
              style={{ ...inputStyle, resize: 'vertical', minHeight: '100px' }}
            />
          </Field>

          <Field label="Precio" required>
            <input
              type="number"
              min="0.01"
              step="0.01"
              inputMode="decimal"
              value={form.precio}
              onChange={(event) =>
                setForm((current) => ({ ...current, precio: event.target.value }))
              }
              required
              disabled={loading}
              style={inputStyle}
            />
          </Field>

          <Field label="Precio original (opcional)">
            <input
              type="number"
              min="0.01"
              step="0.01"
              inputMode="decimal"
              value={form.precioOriginal}
              onChange={(event) =>
                setForm((current) => ({ ...current, precioOriginal: event.target.value }))
              }
              disabled={loading}
              style={inputStyle}
              placeholder="Precio antes del descuento"
            />
          </Field>

          <Field label="Marca" required>
            <input
              type="text"
              value={form.marca}
              onChange={(event) =>
                setForm((current) => ({ ...current, marca: event.target.value }))
              }
              required
              disabled={loading}
              style={inputStyle}
            />
          </Field>

          <Field label="Categoria" required>
            <select
              value={form.categoria}
              onChange={(event) =>
                setForm((current) => ({ ...current, categoria: event.target.value }))
              }
              disabled={loading}
              style={inputStyle}
            >
              {CATEGORIAS.map((categoria) => (
                <option key={categoria} value={categoria}>
                  {categoria}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Subcategoria">
            <input
              type="text"
              value={form.subcategoria}
              onChange={(event) =>
                setForm((current) => ({ ...current, subcategoria: event.target.value }))
              }
              disabled={loading}
              style={inputStyle}
            />
          </Field>
        </div>

        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '12px',
            alignItems: 'center',
            justifyContent: 'flex-end',
            marginTop: '28px',
            paddingTop: '20px',
            borderTop: '1px solid var(--border)',
          }}
        >
          {exito === true && (
            <span style={{ fontSize: '13px', color: '#027a48', marginRight: 'auto' }}>
              Cambios guardados
            </span>
          )}

          {error !== '' && (
            <span style={{ fontSize: '13px', color: '#b42318', marginRight: 'auto' }}>
              {error}
            </span>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              minWidth: '160px',
              height: '44px',
              border: 'none',
              background: 'var(--accent)',
              color: '#ffffff',
              fontSize: '14px',
              fontWeight: 600,
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.75 : 1,
            }}
          >
            {loading ? 'Guardando...' : 'Guardar cambios'}
          </button>
        </div>
      </div>
    </form>
  );
}

function Field({
  label,
  children,
  required = false,
}: {
  label: string;
  children: React.ReactNode;
  required?: boolean;
}) {
  return (
    <label style={{ display: 'grid', gap: '8px' }}>
      <span
        style={{
          fontSize: '12px',
          fontWeight: 600,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          color: 'var(--gray)',
        }}
      >
        {label} {required ? '*' : ''}
      </span>
      {children}
    </label>
  );
}
