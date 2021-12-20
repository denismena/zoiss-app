import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { depoziteCreationDTO, depoziteDTO } from './depozite-item/depozite.model';

@Injectable({
  providedIn: 'root'
})
export class DepoziteService {

  constructor(private http: HttpClient) { }
  private apiUrl = environment.apiUrl + '/depozite';

  getAll(): Observable<depoziteDTO[]>{
    return this.http.get<depoziteDTO[]>(this.apiUrl);
  }

  create(depozit: depoziteCreationDTO){
    console.log('depoziteCreationDTO', depozit);
    return this.http.post(this.apiUrl, depozit);
  }

  getById(id: number): Observable<depoziteDTO>{
    return this.http.get<depoziteDTO>(`${this.apiUrl}/${id}`);
  }

  getByClient(clientId: number): Observable<depoziteDTO[]>{
    return this.http.get<depoziteDTO[]>(`${this.apiUrl}/getByClient/${clientId}`);
  } 

  edit(id: number, depozit: depoziteCreationDTO){
    return this.http.put(`${this.apiUrl}/${id}`, depozit);
  }

  delete(id: number) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
