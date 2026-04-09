'use client';

import { useEffect, useState } from 'react';

import ProductCard from '@/components/ProductCard';
import { getProductos } from '@/lib/api';
import { Producto } from '@/types';

const categorias = ['Todas', 'Mujer', 'Hombre', 'Liquidacion', 'Novedades'];

export default function ProductosPage() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [categoriaActiva, setCategoriaActiva] = useState('Todas');

  useEffect(() => {
    let active = true;

    async function loadProductos() {
      setLoading(true);
      setError('');

      try {
        const res = await getProductos(page, 20);

        if (!active) return;

        setProductos(res.content);
        setTotalPages(res.totalPages);
      } catch (err) {
        if (!active) return;

        setError(err instanceof Error ? err.message : 'Error al cargar productos');
        setProductos([]);
        setTotalPages(0);
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadProductos();

    return () => {
      active = false;
    };
  }, [page]);

  const productosFiltrados =
    categoriaActiva === 'Todas'
      ? productos
      : productos.filter((p) => p.categoria === categoriaActiva);

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

        <p
          style={{
            margin: '8px 0 0',
            fontSize: '13px',
            color: 'var(--gray)',
          }}
        >
          {productosFiltrados.length} productos encontrados
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
              onClick={() => setCategoriaActiva(cat)}
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

      <section style={{ padding: '40px 52px' }}>
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
        ) : productosFiltrados.length === 0 ? (
          <div
            style={{
              padding: '80px 0',
              textAlign: 'center',
              color: 'var(--gray)',
              fontSize: '15px',
            }}
          >
            No hay productos en esta categor\u00eda.
          </div>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
              gap: '2px',
            }}
          >
            {productosFiltrados.map((producto) => (
              <ProductCard key={producto.id} producto={producto} />
            ))}
          </div>
        )}
      </section>

      {totalPages > 1 && (
        <section
          style={{
            padding: '32px 52px',
            borderTop: '1px solid var(--border)',
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

          <div
            style={{
              fontSize: '14px',
              color: 'var(--off-white)',
            }}
          >
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
    </main>
  );
}
