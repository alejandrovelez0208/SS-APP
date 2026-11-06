import { Injectable } from '@angular/core';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { BehaviorSubject, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../../../environments/environment';

export const AUTH_TOKEN_KEY = 'authToken';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly apiUrl = environment.apiUrl + 'auth';

  private currentUserSubject = new BehaviorSubject<any>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router,
  ) {}

  private fetchCurrentUser() {
    return this.http.get(this.apiUrl + '/current-user');
  }

  passwordMatchValidator(passwordMatchValidator: string): ValidatorFn {
    return (confirmControl: AbstractControl): ValidationErrors | null => {
      if (!confirmControl.parent) return null;
      const password = confirmControl.parent.get(passwordMatchValidator)?.value;
      const confirmPassword = confirmControl.value;
      return password === confirmPassword ? null : { passwordMismatch: true };
    };
  }

  initializeAuth(): Promise<void> {
    return new Promise((resolve) => {
      if (!this.isLoggedIn()) {
        this.handleAuthSuccess(null);
        resolve();
        return;
      }

      this.fetchCurrentUser().subscribe({
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

  setCurrentUser(user: any | null) {
    this.currentUserSubject.next(user);
  }

  handleAuthSuccess(authData: any) {
    if (authData?.token) {
      localStorage.setItem(AUTH_TOKEN_KEY, authData.token);
    }
    this.setCurrentUser(authData);
  }

  private clearSession() {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    this.currentUserSubject.next(null);
  }
  getCurrentUser() {
    return this.currentUserSubject.value;
  }

  isAdmin(): boolean {
    const user = this.getCurrentUser();
    return user?.role === 'ADMIN';
  }

  redirectBasedOnRole() {
    this.router.navigate(['/agency']);
  }

  signup(signupData: any) {
    return this.http.post(`${this.apiUrl}/signup`, signupData);
  }

  login(loginData: any) {
    return this.http
      .post(`${this.apiUrl}/login`, loginData)
      .pipe(tap((response) => this.handleAuthSuccess(response)));
  }

  verifyEmail(token: string) {
    return this.http.get(`${this.apiUrl}/verify-email/${token}`);
  }

  resendVerificationEmail(email: string) {
    return this.http.post(`${this.apiUrl}/resend-verification`, { email });
  }

  forgotPassword(email: string) {
    return this.http.post(`${this.apiUrl}/forgot-password`, { email });
  }

  resetPassword(token: string, newPassword: string) {
    return this.http.post(`${this.apiUrl}/reset-password/${token}`, { newPassword });
  }

  logout() {
    this.clearSession();
    this.router.navigate(['/']);
  }
}
