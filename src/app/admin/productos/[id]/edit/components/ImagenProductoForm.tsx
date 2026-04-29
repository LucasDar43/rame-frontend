'use client';

import { ChangeEvent, useEffect, useState } from 'react';
import { actualizarImagenProducto } from '@/lib/api';
import { Producto } from '@/types';

type ImagenProductoFormProps = {
  producto: Producto;
  onActualizado: (producto: Producto) => void;
};

export default function ImagenProductoForm({
  producto,
  onActualizado,
}: ImagenProductoFormProps) {
  const [imagen, setImagen] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [exito, setExito] = useState(false);

  useEffect(() => {
    if (!imagen) {
      setPreviewUrl('');
      return;
    }
    const url = URL.createObjectURL(imagen);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [imagen]);

  useEffect(() => {
    if (!exito) return;
    const id = window.setTimeout(() => setExito(false), 3000);
    return () => window.clearTimeout(id);
  }, [exito]);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setImagen(event.target.files?.[0] ?? null);
    setError('');
  };

  const handleGuardar = async () => {
    if (!imagen) {
      setError('Seleccioná una imagen primero.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const actualizado = await actualizarImagenProducto(producto.id, imagen);
      onActualizado(actualizado);
      setImagen(null);
      setExito(true);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'No se pudo actualizar la imagen.'
      );
    } finally {
      setLoading(false);
    }
  };

  const imagenActual = producto.imagenUrl ?? producto.imagenes?.[0]?.url;

  return (
    <div style={{ padding: '24px' }}>
      <p style={{
        margin: '0 0 16px',
        fontSize: '12px',
        letterSpacing: '0.18em',
        textTransform: 'uppercase',
        color: 'var(--gray)',
        fontWeight: 600,
      }}>
        Imagen principal
      </p>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '24px',
        alignItems: 'start',
      }}>
        <div style={{ display: 'grid', gap: '12px' }}>
          <span style={{
            fontSize: '12px',
            fontWeight: 600,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: 'var(--gray)',
          }}>
            Imagen actual
          </span>

          <div style={{
            width: '100%',
            maxWidth: '200px',
            aspectRatio: '1 / 1',
            border: '1px solid var(--border)',
            background: 'var(--card)',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            {imagenActual ? (
              <img
                src={imagenActual}
                alt={producto.nombre}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  display: 'block',
                }}
              />
            ) : (
              <span style={{
                fontSize: '12px',
                color: 'var(--gray)',
                textAlign: 'center',
                padding: '16px',
              }}>
                Sin imagen
              </span>
            )}
          </div>
        </div>

        <div style={{ display: 'grid', gap: '12px' }}>
          <span style={{
            fontSize: '12px',
            fontWeight: 600,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: 'var(--gray)',
          }}>
            Nueva imagen
          </span>

          <input
            type="file"
            accept="image/*"
            onChange={handleChange}
            disabled={loading}
            style={{
              fontSize: '13px',
              color: 'var(--black)',
            }}
          />

          <div style={{
            width: '100%',
            maxWidth: '200px',
            aspectRatio: '1 / 1',
            border: '1px dashed var(--border2)',
            background: 'var(--card)',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            {previewUrl ? (
              <img
                src={previewUrl}
                alt="Preview"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  display: 'block',
                }}
              />
            ) : (
              <span style={{
                fontSize: '12px',
                color: 'var(--gray)',
                textAlign: 'center',
                padding: '16px',
              }}>
                Preview
              </span>
            )}
          </div>

          {error && (
            <p style={{ margin: 0, fontSize: '13px', color: '#b42318' }}>
              {error}
            </p>
          )}

          {exito && (
            <p style={{ margin: 0, fontSize: '13px', color: '#027a48' }}>
              Imagen actualizada correctamente
            </p>
          )}

          <button
            type="button"
            onClick={handleGuardar}
            disabled={loading || !imagen}
            style={{
              height: '40px',
              border: 'none',
              background: 'var(--accent)',
              color: '#ffffff',
              fontSize: '13px',
              fontWeight: 600,
              cursor: loading || !imagen ? 'not-allowed' : 'pointer',
              opacity: loading || !imagen ? 0.6 : 1,
              maxWidth: '200px',
            }}
          >
            {loading ? 'Subiendo...' : 'Guardar imagen'}
          </button>
        </div>
      </div>
    </div>
  );
}
