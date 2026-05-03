'use client';

import { ChangeEvent, useEffect, useState } from 'react';
import { agregarImagenGaleria, eliminarImagenGaleria, getVariantes } from '@/lib/api';
import { ImagenProducto, Producto } from '@/types';

type GaleriaManagerProps = {
  producto: Producto;
  onActualizado: (producto: Producto) => void;
  variantesKey: number;
};

type ImagenProductoConColor = ImagenProducto & {
  color?: string;
};

export default function GaleriaManager({
  producto,
  onActualizado,
  variantesKey,
}: GaleriaManagerProps) {
  const [imagen, setImagen] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [coloresDisponibles, setColoresDisponibles] = useState<string[]>([]);
  const [colorSeleccionado, setColorSeleccionado] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [loadingVariantes, setLoadingVariantes] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [error, setError] = useState('');
  const [exito, setExito] = useState(false);
  const tieneVariantes = coloresDisponibles.length > 0;

  useEffect(() => {
    const cargarVariantes = async () => {
      setLoadingVariantes(true);
      try {
        const variantes = await getVariantes(producto.id);
        const colores = Array.from(
          new Set(
            variantes
              .filter((v) => v.activo && v.color)
              .map((v) => v.color)
          )
        );
        setColoresDisponibles(colores);
      } catch {
        setColoresDisponibles([]);
      } finally {
        setLoadingVariantes(false);
      }
    };

    cargarVariantes();
  }, [producto.id, variantesKey]);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    setImagen(file);
    setError('');
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    } else {
      setPreviewUrl('');
    }
  };

  const handleAgregar = async () => {
    if (!imagen) {
      setError('Seleccioná una imagen primero.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const actualizado = await agregarImagenGaleria(
        producto.id,
        imagen,
        colorSeleccionado || undefined
      );
      onActualizado(actualizado);
      setImagen(null);
      setPreviewUrl('');
      setColorSeleccionado('');
      setExito(true);
      setTimeout(() => setExito(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo subir la imagen.');
    } finally {
      setLoading(false);
    }
  };

  const handleEliminar = async (imagenId: number) => {
    const confirmado = window.confirm('¿Eliminar esta imagen de la galería?');
    if (!confirmado) return;
    setDeletingId(imagenId);
    setError('');
    try {
      await eliminarImagenGaleria(producto.id, imagenId);
      onActualizado({
        ...producto,
        imagenes: producto.imagenes.filter((img) => img.id !== imagenId),
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo eliminar la imagen.');
    } finally {
      setDeletingId(null);
    }
  };

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
        Galería de imágenes
      </p>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
        gap: '12px',
        marginBottom: '24px',
      }}>
        {producto.imagenes.length === 0 && (
          <p style={{ fontSize: '13px', color: 'var(--gray)', gridColumn: '1 / -1' }}>
            Sin imágenes en la galería.
          </p>
        )}

        {(producto.imagenes as ImagenProductoConColor[]).map((img) => (
          <div key={img.id} style={{ position: 'relative' }}>
            <img
              src={img.url}
              alt=""
              style={{
                width: '100%',
                aspectRatio: '1 / 1',
                objectFit: 'cover',
                display: 'block',
                border: '1px solid var(--border)',
              }}
            />
            <button
              type="button"
              onClick={() => handleEliminar(img.id)}
              disabled={deletingId === img.id}
              title="Eliminar imagen"
              style={{
                position: 'absolute',
                top: '6px',
                right: '6px',
                width: '26px',
                height: '26px',
                background: 'rgba(255,255,255,0.9)',
                border: '1px solid var(--border)',
                cursor: deletingId === img.id ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#cc3333',
                opacity: deletingId === img.id ? 0.5 : 1,
              }}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="1.8">
                <polyline points="3 6 5 6 21 6" />
                <path d="M19 6l-1 14H6L5 6" />
                <path d="M10 11v6M14 11v6" />
                <path d="M9 6V4h6v2" />
              </svg>
            </button>
            <div style={{
              fontSize: '10px',
              color: 'var(--gray)',
              textAlign: 'center',
              marginTop: '4px',
            }}>
              #{img.orden}
              {img.color && (
                <div>
                  <span style={{
                    display: 'inline-block',
                    padding: '2px 8px',
                    fontSize: '10px',
                    fontWeight: 600,
                    letterSpacing: '1px',
                    textTransform: 'uppercase',
                    background: 'var(--card)',
                    border: '1px solid var(--border)',
                    color: 'var(--gray)',
                    marginTop: '2px',
                  }}>
                    {img.color}
                  </span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div style={{
        borderTop: '1px solid var(--border)',
        paddingTop: '20px',
        display: 'grid',
        gap: '12px',
      }}>
        <span style={{
          fontSize: '12px',
          fontWeight: 600,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          color: 'var(--gray)',
        }}>
          Agregar imagen
        </span>

        <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
          <div style={{ display: 'grid', gap: '8px', flex: 1 }}>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              disabled={loading}
              style={{ fontSize: '13px', color: 'var(--black)' }}
            />

            {tieneVariantes && (
              <label style={{
                fontSize: '12px',
                fontWeight: 600,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: 'var(--gray)',
              }}>
                Color (opcional)
                <select
                  value={colorSeleccionado}
                  onChange={(event) => setColorSeleccionado(event.target.value)}
                  disabled={loading || loadingVariantes}
                  style={{
                    width: '100%',
                    minHeight: '40px',
                    padding: '8px 12px',
                    border: '1px solid var(--border2)',
                    background: '#ffffff',
                    color: 'var(--black)',
                    fontSize: '13px',
                    fontFamily: 'var(--font-dm-sans)',
                    outline: 'none',
                    marginTop: '8px',
                    cursor: 'pointer',
                  }}
                >
                  <option value="">Sin tag (imagen general)</option>
                  {coloresDisponibles.map((color) => (
                    <option key={color} value={color}>
                      {color}
                    </option>
                  ))}
                </select>
              </label>
            )}

            {previewUrl && (
              <img
                src={previewUrl}
                alt="Preview"
                style={{
                  width: '100px',
                  height: '100px',
                  objectFit: 'cover',
                  border: '1px dashed var(--border2)',
                }}
              />
            )}
          </div>

          <button
            type="button"
            onClick={handleAgregar}
            disabled={loading || !imagen}
            style={{
              height: '40px',
              padding: '0 20px',
              border: 'none',
              background: 'var(--accent)',
              color: '#ffffff',
              fontSize: '13px',
              fontWeight: 600,
              cursor: loading || !imagen ? 'not-allowed' : 'pointer',
              opacity: loading || !imagen ? 0.6 : 1,
              whiteSpace: 'nowrap',
            }}
          >
            {loading ? 'Subiendo...' : 'Agregar'}
          </button>
        </div>

        {error && (
          <p style={{ margin: 0, fontSize: '13px', color: '#b42318' }}>
            {error}
          </p>
        )}

        {exito && (
          <p style={{ margin: 0, fontSize: '13px', color: '#027a48' }}>
            Imagen agregada correctamente
          </p>
        )}
      </div>
    </div>
  );
}
