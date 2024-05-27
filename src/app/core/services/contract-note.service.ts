import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, delay, map, tap } from 'rxjs/operators';

import { of, EMPTY, Observable } from 'rxjs';
import { ApiUrl } from './api-url.service';
import { LogLoginReqModel } from '../model/log-login/LogLoginReqModel';
import { InquiryReqModel } from '../model/FollowUp/InquiryReqModel';
import { Router } from '@angular/router';


@Injectable({
    providedIn: 'root'
})
export class ContractNoteService {

    masterResModel : LogLoginReqModel[] = []

    constructor(private http: HttpClient 
        ,private url : ApiUrl
        ,private router: Router
        ) {}

    GetAllContractNote() {
        //const body = null
        return this.http.post<any>(this.url.searchContractNote,null)
        .pipe(
                tap(res => {
                    console.log('fetched GetAllContractNote Api')
                    console.log(res)
                    
                }),
                catchError( error => {
                    console.error(error);
                    return of(error)
                })
        )
    }

    searchContractNoteByInquiryWeb(req : InquiryReqModel) {
        const body = req
        return this.http.post<any>(this.url.searchContractNoteByInquiryWeb,body)
        .pipe(
                tap(res => {
                    console.log('fetched searchContractNoteByInquiryWeb Api')
                    console.log(res)
                    
                }),
                catchError( error => {
                    console.error(error);

                    // if (error.status == 401)
                    //     this.router.navigate(['/login']);
                    return of(error)
                })
        )
    }

   

 
}
