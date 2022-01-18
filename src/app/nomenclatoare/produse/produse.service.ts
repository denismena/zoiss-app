import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { produseComandaFurnizorDTO } from 'src/app/comenzi-furn/comenzi-furn-item/comenzi-furn.model';
import { produseComandaDTO } from 'src/app/comenzi/comenzi-item/comenzi.model';
import { environment } from 'src/environments/environment';
import { produseCreationDTO, produseDTO, produseOfertaDTO } from './produse-item/produse.model';

@Injectable({
  providedIn: 'root'
})
export class ProduseService {

  constructor(private http: HttpClient) { }
  private apiUrl = environment.apiUrl + '/produse';

  getAll(): Observable<produseDTO[]>{
    return this.http.get<produseDTO[]>(this.apiUrl);
  }

  getProduseAutocomplete(): Observable<produseOfertaDTO[]>{
    return this.http.get<produseOfertaDTO[]>(this.apiUrl);
  }

  getProduseAutocompleteComanda(): Observable<produseComandaDTO[]>{
    return this.http.get<produseComandaDTO[]>(this.apiUrl);
  }

  getProduseAutocompleteComandaFurnizor(): Observable<produseComandaFurnizorDTO[]>{
    return this.http.get<produseComandaFurnizorDTO[]>(this.apiUrl);
  }
  search(nume: string): Observable<produseDTO[]>{
    return this.http.get<produseDTO[]>(`${this.apiUrl}/${nume}`);
  }
  searchByName(name: string): Observable<produseOfertaDTO[]>{
    const headers = new HttpHeaders('Content-Type: application/json');
    return this.http.post<produseOfertaDTO[]>(this.apiUrl+'/searchByName', 
    JSON.stringify(name), {headers});
  }

  searchByNameComanda(name: string): Observable<produseComandaDTO[]>{
    const headers = new HttpHeaders('Content-Type: application/json');
    return this.http.post<produseComandaDTO[]>(this.apiUrl+'/searchByNameComanda', 
    JSON.stringify(name), {headers});
  }

  searchByNameComandaFurnizor(name: string): Observable<produseComandaFurnizorDTO[]>{
    const headers = new HttpHeaders('Content-Type: application/json');
    return this.http.post<produseComandaFurnizorDTO[]>(this.apiUrl+'/searchByNameComandaFurnizor', 
    JSON.stringify(name), {headers});
  }

  create(produse: produseCreationDTO){
    const formData = this.buildFormData(produse);
    return this.http.post(this.apiUrl, formData);
  }

  getById(id: number): Observable<produseDTO>{
    return this.http.get<produseDTO>(`${this.apiUrl}/${id}`);
  } 

  edit(id: number, produs: produseCreationDTO){
    const formData = this.buildFormData(produs);
    return this.http.put(`${this.apiUrl}/${id}`, formData);
    //return this.http.put(`${this.apiUrl}/${id}`, genre);
  }

  delete(id: number) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  private buildFormData(produs: produseCreationDTO): FormData {
    const formData = new FormData();

    formData.append('nume', produs.nume);
    formData.append('cod', produs.cod);

    if (produs.umId){
      formData.append('umId', produs.umId.toString());
    }
    if (produs.perCutie){
      formData.append('perCutie', produs.perCutie.toString());
    }
    if (produs.pret){
      formData.append('pret', produs.pret.toString());
    }
    if (produs.greutatePerUm){
      formData.append('greutatePerUm', produs.greutatePerUm.toString());
    }
    if (produs.codVamal){
      formData.append('codVamal', produs.codVamal);
    }
    
    if (produs.active){
      formData.append('active', produs.active.toString());
    }

    if (produs.poza){
      formData.append('poza', produs.poza);
    }

    return formData;
  }
}
