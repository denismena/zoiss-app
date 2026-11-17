import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, from, Observable, of, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { NotificationService } from '../utilities/notification.service';
import { SecurityService } from './security.service';
import { catchError, filter, switchMap, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class JwtInterceptorService implements HttpInterceptor {

  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);

  constructor(
    private securityService: SecurityService,
    private notificationService: NotificationService
  ) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Only attach credentials to our own API; never leak the token to third-party hosts
    const isApiRequest = req.url.startsWith(environment.rootUrl) || req.url.startsWith(environment.apiUrl);
    const token = this.securityService.getToken();
    if (token && isApiRequest) {
      req = req.clone({
        setHeaders: { Authorization: `Bearer ${token}` }
      });
    }

    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 429) {
          const retryAfter = error.headers.get('Retry-After');
          const message = retryAfter
            ? `Prea multe cereri. Reîncercați peste ${retryAfter} secunde.`
            : 'Prea multe cereri. Așteptați puțin înainte de a reîncerca.';
          this.notificationService.showErrors([message]);
          return throwError(() => error);
        }
        if (error.status === 401 && !req.url.includes('refresh-token')) {
          return this.handle401Error(req, next);
        }
        if (error.error instanceof Blob) {
          return this.unwrapBlobError(error);
        }
        return throwError(() => error);
      })
    );
  }

  /**
   * File downloads (responseType 'blob') receive their error body as a Blob, so the ProblemDetails message is
   * unreadable to callers. Read it back into JSON/text so parseWebAPIErrors works for downloads too.
   */
  private unwrapBlobError(error: HttpErrorResponse): Observable<never> {
    return from((error.error as Blob).text()).pipe(
      catchError(() => of('')),
      switchMap(text => {
        let body: any = text;
        try { body = JSON.parse(text); } catch { /* plain text body */ }
        return throwError(() => new HttpErrorResponse({
          error: body,
          headers: error.headers,
          status: error.status,
          statusText: error.statusText,
          url: error.url ?? undefined
        }));
      })
    );
  }

  private handle401Error(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);

      const token = this.securityService.getToken();
      return from(this.securityService.tryRefreshingTokens(token as string)).pipe(
        switchMap((isRefreshSuccess: boolean) => {
          this.isRefreshing = false;
          if (isRefreshSuccess) {
            const newToken = this.securityService.getToken()!;
            this.refreshTokenSubject.next(newToken);
            return next.handle(req.clone({
              setHeaders: { Authorization: `Bearer ${newToken}` }
            }));
          }
          this.securityService.logout();
          return throwError(() => new Error('Refresh token failed'));
        }),
        catchError((err) => {
          this.isRefreshing = false;
          this.securityService.logout();
          return throwError(() => err);
        })
      );
    }

    // Another refresh is already in progress -- wait for it to complete
    return this.refreshTokenSubject.pipe(
      filter((token): token is string => token !== null),
      take(1),
      switchMap(token => next.handle(req.clone({
        setHeaders: { Authorization: `Bearer ${token}` }
      })))
    );
  }
}
