import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { produseOfertaDTO } from '../nomenclatoare/produse/produse-item/produse.model';
import { formatDateFormData } from '../utilities/utils';
import { comenziCreationDTO, comenziDTO, comenziPutGetDTO } from './comenzi-item/comenzi.model';

@Injectable({
    providedIn: 'root'
  })

export class ComenziService{
    constructor(private http: HttpClient) { }
  private apiUrl = environment.apiUrl + '/comenzi';

  getAll(): Observable<comenziDTO[]>{
    return this.http.get<comenziDTO[]>(this.apiUrl);
  }

  create(oferte: comenziCreationDTO){
    return this.http.post<number>(this.apiUrl, oferte);
  }

  getById(id: number): Observable<comenziDTO>{
    return this.http.get<comenziDTO>(`${this.apiUrl}/${id}`);
  }

  getNextNumber(): Observable<number>{
    return this.http.get<number>(`${this.apiUrl}/getNextNumber`);
  }
  
  fromOferta(produse: produseOfertaDTO[]){
    return this.http.post(`${this.apiUrl}/fromOferta`, produse);
  }

  public putGet(id: number): Observable<comenziPutGetDTO>{
    return this.http.get<comenziPutGetDTO>(`${this.apiUrl}/putget/${id}`);
  }

  edit(id: number, oferte: comenziCreationDTO){
    return this.http.put(`${this.apiUrl}/${id}`, oferte);
  }

  delete(id: number) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}