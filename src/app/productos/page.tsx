'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

import ProductCard from '@/components/ProductCard';
import { buscarProductosFiltrado, getFiltrosDisponibles } from '@/lib/api';
import { Producto } from '@/types';

const categorias = ['Todas', 'Mujer', 'Hombre', 'Liquidacion', 'Novedades'];

function ProductosContent() {
  const searchParams = useSearchParams();
  const categoriaInicial = searchParams.get('categoria') ?? 'Todas';
  const [productos, setProductos] = useState<Producto[]>([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categoriaActiva, setCategoriaActiva] = useState(categoriaInicial);
  const [totalElements, setTotalElements] = useState(0);
  const [marca, setMarca] = useState<string>('');
  const [color, setColor] = useState<string>('');
  const [talle, setTalle] = useState<string>('');
  const [ordenar, setOrdenar] = useState<string>('');
  const [filtrosDisponibles, setFiltrosDisponibles] = useState<{
    marcas: string[];
    colores: string[];
    talles: string[];
  }>({ marcas: [], colores: [], talles: [] });
  const [q, setQ] = useState<string>(searchParams.get('q') ?? '');

  useEffect(() => {
    let active = true;

    async function loadProductos() {
      setLoading(true);
      setError(null);

      try {
        const res = await buscarProductosFiltrado({
          q: q || undefined,
          categoria: categoriaActiva !== 'Todas' ? categoriaActiva : undefined,
          marca: marca || undefined,
          color: color || undefined,
          talle: talle || undefined,
          ordenar: ordenar || undefined,
          page,
          size: 20,
        });

        if (!active) return;

        setProductos(res.content);
        setTotalPages(res.totalPages);
        setTotalElements(res.totalElements);
      } catch (err) {
        if (!active) return;
        setError(err instanceof Error ? err.message : 'Error al cargar productos');
        setProductos([]);
        setTotalPages(0);
        setTotalElements(0);
      } finally {
        if (active) setLoading(false);
      }
    }

    loadProductos();
    return () => {
      active = false;
    };
  }, [page, categoriaActiva, marca, color, talle, ordenar, q]);

  useEffect(() => {
    getFiltrosDisponibles()
      .then(setFiltrosDisponibles)
      .catch(() => {});
  }, []);

  useEffect(() => {
    const qParam = searchParams.get('q') ?? '';
    setQ(qParam);
    setPage(0);
  }, [searchParams]);

  useEffect(() => {
    const categoria = searchParams.get('categoria') ?? 'Todas';
    setCategoriaActiva(categoria);
    setPage(0);
  }, [searchParams]);

  function resetFiltros() {
    setMarca('');
    setColor('');
    setTalle('');
    setOrdenar('');
    setCategoriaActiva('Todas');
    setPage(0);
  }

  function handleCategoriaChange(categoria: string) {
    setCategoriaActiva(categoria);
    setMarca('');
    setColor('');
    setTalle('');
    setPage(0);
  }

  return (
    <main style={{ minHeight: '100vh', background: '#ffffff' }}>
      <section
        style={{
          marginTop: '62px',
          padding: '52px 52px 32px',
          borderBottom: '1px solid var(--border)',
        }}
      >
        <h1
          style={{
            margin: 0,
            fontFamily: 'var(--font-playfair)',
            fontWeight: 700,
            fontSize: '34px',
            color: 'var(--white)',
            letterSpacing: '-0.5px',
          }}
        >
          Catalogo <em style={{ fontStyle: 'italic', opacity: 0.5 }}>de productos</em>
        </h1>
        <p style={{ margin: '8px 0 0', fontSize: '13px', color: 'var(--gray)' }}>
          {loading ? 'Cargando...' : `${totalElements} productos encontrados`}
        </p>
      </section>

      <section
        style={{
          padding: '24px 52px',
          borderBottom: '1px solid var(--border)',
          display: 'flex',
          gap: '8px',
          flexWrap: 'wrap',
        }}
      >
        {categorias.map((cat) => {
          const activa = cat === categoriaActiva;
          return (
            <button
              key={cat}
              type="button"
              onClick={() => handleCategoriaChange(cat)}
              style={{
                background: activa ? '#111111' : 'transparent',
                color: activa ? '#ffffff' : 'var(--light)',
                border: activa ? '1px solid #111111' : '1px solid var(--border)',
                padding: '8px 20px',
                fontSize: '11px',
                fontWeight: 500,
                letterSpacing: '1px',
                textTransform: 'uppercase',
                cursor: 'pointer',
                fontFamily: 'var(--font-dm-sans)',
              }}
            >
              {cat}
            </button>
          );
        })}
      </section>

      <div
        style={{
          display: 'flex',
          gap: '0',
          alignItems: 'flex-start',
          padding: '0 52px',
        }}
      >
        <aside
          style={{
            width: '240px',
            flexShrink: 0,
            padding: '32px 24px 32px 0',
            borderRight: '1px solid var(--border)',
            position: 'sticky',
            top: '62px',
            maxHeight: 'calc(100vh - 62px)',
            overflowY: 'auto',
          }}
        >
          <div style={{ marginBottom: '32px' }}>
            <p
              style={{
                margin: '0 0 12px',
                fontSize: '11px',
                fontWeight: 600,
                letterSpacing: '2px',
                textTransform: 'uppercase',
                color: 'var(--gray)',
              }}
            >
              Ordenar por
            </p>
            <select
              value={ordenar}
              onChange={(e) => {
                setOrdenar(e.target.value);
                setPage(0);
              }}
              style={{
                width: '100%',
                padding: '10px 12px',
                border: '1px solid var(--border2)',
                background: '#ffffff',
                color: 'var(--black)',
                fontSize: '13px',
                fontFamily: 'var(--font-dm-sans)',
                outline: 'none',
                cursor: 'pointer',
              }}
            >
              <option value="">Relevancia</option>
              <option value="precio-asc">Precio: menor a mayor</option>
              <option value="precio-desc">Precio: mayor a menor</option>
              <option value="nombre-asc">Nombre: A - Z</option>
              <option value="nombre-desc">Nombre: Z - A</option>
            </select>
          </div>

          {filtrosDisponibles.marcas.length > 0 && (
            <div style={{ marginBottom: '32px' }}>
              <p
                style={{
                  margin: '0 0 12px',
                  fontSize: '11px',
                  fontWeight: 600,
                  letterSpacing: '2px',
                  textTransform: 'uppercase',
                  color: 'var(--gray)',
                }}
              >
                Marca
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {filtrosDisponibles.marcas.map((m) => (
                  <label
                    key={m}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      cursor: 'pointer',
                      fontSize: '13px',
                      color: marca === m ? 'var(--black)' : 'var(--light)',
                      fontWeight: marca === m ? 500 : 400,
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={marca === m}
                      onChange={() => {
                        setMarca(marca === m ? '' : m);
                        setPage(0);
                      }}
                      style={{ cursor: 'pointer', accentColor: '#111111' }}
                    />
                    {m}
                  </label>
                ))}
              </div>
            </div>
          )}

          {filtrosDisponibles.colores.length > 0 && (
            <div style={{ marginBottom: '32px' }}>
              <p
                style={{
                  margin: '0 0 12px',
                  fontSize: '11px',
                  fontWeight: 600,
                  letterSpacing: '2px',
                  textTransform: 'uppercase',
                  color: 'var(--gray)',
                }}
              >
                Color
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {filtrosDisponibles.colores.map((c) => (
                  <label
                    key={c}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      cursor: 'pointer',
                      fontSize: '13px',
                      color: color === c ? 'var(--black)' : 'var(--light)',
                      fontWeight: color === c ? 500 : 400,
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={color === c}
                      onChange={() => {
                        setColor(color === c ? '' : c);
                        setPage(0);
                      }}
                      style={{ cursor: 'pointer', accentColor: '#111111' }}
                    />
                    {c}
                  </label>
                ))}
              </div>
            </div>
          )}

          {filtrosDisponibles.talles.length > 0 && (
            <div style={{ marginBottom: '32px' }}>
              <p
                style={{
                  margin: '0 0 12px',
                  fontSize: '11px',
                  fontWeight: 600,
                  letterSpacing: '2px',
                  textTransform: 'uppercase',
                  color: 'var(--gray)',
                }}
              >
                Talle
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {filtrosDisponibles.talles.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => {
                      setTalle(talle === t ? '' : t);
                      setPage(0);
                    }}
                    style={{
                      padding: '6px 12px',
                      fontSize: '12px',
                      border: talle === t ? '1px solid #111111' : '1px solid var(--border)',
                      background: talle === t ? '#111111' : 'transparent',
                      color: talle === t ? '#ffffff' : 'var(--light)',
                      cursor: 'pointer',
                      fontFamily: 'var(--font-dm-sans)',
                    }}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          )}

          {(marca || color || talle || ordenar || categoriaActiva !== 'Todas') && (
            <button
              type="button"
              onClick={resetFiltros}
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid var(--border2)',
                background: 'transparent',
                color: 'var(--gray)',
                fontSize: '12px',
                fontWeight: 500,
                letterSpacing: '1px',
                textTransform: 'uppercase',
                cursor: 'pointer',
                fontFamily: 'var(--font-dm-sans)',
              }}
            >
              Limpiar filtros
            </button>
          )}
        </aside>

        <div style={{ flex: 1, minWidth: 0, padding: '32px 0 32px 32px' }}>
          {loading ? (
            <div
              style={{
                padding: '80px 0',
                textAlign: 'center',
                color: 'var(--gray)',
                fontSize: '15px',
              }}
            >
              Cargando productos...
            </div>
          ) : error ? (
            <div
              style={{
                padding: '80px 0',
                textAlign: 'center',
                color: '#b42318',
                fontSize: '15px',
              }}
            >
              {error}
            </div>
          ) : productos.length === 0 ? (
            <div
              style={{
                padding: '80px 0',
                textAlign: 'center',
                color: 'var(--gray)',
                fontSize: '15px',
              }}
            >
              No se encontraron productos con los filtros seleccionados.
            </div>
          ) : (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
                gap: '2px',
              }}
            >
              {productos.map((producto) => (
                <ProductCard key={producto.id} producto={producto} />
              ))}
            </div>
          )}

          {totalPages > 1 && (
            <section
              style={{
                paddingTop: '32px',
                borderTop: '1px solid var(--border)',
                marginTop: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '16px',
                flexWrap: 'wrap',
              }}
            >
              <button
                type="button"
                disabled={page === 0}
                onClick={() => setPage((p) => p - 1)}
                style={{
                  minWidth: '120px',
                  height: '42px',
                  border: '1px solid var(--border2)',
                  background: '#ffffff',
                  color: 'var(--black)',
                  fontSize: '14px',
                  fontWeight: 600,
                  cursor: page === 0 ? 'not-allowed' : 'pointer',
                  opacity: page === 0 ? 0.5 : 1,
                }}
              >
                Anterior
              </button>

              <div style={{ fontSize: '14px', color: 'var(--gray)' }}>
                Pagina {page + 1} de {totalPages}
              </div>

              <button
                type="button"
                disabled={page >= totalPages - 1}
                onClick={() => setPage((p) => p + 1)}
                style={{
                  minWidth: '120px',
                  height: '42px',
                  border: 'none',
                  background: 'var(--accent)',
                  color: '#ffffff',
                  fontSize: '14px',
                  fontWeight: 600,
                  cursor: page >= totalPages - 1 ? 'not-allowed' : 'pointer',
                  opacity: page >= totalPages - 1 ? 0.5 : 1,
                }}
              >
                Siguiente
              </button>
            </section>
          )}
        </div>
      </div>
    </main>
  );
}

export default function ProductosPage() {
  return (
    <Suspense fallback={
      <main style={{ minHeight: '100vh', background: '#ffffff' }}>
        <div style={{
          padding: '80px 0',
          textAlign: 'center',
          color: 'var(--gray)',
          fontSize: '15px',
        }}>
          Cargando...
        </div>
      </main>
    }>
      <ProductosContent />
    </Suspense>
  );
}
