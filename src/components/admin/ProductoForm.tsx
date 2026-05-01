'use client';

import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { crearProducto } from '@/lib/api';

const CATEGORIAS = ['Mujer', 'Hombre', 'Liquidacion', 'Novedades'];

const EMPTY_FORM = {
  nombre: '',
  descripcion: '',
  precio: '',
  precioOriginal: '',
  marca: '',
  categoria: CATEGORIAS[0],
  subcategoria: '',
};

const previewBoxStyle: React.CSSProperties = {
  width: '100%',
  maxWidth: '280px',
  aspectRatio: '1 / 1',
  border: '1px dashed var(--border2)',
  background: 'var(--card)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  overflow: 'hidden',
};

export default function ProductoForm() {
  const router = useRouter();
  const [form, setForm] = useState(EMPTY_FORM);
  const [imagen, setImagen] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!imagen) {
      setPreviewUrl('');
      return;
    }

    const objectUrl = URL.createObjectURL(imagen);
    setPreviewUrl(objectUrl);

    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [imagen]);

  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleImagenChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    setImagen(file);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');

    const precioNumerico = Number(form.precio);

    if (!form.nombre.trim()) {
      setError('El nombre es obligatorio.');
      return;
    }

    if (!form.marca.trim()) {
      setError('La marca es obligatoria.');
      return;
    }

    if (!Number.isFinite(precioNumerico) || precioNumerico <= 0) {
      setError('El precio debe ser mayor a 0.');
      return;
    }

    const productoPayload = {
      nombre: form.nombre.trim(),
      descripcion: form.descripcion.trim(),
      precio: precioNumerico,
      precioOriginal: form.precioOriginal
        ? Number(form.precioOriginal)
        : undefined,
      marca: form.marca.trim(),
      categoria: form.categoria,
      subcategoria: form.subcategoria.trim() || undefined,
    };

    const formData = new FormData();
    formData.append(
      'producto',
      new Blob([JSON.stringify(productoPayload)], {
        type: 'application/json',
      })
    );

    if (imagen) {
      formData.append('imagen', imagen);
    }

    try {
      setLoading(true);
      await crearProducto(formData);
      router.push('/admin/productos?creado=1');
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'No se pudo guardar el producto.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ padding: '24px' }}>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '24px',
          alignItems: 'start',
        }}
      >
        <div style={{ display: 'grid', gap: '18px' }}>
          <Field label="Nombre" required>
            <input
              type="text"
              name="nombre"
              value={form.nombre}
              onChange={handleChange}
              required
              disabled={loading}
              style={inputStyle}
              placeholder="Ej. Remera deportiva"
            />
          </Field>

          <Field label="Descripcion">
            <textarea
              name="descripcion"
              value={form.descripcion}
              onChange={handleChange}
              disabled={loading}
              rows={5}
              style={{ ...inputStyle, resize: 'vertical', minHeight: '120px' }}
              placeholder="Descripcion breve del producto"
            />
          </Field>

          <Field label="Precio" required>
            <input
              type="number"
              name="precio"
              value={form.precio}
              onChange={handleChange}
              required
              min="0.01"
              step="0.01"
              inputMode="decimal"
              disabled={loading}
              style={inputStyle}
              placeholder="0.00"
            />
          </Field>

          <Field label="Precio original (opcional)">
            <input
              type="number"
              name="precioOriginal"
              value={form.precioOriginal}
              onChange={handleChange}
              min="0.01"
              step="0.01"
              inputMode="decimal"
              disabled={loading}
              style={inputStyle}
              placeholder="Precio antes del descuento"
            />
          </Field>

          <Field label="Marca" required>
            <input
              type="text"
              name="marca"
              value={form.marca}
              onChange={handleChange}
              required
              disabled={loading}
              style={inputStyle}
              placeholder="Ej. Rame"
            />
          </Field>

          <Field label="Categoria" required>
            <select
              name="categoria"
              value={form.categoria}
              onChange={handleChange}
              required
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
              name="subcategoria"
              value={form.subcategoria}
              onChange={handleChange}
              disabled={loading}
              style={inputStyle}
              placeholder="Ej. Running"
            />
          </Field>
        </div>

        <div style={{ display: 'grid', gap: '18px' }}>
          <Field label="Imagen">
            <input
              type="file"
              name="imagen"
              accept="image/*"
              onChange={handleImagenChange}
              disabled={loading}
              style={{
                ...inputStyle,
                padding: '10px',
                background: '#ffffff',
              }}
            />
          </Field>

          <div style={{ display: 'grid', gap: '10px' }}>
            <span
              style={{
                fontSize: '12px',
                fontWeight: 600,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: 'var(--gray)',
              }}
            >
              Preview
            </span>

            <div style={previewBoxStyle}>
              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt="Preview de imagen"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: 'block',
                  }}
                />
              ) : (
                <span
                  style={{
                    padding: '16px',
                    textAlign: 'center',
                    fontSize: '14px',
                    lineHeight: 1.5,
                    color: 'var(--gray)',
                  }}
                >
                  Seleccioná una imagen para ver la vista previa.
                </span>
              )}
            </div>
          </div>

          {error ? (
            <div
              style={{
                padding: '14px 16px',
                border: '1px solid rgba(180, 35, 24, 0.18)',
                background: 'rgba(180, 35, 24, 0.06)',
                color: '#b42318',
                fontSize: '14px',
                lineHeight: 1.5,
              }}
            >
              {error}
            </div>
          ) : null}
        </div>
      </div>

      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '12px',
          justifyContent: 'flex-end',
          marginTop: '28px',
          paddingTop: '20px',
          borderTop: '1px solid var(--border)',
        }}
      >
        <Link
          href="/admin/productos"
          style={{
            minWidth: '120px',
            height: '44px',
            padding: '0 18px',
            border: '1px solid var(--border2)',
            color: 'var(--black)',
            textDecoration: 'none',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '14px',
            fontWeight: 600,
            background: '#ffffff',
            pointerEvents: loading ? 'none' : 'auto',
            opacity: loading ? 0.6 : 1,
          }}
        >
          Cancelar
        </Link>

        <button
          type="submit"
          disabled={loading}
          style={{
            minWidth: '140px',
            height: '44px',
            padding: '0 18px',
            border: 'none',
            background: 'var(--accent)',
            color: '#ffffff',
            fontSize: '14px',
            fontWeight: 600,
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.75 : 1,
          }}
        >
          {loading ? 'Guardando...' : 'Guardar producto'}
        </button>
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
