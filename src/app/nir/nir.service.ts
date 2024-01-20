import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { nirCreationDTO, nirDTO, nirPutGetDTO } from "./nir-item/nir.model";

@Injectable({
    providedIn: 'root'
  })

  export class NIRService {
    constructor(private http: HttpClient) { }
    private apiUrl = environment.apiUrl + '/nir';

    getAll(values: any): Observable<any>{
        const params = new HttpParams({fromObject: values});
        return this.http.get<nirDTO[]>(this.apiUrl, {observe:'response', params});
    }

    create(nir: nirCreationDTO){
        return this.http.post(this.apiUrl, nir);
    }

    getNextNumber(): Observable<number>{
        return this.http.get<number>(`${this.apiUrl}/getNextNumber`);
    }

    getById(id: number): Observable<nirDTO>{
        return this.http.get<nirDTO>(`${this.apiUrl}/${id}`);
    }    
    
    public putGet(id: number): Observable<nirPutGetDTO>{
        return this.http.get<nirPutGetDTO>(`${this.apiUrl}/putget/${id}`);
    }

    edit(id: number, nir: nirCreationDTO){
        return this.http.put(`${this.apiUrl}/${id}`, nir);
    }

    delete(id: number) {
        return this.http.delete(`${this.apiUrl}/${id}`);
    }
  }