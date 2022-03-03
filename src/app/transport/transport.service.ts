import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { produseComandaFurnizorDTO } from '../comenzi-furn/comenzi-furn-item/comenzi-furn.model';
import { formatDateFormData } from '../utilities/utils';
import { transportCreationDTO, transportDTO, transportEditDTO, transportProduseDepozitAllDTO, transportProduseDepozitDTO, transportPutGetDTO } from './transport-item/transport.model';

@Injectable({
    providedIn: 'root'
  })

export class TransportService{
    constructor(private http: HttpClient) { }
  private apiUrl = environment.apiUrl + '/transport';
  
  getAll(values: any): Observable<any>{
    const params = new HttpParams({fromObject: values});
    return this.http.get<transportDTO[]>(this.apiUrl, {observe:'response', params});
  }
  create(transport: transportCreationDTO){
    return this.http.post<number>(this.apiUrl, transport);
  }

  getById(id: number): Observable<transportDTO>{
    return this.http.get<transportDTO>(`${this.apiUrl}/${id}`);
  }

  getNextNumber(): Observable<number>{
    return this.http.get<number>(`${this.apiUrl}/getNextNumber`);
  }
  
  fromComandaFurnizor(produse: produseComandaFurnizorDTO[]){
    return this.http.post(`${this.apiUrl}/fromComandaFurnizor`, produse);
  }

  public putGet(id: number): Observable<transportPutGetDTO>{    
    return this.http.get<transportPutGetDTO>(`${this.apiUrl}/putget/${id}`);
  }

  edit(id: number, transport: transportEditDTO){
    console.log('oferte service:', transport);
    return this.http.put(`${this.apiUrl}/${id}`, transport);
  }

  delete(id: number) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  saveDepozitArrival(produsInDepozit: transportProduseDepozitDTO){
    console.log('produsInDepozit:', produsInDepozit);
    const formData = this.buildFormData(produsInDepozit);
    return this.http.post(`${this.apiUrl}/produsInDepozit`, formData);
    //console.log('produsInDepozit:', produsInDepozit);
    //return this.http.post(`${this.apiUrl}/produsInDepozit`, produsInDepozit);
  }

  saveDepozitArrivalAll(produsInDepozit: transportProduseDepozitAllDTO){
    console.log('produsInDepozitAll:', produsInDepozit);
    return this.http.post(`${this.apiUrl}/produsInDepozitAll`, produsInDepozit);
  }

  private buildFormData(produs: transportProduseDepozitDTO): FormData {
    const formData = new FormData();

    formData.append('detalii', produs.detalii);
    formData.append('depozit', produs.depozit);
    formData.append('data', formatDateFormData(produs.data));
    formData.append('id', produs.id.toString());

    if (produs.transportProdusId){
      formData.append('transportProdusId', produs.transportProdusId.toString());
    }
    if (produs.depozitId){
      formData.append('depozitId', produs.depozitId.toString());
    }   

    if (produs.poza){
      formData.append('poza', produs.poza);
    }

    return formData;
  }
}