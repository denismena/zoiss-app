import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
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

  searchByName(name: string): Observable<produseOfertaDTO[]>{
    const headers = new HttpHeaders('Content-Type: application/json');
    return this.http.post<produseOfertaDTO[]>(this.apiUrl+'/searchByName', 
    JSON.stringify(name), {headers});
  }

  create(produse: produseCreationDTO){
    return this.http.post(this.apiUrl, produse);
  }

  getById(id: number): Observable<produseDTO>{
    return this.http.get<produseDTO>(`${this.apiUrl}/${id}`);
  } 

  edit(id: number, genre: produseCreationDTO){
    return this.http.put(`${this.apiUrl}/${id}`, genre);
  }

  delete(id: number) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  private buildFormData(produs: produseCreationDTO): FormData {
    const formData = new FormData();

    formData.append('nume', produs.nume);
    formData.append('cod', produs.cod);

    if (produs.um){
      formData.append('um', produs.um);
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
