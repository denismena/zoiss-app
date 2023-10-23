import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
  })

export class ExportService{
    constructor(private http: HttpClient) { }
  private apiUrl = environment.apiUrl + '/export';
  
  firstReport(): Observable<Blob>{
    return this.http.get<Blob>(`${this.apiUrl}/firstReport`, { responseType: 'blob' as 'json' });
  }
  ofertaReport(id:number, values:number[], doarNecomandate:string): Observable<Blob>{
    const params = new HttpParams()
    .set('id', id)
    .set('selectedId', values.join(','))
    .set('doarNecomandate', doarNecomandate);
    return this.http.get<Blob>(`${this.apiUrl}/oferta`, { responseType: 'blob' as 'json', params });
  }
  ofertaReportPDF(id:number, values:number[], doarNecomandate:string): Observable<Blob>{
    const params = new HttpParams()
    .set('id', id)
    .set('selectedId', values.join(','))
    .set('doarNecomandate', doarNecomandate);
    return this.http.get<Blob>(`${this.apiUrl}/ofertaPDF`, { responseType: 'blob' as 'json', params });
  }
  ofertaReportPDFcuPoza(id:number, values:number[], doarNecomandate:string): Observable<Blob>{
    const params = new HttpParams()
    .set('id', id)
    .set('selectedId', values.join(','))
    .set('doarNecomandate', doarNecomandate);
    return this.http.get<Blob>(`${this.apiUrl}/ofertaPDFcuPoza`, { responseType: 'blob' as 'json', params });
  }
  comandaReport(id:number): Observable<Blob>{
    return this.http.get<Blob>(`${this.apiUrl}/comanda/${id}`, { responseType: 'blob' as 'json' });
  }
  comandaReportPDF(id:number): Observable<Blob>{
    return this.http.get<Blob>(`${this.apiUrl}/comandaPDF/${id}`, { responseType: 'blob' as 'json' });
  }
  comandaFurnizorReport(id:number): Observable<Blob>{
    return this.http.get<Blob>(`${this.apiUrl}/comandaFurnizor/${id}`, { responseType: 'blob' as 'json' });
  }
  comisionArhitectPDF(values:number[], fromDate: Date, toDate: Date): Observable<Blob>{
    const params = new HttpParams()
    .set('selectedComenziId', values.join(','))
    .set('fromDate', fromDate.toISOString())
    .set('toDate', toDate.toISOString());
    return this.http.get<Blob>(`${this.apiUrl}/comisionArhitectPDF`, {responseType: 'blob' as 'json', params});
    //return this.http.get<Blob>(`${this.apiUrl}/comandaFurnizor/${id}`, { responseType: 'blob' as 'json' });
  }
  aimPDF(id:number): Observable<Blob>{
    return this.http.get<Blob>(`${this.apiUrl}/aimPDF/${id}`, { responseType: 'blob' as 'json' });
  }

}