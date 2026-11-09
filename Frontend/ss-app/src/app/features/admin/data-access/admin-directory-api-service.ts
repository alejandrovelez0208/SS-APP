import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';
import { DirectoryUserDto, UserDetailDto } from '../models/admin-account.model';

/**
 * Lectura/escritura del directorio de usuarios del panel admin.
 * Compartido por Accounts y User Control.
 */
@Injectable({
  providedIn: 'root',
})
export class AdminDirectoryApiService {
  private readonly http = inject(HttpClient);

  private readonly apiUrl = `${environment.apiUrl}users`;

  getAllUsers(): Observable<DirectoryUserDto[]> {
    return this.http.get<DirectoryUserDto[]>(`${this.apiUrl}/get-all`);
  }

  getUserById(id: string): Observable<UserDetailDto> {
    return this.http.get<UserDetailDto>(`${this.apiUrl}/${id}`);
  }

  updateStatus(id: string, enabled: boolean): Observable<DirectoryUserDto> {
    return this.http.patch<DirectoryUserDto>(`${this.apiUrl}/${id}/status`, { enabled });
  }
}
