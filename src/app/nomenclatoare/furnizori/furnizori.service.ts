import { HttpClient, HttpParams } from '@angular/common/http';
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

  getAll(values: any): Observable<any>{
    const params = new HttpParams({fromObject: values});
    return this.http.get<furnizoriDTO[]>(this.apiUrl, {observe:'response', params});
  }
  search(nume: string): Observable<furnizoriDTO[]>{
    return this.http.get<furnizoriDTO[]>(`${this.apiUrl}/search/${nume}`);
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
