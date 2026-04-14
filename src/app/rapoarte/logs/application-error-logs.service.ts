import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ApplicationErrorLog } from './application-error-log.model';

@Injectable({ providedIn: 'root' })
export class ApplicationErrorLogsService {
  private apiUrl = environment.apiUrl + '/application-error-logs';

  constructor(private http: HttpClient) {}

  getAll(values: any): Observable<any> {
    const params = new HttpParams({ fromObject: values });
    return this.http.get<ApplicationErrorLog[]>(this.apiUrl, { observe: 'response', params });
  }

  getById(id: number): Observable<any> {
    return this.http.get<ApplicationErrorLog>(`${this.apiUrl}/${id}`, { observe: 'response' });
  }
}
