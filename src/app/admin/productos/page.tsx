'use client';

import { useEffect, useState } from 'react';
import { editarProductosMasivo, eliminarProducto, getProductosAdmin } from '@/lib/api';
import { Producto } from '@/types';
import ImportarExcelModal from '@/components/admin/ImportarExcelModal';
import ProductosTable from './components/ProductosTable';
import PaginacionControls from './components/PaginacionControls';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

export default function AdminProductosPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(0);
  const [reloadKey, setReloadKey] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [toastVisible, setToastVisible] = useState(false);
  const [modalImportar, setModalImportar] = useState(false);
  const [busqueda, setBusqueda] = useState('');
  const [filtroCategoria, setFiltroCategoria] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('');
  const [seleccionados, setSeleccionados] = useState<number[]>([]);
  const [accionMasiva, setAccionMasiva] = useState('');
  const [valorMasivo, setValorMasivo] = useState('');
  const [aplicandoMasivo, setAplicandoMasivo] = useState(false);

  useEffect(() => {
    let active = true;

    async function loadProductos() {
      setLoading(true);
      setError('');

      try {
        const activoFiltro = filtroEstado === 'activo'
          ? true
          : filtroEstado === 'inactivo'
          ? false
          : undefined;
        const response = await getProductosAdmin(
          page,
          20,
          activoFiltro,
          busqueda || undefined,
          filtroCategoria || undefined,
        );
        if (!active) return;
        setProductos(response.content);
        setTotalPages(response.totalPages);
      } catch (err) {
        if (!active) return;
        setError(err instanceof Error ? err.message : 'No se pudieron cargar los productos.');
        setProductos([]);
        setTotalPages(0);
      } finally {
        if (active) setLoading(false);
      }
    }

    loadProductos();
    return () => { active = false; };
  }, [page, reloadKey, busqueda, filtroCategoria, filtroEstado]);

  useEffect(() => {
    if (searchParams.get('creado') === '1') {
      setToastVisible(true);
      setTimeout(() => {
        setToastVisible(false);
        router.replace('/admin/productos');
      }, 3000);
    }
  }, []);

  const handleEliminar = async (id: number) => {
    const confirmado = window.confirm('\u00bfEliminar este producto? Esta acci\u00f3n no se puede deshacer.');
    if (!confirmado) return;

    setDeletingId(id);
    try {
      await eliminarProducto(id);
      setProductos((prev) => prev.filter((producto) => producto.id !== id));
    } catch (error: unknown) {
      alert(error instanceof Error ? error.message : 'Error al eliminar el producto');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <main style={{ minHeight: '100vh', padding: '96px 24px 32px', background: '#fafafa' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>

        <div style={{
          marginBottom: '24px',
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
        }}>
          <div>
            <p style={{
              margin: '0 0 8px',
              fontSize: '12px',
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: 'var(--gray)',
            }}>
              Panel admin
            </p>
            <h1 style={{
              margin: 0,
              fontSize: '32px',
              lineHeight: 1.1,
              fontWeight: 600,
              color: 'var(--black)',
            }}>
              Productos
            </h1>
          </div>

          <div style={{ display: 'flex', alignItems: 'center' }}>
            <button
              type="button"
              onClick={() => setModalImportar(true)}
              style={{
                border: '1px solid var(--border2)',
                background: 'transparent',
                color: 'var(--black)',
                padding: '10px 20px',
                fontSize: '12px',
                fontWeight: 600,
                letterSpacing: '1.5px',
                textTransform: 'uppercase',
                cursor: 'pointer',
                marginRight: '10px',
              }}
            >
              Importar Excel
            </button>

            <Link href="/admin/productos/nuevo" style={{
              display: 'inline-flex',
              alignItems: 'center',
              padding: '10px 20px',
              background: '#111111',
              color: '#ffffff',
              textDecoration: 'none',
              fontSize: '12px',
              fontWeight: 600,
              letterSpacing: '1.5px',
              textTransform: 'uppercase',
            }}>
              Nuevo producto
            </Link>
          </div>
        </div>

        <div style={{
          display: 'flex',
          gap: '12px',
          marginBottom: '16px',
          flexWrap: 'wrap',
          alignItems: 'center',
        }}>
          <input
            type="text"
            placeholder="Buscar por nombre..."
            value={busqueda}
            onChange={(e) => {
              setBusqueda(e.target.value);
              setPage(0);
              setReloadKey((prev) => prev + 1);
            }}
            style={{
              height: '40px',
              padding: '0 14px',
              border: '1px solid var(--border2)',
              fontSize: '13px',
              fontFamily: 'var(--font-dm-sans)',
              outline: 'none',
              minWidth: '220px',
              background: '#ffffff',
              color: 'var(--black)',
            }}
          />

          <select
            value={filtroCategoria}
            onChange={(e) => {
              setFiltroCategoria(e.target.value);
              setPage(0);
              setReloadKey((prev) => prev + 1);
            }}
            style={{
              height: '40px',
              padding: '0 12px',
              border: '1px solid var(--border2)',
              fontSize: '13px',
              fontFamily: 'var(--font-dm-sans)',
              outline: 'none',
              background: '#ffffff',
              color: 'var(--black)',
              cursor: 'pointer',
            }}
          >
            <option value="">Todas las categorias</option>
            <option value="Mujer">Mujer</option>
            <option value="Hombre">Hombre</option>
            <option value="Liquidacion">Liquidacion</option>
            <option value="Novedades">Novedades</option>
            <option value="General">General</option>
          </select>

          <select
            value={filtroEstado}
            onChange={(e) => {
              setFiltroEstado(e.target.value);
              setPage(0);
              setReloadKey((prev) => prev + 1);
            }}
            style={{
              height: '40px',
              padding: '0 12px',
              border: '1px solid var(--border2)',
              fontSize: '13px',
              fontFamily: 'var(--font-dm-sans)',
              outline: 'none',
              background: '#ffffff',
              color: 'var(--black)',
              cursor: 'pointer',
            }}
          >
            <option value="">Todos los estados</option>
            <option value="activo">Activo</option>
            <option value="inactivo">Inactivo</option>
          </select>

          {(busqueda || filtroCategoria || filtroEstado) && (
            <button
              type="button"
              onClick={() => {
                setBusqueda('');
                setFiltroCategoria('');
                setFiltroEstado('');
                setPage(0);
                setReloadKey((prev) => prev + 1);
              }}
              style={{
                height: '40px',
                padding: '0 16px',
                border: '1px solid var(--border2)',
                background: 'transparent',
                color: 'var(--gray)',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer',
                fontFamily: 'var(--font-dm-sans)',
              }}
            >
              Limpiar filtros
            </button>
          )}
        </div>

        {seleccionados.length > 0 && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '12px 16px',
            background: 'var(--card)',
            border: '1px solid var(--border)',
            marginBottom: '8px',
            flexWrap: 'wrap',
          }}>
            <span style={{ fontSize: '13px', color: 'var(--black)', fontWeight: 600 }}>
              {seleccionados.length} seleccionado(s)
            </span>

            <select
              value={accionMasiva}
              onChange={(e) => {
                setAccionMasiva(e.target.value);
                setValorMasivo('');
              }}
              style={{
                height: '36px',
                padding: '0 12px',
                border: '1px solid var(--border2)',
                fontSize: '13px',
                fontFamily: 'var(--font-dm-sans)',
                outline: 'none',
                background: '#ffffff',
                color: 'var(--black)',
                cursor: 'pointer',
              }}
            >
              <option value="">Seleccionar accion...</option>
              <option value="categoria">Cambiar categoria</option>
              <option value="marca">Cambiar marca</option>
              <option value="activar">Activar</option>
              <option value="desactivar">Desactivar</option>
              <option value="precio">Aumentar precio %</option>
            </select>

            {accionMasiva === 'categoria' && (
              <select
                value={valorMasivo}
                onChange={(e) => setValorMasivo(e.target.value)}
                style={{
                  height: '36px',
                  padding: '0 12px',
                  border: '1px solid var(--border2)',
                  fontSize: '13px',
                  fontFamily: 'var(--font-dm-sans)',
                  outline: 'none',
                  background: '#ffffff',
                  color: 'var(--black)',
                  cursor: 'pointer',
                }}
              >
                <option value="">Elegir categoria...</option>
                <option value="Mujer">Mujer</option>
                <option value="Hombre">Hombre</option>
                <option value="Liquidacion">Liquidacion</option>
                <option value="Novedades">Novedades</option>
                <option value="General">General</option>
              </select>
            )}

            {(accionMasiva === 'marca' || accionMasiva === 'precio') && (
              <input
                type={accionMasiva === 'precio' ? 'number' : 'text'}
                placeholder={accionMasiva === 'precio' ? 'Ej: 20 (%)' : 'Nombre de marca'}
                value={valorMasivo}
                onChange={(e) => setValorMasivo(e.target.value)}
                min={accionMasiva === 'precio' ? '0.01' : undefined}
                style={{
                  height: '36px',
                  padding: '0 12px',
                  border: '1px solid var(--border2)',
                  fontSize: '13px',
                  fontFamily: 'var(--font-dm-sans)',
                  outline: 'none',
                  background: '#ffffff',
                  color: 'var(--black)',
                  minWidth: '180px',
                }}
              />
            )}

            <button
              type="button"
              disabled={
                aplicandoMasivo ||
                !accionMasiva ||
                ((accionMasiva === 'categoria' ||
                  accionMasiva === 'marca' ||
                  accionMasiva === 'precio') && !valorMasivo)
              }
              onClick={async () => {
                setAplicandoMasivo(true);
                try {
                  const payload: {
                    ids: number[];
                    categoria?: string;
                    marca?: string;
                    activo?: boolean;
                    porcentajeAumento?: number;
                  } = { ids: seleccionados };

                  if (accionMasiva === 'categoria') payload.categoria = valorMasivo;
                  if (accionMasiva === 'marca') payload.marca = valorMasivo;
                  if (accionMasiva === 'activar') payload.activo = true;
                  if (accionMasiva === 'desactivar') payload.activo = false;
                  if (accionMasiva === 'precio') payload.porcentajeAumento = Number(valorMasivo);

                  await editarProductosMasivo(payload);
                  setSeleccionados([]);
                  setAccionMasiva('');
                  setValorMasivo('');
                  setPage(0);
                  setReloadKey((prev) => prev + 1);
                } catch (err) {
                  alert(err instanceof Error ? err.message : 'Error al aplicar cambios');
                } finally {
                  setAplicandoMasivo(false);
                }
              }}
              style={{
                height: '36px',
                padding: '0 20px',
                border: 'none',
                background: 'var(--accent)',
                color: '#ffffff',
                fontSize: '13px',
                fontWeight: 600,
                cursor: aplicandoMasivo ? 'not-allowed' : 'pointer',
                opacity: aplicandoMasivo ? 0.7 : 1,
                fontFamily: 'var(--font-dm-sans)',
              }}
            >
              {aplicandoMasivo ? 'Aplicando...' : 'Aplicar'}
            </button>

            <button
              type="button"
              onClick={() => {
                setSeleccionados([]);
                setAccionMasiva('');
                setValorMasivo('');
              }}
              style={{
                height: '36px',
                padding: '0 16px',
                border: '1px solid var(--border)',
                background: 'transparent',
                color: 'var(--gray)',
                fontSize: '12px',
                cursor: 'pointer',
                fontFamily: 'var(--font-dm-sans)',
              }}
            >
              Cancelar
            </button>
          </div>
        )}

        <section style={{
          border: '1px solid var(--border)',
          background: '#ffffff',
          overflow: 'hidden',
        }}>
          {loading ? (
            <div style={{ padding: '48px 24px', textAlign: 'center', color: 'var(--gray)', fontSize: '15px' }}>
              Cargando productos...
            </div>
          ) : error ? (
            <div style={{ padding: '48px 24px', textAlign: 'center', color: '#b42318', fontSize: '15px' }}>
              {error}
            </div>
          ) : productos.length === 0 ? (
            <div style={{ padding: '48px 24px', textAlign: 'center', color: 'var(--gray)', fontSize: '15px' }}>
              No hay productos para mostrar.
            </div>
          ) : (
            <>
              <ProductosTable
                productos={productos}
                onEliminar={handleEliminar}
                deletingId={deletingId}
                seleccionados={seleccionados}
                onToggleSeleccion={(id: number) => {
                  setSeleccionados((prev) =>
                    prev.includes(id) ? prev.filter((selectedId) => selectedId !== id) : [...prev, id]
                  );
                }}
                onToggleTodos={(ids: number[]) => {
                  const todosSeleccionados = ids.every((id) => seleccionados.includes(id));
                  setSeleccionados(todosSeleccionados ? [] : ids);
                }}
              />
              <PaginacionControls
                page={page}
                totalPages={totalPages}
                onPrev={() => setPage((current) => Math.max(current - 1, 0))}
                onNext={() => setPage((current) => totalPages > 0 ? Math.min(current + 1, totalPages - 1) : current)}
              />
            </>
          )}
        </section>
        {toastVisible && (
          <div style={{
            position: 'fixed',
            bottom: '32px',
            right: '32px',
            background: '#111111',
            color: '#ffffff',
            padding: '14px 24px',
            fontSize: '13px',
            fontWeight: 500,
            letterSpacing: '0.5px',
            zIndex: 999,
            boxShadow: '0 4px 24px rgba(0,0,0,0.18)',
          }}>
            Producto creado correctamente
          </div>
        )}
        {modalImportar && (
          <ImportarExcelModal
            onClose={() => setModalImportar(false)}
            onSuccess={() => {
              setModalImportar(false);
              setPage(0);
              setReloadKey((prev) => prev + 1);
            }}
          />
        )}
      </div>
    </main>
  );
}
