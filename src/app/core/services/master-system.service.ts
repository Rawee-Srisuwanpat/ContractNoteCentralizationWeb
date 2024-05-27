import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, delay, map, tap } from 'rxjs/operators';

import { of, EMPTY, Observable } from 'rxjs';
import { ApiUrl } from './api-url.service';
import { ManageMasterSystemReqModel } from '../model/ManageMasterSystem/ManageMasterSystemReqModel';

@Injectable({
    providedIn: 'root'
})
export class MasterSystemService {

    constructor(private http: HttpClient ,private url : ApiUrl) {
    }

   

    createMasterSystem(req : ManageMasterSystemReqModel) {
        const body = req
        return this.http.post<any>(this.url.createMasterSystem,body)
        .pipe(
                tap(res => {
                    console.log('fetched createMasterSystem Api')
                    console.log(res)
                }),
                catchError( error => {
                    console.error(error);
                    return of(error)
                })
        )
    }

    editMasterSystem(req : ManageMasterSystemReqModel) {
        const body = req
        return this.http.post<any>(this.url.editMasterSystem,body)
        .pipe(
                tap(res => {
                    console.log('fetched editMasterSystem Api')
                    console.log(res)
                }),
                catchError( error => {
                    console.error(error);
                    return of(error)
                })
        )
    }

    deleteMasterSystem(req : ManageMasterSystemReqModel) {
        const body = req
        return this.http.post<any>(this.url.deleteMasterSystem,body)
        .pipe(
                tap(res => {
                    console.log('fetched deleteMasterSystem Api')
                    console.log(res)
                }),
                catchError( error => {
                    console.error(error);
                    return of(error)
                })
        )
    }

    searchMasterSystem() {

        //const body = null
        return this.http.post<any>(this.url.searchMasterSystem,null)
        .pipe(
                tap(res => {
                    console.log('fetched searchMasterSystem Api')
                    console.log(res)
                }),
                catchError( error => {
                    console.error(error);
                    return of(error)
                })
        )
    }

 
}
