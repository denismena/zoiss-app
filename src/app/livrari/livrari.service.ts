import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { transportProduseDTO } from '../transport/transport-item/transport.model';
import { livrariCreationDTO, LivrariDTO, livrariProduseDTO, livrariPutGetDTO } from './livrari-item/livrari.model';
@Injectable({
    providedIn: 'root'
  })

export class LivrariService{
    constructor(private http: HttpClient) { }
  private apiUrl = environment.apiUrl + '/livrari';

  getAll(values: any): Observable<any>{
    const params = new HttpParams({fromObject: values});
    return this.http.get<LivrariDTO[]>(this.apiUrl, {observe:'response', params});
  }

  create(livrare: livrariCreationDTO){
    return this.http.post<number>(this.apiUrl, livrare);
  }

  getById(id: number): Observable<LivrariDTO>{
    return this.http.get<LivrariDTO>(`${this.apiUrl}/${id}`);
  }

  getNextNumber(): Observable<number>{
    return this.http.get<number>(`${this.apiUrl}/getNextNumber`);
  }
  
  fromTransport(numar: string, produse: transportProduseDTO[]){
    return this.http.post(`${this.apiUrl}/fromTransport/${numar}`, produse);
  }

  public putGet(id: number): Observable<livrariPutGetDTO>{    
    return this.http.get<livrariPutGetDTO>(`${this.apiUrl}/putget/${id}`);
  }

  edit(id: number, oferte: LivrariDTO){    
    return this.http.put(`${this.apiUrl}/${id}`, oferte);
  }

  delete(id: number) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}