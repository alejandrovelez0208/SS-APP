import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '@shared/services/auth/auth-service';
import { adminGuard } from './admin-guard';

describe('adminGuard', () => {
  const route = {} as ActivatedRouteSnapshot;
  const state = {} as RouterStateSnapshot;

  function setup(isLoggedIn: boolean, isAdmin: boolean) {
    const router = { createUrlTree: vi.fn((commands: string[]) => commands) };

    TestBed.configureTestingModule({
      providers: [
        { provide: Router, useValue: router },
        {
          provide: AuthService,
          useValue: { isLoggedIn: () => isLoggedIn, isAdmin: () => isAdmin },
        },
      ],
    });

    return router;
  }

  it('allows an authenticated admin', () => {
    setup(true, true);

    const result = TestBed.runInInjectionContext(() => adminGuard(route, state));

    expect(result).toBe(true);
  });

  it('redirects an unauthenticated user to login', () => {
    const router = setup(false, false);

    TestBed.runInInjectionContext(() => adminGuard(route, state));

    expect(router.createUrlTree).toHaveBeenCalledWith(['/login']);
  });

  it('redirects a non-admin user to access restricted', () => {
    const router = setup(true, false);

    TestBed.runInInjectionContext(() => adminGuard(route, state));

    expect(router.createUrlTree).toHaveBeenCalledWith(['/access-restricted']);
  });
});
