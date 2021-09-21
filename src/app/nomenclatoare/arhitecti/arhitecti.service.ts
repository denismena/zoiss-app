import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { arhitectiCreationDTO, arhitectiDTO } from './arhitecti-item/arhitecti.model';

@Injectable({
  providedIn: 'root'
})
export class ArhitectiService {

  constructor(private http: HttpClient) { }
  private apiUrl = environment.apiUrl + '/arhitecti';

  getAll(): Observable<arhitectiDTO[]>{
    return this.http.get<arhitectiDTO[]>(this.apiUrl);
  }

  create(produse: arhitectiCreationDTO){
    return this.http.post(this.apiUrl, produse);
  }

  getById(id: number): Observable<arhitectiDTO>{
    return this.http.get<arhitectiDTO>(`${this.apiUrl}/${id}`);
  } 

  edit(id: number, genre: arhitectiCreationDTO){
    return this.http.put(`${this.apiUrl}/${id}`, genre);
  }

  delete(id: number) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
