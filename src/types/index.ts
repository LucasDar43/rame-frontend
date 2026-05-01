export interface Producto {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  precioOriginal?: number;
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
  varianteId: number;
  cantidad: number;
}

export interface OrdenRequest {
  nombreComprador: string;
  emailComprador: string;
  telefonoComprador?: string;
  direccionEnvio?: string;
  numeroDireccion?: string;
  pisoDpto?: string;
  codigoPostal?: string;
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
  varianteId: number;
  nombreProducto: string;
  talle: string;
  color: string;
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

export interface OrdenResumen {
  id: number;
  nombreComprador: string;
  emailComprador: string;
  total: number;
  estado: 'PENDIENTE' | 'APROBADO' | 'RECHAZADO' | 'CANCELADO';
  fechaCreacion: string;
}

export interface EnvioResponse {
  costo: number;
  zona: string;
  descripcion: string;
  umbralEnvioGratis: number;
}

export interface CuponResponse {
  id: number;
  codigo: string;
  porcentaje: number;
  activo: boolean;
  fechaCreacion: string;
}

export interface CuponRequest {
  codigo: string;
  porcentaje: number;
  activo: boolean;
}

export interface CuponValido {
  codigo: string;
  porcentaje?: number;
  valido: boolean;
  mensaje: string;
}
