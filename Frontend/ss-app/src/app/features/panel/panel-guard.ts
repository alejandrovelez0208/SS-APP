import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthSessionService } from '@core/auth/auth-session.service';

/**
 * Protege el panel: sin sesión activa se redirige al login.
 * Como la sesión vive en memoria, cualquier recarga obliga a loguearse.
 */
export const panelGuard: CanActivateFn = () => {
  const auth = inject(AuthSessionService);
  const router = inject(Router);

  return auth.isLoggedIn() ? true : router.createUrlTree(['/login']);
};
