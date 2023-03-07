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
  create(furnizor: furnizoriCreationDTO){
    const formData = this.buildFormData(furnizor);
    return this.http.post(this.apiUrl, formData);
  }

  getById(id: number): Observable<furnizoriDTO>{
    return this.http.get<furnizoriDTO>(`${this.apiUrl}/${id}`);
  } 

  edit(id: number, furnizor: furnizoriCreationDTO){
    const formData = this.buildFormData(furnizor);
    return this.http.put(`${this.apiUrl}/${id}`, formData);
  }

  delete(id: number) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  private buildFormData(furnizor: furnizoriCreationDTO): FormData {
    const formData = new FormData();

    formData.append('nume', furnizor.nume);    

    if (furnizor.tara){
      formData.append('tara', furnizor.tara.toString());
    }
    if (furnizor.oras){
      formData.append('oras', furnizor.oras.toString());
    }
    if (furnizor.judet){
      formData.append('judet', furnizor.judet.toString());
    }
    if (furnizor.adresa){
      formData.append('adresa', furnizor.adresa.toString());
    }
    if (furnizor.tel){
      formData.append('tel', furnizor.tel);
    }
    if (furnizor.email){
      formData.append('email', furnizor.email.toString());
    }    
    if (furnizor.conditii){
      formData.append('conditii', furnizor.conditii.toString());
    }
    if (furnizor.active){
      formData.append('active', furnizor.active.toString());
    }    
    if (furnizor.files){
      for(var i =  0; i <  furnizor.files.length; i++)  {  
        formData.append("files",  furnizor.files[i]);
      } 
    }
    if(furnizor.fileNames != null && furnizor.fileNames != undefined) {
      const fileNamesArray = Object.entries(furnizor.fileNames);
      for (const obj of fileNamesArray) {
        formData.append('fileNames', obj[1] as string);
      }
    }
    return formData;
  }
}
