import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { AuthApiService } from './auth-api.service';
import { AuthSessionService } from './auth-session.service';

describe('AuthSessionService', () => {
  let service: AuthSessionService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: AuthApiService, useValue: {} },
        { provide: Router, useValue: { navigate: () => undefined } },
      ],
    });
    service = TestBed.inject(AuthSessionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
