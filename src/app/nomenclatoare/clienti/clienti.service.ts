import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { clientiDTO, clientiListDTO, clientiCreationDTO} from './clienti-item/clienti.model'

@Injectable({
  providedIn: 'root'
})
export class ClientiService {

  constructor(private http: HttpClient) { }
  private apiUrl = environment.apiUrl + '/clienti';

  getAll(): Observable<clientiDTO[]>{
    return this.http.get<clientiDTO[]>(this.apiUrl);
  }

  create(client: clientiCreationDTO){
    return this.http.post(this.apiUrl, client);
  }

  getById(id: number): Observable<clientiDTO>{
    return this.http.get<clientiDTO>(`${this.apiUrl}/${id}`);
  } 

  edit(id: number, client: clientiCreationDTO){
    console.log('edit to service:', client);
    return this.http.put(`${this.apiUrl}/${id}`, client);
  }

  delete(id: number) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}