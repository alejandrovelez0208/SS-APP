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

  constructor(private http: HttpClient, private router: Router) { }

  getServiceClassification(filters: CatalogFilter): Observable<any[]> {
    return this.http.post<any[]>(this.apiUrl + 'search', filters);
  }

  assignTitles(serviceClassification: any[]) {
    for (const item of serviceClassification) {
      this.classificationMap.set(item.code, item.description);
    }
  }
}