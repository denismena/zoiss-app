import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { sucursalaCreationDTO, sucursalaDTO } from './sucursale-item/sucursala.model';

@Injectable({
  providedIn: 'root'
})
export class SucursaleService {

  constructor(private http: HttpClient) { }
  private apiUrl = environment.apiUrl + '/sucursale';

  getAll(): Observable<sucursalaDTO[]>{
    return this.http.get<sucursalaDTO[]>(this.apiUrl);
  }

  create(produse: sucursalaCreationDTO){
    return this.http.post(this.apiUrl, produse);
  }

  getById(id: number): Observable<sucursalaDTO>{
    return this.http.get<sucursalaDTO>(`${this.apiUrl}/${id}`);
  } 

  edit(id: number, genre: sucursalaCreationDTO){
    return this.http.put(`${this.apiUrl}/${id}`, genre);
  }

  delete(id: number) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }  
}
