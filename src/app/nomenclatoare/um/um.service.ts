import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { umCreationDTO, umDTO } from './um-item/um.model';

@Injectable({
  providedIn: 'root'
})
export class UMService {

  constructor(private http: HttpClient) { }
  private apiUrl = environment.apiUrl + '/um';

  getAll(): Observable<umDTO[]>{
    return this.http.get<umDTO[]>(this.apiUrl);
  }

  create(produse: umCreationDTO){
    return this.http.post(this.apiUrl, produse);
  }

  getById(id: number): Observable<umDTO>{
    return this.http.get<umDTO>(`${this.apiUrl}/${id}`);
  } 

  edit(id: number, genre: umCreationDTO){
    return this.http.put(`${this.apiUrl}/${id}`, genre);
  }

  delete(id: number) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }  
}
