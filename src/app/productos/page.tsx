'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import ProductCard from '@/components/ProductCard';
import { buscarProductosFiltrado, getFiltrosDisponibles, getSubcategorias } from '@/lib/api';
import { Producto } from '@/types';

const categorias = ['Todas', 'Mujer', 'Hombre', 'Liquidacion', 'Novedades'];

function ProductosContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [productos, setProductos] = useState<Producto[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalElements, setTotalElements] = useState(0);
  const [filtrosDisponibles, setFiltrosDisponibles] = useState<{
    marcas: string[];
    colores: string[];
    talles: string[];
  }>({ marcas: [], colores: [], talles: [] });
  const [subcategorias, setSubcategorias] = useState<string[]>([]);

  const q = searchParams.get('q') ?? '';
  const categoriaActiva = searchParams.get('categoria') ?? 'Todas';
  const subcategoria = searchParams.get('subcategoria') ?? '';
  const marca = searchParams.get('marca') ?? '';
  const color = searchParams.get('color') ?? '';
  const talle = searchParams.get('talle') ?? '';
  const ordenar = searchParams.get('ordenar') ?? '';
  const page = Number(searchParams.get('page') ?? '0');

  function setFiltros(cambios: Record<string, string>) {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(cambios).forEach(([key, value]) => {
      if (value === '' || value === 'Todas' || value === '0') {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });
    router.replace(`/productos?${params.toString()}`, { scroll: false });
  }

  useEffect(() => {
    let active = true;

    async function loadProductos() {
      setLoading(true);
      setError(null);

      try {
        const res = await buscarProductosFiltrado({
          q: q || undefined,
          categoria: categoriaActiva !== 'Todas' ? categoriaActiva : undefined,
          subcategoria: subcategoria || undefined,
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
  }, [page, categoriaActiva, marca, color, talle, ordenar, q, subcategoria]);

  useEffect(() => {
    getFiltrosDisponibles()
      .then(setFiltrosDisponibles)
      .catch(() => {});
  }, []);

  useEffect(() => {
    setSubcategorias([]);
    getSubcategorias(categoriaActiva !== 'Todas' ? categoriaActiva : undefined)
      .then(setSubcategorias)
      .catch(() => setSubcategorias([]));
  }, [categoriaActiva]);

  function resetFiltros() {
    router.replace('/productos', { scroll: false });
  }

  function handleCategoriaChange(categoria: string) {
    setFiltros({ categoria, marca: '', color: '', talle: '', subcategoria: '', page: '0' });
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
          {subcategorias.length > 0 && (
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
                Tipo de prenda
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {subcategorias.map((sub) => (
                  <label
                    key={sub}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      cursor: 'pointer',
                      fontSize: '13px',
                      color: subcategoria === sub ? 'var(--black)' : 'var(--light)',
                      fontWeight: subcategoria === sub ? 500 : 400,
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={subcategoria === sub}
                      onChange={() => {
                        setFiltros({ subcategoria: subcategoria === sub ? '' : sub, page: '0' });
                      }}
                      style={{ cursor: 'pointer', accentColor: '#111111' }}
                    />
                    {sub}
                  </label>
                ))}
              </div>
            </div>
          )}

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
                        setFiltros({ marca: marca === m ? '' : m, page: '0' });
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
                        setFiltros({ color: color === c ? '' : c, page: '0' });
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
                      setFiltros({ talle: talle === t ? '' : t, page: '0' });
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

          {(marca || color || talle || ordenar || subcategoria || categoriaActiva !== 'Todas') && (
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
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '24px',
              paddingBottom: '16px',
              borderBottom: '1px solid var(--border)',
            }}
          >
            <p
              style={{
                margin: 0,
                fontSize: '13px',
                color: 'var(--gray)',
              }}
            >
              {loading ? 'Cargando...' : `${totalElements} productos encontrados`}
            </p>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
              }}
            >
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 600,
                  letterSpacing: '2px',
                  textTransform: 'uppercase',
                  color: 'var(--gray)',
                }}
              >
                Ordenar por
              </span>
              <select
                value={ordenar}
                onChange={(e) => setFiltros({ ordenar: e.target.value, page: '0' })}
                style={{
                  padding: '8px 12px',
                  border: '1px solid var(--border2)',
                  background: '#ffffff',
                  color: 'var(--black)',
                  fontSize: '13px',
                  fontFamily: 'var(--font-dm-sans)',
                  outline: 'none',
                  cursor: 'pointer',
                  minWidth: '200px',
                }}
              >
                <option value="">Relevancia</option>
                <option value="precio-asc">Precio: menor a mayor</option>
                <option value="precio-desc">Precio: mayor a menor</option>
                <option value="nombre-asc">Nombre: A - Z</option>
                <option value="nombre-desc">Nombre: Z - A</option>
              </select>
            </div>
          </div>

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
                onClick={() => setFiltros({ page: String(Math.max(page - 1, 0)) })}
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
                onClick={() => setFiltros({ page: String(Math.min(page + 1, totalPages - 1)) })}
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
