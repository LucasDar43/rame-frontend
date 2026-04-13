'use client';

import { useEffect, useRef, useState } from 'react';
import { Producto, Variante } from '@/types';
import useCart from '@/hooks/useCart';

interface Props {
  producto: Producto;
  variantes: Variante[];
}

export default function ProductoDetalle({ producto, variantes }: Props) {
  const [imagenActiva, setImagenActiva] = useState(0);
  const [talleSeleccionado, setTalleSeleccionado] = useState<string | null>(null);
  const [colorSeleccionado, setColorSeleccionado] = useState<string | null>(null);
  const [codigoPostal, setCodigoPostal] = useState('');
  const [envioCosto, setEnvioCosto] = useState<string | null>(null);
  const [envioCargando, setEnvioCargando] = useState(false);
  const [agregado, setAgregado] = useState(false);
  const agregadoTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { addItem } = useCart();

  const talles = Array.from(new Set(variantes.map((v) => v.talle)));
  const colores = Array.from(new Set(variantes.map((v) => v.color)));

  const varianteSeleccionada = variantes.find(
    (v) => v.talle === talleSeleccionado && v.color === colorSeleccionado
  );

  const imagenes = producto.imagenes?.length
    ? producto.imagenes.map((i) => i.url)
    : producto.imagenUrl
    ? [producto.imagenUrl]
    : [];

  useEffect(() => {
    return () => {
      if (agregadoTimeoutRef.current !== null) {
        clearTimeout(agregadoTimeoutRef.current);
      }
    };
  }, []);

  const calcularEnvio = async () => {
    if (codigoPostal.length < 4) return;
    setEnvioCargando(true);
    setEnvioCosto(null);
    // Simulado — reemplazar con API de Correo Argentino
    await new Promise((r) => setTimeout(r, 1000));
    setEnvioCosto('$2.850 — Llega en 3 a 5 días hábiles');
    setEnvioCargando(false);
  };

  const handleAgregarAlCarrito = () => {
    if (!varianteSeleccionada || varianteSeleccionada.stock <= 0) {
      return;
    }

    addItem({
      productoId: producto.id,
      varianteId: varianteSeleccionada.id,
      nombre: producto.nombre,
      marca: producto.marca,
      imagenUrl: producto.imagenUrl ?? producto.imagenes?.[0]?.url,
      talle: varianteSeleccionada.talle,
      color: varianteSeleccionada.color,
      precio: producto.precio,
      cantidad: 1,
    });

    setAgregado(true);

    if (agregadoTimeoutRef.current !== null) {
      clearTimeout(agregadoTimeoutRef.current);
    }

    agregadoTimeoutRef.current = setTimeout(() => {
      setAgregado(false);
    }, 1500);
  };

  return (
    <div style={{ marginTop: '62px', padding: '52px', minHeight: '100vh' }}>

      {/* Breadcrumb */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: '8px',
        fontSize: '11px', letterSpacing: '1.5px', textTransform: 'uppercase',
        color: 'var(--gray)', marginBottom: '40px',
      }}>
        <a href="/" style={{ color: 'var(--gray)', textDecoration: 'none' }}>Inicio</a>
        <span>/</span>
        <a href="#" style={{ color: 'var(--gray)', textDecoration: 'none' }}>{producto.categoria}</a>
        <span>/</span>
        <span style={{ color: 'var(--white)' }}>{producto.nombre}</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '80px' }}>

        {/* Columna izquierda — Galería */}
        <div>
          {/* Imagen principal */}
          <div style={{
            background: '#f5f5f5', height: '560px', position: 'relative',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            marginBottom: '8px', overflow: 'hidden',
          }}>
            {imagenes.length > 0 ? (
              <>
                <img
                  src={imagenes[imagenActiva]}
                  alt={producto.nombre}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                {/* Flechas de navegaciÃ³n */}
                {imagenes.length > 1 && (
                  <>
                    <button
                      onClick={() => setImagenActiva((prev) => (prev === 0 ? imagenes.length - 1 : prev - 1))}
                      style={{
                        position: 'absolute', left: '16px', top: '50%',
                        transform: 'translateY(-50%)',
                        width: '36px', height: '36px',
                        background: 'rgba(255,255,255,0.9)',
                        border: '1px solid var(--border)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        cursor: 'pointer',
                      }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" strokeWidth="1.5">
                        <path d="M15 18l-6-6 6-6"/>
                      </svg>
                    </button>
                    <button
                      onClick={() => setImagenActiva((prev) => (prev === imagenes.length - 1 ? 0 : prev + 1))}
                      style={{
                        position: 'absolute', right: '16px', top: '50%',
                        transform: 'translateY(-50%)',
                        width: '36px', height: '36px',
                        background: 'rgba(255,255,255,0.9)',
                        border: '1px solid var(--border)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        cursor: 'pointer',
                      }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" strokeWidth="1.5">
                        <path d="M9 18l6-6-6-6"/>
                      </svg>
                    </button>
                  </>
                )}
              </>
            ) : (
              <div style={{ opacity: 0.1 }}>
                <svg width="72" height="72" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="0.8">
                  <rect x="3" y="3" width="18" height="18" rx="2"/>
                  <circle cx="8.5" cy="8.5" r="1.5"/>
                  <polyline points="21 15 16 10 5 21"/>
                </svg>
              </div>
            )}

            {/* Badge marca */}
            <div style={{
              position: 'absolute', top: '18px', left: '18px',
              fontSize: '9px', fontWeight: 700, letterSpacing: '2px',
              textTransform: 'uppercase', padding: '4px 10px',
              background: '#111111', color: '#ffffff',
            }}>
              {producto.marca}
            </div>

            {/* Contador de imagen */}
            {imagenes.length > 1 && (
              <div style={{
                position: 'absolute', bottom: '16px', right: '16px',
                fontSize: '10px', letterSpacing: '1px', color: 'var(--gray)',
                background: 'rgba(255,255,255,0.9)', padding: '4px 10px',
                border: '1px solid var(--border)',
              }}>
                {imagenActiva + 1} / {imagenes.length}
              </div>
            )}
          </div>

          {/* Miniaturas */}
          {imagenes.length > 1 && (
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {imagenes.map((url, i) => (
                <div
                  key={i}
                  onClick={() => setImagenActiva(i)}
                  style={{
                    width: '88px', height: '88px', background: '#f5f5f5',
                    cursor: 'pointer', overflow: 'hidden', flexShrink: 0,
                    border: imagenActiva === i
                      ? '2px solid #111111'
                      : '2px solid transparent',
                    transition: 'border-color 0.15s',
                  }}
                >
                  <img src={url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }}/>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Columna derecha — Info */}
        <div style={{ paddingTop: '8px' }}>

          {/* Marca + nombre */}
          <div style={{
            fontSize: '10px', fontWeight: 600, letterSpacing: '3px',
            textTransform: 'uppercase', color: 'var(--gray)', marginBottom: '10px',
          }}>
            {producto.marca}
          </div>
          <h1 style={{
            fontFamily: 'var(--font-playfair)', fontWeight: 900,
            fontSize: '48px', lineHeight: 1, letterSpacing: '-1px',
            color: 'var(--white)', marginBottom: '16px',
          }}>
            {producto.nombre}
          </h1>

          {/* Precio */}
          <div style={{
            fontFamily: 'var(--font-playfair)', fontWeight: 700,
            fontSize: '32px', color: 'var(--white)', marginBottom: '32px',
          }}>
            ${producto.precio.toLocaleString('es-AR')}
          </div>

          {/* DescripciÃ³n */}
          {producto.descripcion && (
            <p style={{
              fontSize: '14px', color: 'var(--light)', lineHeight: 1.8,
              fontWeight: 300, marginBottom: '36px',
              paddingBottom: '36px', borderBottom: '1px solid var(--border)',
            }}>
              {producto.descripcion}
            </p>
          )}

          {/* Colores */}
          {colores.length > 0 && (
            <div style={{ marginBottom: '28px' }}>
              <div style={{
                fontSize: '10px', fontWeight: 600, letterSpacing: '2px',
                textTransform: 'uppercase', color: 'var(--gray)', marginBottom: '12px',
              }}>
                Color {colorSeleccionado && `— ${colorSeleccionado}`}
              </div>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {colores.map((color) => (
                  <button
                    key={color}
                    onClick={() => setColorSeleccionado(color)}
                    style={{
                      padding: '8px 18px', fontSize: '11px', fontWeight: 500,
                      letterSpacing: '1px', textTransform: 'uppercase',
                      cursor: 'pointer', fontFamily: 'var(--font-dm-sans)',
                      background: colorSeleccionado === color ? '#111111' : 'transparent',
                      color: colorSeleccionado === color ? '#ffffff' : 'var(--light)',
                      border: colorSeleccionado === color
                        ? '1px solid #111111'
                        : '1px solid var(--border)',
                    }}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Talles */}
          {talles.length > 0 && (
            <div style={{ marginBottom: '36px' }}>
              <div style={{
                fontSize: '10px', fontWeight: 600, letterSpacing: '2px',
                textTransform: 'uppercase', color: 'var(--gray)', marginBottom: '12px',
              }}>
                Talle {talleSeleccionado && `— ${talleSeleccionado}`}
              </div>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {talles.map((talle) => {
                  const disponible = variantes.some(
                    (v) => v.talle === talle &&
                      (!colorSeleccionado || v.color === colorSeleccionado) &&
                      v.stock > 0 && v.activo
                  );
                  return (
                    <button
                      key={talle}
                      onClick={() => disponible && setTalleSeleccionado(talle)}
                      style={{
                        width: '48px', height: '48px', fontSize: '12px',
                        fontWeight: 500, letterSpacing: '0.5px',
                        cursor: disponible ? 'pointer' : 'not-allowed',
                        fontFamily: 'var(--font-dm-sans)',
                        background: talleSeleccionado === talle ? '#111111' : 'transparent',
                        color: !disponible
                          ? 'var(--border2)'
                          : talleSeleccionado === talle
                          ? '#ffffff'
                          : 'var(--light)',
                        border: talleSeleccionado === talle
                          ? '1px solid #111111'
                          : '1px solid var(--border)',
                        opacity: disponible ? 1 : 0.4,
                      }}
                    >
                      {talle}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Stock */}
          {varianteSeleccionada && (
            <div style={{
              fontSize: '12px', color: 'var(--gray)',
              marginBottom: '28px', letterSpacing: '0.5px',
            }}>
              {varianteSeleccionada.stock > 0
                ? `${varianteSeleccionada.stock} unidades disponibles`
                : 'Sin stock'}
            </div>
          )}

          {/* BotÃ³n agregar */}
          <button
            onClick={handleAgregarAlCarrito}
            disabled={!varianteSeleccionada || varianteSeleccionada.stock === 0}
            style={{
              width: '100%', padding: '18px', fontSize: '11px',
              fontWeight: 600, letterSpacing: '2.5px', textTransform: 'uppercase',
              fontFamily: 'var(--font-dm-sans)', cursor: 'pointer',
              border: 'none', marginBottom: '12px',
              background: varianteSeleccionada && varianteSeleccionada.stock > 0
                ? '#111111' : '#cccccc',
              color: '#ffffff',
            }}
          >
            {!talleSeleccionado || !colorSeleccionado
              ? 'Seleccioná talle y color'
              : varianteSeleccionada && varianteSeleccionada.stock > 0
              ? agregado
                ? 'Agregado'
                : 'Agregar al carrito'
              : 'Sin stock'}
          </button>

          {/* â”€â”€ Calcular envio â”€â”€ */}
          <div style={{
            marginTop: '28px', padding: '20px',
            border: '1px solid var(--border)', background: '#fafafa',
          }}>
            <div style={{
              fontSize: '10px', fontWeight: 700, letterSpacing: '2px',
              textTransform: 'uppercase', color: 'var(--white)', marginBottom: '14px',
            }}>
              Calcular envio
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                type="text"
                placeholder="Codigo postal"
                value={codigoPostal}
                onChange={(e) => {
                  setCodigoPostal(e.target.value.replace(/\D/g, '').slice(0, 8));
                  setEnvioCosto(null);
                }}
                style={{
                  flex: 1, padding: '10px 14px', fontSize: '13px',
                  border: '1px solid var(--border)', outline: 'none',
                  fontFamily: 'var(--font-dm-sans)', background: '#ffffff',
                  color: 'var(--white)',
                }}
              />
              <button
                onClick={calcularEnvio}
                disabled={codigoPostal.length < 4 || envioCargando}
                style={{
                  padding: '10px 20px', fontSize: '11px', fontWeight: 600,
                  letterSpacing: '1.5px', textTransform: 'uppercase',
                  fontFamily: 'var(--font-dm-sans)', cursor: 'pointer',
                  border: 'none',
                  background: codigoPostal.length >= 4 ? '#111111' : '#cccccc',
                  color: '#ffffff',
                }}
              >
                {envioCargando ? '...' : 'Calcular'}
              </button>
            </div>

            {envioCosto && (
              <div style={{
                marginTop: '12px', padding: '10px 14px',
                background: '#f0f0f0', border: '1px solid var(--border)',
                fontSize: '13px', color: 'var(--white)',
                display: 'flex', alignItems: 'center', gap: '8px',
              }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="1.5">
                  <rect x="1" y="3" width="15" height="13"/>
                  <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/>
                  <circle cx="5.5" cy="18.5" r="2.5"/>
                  <circle cx="18.5" cy="18.5" r="2.5"/>
                </svg>
                {envioCosto}
              </div>
            )}
          </div>

          {/* Info extra */}
          <div style={{
            marginTop: '28px', paddingTop: '28px',
            borderTop: '1px solid var(--border)',
            display: 'flex', flexDirection: 'column', gap: '12px',
          }}>
            {[
              'Envio a domicilio disponible',
              'Retiro gratis en local',
              'Cambios dentro de los 30 dias',
            ].map((texto) => (
              <div key={texto} style={{
                display: 'flex', alignItems: 'center', gap: '10px',
                fontSize: '12px', color: 'var(--gray)',
              }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
                {texto}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
