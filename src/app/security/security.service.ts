import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { authentificationResponse, forgetPass, resetPass, userCredentials, UtilizatoriDTO } from './security.models';

@Injectable({
  providedIn: 'root'
})
export class SecurityService {

  constructor(private http: HttpClient, private router: Router ) {}  

  private apiUrl = environment.apiUrl + "/utilizatori";
  private readonly tokenKey: string = 'token';
  private readonly expirationTokenKey: string = 'token-expiration';
  private readonly roleField = "role";

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
    return this.getFieldFromJwt(this.roleField);
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

  edit(id:string, utilizatoriDTO: UtilizatoriDTO):Observable<authentificationResponse>{    
    return this.http.put<authentificationResponse>(`${this.apiUrl}/${id}`, utilizatoriDTO);    
  }

  login(userCredentials: userCredentials):Observable<authentificationResponse>{
    return this.http.post<authentificationResponse>(this.apiUrl+"/login", userCredentials);
  }

  logout(){
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.expirationTokenKey);
    this.router.navigate(['/']);
  }

  saveToke(authenticationResponse: authentificationResponse){
    localStorage.setItem(this.tokenKey, authenticationResponse.token);
    localStorage.setItem(this.expirationTokenKey, authenticationResponse.expiration.toString());
  }

  getToken(){
    return localStorage.getItem(this.tokenKey);
  }

  getUsers(): Observable<UtilizatoriDTO[]>{
    return this.http.get<UtilizatoriDTO[]>(this.apiUrl);
  }

  getById(id: string): Observable<UtilizatoriDTO>{
    return this.http.get<UtilizatoriDTO>(`${this.apiUrl}/${id}`);
  }
  
  getByEmail(id: string): Observable<UtilizatoriDTO>{
    return this.http.get<UtilizatoriDTO>(`${this.apiUrl}/getByEmail/${id}`);
  }

  markAsInactive(id: string) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  forgetPassword(email: forgetPass){
    return this.http.post(this.apiUrl+"/forgetpass", email);    
  }
  resetPassword(resetpass: resetPass){    
    return this.http.post(this.apiUrl+"/resetpass", resetpass);    
  }
  confirmEmail(email: forgetPass){
    return this.http.post(this.apiUrl+"/confirmEmail", email);    
  }
}
