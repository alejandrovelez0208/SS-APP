import { inject, Injectable, signal } from '@angular/core';
import { CatalogTypeOption } from '@features/admin/constants/catalog-type-options';
import { Catalog, CatalogType } from '@shared/models/catalog.model';
import { CatalogApiService } from '@shared/services/catalogs/catalog-api.service';
import { forkJoin } from 'rxjs';

interface CatalogOption { id: number; label: string; }
const toOption = (c: Catalog): CatalogOption => ({ id: c.id, label: c.name });

@Injectable({
  providedIn: 'root',
})
export class CatalogOptionService {
  private readonly catalogApi = inject(CatalogApiService);

  readonly services = signal<CatalogOption[]>([]);
  readonly channels = signal<CatalogOption[]>([]);
  readonly departures = signal<CatalogOption[]>([]);
  readonly modalities = signal<CatalogOption[]>([]);
  readonly loading = signal(false);

  private loaded = false;

  load(): void {
    if (this.loaded) return;

    this.loading.set(true);
    forkJoin({
      services: this.catalogApi.searchByType(CatalogType.SERVICE),
      channels: this.catalogApi.searchByType(CatalogType.CHANNEL),
      departures: this.catalogApi.searchByType(CatalogType.TRAVEL),
      modalities: this.catalogApi.searchByType(CatalogType.MODALITY),
    }).subscribe({
      next: ({ services, channels, departures, modalities }) => {
        this.services.set(services.map(toOption));
        this.channels.set(channels.map(toOption));
        this.departures.set(departures.map(toOption));
        this.modalities.set(modalities.map(toOption));
        this.loaded = true;
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  
}
