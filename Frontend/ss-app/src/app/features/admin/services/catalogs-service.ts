import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CatalogsService {
  readonly apiUrl = environment.apiUrl + 'catalogs';

  constructor(private http: HttpClient, private router: Router,) { }

  createElement(payload: { catalogType: string, name: string }): Observable<unknown> {
    return this.http.post(this.apiUrl + '/create', payload);
  }

}
