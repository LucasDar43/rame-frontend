export interface Producto {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  marca: string;
  categoria: string;
  subcategoria?: string;
  imagenUrl?: string;
  imagenes: ImagenProducto[];
  activo: boolean;
  fechaCreacion: string;
}

export interface ImagenProducto {
  id: number;
  url: string;
  orden: number;
}

export interface Variante {
  id: number;
  productoId: number;
  talle: string;
  color: string;
  stock: number;
  sku?: string;
  activo: boolean;
}

export interface VarianteRequestDTO {
  talle: string;
  color: string;
  stock: number;
  sku?: string;
}

export interface Page<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}

export interface OrdenItem {
  productoId: number;
  cantidad: number;
}

export interface OrdenRequest {
  nombreComprador: string;
  emailComprador: string;
  telefonoComprador?: string;
  direccionEnvio?: string;
  ciudadEnvio?: string;
  provinciaEnvio?: string;
  items: OrdenItem[];
}

export interface OrdenResponse {
  id: number;
  nombreComprador: string;
  emailComprador: string;
  total: number;
  estado: 'PENDIENTE' | 'APROBADO' | 'RECHAZADO' | 'CANCELADO';
  mpPreferenceId: string;
  initPoint: string;
  items: OrdenItemDTO[];
  fechaCreacion: string;
}

export interface OrdenItemDTO {
  productoId: number;
  nombreProducto: string;
  imagenUrl?: string;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
}

export interface FilaError {
  fila: number;
  mensaje: string;
}

export interface ImportacionResultado {
  productosCreados: number;
  variantesCreadas: number;
  errores: FilaError[];
}
