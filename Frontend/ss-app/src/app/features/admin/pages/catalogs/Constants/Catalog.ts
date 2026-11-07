export enum CatalogType {
  CATEGORY = 'CATEGORY',
  CHANNEL = 'CHANNEL',
  MODALITY = 'MODALITY',
  SERVICE = 'SERVICE',
  TRAVEL = 'TRAVEL'
}

export interface CatalogTypeOption {
  value: CatalogType;
  label: string;
}

export const CATALOG_TYPE_OPTIONS: CatalogTypeOption[] = [
  { value: CatalogType.CATEGORY, label: 'Categoría Raíz / Principal' },
  { value: CatalogType.CHANNEL, label: 'Canales de Comunicación' },
  { value: CatalogType.MODALITY, label: 'Modalidad de Servicio' },
  { value: CatalogType.SERVICE, label: 'Servicios y Prácticas' },
  { value: CatalogType.TRAVEL, label: 'Viajes y Desplazamientos' }
];