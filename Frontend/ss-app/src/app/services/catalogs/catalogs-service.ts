import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CatalogFilter } from '../../shared/CatalogFilter';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CatalogsService {
  private apiUrl = environment.apiUrl + 'catalogs/';

  classificationMap = new Map<number, string>();
  modalititesMap = new Map<number, string>();
  channelsMap = new Map<number, string>();

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
      switch (item.code) {
        case 110:
          this.modalititesMap.set(item.code, "whatsapp");
          break;
        case 120:
          this.modalititesMap.set(item.code, "telegram");
          break;
      }
    }
  }
}