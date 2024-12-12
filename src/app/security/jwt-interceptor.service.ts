import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { from, Observable, throwError } from 'rxjs';
import { SecurityService } from './security.service';
import { catchError, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class JwtInterceptorService implements HttpInterceptor {

  constructor(private securityService: SecurityService) { }
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.securityService.getToken();
    if(token){
      req = req.clone({
        setHeaders: {Authorization: `Bearer ${token}`}
      });
    }

    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401 
          //&& error.error.error_description.includes('Token has expired.')
        ) {
          // Token expired, try to refresh it
          return from(this.securityService.tryRefreshingTokens(token as string)).pipe(
            switchMap((isRefreshSuccess: boolean) => {
              if (isRefreshSuccess) {
                const newToken = this.securityService.getToken();
                const newReq = req.clone({
                  setHeaders: { Authorization: `Bearer ${newToken}` }
                });
                return next.handle(newReq);
              } else {
                this.securityService.logout();
                return throwError(error);
              }
            }),
            catchError((refreshError) => {
              this.securityService.logout();
              return throwError(refreshError);
            })
          );
        } else {
          return throwError(error);
        }
      })
    );
  }
}
