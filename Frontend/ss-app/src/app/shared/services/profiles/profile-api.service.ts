import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'environments/environment';

export interface ProfileApiResponse {
  id: number;
  profileName: string;
  status: string;
  complete: boolean;
  completedAt: string | null;
  emailVerified?: boolean;
}

export interface ProfileUpdatePayload {
  profileName?: string;
  gender?: string;
  age?: number;
  hairColor?: string;
  heightCm?: number;
  weightKg?: number;
  orientation?: string;
  country?: string;
  city?: string;
  phoneCountryCode?: string;
  phoneNumber?: string;
  availableAllDay?: boolean;
  scheduleFrom?: string;
  scheduleTo?: string;
  website?: string;
  basicRate?: number;
  currency?: string;
  serviceIds?: number[];
  departureIds?: number[];
  channelIds?: number[];
  modalityIds?: number[];
}

/**
 * API del perfil del usuario autenticado.
 * Compartida por el registro (guardado progresivo) y el panel.
 */
@Injectable({ providedIn: 'root' })
export class ProfileApiService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}profiles`;

  getMe(): Observable<ProfileApiResponse> {
    return this.http.get<ProfileApiResponse>(`${this.apiUrl}/me`);
  }

  updateMe(payload: ProfileUpdatePayload): Observable<ProfileApiResponse> {
    return this.http.patch<ProfileApiResponse>(`${this.apiUrl}/me`, payload);
  }

  completeMe(): Observable<ProfileApiResponse> {
    return this.http.post<ProfileApiResponse>(`${this.apiUrl}/me/complete`, {});
  }
}
