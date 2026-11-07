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
  { value: CatalogType.CATEGORY, label: 'Root Category / Main' },
  { value: CatalogType.CHANNEL, label: 'Channels Communication' },
  { value: CatalogType.MODALITY, label: 'Service Modality' },
  { value: CatalogType.SERVICE, label: 'Services and Practices' },
  { value: CatalogType.TRAVEL, label: 'Trips and Movements' }
];