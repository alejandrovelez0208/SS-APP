import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { City, InternationalCodePhone } from '../../shared/models/escort.model';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private http = inject(HttpClient);

  getNationalities(): Observable<any[]> {
    return this.http.get<any>('/data/nationalities.json').pipe(
      map(data => data?.data?.objects ?? [])
    );
  }

  getInternationalCodes(): Observable<InternationalCodePhone[]> {
    return this.http.get<any>('/data/internationalCodePhone.json').pipe(
      map(data => (Array.isArray(data) ? data : [data]))
    );
  }

  getCitiesColombia(): Observable<City[]> {
    return this.http.get<any>('/data/citiesColombia.json').pipe(
      map(data => (Array.isArray(data) ? data : [data]))
    );
  }
}
