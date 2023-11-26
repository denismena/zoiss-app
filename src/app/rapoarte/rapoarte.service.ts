import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { comenziDTO } from '../comenzi/comenzi-item/comenzi.model';
import { comandaArhitectiDTO } from './comisionArhitecti/comision-arhitecti.model';
import { comenziPerLuna } from './comenzi-depozite/comenzi-depozite.model';

@Injectable({
    providedIn: 'root'
  })
export class RapoarteService{
    constructor(private http: HttpClient) { }
    private apiUrl = environment.apiUrl + '/reports';

    comisionArhitecti(values: any): Observable<any>{
      const params = new HttpParams({fromObject: values});
      return this.http.get<comenziDTO[]>(`${this.apiUrl}/comisionArhitect`, {observe:'response', params});
    }

    plateste(comenzi: comandaArhitectiDTO[]){
      return this.http.post(`${this.apiUrl}/plateste`, comenzi);
    }

    comenziUtilizatori(values: any): Observable<any>{
      const params = new HttpParams({fromObject: values});
      return this.http.get<comenziDTO[]>(`${this.apiUrl}/comenziUtilizatori`, {observe:'response', params});
    }
    
    comenziDepozite(values: any): Observable<any>{
      const params = new HttpParams({fromObject: values});
      return this.http.get<comenziDTO[]>(`${this.apiUrl}/comenziDepozite`, {observe:'response', params});
    }

    trendComenziPerUtilizator(values: any): Observable<any>{
      const params = new HttpParams({fromObject: values});      
      return this.http.get<comenziPerLuna[]>(`${this.apiUrl}/trendComenziPerUtilizator`, {observe:'response', params});
    }

    trendComenzi(values: any): Observable<any>{
      const params = new HttpParams({fromObject: values});      
      return this.http.get<comenziPerLuna[]>(`${this.apiUrl}/trendComenzi`, {observe:'response', params});
    }

    trendComenziClientNou(values: any): Observable<any>{
      const params = new HttpParams({fromObject: values});      
      return this.http.get<comenziPerLuna[]>(`${this.apiUrl}/trendComenziClientNou`, {observe:'response', params});
    }
}