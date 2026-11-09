import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthUser } from './auth.models';

@Injectable({
  providedIn: 'root',
})
export class AuthApiService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}auth`;

  getCurrentUser<T = AuthUser>(): Observable<T> {
    return this.http.get<T>(`${this.apiUrl}/current-user`);
  }

  signup(signupData: unknown): Observable<AuthUser> {
    return this.http.post<AuthUser>(`${this.apiUrl}/signup`, signupData);
  }

  login(loginData: unknown): Observable<AuthUser> {
    return this.http.post<AuthUser>(`${this.apiUrl}/login`, loginData);
  }

  refresh(refreshToken: string): Observable<AuthUser> {
    return this.http.post<AuthUser>(`${this.apiUrl}/refresh`, { refreshToken });
  }

  logout(refreshToken: string): Observable<unknown> {
    return this.http.post(`${this.apiUrl}/logout`, { refreshToken });
  }

  verifyEmail(token: string): Observable<unknown> {
    return this.http.get(`${this.apiUrl}/verify-email/${token}`);
  }

  resendVerificationEmail(email: string): Observable<unknown> {
    return this.http.post(`${this.apiUrl}/resend-verification`, { email });
  }

  forgotPassword(email: string): Observable<unknown> {
    return this.http.post(`${this.apiUrl}/forgot-password`, { email });
  }

  resetPassword(token: string, newPassword: string): Observable<unknown> {
    return this.http.post(`${this.apiUrl}/reset-password/${token}`, { newPassword });
  }
}
