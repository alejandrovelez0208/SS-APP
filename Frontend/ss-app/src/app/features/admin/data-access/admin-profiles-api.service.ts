import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';
import {
  AdminProfileDetailDto,
  AdminProfilePageDto,
  AdminProfileSummaryDto,
} from '../models/admin-profile.dto';
import {
  AdminProfileQuery,
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

  getPage(query: AdminProfileQuery): Observable<AdminProfilePageDto> {
    let params = new HttpParams()
      .set('page', query.page)
      .set('size', query.size);

    const search = query.search.trim();
    if (search) {
      params = params.set('search', search);
    }
    if (query.accountType !== 'ALL') {
      params = params.set('accountType', query.accountType);
    }
    if (query.status !== 'ALL') {
      params = params.set('status', query.status);
    }
    if (query.verificationStatus && query.verificationStatus !== 'ALL') {
      params = params.set('verificationStatus', query.verificationStatus);
    }

    return this.http.get<AdminProfilePageDto>(`${this.apiUrl}/page`, { params });
  }

  getById(id: string): Observable<AdminProfileDetailDto> {
    return this.http.get<AdminProfileDetailDto>(`${this.apiUrl}/${id}`);
  }

  updateStatus(id: string, status: ProfileState): Observable<AdminProfileSummaryDto> {
    return this.http.patch<AdminProfileSummaryDto>(`${this.apiUrl}/${id}/status`, { status });
  }
}
