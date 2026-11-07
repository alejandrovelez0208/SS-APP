import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { CatalogApiService } from '@shared/services/catalogs/catalog-api.service';
import { SignupCatalogStateService } from './signup-catalog-state.service';

describe('SignupCatalogStateService', () => {
  let service: SignupCatalogStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: CatalogApiService,
          useValue: { searchByType: () => of([]) },
        },
      ],
    });
    service = TestBed.inject(SignupCatalogStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
