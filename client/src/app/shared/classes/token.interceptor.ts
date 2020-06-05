import { Injectable } from '@angular/core';
import { AuthService } from '../services/auth.service';
import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor(private auth: AuthService, private router: Router) { }

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // if (!(this.router.url.indexOf('/statistic/'))) {
    //   const url = this.router.url.substring('/statistic/'.length).split('/');
    //   this.router.navigate(['/statistic'], {
    //     queryParams: {
    //       id: url[0],
    //       from: url[1],
    //       to: url[2],
    //       name: url[3],
    //       imgRoute: 'uploads/' + url[4]
    //     }
    //   });
    // }
    if (this.auth.isAuthenticated()) {
      req = req.clone({
        setHeaders: {
          Authorization: this.auth.getToken()
        }
      });
    }

    return next
      .handle(req)
      .pipe(
        catchError((error: HttpErrorResponse) => this.handleAuthError(error))
      );
  }

  private handleAuthError(error: HttpErrorResponse): Observable<any> {
    if (error.status === 401) {
      this.router.navigate(['/login'], {
        queryParams: {
          sessionFailed: true
        }
      });
    }

    return throwError(error);
  }
}
