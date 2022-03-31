import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { stickyNotesCreationDTO, stickyNotesDTO } from './sticky-notes.model';

@Injectable({
    providedIn: 'root'
  })

export class StickyNotesService{
    constructor(private http: HttpClient) { }
  private apiUrl = environment.apiUrl + '/notes';

  getAll(): Observable<stickyNotesDTO[]>{
    return this.http.get<stickyNotesDTO[]>(this.apiUrl);
  }
  create(notes: stickyNotesCreationDTO){
    return this.http.post<number>(this.apiUrl, notes);
  }
  edit(id: number, notes: stickyNotesCreationDTO){
    return this.http.put(`${this.apiUrl}/${id}`, notes);
  }

  delete(id: number) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}  