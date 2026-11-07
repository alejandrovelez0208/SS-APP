import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthSessionService } from '@core/auth/auth-session.service';

export const adminGuard: CanActivateFn = () => {
  const authService = inject(AuthSessionService);
  const router = inject(Router);

  if (!authService.isLoggedIn()) {
    return router.createUrlTree(['/login']);
  }

  return authService.isAdmin() ? true : router.createUrlTree(['/access-restricted']);
};
