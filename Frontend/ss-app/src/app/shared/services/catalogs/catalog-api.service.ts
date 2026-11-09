import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Catalog, CatalogType, CreateCatalogRequest, MessageResponse } from '@shared/models/catalog.model';

/**
 * Única puerta de entrada HTTP para catálogos.
 */
@Injectable({
  providedIn: 'root',
})
export class CatalogApiService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}catalogs`;

  searchByType(type: CatalogType): Observable<Catalog[]> {
    return this.http.get<Catalog[]>(this.apiUrl, { params: { type, active: true } });
  }

  getAll(): Observable<Catalog[]> {
    return this.http.get<Catalog[]>(this.apiUrl);
  }

  create(payload: CreateCatalogRequest): Observable<Catalog> {
    return this.http.post<Catalog>(this.apiUrl, payload);
  }

  updateStatus(id: number, active: boolean): Observable<Catalog> {
    return this.http.patch<Catalog>(`${this.apiUrl}/${id}/status`, { active });
  }

  deleteItem(id: number): Observable<MessageResponse> {
    return this.http.delete<MessageResponse>(`${this.apiUrl}/${id}/delete`);
  }
}
