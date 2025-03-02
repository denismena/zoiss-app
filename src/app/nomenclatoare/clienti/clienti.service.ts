import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { clientiDTO, clientiCreationDTO, clientiAdresaPutGetDTO} from './clienti-item/clienti.model'

@Injectable({
  providedIn: 'root'
})
export class ClientiService {

  constructor(private http: HttpClient) { }
  private apiUrl = environment.apiUrl + '/clienti';

  getAll(values: any): Observable<any>{
    const params = new HttpParams({fromObject: values});
    return this.http.get<clientiDTO[]>(this.apiUrl, {observe:'response', params});
  }
  search(nume: string): Observable<clientiDTO[]>{
    return this.http.get<clientiDTO[]>(`${this.apiUrl}/search/${nume}`);
  }

  create(client: clientiCreationDTO){
    return this.http.post(this.apiUrl, client);
  }

  getById(id: number): Observable<clientiDTO>{
    return this.http.get<clientiDTO>(`${this.apiUrl}/${id}`);
  } 

  public putGet(id: number): Observable<clientiAdresaPutGetDTO>{
    return this.http.get<clientiAdresaPutGetDTO>(`${this.apiUrl}/putget/${id}`);
  }

  edit(id: number, client: clientiCreationDTO){
    console.log('edit to service:', client);
    return this.http.put(`${this.apiUrl}/${id}`, client);
  }

  delete(id: number) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}