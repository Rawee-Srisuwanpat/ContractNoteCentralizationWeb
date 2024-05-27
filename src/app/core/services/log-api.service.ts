import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, delay, map, tap } from 'rxjs/operators';

import { of, EMPTY, Observable } from 'rxjs';
import { ApiUrl } from './api-url.service';
import { LogLoginReqModel } from '../model/log-login/LogLoginReqModel';
import { LogApiInquiryReqModel } from '../model/log-api/LogApiInquiryReqModel';


@Injectable({
    providedIn: 'root'
})
export class LogApiService {


    constructor(private http: HttpClient ,private url : ApiUrl) {}

    GetAllLogApi(req : LogApiInquiryReqModel ) {
        const body = req
        return this.http.post<any>(this.url.searchLogApi,body)
        .pipe(
                tap(res => {
                    console.log('fetched GetAllLogApi Api')
                    console.log(res)
                    
                }),
                catchError( error => {
                    console.error(error);
                    return of(error)
                })
        )
    }

   

 
}
