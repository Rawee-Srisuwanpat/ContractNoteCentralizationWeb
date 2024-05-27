import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, delay, map, tap } from 'rxjs/operators';

import { of, EMPTY, Observable } from 'rxjs';
import { ApiUrl } from './api-url.service';
import { ManageRegisterCreateReqModel } from '../model/ManageRegister/ManageRegisterCreateReqModel';
import { ManageRegisterDeleteReqModel } from '../model/ManageRegister/ManageRegisterDeleteReqModel';
import { ManageUserReqModel } from '../model/ManageUser/ManageUserReqModel';

@Injectable({
    providedIn: 'root'
})
export class ManageRegisterService {

    constructor(private http: HttpClient ,private url : ApiUrl) {
    }

   

    createManageRegister(req : ManageRegisterCreateReqModel) {
        const body = req
        return this.http.post<any>(this.url.createUser,body)
        .pipe(
                tap(res => {
                    console.log('fetched createRegister Api')
                    console.log(res)
                }),
                catchError( error => {
                    console.error(error);
                    return of(error)
                })
        )
    }

    editManageRegister(req : ManageRegisterCreateReqModel) {
        const body = req
        return this.http.post<any>(this.url.editUser,body)
        .pipe(
                tap(res => {
                    console.log('fetched editRegister Api')
                    console.log(res)
                }),
                catchError( error => {
                    console.error(error);
                    return of(error)
                })
        )
    }

    deleteManageRegister(req : ManageRegisterDeleteReqModel) {
        const body = req
        return this.http.post<any>(this.url.deleteUser,body)
        .pipe(
                tap(res => {
                    console.log('fetched deleteRegister Api')
                    console.log(res)
                }),
                catchError( error => {
                    console.error(error);
                    return of(error)
                })
        )
    }

    searchManageRegister(req : ManageUserReqModel) {

        const body = req
        return this.http.post<any>(this.url.searchUser,req)
        .pipe(
                tap(res => {
                    console.log('fetched searchRegister Api')
                    console.log(res)
                }),
                catchError( error => {
                    console.error(error);
                    return of(error)
                })
        )
    }

 
}
