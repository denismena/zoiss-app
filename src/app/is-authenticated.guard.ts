import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { SecurityService } from './security/security.service';

@Injectable({
  providedIn: 'root'
})
export class IsAuthenticatedGuard  {
  constructor(private securitySevice: SecurityService, private router: Router){

  }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      if(this.securitySevice.isAuthenticated())return true;
      else 
      {
        this.router.navigate(["/login"]);
        return false
      }
  }
  
}
