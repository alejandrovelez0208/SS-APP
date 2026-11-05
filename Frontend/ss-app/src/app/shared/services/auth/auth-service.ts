import { Injectable } from '@angular/core';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { BehaviorSubject, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly apiUrl = environment.apiUrl + 'auth';

  private currentUserSubject = new BehaviorSubject<any>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) { }

  private fetchCurrentUser() {
    return this.http.get(this.apiUrl + '/current-user');
  }

  passwordMatchValidator(passwordMatchValidator: string): ValidatorFn {
    return (confirmControl: AbstractControl): ValidationErrors | null => {
      if (!confirmControl.parent) return null;
      const password = confirmControl.parent.get(passwordMatchValidator)?.value;
      const confirmPassword = confirmControl.value;
      return password === confirmPassword ? null : { passwordMismatch: true };
    }
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
          this.handleAuthSuccess(null);
          resolve();
        }
      });
    })
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  setCurrentUser(user: any | null) {
    this.currentUserSubject.next(user);
  }

  handleAuthSuccess(authData: any) {
    if (authData?.token) {
      localStorage.setItem('authToken', authData.token);
    }
    this.setCurrentUser(authData);
  }
  getCurrentUser() {
    return this.currentUserSubject.value;
  }

  isAdmin(): boolean {
    const user = this.getCurrentUser();
    return user?.role === 'ADMIN';
  }

  redirectBasedOnRole() {
    const targetUrl = this.isAdmin() ? '/admin' : '/home';
    this.router.navigate([targetUrl]);
  }

  signup(signupData: any) {
    return this.http.post(`${this.apiUrl}/signup`, signupData);
  }

  login(loginData: any) {
    return this.http.post(`${this.apiUrl}/login`, loginData).pipe(tap(response => this.handleAuthSuccess(response)));
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

  changePassword(changePasswordData: any) {
    return this.http.post(`${this.apiUrl}/change-password`, { changePasswordData });
  }

  logout() {
    localStorage.removeItem('token');
    this.currentUserSubject.next(null);
    this.router.navigate(['/']);
  }

}
