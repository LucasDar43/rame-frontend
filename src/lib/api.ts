import { Producto, Page, Variante, OrdenRequest, OrdenResponse } from '@/types';

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

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.mensaje || `Error ${res.status}`);
  }

  // 👇 CLAVE
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

// ─── PRODUCTOS ───────────────────────────────────────────

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

// ─── PRODUCTOS - ADMIN ────────────────────────────────────

export async function crearProducto(formData: FormData): Promise<Producto> {
  const res = await fetch(`${BASE_URL}/productos`, {
    method: 'POST',
    headers: authHeaders(),
    body: formData, // multipart, NO pongas Content-Type acá
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

// ─── VARIANTES ───────────────────────────────────────────

export async function getVariantes(productoId: number): Promise<Variante[]> {
  return fetchApi(`/productos/${productoId}/variantes`);
}

// ─── ÓRDENES ─────────────────────────────────────────────

export async function crearOrden(data: OrdenRequest): Promise<OrdenResponse> {
  return fetchApi('/ordenes', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function getOrden(id: number): Promise<OrdenResponse> {
  return fetchApi(`/ordenes/${id}`);
}

// ─── AUTH ─────────────────────────────────────────────────

export async function login(email: string, password: string) {
  return fetchApi<{ token: string; email: string; rol: string }>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}