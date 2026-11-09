/**
 * Tipos de catálogo soportados por la API (`/api/catalogs`).
 */
export enum CatalogType {
  CATEGORY = 'CATEGORY',
  CHANNEL = 'CHANNEL',
  MODALITY = 'MODALITY',
  SERVICE = 'SERVICE',
  TRAVEL = 'TRAVEL',
}

/**
 * Elemento que consumen los componentes del signup. Se adapta desde
 * {@link Catalog}.
 */
export interface CatalogItem {
  id: number;
  typeId?: number;
  code: number;
  description: string;
  fatherType?: number | null;
}

/**
 * Elemento del modelo nuevo (`catalog`).
 */
export interface Catalog {
  id: number;
  name: string;
  catalogType: CatalogType;
  active: boolean;
}

export interface CreateCatalogRequest {
  catalogType: CatalogType;
  name: string;
}

/**
 * Valor que devuelve el diálogo dinámico antes de normalizarse.
 */
export interface CatalogFormValue {
  catalogType: string;
  name: string;
}

/**
 * Respuesta simple usada por endpoints que no devuelven un recurso.
 */
export interface MessageResponse {
  message: string;
}
