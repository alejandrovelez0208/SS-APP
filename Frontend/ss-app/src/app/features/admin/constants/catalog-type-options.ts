import { CatalogType } from '@shared/models/catalog.model';

export interface CatalogTypeOption {
  value: CatalogType;
  label: string;
}

export const CATALOG_TYPE_OPTIONS: readonly CatalogTypeOption[] = [
  { value: CatalogType.CATEGORY, label: 'Root Category / Main' },
  { value: CatalogType.CHANNEL, label: 'Channels Communication' },
  { value: CatalogType.MODALITY, label: 'Service Modality' },
  { value: CatalogType.SERVICE, label: 'Services and Practices' },
  { value: CatalogType.TRAVEL, label: 'Trips and Movements' },
  { value: CatalogType.CITY, label: 'Base Cities' },
];

export function resolveCatalogType(label: string): CatalogType {
  const option = CATALOG_TYPE_OPTIONS.find((item) => item.label === label);

  if (!option) {
    throw new Error(`Unknown catalog type: ${label}`);
  }

  return option.value;
}
