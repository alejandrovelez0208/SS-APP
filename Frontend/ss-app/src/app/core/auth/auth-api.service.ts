import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthApiService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}auth`;

  getCurrentUser<T = unknown>(): Observable<T> {
    return this.http.get<T>(`${this.apiUrl}/current-user`);
  }

  signup(signupData: unknown): Observable<unknown> {
    return this.http.post(`${this.apiUrl}/signup`, signupData);
  }

  login(loginData: unknown): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, loginData);
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
