import { HTTP_INTERCEPTORS, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpResponse } from '@angular/common/http';
import { finalize, map, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';

@Injectable()
export class EncryptInterceptor implements HttpInterceptor {
  reqCaech = new Map();

  constructor(
    public router: Router
  ) { }

  // canCaech(req: HttpRequest<any>): boolean {
  //   return req.urlWithParams.includes(req.url);
  // }

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    const caech = this.reqCaech.get(req.urlWithParams);
    if (caech)
      return of(caech);

    this.reqCaech.set(req.urlWithParams, {});

    let bodyData: any = null;
    let data = req.body;
    
    let headers: any = {}

    let payload: HttpRequest<any>;
    payload = req.clone({ body: data, setHeaders: { ...headers } })

    return next.handle(payload).pipe(
      map(
        (event: any) => {
          if (event instanceof HttpResponse) {
            bodyData = event.body;
            bodyData = this.tranformResponse(bodyData);
            event = event.clone({
              body: bodyData
            });
            return event;
          }
        },
        (error) => error
      ),
      finalize(() => {
        this.reqCaech.delete(req.urlWithParams);
      }),catchError(d => this.handleError(d))
    );
  }

  private handleError(error: HttpErrorResponse) {
    // if (error == null) {
    //   error = Object.assign({});
    //   this.reqCaech.clear();
    // } else
    //   this.reqCaech.delete(error?.['url']);

    error = error || Object.assign({});
    return throwError(() => error); //error?.error
  }

  tranformResponse(bodyData: any) {
    return bodyData;
  }
}
export const httpInterceptorProviders = [
  { provide: HTTP_INTERCEPTORS, useClass: EncryptInterceptor, multi: true }
];