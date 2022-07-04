import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
  })

export class RapoarteService{
    constructor(private http: HttpClient) { }
  private apiUrl = environment.apiUrl + '/reports';
  
  firstReport(): Observable<Blob>{
    return this.http.get<Blob>(`${this.apiUrl}/firstReport`, { responseType: 'blob' as 'json' });
  }
  ofertaReport(id:number): Observable<Blob>{
    return this.http.get<Blob>(`${this.apiUrl}/oferta/${id}`, { responseType: 'blob' as 'json' });
  }
  ofertaReportPDF(id:number): Observable<Blob>{
    return this.http.get<Blob>(`${this.apiUrl}/ofertaPDF/${id}`, { responseType: 'blob' as 'json' });
  }
  ofertaReportPDFcuPoza(id:number): Observable<Blob>{
    return this.http.get<Blob>(`${this.apiUrl}/ofertaPDFcuPoza/${id}`, { responseType: 'blob' as 'json' });
  }
  comandaReport(id:number): Observable<Blob>{
    return this.http.get<Blob>(`${this.apiUrl}/comanda/${id}`, { responseType: 'blob' as 'json' });
  }
  comandaReportPDF(id:number): Observable<Blob>{
    return this.http.get<Blob>(`${this.apiUrl}/comandaPDF/${id}`, { responseType: 'blob' as 'json' });
  }
}