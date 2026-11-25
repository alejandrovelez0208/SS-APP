import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';
import {
  AdminProfileDetailDto,
  AdminProfileSummaryDto,
} from '../models/admin-profile.dto';
import {
  ProfileFilters,
  ProfileState,
} from '../models/admin-profile.model';

/**
 * Consume los endpoints admin de perfiles.
 * Devuelve DTOs; el mapeo a modelos de vista queda en el state service.
 */
@Injectable({
  providedIn: 'root',
})
export class AdminProfilesApiService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}admin/profiles`;

  getAll(filters: ProfileFilters): Observable<AdminProfileSummaryDto[]> {
    let params = new HttpParams();

    const search = filters.search.trim();
    if (search) {
      params = params.set('search', search);
    }
    if (filters.accountType !== 'ALL') {
      params = params.set('accountType', filters.accountType);
    }
    if (filters.status !== 'ALL') {
      params = params.set('status', filters.status);
    }
    if (filters.verificationStatus && filters.verificationStatus !== 'ALL') {
      params = params.set('verificationStatus', filters.verificationStatus);
    }

    return this.http.get<AdminProfileSummaryDto[]>(this.apiUrl, { params });
  }

  getById(id: string): Observable<AdminProfileDetailDto> {
    return this.http.get<AdminProfileDetailDto>(`${this.apiUrl}/${id}`);
  }

  updateStatus(id: string, status: ProfileState): Observable<AdminProfileSummaryDto> {
    return this.http.patch<AdminProfileSummaryDto>(`${this.apiUrl}/${id}/status`, { status });
  }
}
