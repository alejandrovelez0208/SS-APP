import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { CatalogItem, CatalogType } from '@shared/models/catalog.model';
import { CatalogApiService } from './catalog-api.service';
import { toCatalogItem } from './catalog.mapper';

export type CatalogKey = 'modality' | 'channels' | 'typeOfServices' | 'departures';

const SERVICES_GROUP_LABEL = 'Services and Practices';

/**
 * Estado de catálogos que consume el signup: listas, fórmulas y agrupaciones.
 */
@Injectable({
  providedIn: 'root',
})
export class CatalogOptionsService {
  private readonly catalogApi = inject(CatalogApiService);

  private readonly catalogLists = new Map<CatalogKey, CatalogItem[]>();
  private readonly formulaMaps = new Map<CatalogKey, Map<number, string>>();
  private groupedServicesCache: [string, CatalogItem[]][] = [];

  search(type: CatalogType): Observable<CatalogItem[]> {
    return this.catalogApi.searchByType(type).pipe(map((catalogs) => catalogs.map(toCatalogItem)));
  }

  assignModalityFormula(items: CatalogItem[]): void {
    this.catalogLists.set('modality', items);
    this.formulaMaps.set('modality', this.buildFormulaMap(items));
  }

  assignChannelsFormula(items: CatalogItem[]): void {
    this.catalogLists.set('channels', items);
    this.formulaMaps.set('channels', this.buildFormulaMap(items));
  }

  assignTypeOfServicesFormula(items: CatalogItem[]): void {
    this.catalogLists.set('typeOfServices', items);
    this.formulaMaps.set('typeOfServices', this.buildFormulaMap(items));
    this.rebuildGroupedServices();
  }

  assignDeparturesFormula(items: CatalogItem[]): void {
    this.catalogLists.set('departures', items);
    this.formulaMaps.set('departures', this.buildFormulaMap(items));
  }

  getFormulaMap(type: CatalogKey): Map<number, string> {
    return this.formulaMaps.get(type) ?? new Map();
  }

  get groupedServices(): [string, CatalogItem[]][] {
    return this.groupedServicesCache;
  }

  private buildFormulaMap(items: CatalogItem[]): Map<number, string> {
    const map = new Map<number, string>();

    for (const item of items) {
      const formula = item.description.toLowerCase().trim().replace(/\s+/g, '_');
      map.set(item.code, formula);
    }

    return map;
  }

  private rebuildGroupedServices(): void {
    const items = this.catalogLists.get('typeOfServices') ?? [];
    this.groupedServicesCache = items.length > 0 ? [[SERVICES_GROUP_LABEL, items]] : [];
  }
}
