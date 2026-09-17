import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CatalogFilter } from '../../shared/CatalogFilter';
import { Observable } from 'rxjs';
import { ServiceItem } from '../../shared/models/escort.model';

@Injectable({
  providedIn: 'root',
})
export class CatalogsService {
  private apiUrl = environment.apiUrl + 'catalogs/';

  classificationMap = new Map<number, string>();
  modalititesMap = new Map<number, string>();
  channelsMap = new Map<number, string>();
  typeOfServicesMap = new Map<number, string>();

  constructor(private http: HttpClient, private router: Router) { }

  getPTipos(filters: CatalogFilter): Observable<any[]> {
    return this.http.post<any[]>(this.apiUrl + 'search', filters);
  }

  assignModalityFormula(serviceModalities: any[]) {
    for (const item of serviceModalities) {
      switch (item.code) {
        case 210:
          this.modalititesMap.set(item.code, "own_location");
          break;
        case 220:
          this.modalititesMap.set(item.code, "hotels");
          break;
        case 230:
          this.modalititesMap.set(item.code, "customer_address");
          break;
      }
    }
  }

  assignChannelsFormular(channels: any[]) {
    for (const item of channels) {
      const formula = item.description.toLowerCase().trim().replace(/\s+/g, '_');
      this.channelsMap.set(item.code, formula);
    }
  }

  assingTypeOfServicesFormula(typeOfServices: any[]) {
    for (const item of typeOfServices) {
      const formula = item.description.toLowerCase().trim().replace(/\s+/g, '_');
      this.typeOfServicesMap.set(item.code, formula);
    }
  }
  categorizeService(code: number): string {
    if (code >= 310 && code <= 312) {
      return 'Type of Services';
    } else if (code >= 313 && code <= 320) {
      return 'I attend to';
    } else {
      return 'Others';
    }
  }

  get groupedServices() {
    const groups: { [title: string]: any[] } = {
      'Type of Services': [],
      'I attend to': [],
      'Others': []
    };

    this.typeOfServicesMap.forEach((description, code) => {
      const category = this.categorizeService(code);

      const item = { code, description }; 

      if (groups[category]) {
        groups[category].push(item);
      } else {
        groups['Others'].push(item);
      }
    });
    return Object.entries(groups).filter(([_, items]) => items.length > 0);
  }
}