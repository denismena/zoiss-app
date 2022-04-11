import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject  } from 'rxjs';
import { take } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { notificariDTO } from './notificari.model';

@Injectable({
    providedIn: 'root'
  })

export class NotificariService{    
    necitite: number = 0;
    constructor(private http: HttpClient) { 
        // this.getAll().subscribe(notificari=>{
        //     this.necitite = notificari.filter(f=>f.read==false).length;
        //   });    
    }
    private apiUrl = environment.apiUrl + '/notificari';

    getAll(): Observable<notificariDTO[]>{
        return this.http.get<notificariDTO[]>(this.apiUrl);
    }
    read(id: number) {
        return this.http.put(`${this.apiUrl}/read/${id}`,'');
    }
    readAll() {
        return this.http.put(`${this.apiUrl}/readAll`,'');
    }

    delete(id: number) {
        return this.http.delete(`${this.apiUrl}/${id}`);
    }
    deleteAll() {
        return this.http.delete(`${this.apiUrl}/deleteAll`);
      }
}