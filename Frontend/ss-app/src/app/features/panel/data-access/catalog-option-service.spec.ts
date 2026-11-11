import { TestBed } from '@angular/core/testing';

import { CatalogOptionService } from './catalog-option-service';

describe('CatalogOptionService', () => {
  let service: CatalogOptionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CatalogOptionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
