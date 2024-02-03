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
  async canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Promise<Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree> {
      const result = await this.securitySevice.isAuthenticated();
      if(result)return true;
      else 
      {
        this.router.navigate(["/login"]);
        return false
      }
  }
  
}
