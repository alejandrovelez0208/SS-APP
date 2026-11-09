import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { AuthApiService } from './auth-api.service';
import { AuthTokenStore } from './auth-token.store';
import { AuthUser } from './auth.models';

@Injectable({
  providedIn: 'root',
})
export class AuthSessionService {
  private readonly authApi = inject(AuthApiService);
  private readonly router = inject(Router);
  private readonly tokenStore = inject(AuthTokenStore);

  private readonly currentUserSubject = new BehaviorSubject<AuthUser | null>(null);
  readonly currentUser$ = this.currentUserSubject.asObservable();

  initializeAuth(): Promise<void> {
    return new Promise((resolve) => {
      if (!this.isLoggedIn()) {
        this.handleAuthSuccess(null);
        resolve();
        return;
      }

      this.authApi.getCurrentUser<AuthUser>().subscribe({
        next: (user) => {
          this.handleAuthSuccess(user);
          resolve();
        },
        error: () => {
          this.clearSession();
          resolve();
        },
      });
    });
  }

  getToken(): string | null {
    return this.tokenStore.getAccess();
  }

  getRefreshToken(): string | null {
    return this.tokenStore.getRefresh();
  }

  isLoggedIn(): boolean {
    return !!(this.getToken() || this.getRefreshToken());
  }

  setCurrentUser(user: AuthUser | null): void {
    this.currentUserSubject.next(user);
  }

  handleAuthSuccess(authData: AuthUser | null): void {
    if (authData?.token || authData?.refreshToken) {
      this.tokenStore.setTokens(authData.token ?? null, authData.refreshToken ?? null);
    }
    this.setCurrentUser(authData);
  }

  getCurrentUser(): AuthUser | null {
    return this.currentUserSubject.value;
  }

  getProfileId(): number | null {
    return this.getCurrentUser()?.profileId ?? null;
  }

  isProfileComplete(): boolean {
    return this.getCurrentUser()?.profileComplete === true;
  }

  isEmailVerified(): boolean {
    return this.getCurrentUser()?.emailVerified === true;
  }

  isAdmin(): boolean {
    return this.getCurrentUser()?.role === 'ADMIN';
  }

  redirectBasedOnRole(): void {
    if (this.isAdmin()) {
      this.router.navigate(['/admin']);
    } else {
      this.router.navigate(['/panel/overview']);
    }
  }

  login(loginData: unknown): Observable<AuthUser> {
    return this.authApi
      .login(loginData)
      .pipe(tap((response) => this.handleAuthSuccess(response)));
  }

  logout(): void {
    const refreshToken = this.getRefreshToken();

    if (refreshToken) {
      this.authApi.logout(refreshToken).subscribe({ error: () => undefined });
    }

    this.clearSession();
    this.router.navigate(['/login']);
  }

  /** Logout local forzado (inactividad, refresh inválido). */
  forceLogout(): void {
    this.logout();
  }

  private clearSession(): void {
    this.tokenStore.clear();
    this.currentUserSubject.next(null);
  }
}
