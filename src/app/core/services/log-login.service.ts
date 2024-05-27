import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, delay, map, tap } from 'rxjs/operators';

import { of, EMPTY, Observable } from 'rxjs';
import { ApiUrl } from './api-url.service';
import { LogLoginReqModel } from '../model/log-login/LogLoginReqModel';


@Injectable({
    providedIn: 'root'
})
export class LogLoginService {

    masterResModel : LogLoginReqModel[] = []

    constructor(private http: HttpClient ,private url : ApiUrl) {}

    GetAllLogLogin() {
        //const body = null
        return this.http.post<any>(this.url.searchLogLogin,null)
        .pipe(
                tap(res => {
                    console.log('fetched GetAllLogLogin Api')
                    console.log(res)
                    
                }),
                catchError( error => {
                    console.error(error);
                    return of(error)
                })
        )
    }

   

 
}
