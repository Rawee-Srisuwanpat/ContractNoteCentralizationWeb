import { Component,ViewChild, OnInit, ChangeDetectorRef, OnDestroy, AfterViewInit, SimpleChanges, OnChanges, DoCheck } from '@angular/core';
import { Subject, filter, firstValueFrom, lastValueFrom, switchMap, take, takeUntil, timer } from 'rxjs';
import { Subscription } from 'rxjs';
import { HeaderComponent } from '../header-menu/header-menu.component';

//import * as listCollection from '../../../assets/document'// /mock-data-collections.json

@Component({
    selector: 'app-layout',
    templateUrl: './layout.component.html',
    styleUrls: ['./layout.component.css']
})
export class LayoutComponent implements OnInit, OnDestroy,DoCheck  {
    private _mobileQueryListener: () => void;
    mobileQuery: MediaQueryList;
    userName: string = "";
    isAdmin: boolean = false;
    showNavbar: any;
    private autoLogoutSubscription: Subscription = new Subscription;
    destroyed$ = new Subject<void>();

    isShow : boolean = false
    text : string = ''

    is_toggle_side_menu: boolean =true 

    constructor() {

    }

    @ViewChild(HeaderComponent) header:HeaderComponent

    // ngOnChanges(changes: SimpleChanges) {
    //     console.log(changes)

    //     this.text = this.header.text 
    // }

    ngDoCheck(): void {
        //this.text = this.header.text 
        //console.log(this.header)
        if (this.header != undefined)
        {
            this.text = this.header.text
            this.is_toggle_side_menu = this.header.is_toggleSideMenu
        }
     }


    ngOnInit() {
        //this.text = 'from layout'
       
        //this.isShow = this.layout.isShow
        // this.isShow = this.header.is_toggleSideMenu
        
    }

    ngAfterViewInit(): void {
    //     console.log(this.header)
    //    this.text = this.header.text 

    }

    ngOnDestroy() {
       
    }

   
}
