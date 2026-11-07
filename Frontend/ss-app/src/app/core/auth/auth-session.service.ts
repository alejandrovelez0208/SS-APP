import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { AuthApiService } from './auth-api.service';
import { AUTH_TOKEN_KEY } from './auth.constants';

@Injectable({
  providedIn: 'root',
})
export class AuthSessionService {
  private readonly authApi = inject(AuthApiService);
  private readonly router = inject(Router);

  private readonly currentUserSubject = new BehaviorSubject<any>(null);
  readonly currentUser$ = this.currentUserSubject.asObservable();

  initializeAuth(): Promise<void> {
    return new Promise((resolve) => {
      if (!this.isLoggedIn()) {
        this.handleAuthSuccess(null);
        resolve();
        return;
      }

      this.authApi.getCurrentUser<any>().subscribe({
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
    return localStorage.getItem(AUTH_TOKEN_KEY);
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  setCurrentUser(user: any | null): void {
    this.currentUserSubject.next(user);
  }

  handleAuthSuccess(authData: any): void {
    if (authData?.token) {
      localStorage.setItem(AUTH_TOKEN_KEY, authData.token);
    }
    this.setCurrentUser(authData);
  }

  getCurrentUser(): any {
    return this.currentUserSubject.value;
  }

  isAdmin(): boolean {
    return this.getCurrentUser()?.role === 'ADMIN';
  }

  redirectBasedOnRole(): void {
    if (this.isAdmin()) {
      this.router.navigate(['/admin']);
    } else {
      this.router.navigate(['/agency']);
    }
  }

  login(loginData: unknown): Observable<any> {
    return this.authApi
      .login(loginData)
      .pipe(tap((response) => this.handleAuthSuccess(response)));
  }

  logout(): void {
    this.clearSession();
    this.router.navigate(['/']);
  }

  private clearSession(): void {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    this.currentUserSubject.next(null);
  }
}
