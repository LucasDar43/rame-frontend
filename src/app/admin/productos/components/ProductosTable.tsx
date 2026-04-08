'use client';

import { useRouter } from 'next/navigation';
import { Producto } from '@/types';

type ProductosTableProps = {
  productos: Producto[];
  onEliminar: (id: number) => void;
  deletingId: number | null;
};

const PLACEHOLDER_IMAGE =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='80' height='80' viewBox='0 0 80 80'><rect width='80' height='80' rx='12' fill='%23f4f1eb'/><path d='M24 52l10-10 8 8 14-16 8 18H24z' fill='%23d6cec2'/><circle cx='31' cy='28' r='6' fill='%23d6cec2'/></svg>";

const currencyFormatter = new Intl.NumberFormat('es-AR', {
  style: 'currency',
  currency: 'ARS',
});

export default function ProductosTable({
  productos,
  onEliminar,
  deletingId,
}: ProductosTableProps) {
  const router = useRouter();

  return (
    <div style={{ width: '100%', overflowX: 'auto' }}>
      <table
        style={{
          width: '100%',
          minWidth: '960px',
          borderCollapse: 'collapse',
        }}
      >
        <thead>
          <tr style={{ background: 'var(--card)' }}>
            {[
              'ID',
              'Imagen',
              'Nombre',
              'Marca',
              'Categoría',
              'Precio',
              'Estado',
              'Acciones',
            ].map((title) => (
              <th
                key={title}
                style={{
                  padding: '16px',
                  textAlign: 'left',
                  fontSize: '12px',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: 'var(--gray)',
                  borderBottom: '1px solid var(--border)',
                  whiteSpace: 'nowrap',
                }}
              >
                {title}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {productos.map((producto) => {
            const imagenSrc =
              producto.imagenUrl || producto.imagenes?.[0]?.url || PLACEHOLDER_IMAGE;

            return (
              <tr key={producto.id}>
                <td
                  style={{
                    padding: '16px',
                    borderBottom: '1px solid var(--border)',
                    color: 'var(--black)',
                    fontSize: '14px',
                    whiteSpace: 'nowrap',
                  }}
                >
                  #{producto.id}
                </td>
                <td
                  style={{
                    padding: '16px',
                    borderBottom: '1px solid var(--border)',
                  }}
                >
                  <img
                    src={imagenSrc}
                    alt={producto.nombre}
                    onError={(event) => {
                      event.currentTarget.src = PLACEHOLDER_IMAGE;
                    }}
                    style={{
                      width: '56px',
                      height: '56px',
                      objectFit: 'cover',
                      border: '1px solid var(--border)',
                      background: 'var(--card)',
                      display: 'block',
                    }}
                  />
                </td>
                <td
                  style={{
                    padding: '16px',
                    borderBottom: '1px solid var(--border)',
                    color: 'var(--black)',
                    fontSize: '14px',
                    fontWeight: 500,
                  }}
                >
                  {producto.nombre}
                </td>
                <td
                  style={{
                    padding: '16px',
                    borderBottom: '1px solid var(--border)',
                    color: 'var(--off-white)',
                    fontSize: '14px',
                  }}
                >
                  {producto.marca}
                </td>
                <td
                  style={{
                    padding: '16px',
                    borderBottom: '1px solid var(--border)',
                    color: 'var(--off-white)',
                    fontSize: '14px',
                  }}
                >
                  {producto.categoria}
                </td>
                <td
                  style={{
                    padding: '16px',
                    borderBottom: '1px solid var(--border)',
                    color: 'var(--black)',
                    fontSize: '14px',
                    fontWeight: 500,
                    whiteSpace: 'nowrap',
                  }}
                >
                  {currencyFormatter.format(producto.precio)}
                </td>
                <td
                  style={{
                    padding: '16px',
                    borderBottom: '1px solid var(--border)',
                  }}
                >
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      padding: '6px 10px',
                      fontSize: '12px',
                      fontWeight: 600,
                      background: producto.activo
                        ? 'rgba(18, 183, 106, 0.12)'
                        : 'rgba(152, 162, 179, 0.18)',
                      color: producto.activo ? '#027a48' : '#475467',
                    }}
                  >
                    {producto.activo ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
                <td
                  style={{
                    padding: '16px',
                    borderBottom: '1px solid var(--border)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <button
                      onClick={() => router.push(`/admin/productos/${producto.id}/edit`)}
                      title="Editar producto"
                      style={{
                        border: '1px solid var(--border)',
                        background: 'transparent',
                        color: 'var(--black)',
                        width: '34px',
                        height: '34px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginRight: '8px',
                      }}
                    >
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                      >
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                      </svg>
                    </button>

                    <button
                      onClick={() => onEliminar(producto.id)}
                      disabled={deletingId === producto.id}
                      title="Eliminar producto"
                      style={{
                        background: 'transparent',
                        border: '1px solid var(--border)',
                        color: deletingId === producto.id ? 'var(--gray)' : '#cc3333',
                        width: '34px',
                        height: '34px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: deletingId === producto.id ? 'not-allowed' : 'pointer',
                        opacity: deletingId === producto.id ? 0.5 : 1,
                      }}
                    >
                      {deletingId === producto.id ? (
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          style={{ animation: 'spin 1s linear infinite' }}
                        >
                          <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                        </svg>
                      ) : (
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.8"
                        >
                          <polyline points="3 6 5 6 21 6" />
                          <path d="M19 6l-1 14H6L5 6" />
                          <path d="M10 11v6M14 11v6" />
                          <path d="M9 6V4h6v2" />
                        </svg>
                      )}
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

