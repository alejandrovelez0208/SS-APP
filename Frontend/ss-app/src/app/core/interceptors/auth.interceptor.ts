import { HttpClient, HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { Injector, inject } from '@angular/core';
import {
  Observable,
  catchError,
  finalize,
  shareReplay,
  switchMap,
  tap,
  throwError,
} from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthSessionService } from '../auth/auth-session.service';
import { AuthTokenStore } from '../auth/auth-token.store';
import { AuthUser } from '../auth/auth.models';

let refreshRequest$: Observable<AuthUser> | null = null;

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const tokenStore = inject(AuthTokenStore);
  const injector = inject(Injector);
  const accessToken = tokenStore.getAccess();

  const isApiRequest = req.url.startsWith(environment.apiUrl);
  const isAuthEndpoint =
    req.url.includes('/auth/login') ||
    req.url.includes('/auth/signup') ||
    req.url.includes('/auth/refresh') ||
    req.url.includes('/auth/logout');

  const request = isApiRequest && accessToken
    ? req.clone({ setHeaders: { Authorization: `Bearer ${accessToken}` } })
    : req;

  return next(request).pipe(
    catchError((error: unknown) => {
      const httpError = error as HttpErrorResponse;

      if (!isApiRequest || isAuthEndpoint || httpError.status !== 401) {
        return throwError(() => error);
      }

      const refreshToken = tokenStore.getRefresh();
      if (!refreshToken) {
        injector.get(AuthSessionService).forceLogout();
        return throwError(() => error);
      }

      const session = injector.get(AuthSessionService);

      if (!refreshRequest$) {
        refreshRequest$ = injector
          .get(HttpClient)
          .post<AuthUser>(`${environment.apiUrl}auth/refresh`, { refreshToken })
          .pipe(
            tap((response) => session.handleAuthSuccess(response)),
            shareReplay(1),
            finalize(() => {
              refreshRequest$ = null;
            }),
          );
      }

      return refreshRequest$.pipe(
        switchMap((response) =>
          next(
            req.clone({
              setHeaders: { Authorization: `Bearer ${response.token}` },
            }),
          ),
        ),
        catchError((refreshError: unknown) => {
          session.forceLogout();
          return throwError(() => refreshError);
        }),
      );
    }),
  );
};
