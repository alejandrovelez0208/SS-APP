import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CatalogFilter } from '../../shared/CatalogFilter';
import { Observable } from 'rxjs';
import { CatalogItem, ServiceItem } from '../../shared/models/escort.model';
import { OTHERS_CATEGORY_LABEL, SERVICE_CATEGORY_RANGES } from '../../shared/enums/constants/fieldOptions';

export type CatalogType = 'modality' | 'channels' | 'typeOfServices';

@Injectable({
  providedIn: 'root',
})
export class CatalogsService {
  private apiUrl = environment.apiUrl + 'catalogs/';

  private catalogLists = new Map<CatalogType, CatalogItem[]>();
  private formulaMaps = new Map<CatalogType, Map<number, string>>();
  private _groupedServicesCache: [string, CatalogItem[]][] = [];

  constructor(private http: HttpClient, private router: Router) { }

  getPTipos(filters: CatalogFilter): Observable<CatalogItem[]> {
    return this.http.post<CatalogItem[]>(this.apiUrl + 'search', filters);
  }

  private buildFormulaMap(items: CatalogItem[]): Map<number, string> {
    const map = new Map<number, string>();
    for (const item of items) {
      const formula = item.description.toLowerCase().trim().replace(/\s+/g, '_');
      map.set(item.code, formula);
    }
    return map;
  }

  assignModalityFormula(items: CatalogItem[]): void {
    this.catalogLists.set('modality', items);

    const map = new Map<number, string>();
    for (const item of items) {
      switch (item.code) {
        case 210: map.set(item.code, 'own_location'); break;
        case 220: map.set(item.code, 'hotels'); break;
        case 230: map.set(item.code, 'customer_address'); break;
      }
    }
    this.formulaMaps.set('modality', map);
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

  getFormulaMap(type: CatalogType): Map<number, string> {
    return this.formulaMaps.get(type) ?? new Map();
  }

  categorizeService(code: number): string {
    const { TYPE_OF_SERVICES, I_ATTEND_TO } = SERVICE_CATEGORY_RANGES;
    if (code >= TYPE_OF_SERVICES.min && code <= TYPE_OF_SERVICES.max) {
      return TYPE_OF_SERVICES.label;
    }
    if (code >= I_ATTEND_TO.min && code <= I_ATTEND_TO.max) {
      return I_ATTEND_TO.label;
    }
    return OTHERS_CATEGORY_LABEL;
  }

  private rebuildGroupedServices(): void {
    const items = this.catalogLists.get('typeOfServices') ?? [];
    const groups: { [title: string]: CatalogItem[] } = {
      [SERVICE_CATEGORY_RANGES.TYPE_OF_SERVICES.label]: [],
      [SERVICE_CATEGORY_RANGES.I_ATTEND_TO.label]: [],
      [OTHERS_CATEGORY_LABEL]: [],
    };

    for (const item of items) {
      const category = this.categorizeService(item.code);
      groups[category].push(item);
    }

    this._groupedServicesCache = Object.entries(groups).filter(([_, list]) => list.length > 0);
  }

  get groupedServices(): [string, CatalogItem[]][] {
    return this._groupedServicesCache;
  }
}