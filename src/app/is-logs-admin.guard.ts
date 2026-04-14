import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { SecurityService } from './security/security.service';

@Injectable({
  providedIn: 'root'
})
export class IsLogsAdminGuard implements CanActivate {
  private allowedEmails = ['denis.menacai@gmail.com', 'deni.menacai@gmail.com'];

  constructor(private securityService: SecurityService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (this.allowedEmails.includes(this.securityService.getFieldFromJwt('email'))) return true;
    this.router.navigate(['/home']);
    return false;
  }
}
