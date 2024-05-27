import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, delay, map, tap } from 'rxjs/operators';
//import * as jwt_decode from 'jwt-decode';
import * as moment from 'moment';

import { environment } from '../../../environments/environment';
import { of, EMPTY, Observable } from 'rxjs';
import { ApiUrl } from './api-url.service';

@Injectable({
    providedIn: 'root'
})
export class AuthenticationService {

    constructor(private http: HttpClient ,private url : ApiUrl) {
    }

    login(email: string, password: string) {
        return of(true)
            .pipe(delay(1000),
                map((/*response*/) => {
                    // set token property
                    // const decodedToken = jwt_decode(response['token']);

                    // store email and jwt token in local storage to keep user logged in between page refreshes
                    localStorage.setItem('currentUser', JSON.stringify({
                        token: 'aisdnaksjdn,axmnczm',
                        isAdmin: true,
                        email: 'john.doe@gmail.com',
                        id: '12312323232',
                        alias: 'john.doe@gmail.com'.split('@')[0],
                        expiration: moment().add(1, 'days').toDate(),
                        fullName: 'John Doe'
                    }));

                    console.log(email, password)
                    if (email == 'tong' && password == '123')

                        return true;
                    else 
                        return false;
                }));
    }

    loginApi(email: string, password: string) {

        const body = {
            user_name : email ,
            password : password
        }
        return this.http.post<any>(this.url.login,body)
        .pipe(
                tap(res => {
                    console.log('fetched loginApi')
                    console.log(res)
                }),
                catchError(this.handleError<any>('loginApi', []))
        )
    }

    loginApiAndGetToken(email: string, password: string) {

        var d = new Date()

        let month = '' + (d.getMonth() +1)
        let day = '' + d.getDate() 
        let hours = '' + d.getHours()
        let minutes  = '' + d.getMinutes()

        if (month.length < 2)
            month =  '0' + month

        if (day.length < 2) 
            day = '0' + day;

        if (hours.length < 2) 
            hours = '0' + hours;
        
        if (minutes.length < 2) 
            minutes = '0' + minutes;




        let transaction_id  = d.getFullYear().toString() + month + day
                                 + hours + minutes + d.getMilliseconds().toString()
        const body = {
            transaction_id : transaction_id, 
            data : {
                username : email ,
                password : password ,
                authen_type : "AD"
            }
        }
        return this.http.post<any>(this.url.loginAndGetToken,body)
        .pipe(
                tap(res => {
                    console.log('fetched loginApi')
                    console.log(res)
                }),
                catchError(this.handleError<any>('loginApi', []))
        )
    }

    refreshToken(token : string ,refresh_token :string ) {
        var d = new Date()

        let month = '' + (d.getMonth() +1)
        let day = '' + d.getDate() 
        let hours = '' + d.getHours()
        let minutes  = '' + d.getMinutes()

        if (month.length < 2)
            month =  '0' + month

        if (day.length < 2) 
            day = '0' + day;

        if (hours.length < 2) 
            hours = '0' + hours;
        
        if (minutes.length < 2) 
            minutes = '0' + minutes;




        let transaction_id  = d.getFullYear().toString() + month + day
                                 + hours + minutes + d.getMilliseconds().toString()
        const body = {
            transaction_id : transaction_id, 
            data : {
                token : token ,
                refresh_token : refresh_token 
            }
        }
        return this.http.post<any>(this.url.refreshToken,body)
        .pipe(
                tap(res => {
                    console.log('fetched refreshToken')
                    console.log(res)
                }),
                catchError(this.handleError<any>('refreshToken', []))
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


    logout(): void {
        // clear token remove user from local storage to log user out
        //localStorage.removeItem('currentUser');
        localStorage.removeItem('savedUser');
        localStorage.clear();
    }

    getCurrentUser(): any {
        // TODO: Enable after implementation
        // return JSON.parse(this.localStorage.getItem('currentUser'));
        return {
            token: 'aisdnaksjdn,axmnczm',
            isAdmin: true,
            email: 'john.doe@gmail.com',
            id: '12312323232',
            alias: 'john.doe@gmail.com'.split('@')[0],
            expiration: moment().add(1, 'days').toDate(),
            fullName: 'John Doe'
        };
    }

    passwordResetRequest(email: string) {
        return of(true).pipe(delay(1000));
    }

    changePassword(email: string, currentPwd: string, newPwd: string) {
        return of(true).pipe(delay(1000));
    }

    passwordReset(email: string, token: string, password: string, confirmPassword: string): any {
        return of(true).pipe(delay(1000));
    }
}
