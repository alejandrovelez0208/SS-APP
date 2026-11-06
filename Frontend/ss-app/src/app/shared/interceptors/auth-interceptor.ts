import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { AUTH_TOKEN_KEY } from '../services/auth/auth-service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem(AUTH_TOKEN_KEY);

  if (!token || !req.url.startsWith(environment.apiUrl)) {
    return next(req);
  }

  return next(
    req.clone({
      setHeaders: { Authorization: `Bearer ${token}` },
    }),
  );
};
