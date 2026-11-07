import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { CatalogApiService } from '@shared/services/catalogs/catalog-api.service';
import { AdminCatalogFacade } from './admin-catalog.facade';

describe('AdminCatalogFacade', () => {
  let service: AdminCatalogFacade;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: CatalogApiService,
          useValue: {
            getAll: () => of([]),
            create: () => of({ id: 1, name: 'Test', catalogType: 'MODALITY', active: true }),
            updateStatus: () => of({ id: 1, name: 'Test', catalogType: 'MODALITY', active: false }),
          },
        },
      ],
    });
    service = TestBed.inject(AdminCatalogFacade);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
