import {
  Producto,
  Page,
  Variante,
  VarianteRequestDTO,
  OrdenRequest,
  OrdenResponse,
  OrdenResumen,
  ImportacionResultado,
} from '@/types';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080/api';
console.log('BASE_URL:', BASE_URL);

// Helper interno para los fetches
async function fetchApi<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  if (res.status === 401 || res.status === 403) {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('email');
      localStorage.removeItem('rol');
      window.location.href = '/admin/login';
    }
    throw new Error('Sesi\u00f3n expirada');
  }

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.mensaje || `Error ${res.status}`);
  }

  if (res.status === 204) {
    return undefined as T;
  }

  return res.json();
}

// Helper para requests autenticados (panel admin)
function authHeaders(): HeadersInit {
  const token = typeof window !== 'undefined'
    ? localStorage.getItem('token')
    : null;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// PRODUCTOS

export async function getProductos(page = 0, size = 12): Promise<Page<Producto>> {
  return fetchApi(`/productos?page=${page}&size=${size}`);
}

export async function getProducto(id: number): Promise<Producto> {
  return fetchApi(`/productos/${id}`);
}

export async function buscarProductos(q: string): Promise<Producto[]> {
  return fetchApi(`/productos/buscar?q=${encodeURIComponent(q)}`);
}

export async function getProductosPorCategoria(categoria: string): Promise<Producto[]> {
  return fetchApi(`/productos/categoria/${encodeURIComponent(categoria)}`);
}

// PRODUCTOS - ADMIN

export async function crearProducto(formData: FormData): Promise<Producto> {
  const res = await fetch(`${BASE_URL}/productos`, {
    method: 'POST',
    headers: authHeaders(),
    body: formData,
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.mensaje || `Error ${res.status}`);
  }
  return res.json();
}

export async function actualizarProducto(id: number, data: Partial<Producto>): Promise<Producto> {
  return fetchApi(`/productos/${id}`, {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
}

export async function eliminarProducto(id: number): Promise<void> {
  return fetchApi(`/productos/${id}`, {
    method: 'DELETE',
    headers: authHeaders(),
  });
}

// VARIANTES

export async function getVariantes(productoId: number): Promise<Variante[]> {
  return fetchApi(`/productos/${productoId}/variantes`, {
    headers: authHeaders(),
  });
}

export async function crearVariante(
  productoId: number,
  data: VarianteRequestDTO,
): Promise<Variante> {
  return fetchApi(`/productos/${productoId}/variantes`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
}

export async function actualizarVariante(
  productoId: number,
  varianteId: number,
  data: VarianteRequestDTO,
): Promise<Variante> {
  return fetchApi(`/productos/${productoId}/variantes/${varianteId}`, {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
}

export async function eliminarVariante(
  productoId: number,
  varianteId: number,
): Promise<void> {
  return fetchApi(`/productos/${productoId}/variantes/${varianteId}`, {
    method: 'DELETE',
    headers: authHeaders(),
  });
}

// ORDENES

export async function crearOrden(data: OrdenRequest): Promise<OrdenResponse> {
  return fetchApi('/ordenes', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function getOrden(id: number): Promise<OrdenResponse> {
  return fetchApi(`/ordenes/${id}`);
}

export async function getOrdenes(page = 0, size = 10): Promise<Page<OrdenResumen>> {
  return fetchApi(`/ordenes?page=${page}&size=${size}`, {
    headers: authHeaders(),
  });
}

// AUTH

export async function login(email: string, password: string) {
  return fetchApi<{ token: string; email: string; rol: string }>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

export async function importarProductosSimple(
  file: File
): Promise<ImportacionResultado> {
  const formData = new FormData();
  formData.append('archivo', file);

  const res = await fetch(`${BASE_URL}/productos/importar-simple`, {
    method: 'POST',
    headers: authHeaders(),
    body: formData,
  });

  if (res.status === 401 || res.status === 403) {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('email');
      localStorage.removeItem('rol');
      window.location.href = '/admin/login';
    }
    throw new Error('Sesi\u00f3n expirada');
  }

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.mensaje || `Error ${res.status}`);
  }

  return res.json();
}

export async function buscarProductosFiltrado(
  params: {
    q?: string;
    categoria?: string;
    marca?: string;
    color?: string;
    talle?: string;
    ordenar?: string;
    page?: number;
    size?: number;
  }
): Promise<Page<Producto>> {
  const queryParams = new URLSearchParams();
  queryParams.append('page', String(params.page ?? 0));
  queryParams.append('size', String(params.size ?? 20));
  if (params.q && params.q.trim()) queryParams.append('q', params.q.trim());
  if (params.categoria && params.categoria !== 'Todas') queryParams.append('categoria', params.categoria);
  if (params.marca) queryParams.append('marca', params.marca);
  if (params.color) queryParams.append('color', params.color);
  if (params.talle) queryParams.append('talle', params.talle);
  if (params.ordenar) queryParams.append('ordenar', params.ordenar);
  return fetchApi(`/productos/buscar-filtrado?${queryParams.toString()}`);
}

export async function getFiltrosDisponibles(): Promise<{
  marcas: string[];
  colores: string[];
  talles: string[];
}> {
  return fetchApi('/productos/filtros-disponibles');
}
