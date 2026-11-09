import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { resolveCatalogType } from '../constants/catalog-type-options';
import { Catalog, CatalogFormValue, MessageResponse } from '@shared/models/catalog.model';
import { CatalogApiService } from '@shared/services/catalogs/catalog-api.service';

/**
 * Operaciones del panel administrativo sobre el modelo nuevo de catálogos.
 */
@Injectable({
  providedIn: 'root',
})
export class AdminCatalogFacade {
  private readonly catalogApi = inject(CatalogApiService);

  getAll(): Observable<Catalog[]> {
    return this.catalogApi.getAll();
  }

  create(formValue: CatalogFormValue): Observable<Catalog> {
    return this.catalogApi.create({
      catalogType: resolveCatalogType(formValue.catalogType),
      name: formValue.name.trim(),
    });
  }

  updateStatus(id: number, active: boolean): Observable<Catalog> {
    return this.catalogApi.updateStatus(id, active);
  }

  deleteItem(id: number): Observable<MessageResponse> {
    return this.catalogApi.deleteItem(id);
  }
}
