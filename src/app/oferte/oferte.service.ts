import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { formatDateFormData } from '../utilities/utils';
import { ofertaPutGetDTO, oferteCreationDTO, oferteDTO } from './oferte-item/oferte.model';

@Injectable({
  providedIn: 'root'
})
export class OferteService {

  constructor(private http: HttpClient) { }
  private apiUrl = environment.apiUrl + '/oferte';

  getAll(values: any): Observable<any>{
    const params = new HttpParams({fromObject: values});
    return this.http.get<oferteDTO[]>(this.apiUrl, {observe:'response', params});
  }

  create(oferte: oferteCreationDTO){
    return this.http.post(this.apiUrl, oferte);
  }

  getById(id: number): Observable<oferteDTO>{
    return this.http.get<oferteDTO>(`${this.apiUrl}/${id}`);
  }
  
  getNextNumber(): Observable<number>{
    return this.http.get<number>(`${this.apiUrl}/getNextNumber`);
  }

  public putGet(id: number): Observable<ofertaPutGetDTO>{
    return this.http.get<ofertaPutGetDTO>(`${this.apiUrl}/putget/${id}`);
  }

  edit(id: number, oferte: oferteCreationDTO){
    return this.http.put(`${this.apiUrl}/${id}`, oferte);
  }

  delete(id: number) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  private BuildFormData(oferta: oferteCreationDTO): FormData {
    const formData = new FormData();

    formData.append('numar', oferta.numar.toString());
    formData.append('data', formatDateFormData(oferta.data));
    formData.append('clientId', oferta.clientId.toString());
    formData.append('utilizatorId', oferta.utilizatorId.toString());
    
    if (oferta.arhitectId){
      formData.append('arhitectId', oferta.arhitectId.toString());
    }
    if (oferta.avans){
      formData.append('avans', oferta.avans.toString());
    }
    if (oferta.conditiiPlata){
      formData.append('conditiiPlata', oferta.conditiiPlata);
    }
    if (oferta.termenLivrare){
      formData.append('termenLivrare', formatDateFormData(oferta.termenLivrare));
    }
    console.log('formData produse:', oferta.produse);
    formData.append('produse', JSON.stringify(oferta.produse));

    return formData;
  }
}
