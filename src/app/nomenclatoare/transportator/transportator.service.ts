import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { transportatorCreationDTO, transportatorDTO } from './transportator-item/transportator.model';

@Injectable({
  providedIn: 'root'
})
export class TransporatorService {

  constructor(private http: HttpClient) { }
  private apiUrl = environment.apiUrl + '/transportator';

  getAll(): Observable<transportatorDTO[]>{
    return this.http.get<transportatorDTO[]>(this.apiUrl);
  }

  create(transportator: transportatorCreationDTO){
    return this.http.post(this.apiUrl, transportator);
  }

  getById(id: number): Observable<transportatorDTO>{
    return this.http.get<transportatorDTO>(`${this.apiUrl}/${id}`);
  } 

  edit(id: number, transportator: transportatorCreationDTO){
    return this.http.put(`${this.apiUrl}/${id}`, transportator);
  }

  delete(id: number) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
