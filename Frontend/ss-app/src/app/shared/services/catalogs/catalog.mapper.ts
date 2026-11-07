import { Catalog, CatalogItem } from '@shared/models/catalog.model';

/**
 * Adapta un elemento del modelo nuevo a la forma que consumen los componentes
 * del signup. El `code` usa el id porque las fórmulas se generan desde el
 * nombre.
 */
export function toCatalogItem(catalog: Catalog): CatalogItem {
  return {
    id: catalog.id,
    code: catalog.id,
    description: catalog.name,
    fatherType: null,
  };
}
