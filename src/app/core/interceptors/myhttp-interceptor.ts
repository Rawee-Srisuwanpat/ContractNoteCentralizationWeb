import { Injectable } from '@angular/core';
import {
  HttpEvent, HttpInterceptor,
  HttpHandler,
  HttpResponse,
  HttpRequest,
  HttpErrorResponse
} from '@angular/common/http';

import { Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { IdleService } from '../services/IdleService';
import { AuthenticationService } from '../services/auth.service';



@Injectable()
export class MyHttpInterceptor implements HttpInterceptor {

  constructor(
    private router: Router
    ,private idleService : IdleService
    ,private authenticationService : AuthenticationService
  ) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    console.log('Interceptor ran..');
    const started = Date.now();  // เวลาเริ่มต้นที่ request          


    //const authToken = '123456789'

    const authToken = localStorage.getItem('token');

    // // Get the auth token from the service.
    // let authToken = localStorage.getItem('token');
    // //this.auth.getAuthorizationToken();
    // console.log(authToken)

    // if (authToken != null) {
    //    authToken = '12123'
    // }



    // Clone the request and replace the original headers with
    // cloned headers, updated with the authorization.
    const authReq = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${authToken}` )
    });

    // send cloned request with header to the next handler.
    if (authToken != null)
      return next.handle(authReq).pipe( 
          tap ( () => {

          },
          (err : any) => {
            console.log(err)
            if (err instanceof HttpErrorResponse) {
              if (err.status !== 401) {
                return;
              }

              if (err.status === 401 && this.idleService.isIdle) {
                localStorage.clear();
                this.router.navigate(['/401']);
              }else {

                let token = localStorage.getItem('token')
                let refresh_token = localStorage.getItem('refresh_token')

                this.authenticationService.refreshToken(token,refresh_token).subscribe(data => {
                //this.authenticationService.loginApiAndGetToken('rawee.s','SummitDec2023').subscribe(data => {
                  if (data?.status?.status_code == '00') {
                    console.log('Extend token success')
                    console.log('old token :' , localStorage.getItem('token'))
                    console.log('new token :' , data.token)
                    localStorage.setItem('token', data.token);
                  }
                  else
                    console.log('Extend token fail')
                })
              }

              
               
            }

          })
      );
    else {
      //console.log('here')
      return next.handle(req);
    }

  }

}