import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { authentificationResponse, forgetPass, resetPass, tokenModel, userCredentials, UtilizatoriDTO } from './security.models';
import { UnsubscribeService } from '../unsubscribe.service';
import { takeUntil } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SecurityService {

  constructor(private http: HttpClient, private router: Router, private unsubscribeService: UnsubscribeService) {}  

  private apiUrl = environment.apiUrl + "/utilizatori";
  private readonly tokenKey: string = 'token';
  private readonly expirationTokenKey: string = 'token-expiration';
  private readonly refreshToken = "refreshToken";
  private readonly roleField = "role";

  async isAuthenticated(): Promise<boolean> {
    const token = localStorage.getItem(this.tokenKey);
    if (!token) return false;
    const expiration = localStorage.getItem(this.expirationTokenKey);
    if (!expiration) return false;
    const expirationDate = new Date(expiration);

    if (expirationDate <= new Date()) {
      const isRefreshSuccess = token ? await this.tryRefreshingTokens(token) : false;
      if (!isRefreshSuccess) {
        this.logout();
        this.router.navigate(["/login"]);
        return false;
      }
    }

    return true;
  }

  private async tryRefreshingTokens(token: string): Promise<boolean> {
    const refreshToken = localStorage.getItem("refreshToken");
    if (!token || !refreshToken) { 
      return false;
    }
    
    let credentials: tokenModel = {
      token: token,
      refreshToken: refreshToken
    }  
    let isRefreshSuccess: boolean = false;

    try {
      const authenticatorResponse = await this.refreshtoken(credentials)
        .pipe(takeUntil(this.unsubscribeService.unsubscribeSignal$))
        .toPromise();

      this.saveToke(authenticatorResponse);
      localStorage.setItem("token", authenticatorResponse.token);
      localStorage.setItem("refreshToken", authenticatorResponse.refreshToken);
      isRefreshSuccess = true;
      //this.router.navigate(['/']);
    } catch (error) {
      isRefreshSuccess = false;
    }

    return isRefreshSuccess;
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

  refreshtoken(userCredentials: tokenModel):Observable<authentificationResponse>{
    return this.http.post<authentificationResponse>(this.apiUrl+"/refresh-token", userCredentials);
  }

  logout(){
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.expirationTokenKey);
    localStorage.removeItem(this.refreshToken);
    this.router.navigate(['/login']);
  }

  saveToke(authenticationResponse: authentificationResponse){
    localStorage.setItem(this.tokenKey, authenticationResponse.token);
    localStorage.setItem(this.refreshToken, authenticationResponse.refreshToken);
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

  changeStatus(id: string, active: boolean){
    return this.http.put(`${this.apiUrl}/${id}/changeStatus`, active);    
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
  setNotificationStyle(style: string){
    return this.http.post(this.apiUrl+"/setNotificationStyle", style);
  }
}
