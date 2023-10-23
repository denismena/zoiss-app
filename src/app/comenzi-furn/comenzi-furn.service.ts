import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { produseComandaDTO } from '../comenzi/comenzi-item/comenzi.model';
import { comenziFurnizorDTO, comenziFurnizorCreationDTO, comenziFurnizoriPutGetDTO, comenziFurnizorBasicDTO, toExistingComenziFurnizoriDTO } from './comenzi-furn-item/comenzi-furn.model';

@Injectable({
    providedIn: 'root'
  })

export class ComenziFurnizorService{
    constructor(private http: HttpClient) { }
  private apiUrl = environment.apiUrl + '/comenziFurnizor';

  getAll(values: any): Observable<any>{
    const params = new HttpParams({fromObject: values});
    return this.http.get<comenziFurnizorDTO[]>(this.apiUrl, {observe:'response', params});
  }

  getBasicList(furnizorId: number): Observable<comenziFurnizorBasicDTO[]>{
    return this.http.get<comenziFurnizorBasicDTO[]>(`${this.apiUrl}/getBasicList/${furnizorId}`);
  }
  create(oferte: comenziFurnizorCreationDTO){
    return this.http.post<number>(this.apiUrl, oferte);
  }

  getById(id: number): Observable<comenziFurnizorDTO>{
    return this.http.get<comenziFurnizorDTO>(`${this.apiUrl}/${id}`);
  }

  getNextNumber(): Observable<number>{
    return this.http.get<number>(`${this.apiUrl}/getNextNumber`);
  }
  
  fromComanda(produse: produseComandaDTO[]){
    return this.http.post(`${this.apiUrl}/fromComanda`, produse);
  }
  addToExisting(produse: toExistingComenziFurnizoriDTO){
    console.log('produse:', produse); 
    return this.http.post(`${this.apiUrl}/addProduse`, produse);
  }

  public putGet(id: number): Observable<comenziFurnizoriPutGetDTO>{    
    return this.http.get<comenziFurnizoriPutGetDTO>(`${this.apiUrl}/putget/${id}`);
  }

  edit(id: number, oferte: comenziFurnizorCreationDTO){
    console.log('oferte service:', oferte);
    return this.http.put(`${this.apiUrl}/${id}`, oferte);
  }

  delete(id: number) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  setPlatita(id: number, platita: boolean){
    return this.http.get(`${this.apiUrl}/setPlatita/${id}/${platita}`); 
  }
}