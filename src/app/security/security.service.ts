import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { authentificationResponse, userCredentials } from './security.models';

@Injectable({
  providedIn: 'root'
})
export class SecurityService {

  constructor(private http: HttpClient ) {}  

  private apiUrl = environment.apiUrl + "/utilizatori";
  private tokenKey: string = 'token';
  private expirationTokenKey: string = 'token-expiration';

  isAuthenticated():boolean{
    const token = localStorage.getItem(this.tokenKey);
    if(!token) return false;    
    const expiration = localStorage.getItem(this.expirationTokenKey);
    if(!expiration) return false;
    const expirationDate = new Date(expiration);
    if(expirationDate <= new Date()) 
    {
      this.logout();
      return false;
    }

    return true;
  }

  getRole():string{
    return ''; 
  }

  getFieldFromJwt(field: string): string{
    const token = localStorage.getItem(this.tokenKey);
    if(!token) return '';
    const dataToken = JSON.parse(atob(token.split('.')[1]));
    return dataToken[field];
  }
  register(userCredentials: userCredentials):Observable<authentificationResponse>{
    return this.http.post<authentificationResponse>(this.apiUrl+"/create", userCredentials);
  }

  login(userCredentials: userCredentials):Observable<authentificationResponse>{
    return this.http.post<authentificationResponse>(this.apiUrl+"/login", userCredentials);
  }

  logout(){
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.expirationTokenKey);
  }

  saveToke(authenticationResponse: authentificationResponse){
    localStorage.setItem(this.tokenKey, authenticationResponse.token);
    localStorage.setItem(this.expirationTokenKey, authenticationResponse.expiration.toString());
  }
}
