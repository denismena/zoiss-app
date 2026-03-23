import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, firstValueFrom, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { authentificationResponse, forgetPass, resetPass, tokenModel, userCredentials, UtilizatoriDTO } from './security.models';
import { take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SecurityService {

  private apiUrl = environment.apiUrl + "/utilizatori";
  private readonly tokenKey: string = 'token';
  private readonly expirationTokenKey: string = 'token-expiration';
  private readonly refreshToken = "refreshToken";
  private readonly roleField = "role";

  private loggedIn$ = new BehaviorSubject<boolean>(this.hasValidToken());
  isLoggedIn$ = this.loggedIn$.asObservable();

  constructor(private http: HttpClient, private router: Router) {}

  private hasValidToken(): boolean {
    const token = localStorage.getItem(this.tokenKey);
    if (!token) return false;
    const expiration = localStorage.getItem(this.expirationTokenKey);
    if (!expiration) return false;
    return new Date(expiration) > new Date();
  }

  /*
   * SECURITY NOTE: JWT and refresh tokens are stored in localStorage.
   * This is vulnerable to XSS-based token theft if an attacker injects malicious script.
   * Recommended improvement: Use HttpOnly cookies for tokens (requires backend changes).
   * If cookies are not feasible, ensure strict Content-Security-Policy and other XSS mitigations.
   */

  async isAuthenticated(): Promise<boolean> {
    const token = localStorage.getItem(this.tokenKey);
    if (!token) return false;
    const expiration = localStorage.getItem(this.expirationTokenKey);
    if (!expiration) return false;
    const expirationDate = new Date(expiration);

    if (expirationDate <= new Date()) {
      const isRefreshSuccess = await this.tryRefreshingTokens(token);
      if (!isRefreshSuccess) {
        this.logout();
        return false;
      }
    }

    return true;
  }

  public async tryRefreshingTokens(token: string): Promise<boolean> {
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
      const authenticatorResponse = await firstValueFrom(this.refreshtoken(credentials).pipe(take(1)));
      this.saveToken(authenticatorResponse);
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
    this.loggedIn$.next(false);
    this.router.navigate(['/login']);
  }

  saveToken(authenticationResponse: authentificationResponse){
    localStorage.setItem(this.tokenKey, authenticationResponse.token);
    localStorage.setItem(this.refreshToken, authenticationResponse.refreshToken);
    localStorage.setItem(this.expirationTokenKey, authenticationResponse.expiration.toString());
    this.loggedIn$.next(true);
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
