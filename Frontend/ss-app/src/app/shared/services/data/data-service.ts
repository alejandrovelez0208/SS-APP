import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { City, InternationalCodePhone, Nationality } from '../../models/escort.model';

interface NationalitiesResponse {
  data?: {
    objects?: Nationality[];
  };
}

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private http = inject(HttpClient);

  getNationalities(): Observable<Nationality[]> {
    return this.http.get<NationalitiesResponse>('/data/nationalities.json').pipe(
      map(data => data?.data?.objects ?? [])
    );
  }

  getInternationalCodes(): Observable<InternationalCodePhone[]> {
    return this.http
      .get<InternationalCodePhone | InternationalCodePhone[]>('/data/internationalCodePhone.json')
      .pipe(map(data => (Array.isArray(data) ? data : [data])));
  }

  getCitiesColombia(): Observable<City[]> {
    return this.http
      .get<City | City[]>('/data/citiesColombia.json')
      .pipe(map(data => (Array.isArray(data) ? data : [data])));
  }
}
