import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { furnizoriDTO, furnizoriCreationDTO} from './furnizori-item/furnizori.model'

@Injectable({
  providedIn: 'root'
})
export class FurnizoriService {

  constructor(private http: HttpClient) { }
  private apiUrl = environment.apiUrl + '/furnizori';

  getAll(): Observable<furnizoriDTO[]>{
    return this.http.get<furnizoriDTO[]>(this.apiUrl);
  }

  create(produse: furnizoriCreationDTO){
    return this.http.post(this.apiUrl, produse);
  }

  getById(id: number): Observable<furnizoriDTO>{
    return this.http.get<furnizoriDTO>(`${this.apiUrl}/${id}`);
  } 

  edit(id: number, genre: furnizoriCreationDTO){
    return this.http.put(`${this.apiUrl}/${id}`, genre);
  }

  delete(id: number) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
