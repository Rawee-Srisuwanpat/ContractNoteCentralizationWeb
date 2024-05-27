import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, delay, map, tap } from 'rxjs/operators';

import { of, EMPTY, Observable } from 'rxjs';
import { ApiUrl } from './api-url.service';
import { ManageMasterSystemReqModel } from '../model/ManageMasterSystem/ManageMasterSystemReqModel';
import { ManageRoleReqModel } from '../model/ManageRole/ManageRoleReqModel';
import { ManageRoleDeleteReqModel } from '../model/ManageRole/ManageRoleDeleteReqModel';

@Injectable({
    providedIn: 'root'
})
export class ManageRoleService {

    constructor(private http: HttpClient ,private url : ApiUrl) {
    }

   

    createRole(req : ManageRoleReqModel) {
        const body = req
        return this.http.post<any>(this.url.createRole,body)
        .pipe(
                tap(res => {
                    console.log('fetched createRole Api')
                    console.log(res)
                }),
                catchError( error => {
                    console.error(error);
                    return of(error)
                })
        )
    }

    editRole(req : ManageRoleReqModel) {
        const body = req
        return this.http.post<any>(this.url.editRole,body)
        .pipe(
                tap(res => {
                    console.log('fetched editRole Api')
                    console.log(res)
                }),
                catchError( error => {
                    console.error(error);
                    return of(error)
                })
        )
    }

    deleteRole(req : ManageRoleDeleteReqModel) {
        const body = req
        return this.http.post<any>(this.url.deleteRole,body)
        .pipe(
                tap(res => {
                    console.log('fetched deleteRole Api')
                    console.log(res)
                }),
                catchError( error => {
                    console.error(error);
                    return of(error)
                })
        )
    }

    searchRole() {

        //const body = null
        return this.http.post<any>(this.url.searchRole,null)
        .pipe(
                tap(res => {
                    console.log('fetched searchRole Api')
                    console.log(res)
                }),
                catchError( error => {
                    console.error(error);
                    return of(error)
                })
        )
    }

    searchRoleByUser(user) {

        const body = {user : user}
        return this.http.post<any>(this.url.searchRoleByUser,body)
        .pipe(
                tap(res => {
                    console.log('fetched searchRoleByUser Api')
                    console.log(res)
                }),
                catchError( error => {
                    console.error(error);
                    return of(error)
                })
        )
    }

 
}
