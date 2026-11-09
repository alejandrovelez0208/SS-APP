import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { AdminDirectoryApiService } from './admin-directory-api-service';

describe('AdminDirectoryApiService', () => {
  let service: AdminDirectoryApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(AdminDirectoryApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
