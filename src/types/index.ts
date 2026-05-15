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
  tieneVariantes?: boolean;
  destacado?: boolean;
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
  estadoOperativo?: EstadoOperativo;
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
  estadoOperativo?: EstadoOperativo;
  fechaCreacion: string;
}

export type EstadoOperativo =
  | 'PENDIENTE_PREPARACION'
  | 'EN_PREPARACION'
  | 'LISTO_PARA_ENVIO'
  | 'ENVIADO'
  | 'ENTREGADO';

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

export interface ZonaEnvio {
  id: number;
  codigo: string;
  nombre: string;
  descripcion: string;
  costo: number;
  fechaActualizacion: string;
}

export interface ZonaEnvioUpdate {
  costo: number;
  descripcion?: string;
}

export interface AuditLogResponseDTO {
  id: number;
  usuarioEmail: string;
  accion: string;
  entidad: string;
  entidadId: string | null;
  ip: string;
  metadataJson: string | null;
  fecha: string;
}
