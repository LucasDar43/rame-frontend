'use client';

import { ChangeEvent, MouseEvent, useState } from 'react';
import { importarProductosSimple } from '@/lib/api';
import { ImportacionResultado } from '@/types';

interface ImportarExcelModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

export default function ImportarExcelModal({
  onClose,
  onSuccess,
}: ImportarExcelModalProps) {
  const [archivo, setArchivo] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [resultado, setResultado] = useState<ImportacionResultado | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleOverlayClick = (event: MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget && !loading) {
      onClose();
    }
  };

  const handleArchivoChange = (event: ChangeEvent<HTMLInputElement>) => {
    setArchivo(event.target.files?.[0] ?? null);
    setResultado(null);
    setError(null);
  };

  const handleImportar = async () => {
    if (!archivo) return;

    setLoading(true);
    setError(null);
    setResultado(null);

    try {
      const data = await importarProductosSimple(archivo);
      setResultado(data);
      if (data.productosCreados > 0) onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al importar');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      onClick={handleOverlayClick}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.4)',
        zIndex: 200,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
      }}
    >
      <div
        style={{
          background: '#ffffff',
          border: '1px solid var(--border)',
          padding: '32px',
          width: '480px',
          maxWidth: 'calc(100vw - 48px)',
          position: 'relative',
        }}
      >
        {resultado === null ? (
          <>
            <div style={{ marginBottom: '24px' }}>
              <h2
                style={{
                  margin: 0,
                  fontSize: '20px',
                  fontWeight: 600,
                  color: 'var(--black)',
                }}
              >
                Importar Excel
              </h2>
              <p
                style={{
                  margin: '6px 0 0',
                  fontSize: '13px',
                  color: 'var(--gray)',
                }}
              >
                Seleccione un archivo .xlsx para importar productos.
              </p>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label
                style={{
                  display: 'block',
                  marginBottom: '10px',
                  fontSize: '11px',
                  letterSpacing: '2px',
                  textTransform: 'uppercase',
                  color: 'var(--gray)',
                }}
              >
                Archivo
              </label>
              <input
                type="file"
                accept=".xlsx"
                onChange={handleArchivoChange}
                disabled={loading}
                style={{
                  width: '100%',
                  fontSize: '13px',
                  color: 'var(--black)',
                }}
              />
              {archivo && (
                <div
                  style={{
                    marginTop: '10px',
                    fontSize: '12px',
                    color: 'var(--off-white)',
                  }}
                >
                  {archivo.name}
                </div>
              )}
            </div>

            {error !== null && (
              <div
                style={{
                  color: '#b42318',
                  fontSize: '13px',
                  padding: '10px 14px',
                  border: '1px solid rgba(180,35,24,0.2)',
                  background: 'rgba(180,35,24,0.05)',
                  marginBottom: '20px',
                }}
              >
                {error}
              </div>
            )}

            <div
              style={{
                display: 'flex',
                justifyContent: 'flex-end',
                gap: '10px',
              }}
            >
              <button
                type="button"
                disabled={loading}
                onClick={onClose}
                style={{
                  border: '1px solid var(--border2)',
                  background: 'transparent',
                  color: 'var(--black)',
                  padding: '10px 20px',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: loading ? 'not-allowed' : 'pointer',
                }}
              >
                Cancelar
              </button>
              <button
                type="button"
                disabled={archivo === null || loading}
                onClick={handleImportar}
                style={{
                  background: 'var(--accent)',
                  color: '#ffffff',
                  border: 'none',
                  padding: '10px 20px',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: loading ? 'not-allowed' : 'pointer',
                  opacity: archivo === null || loading ? 0.6 : 1,
                }}
              >
                {loading ? 'Importando...' : 'Importar'}
              </button>
            </div>
          </>
        ) : (
          <>
            {resultado.productosCreados > 0 && resultado.errores.length === 0 && (
              <div style={{ marginBottom: '20px' }}>
                <div
                  style={{
                    fontSize: '16px',
                    fontWeight: 600,
                    color: '#027a48',
                  }}
                >
                  Importaci\u00f3n completada
                </div>
                <div
                  style={{
                    marginTop: '8px',
                    fontSize: '13px',
                    color: 'var(--gray)',
                  }}
                >
                  {resultado.productosCreados} productos creados \u00b7 {resultado.variantesCreadas} variantes creadas
                </div>
              </div>
            )}

            {resultado.productosCreados > 0 && resultado.errores.length > 0 && (
              <div style={{ marginBottom: '20px' }}>
                <div
                  style={{
                    fontSize: '16px',
                    fontWeight: 600,
                    color: '#b45309',
                  }}
                >
                  Importaci\u00f3n con advertencias
                </div>
                <div
                  style={{
                    marginTop: '8px',
                    fontSize: '13px',
                    color: 'var(--gray)',
                  }}
                >
                  {resultado.productosCreados} productos creados \u00b7 {resultado.variantesCreadas} variantes creadas
                </div>
                <div
                  style={{
                    marginTop: '12px',
                    maxHeight: '160px',
                    overflowY: 'auto',
                  }}
                >
                  {resultado.errores.map((item) => (
                    <div
                      key={`${item.fila}-${item.mensaje}`}
                      style={{
                        fontSize: '12px',
                        color: '#b42318',
                        marginBottom: '8px',
                      }}
                    >
                      Fila {item.fila} \u2014 {item.mensaje}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {resultado.productosCreados === 0 && (
              <div style={{ marginBottom: '20px' }}>
                <div
                  style={{
                    fontSize: '16px',
                    fontWeight: 600,
                    color: '#b42318',
                  }}
                >
                  No se import\u00f3 ning\u00fan producto
                </div>
                {resultado.errores.length > 0 && (
                  <div
                    style={{
                      marginTop: '12px',
                      maxHeight: '160px',
                      overflowY: 'auto',
                    }}
                  >
                    {resultado.errores.map((item) => (
                      <div
                        key={`${item.fila}-${item.mensaje}`}
                        style={{
                          fontSize: '12px',
                          color: '#b42318',
                          marginBottom: '8px',
                        }}
                      >
                        Fila {item.fila} \u2014 {item.mensaje}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button
                type="button"
                onClick={onClose}
                style={{
                  border: '1px solid var(--border2)',
                  background: 'transparent',
                  color: 'var(--black)',
                  padding: '10px 20px',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Cerrar
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
