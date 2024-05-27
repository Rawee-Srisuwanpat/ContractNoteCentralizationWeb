import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, delay, map, tap } from 'rxjs/operators';

import { of, EMPTY, Observable } from 'rxjs';
import { ApiUrl } from './api-url.service';
import { ManageMasterSystemReqModel } from '../model/ManageMasterSystem/ManageMasterSystemReqModel';
import { ManageUserReqModel } from '../model/ManageUser/ManageUserReqModel';

@Injectable({
    providedIn: 'root'
})
export class ManageUserService {

    constructor(private http: HttpClient ,private url : ApiUrl) {
    }

   

    createUser(req : ManageUserReqModel) {
        const body = req
        return this.http.post<any>(this.url.createUser,body)
        .pipe(
                tap(res => {
                    console.log('fetched createUser Api')
                    console.log(res)
                }),
                catchError( error => {
                    console.error(error);
                    return of(error)
                })
        )
    }

    editUser(req : ManageUserReqModel) {
        const body = req
        return this.http.post<any>(this.url.editUser,body)
        .pipe(
                tap(res => {
                    console.log('fetched editUser Api')
                    console.log(res)
                }),
                catchError( error => {
                    console.error(error);
                    return of(error)
                })
        )
    }

    deleteUser(req : ManageUserReqModel) {
        const body = req
        return this.http.post<any>(this.url.deleteUser,body)
        .pipe(
                tap(res => {
                    console.log('fetched deleteUser Api')
                    console.log(res)
                }),
                catchError( error => {
                    console.error(error);
                    return of(error)
                })
        )
    }

    searchUser(req : ManageUserReqModel) {

        const body = req
        return this.http.post<any>(this.url.searchUser,body)
        .pipe(
                tap(res => {
                    console.log('fetched searchUser Api')
                    console.log(res)
                }),
                catchError( error => {
                    console.error(error);
                    return of(error)
                })
        )
    }

 
}
