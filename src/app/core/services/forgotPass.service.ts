import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, delay, map, tap } from 'rxjs/operators';

import { of, EMPTY, Observable } from 'rxjs';
import { ApiUrl } from './api-url.service';
import { SendOtpModel } from '../model/SendOtpModel';
import { VerifyOtpModel } from '../model/VerifyOtpModel';

@Injectable({
    providedIn: 'root'
})
export class ForgotPasswordService {

    constructor(private http: HttpClient ,private url : ApiUrl) {
    }

   
    verifyOtp(req :VerifyOtpModel ) {
        const body = req
        return this.http.post<any>(this.url.verifyOtp,body)
        .pipe(
                tap(res => {
                    console.log('fetched verifyOtp')
                    console.log(res)
                }),
                catchError(this.handleError<any>('verifyOtp', []))
        )
    }

    sendOtp(register : SendOtpModel) {

        // const body = {
        //     user_name : email ,
        //     password : password
        // }
        const body = register
        return this.http.post<any>(this.url.sendOtp,body)
        .pipe(
                tap(res => {
                    console.log('fetched loginApi')
                    console.log(res)
                }),
                catchError(this.handleError<any>('loginApi', []))
        )
    }

    private handleError<T>(operation = 'operation', result?: T) {
        return (error: any): Observable<boolean> => {
        //return (error: any): Observable<T> => {
      
          // TODO: send the error to remote logging infrastructure
          console.error(error); // log to console instead
      
          // TODO: better job of transforming error for user consumption
          console.log(`${operation} failed: ${error.message}`);
      
          // Let the app keep running by returning an empty result.
          //return of(result as T);
          return of(false)
        };
    }


 
}
