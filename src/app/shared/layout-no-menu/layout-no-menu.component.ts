import { Component, OnInit, ChangeDetectorRef, OnDestroy, AfterViewInit } from '@angular/core';
import { Subject, filter, firstValueFrom, lastValueFrom, switchMap, take, takeUntil, timer } from 'rxjs';
import { Subscription } from 'rxjs';

//import * as listCollection from '../../../assets/document'// /mock-data-collections.json

@Component({
    selector: 'app-layout-no-menu',
    templateUrl: './layout-no-menu.component.html',
    styleUrls: ['./layout-no-menu.component.css']
})
export class LayoutNoMenuComponent implements OnInit, OnDestroy {
    private _mobileQueryListener: () => void;
    mobileQuery: MediaQueryList;
    userName: string = "";
    isAdmin: boolean = false;
    showNavbar: any;
    private autoLogoutSubscription: Subscription = new Subscription;
    destroyed$ = new Subject<void>();

    constructor() {

    }

    ngOnInit() {
        
    }

    ngOnDestroy() {
       
    }

   
}
