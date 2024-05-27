import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, delay, map, tap } from 'rxjs/operators';

import { of, EMPTY, Observable } from 'rxjs';
import { ApiUrl } from './api-url.service';
import { MasterResModel } from '../model/Master/MasterResModel';


@Injectable({
    providedIn: 'root'
})
export class MasterService {

    masterResModel : MasterResModel[] = []

    constructor(private http: HttpClient ,private url : ApiUrl) {}

    GetAllMaster() {
        //const body = null
        return this.http.post<any>(this.url.getAllMaster,null)
        .pipe(
                tap(res => {
                    console.log('fetched GetAllMaster Api')
                    console.log(res)
                    
                }),
                catchError( error => {
                    console.error(error);
                    return of(error)
                })
        )
    }

    GetAllActionCode() {
        //const body = null
        return this.http.post<any>(this.url.getAllActionCode,null)
        .pipe(
                tap(res => {
                    console.log('fetched GetAllActionCode Api')
                    console.log(res)
                    
                }),
                catchError( error => {
                    console.error(error);
                    return of(error)
                })
        )
    }

    GetAllResultCode() {
        //const body = null
        return this.http.post<any>(this.url.getAllResultCode,null)
        .pipe(
                tap(res => {
                    console.log('fetched GetAllResultCode Api')
                    console.log(res)
                    
                }),
                catchError( error => {
                    console.error(error);
                    return of(error)
                })
        )
    }

    GetAllCollectorTeamCode() {
        //const body = null
        return this.http.post<any>(this.url.getAllCollectorTeamCode,null)
        .pipe(
                tap(res => {
                    console.log('fetched GetGetAllCollectorTeamCode Api')
                    console.log(res)
                    
                }),
                catchError( error => {
                    console.error(error);
                    return of(error)
                })
        )
    }

    GetAllCollectorCode() {
        //const body = null
        return this.http.post<any>(this.url.getAllCollectorCode,null)
        .pipe(
                tap(res => {
                    console.log('fetched GetGetAllCollectorCode Api')
                    console.log(res)
                    
                }),
                catchError( error => {
                    console.error(error);
                    return of(error)
                })
        )
    }

   

 
}
