import { Injectable } from '@angular/core';

const ACCESS_TOKEN_KEY = 'ss.accessToken';
const REFRESH_TOKEN_KEY = 'ss.refreshToken';

@Injectable({ providedIn: 'root' })
export class AuthTokenStore {
  private accessToken: string | null = localStorage.getItem(ACCESS_TOKEN_KEY);
  private refreshTokenValue: string | null = localStorage.getItem(REFRESH_TOKEN_KEY);

  constructor() {
    localStorage.removeItem('authToken');
  }

  getAccess(): string | null {
    return this.accessToken;
  }

  getRefresh(): string | null {
    return this.refreshTokenValue;
  }

  setTokens(accessToken: string | null, refreshToken: string | null): void {
    this.accessToken = accessToken;
    this.refreshTokenValue = refreshToken;

    this.persist(ACCESS_TOKEN_KEY, accessToken);
    this.persist(REFRESH_TOKEN_KEY, refreshToken);
  }

  clear(): void {
    this.accessToken = null;
    this.refreshTokenValue = null;
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  }

  private persist(key: string, value: string | null): void {
    if (value) {
      localStorage.setItem(key, value);
    } else {
      localStorage.removeItem(key);
    }
  }
}
