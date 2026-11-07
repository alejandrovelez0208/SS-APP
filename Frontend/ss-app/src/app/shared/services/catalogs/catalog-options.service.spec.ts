import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { CatalogApiService } from './catalog-api.service';
import { CatalogOptionsService } from './catalog-options.service';

describe('CatalogOptionsService', () => {
  let service: CatalogOptionsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: CatalogApiService,
          useValue: { searchByType: () => of([]) },
        },
      ],
    });
    service = TestBed.inject(CatalogOptionsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
