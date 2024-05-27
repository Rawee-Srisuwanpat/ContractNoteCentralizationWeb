import { Component,ViewChild, OnInit, ChangeDetectorRef, OnDestroy, AfterViewInit } from '@angular/core';
import { Subject, filter, firstValueFrom, lastValueFrom, switchMap, take, takeUntil, timer } from 'rxjs';
import { Subscription } from 'rxjs';
import * as $ from 'jquery'
import { AuthenticationService } from 'src/app/core/services/auth.service';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { LayoutComponent } from '../layout/layout.component';
import { MenuItem } from 'primeng/api';



//import * as listCollection from '../../../assets/document'// /mock-data-collections.json

@Component({
    selector: 'header-menu',
    templateUrl: './header-menu.component.html',
    styleUrls: ['./header-menu.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {

     
    private _mobileQueryListener: () => void;
    mobileQuery: MediaQueryList;
    userName: string = "";
    isAdmin: boolean = false;
    showNavbar: any;
    private autoLogoutSubscription: Subscription = new Subscription;
    destroyed$ = new Subject<void>();
    istoggle: boolean = false

    is_toggleSideMenu: boolean = true

    text : string = ''
    items2: MenuItem[] | undefined;



    constructor(private authenService :AuthenticationService) {

    }

    ngOnInit() {
        this.userName =  localStorage.getItem('savedUser');
        this.items2 = [
            // {
                
            //     label: 'Edit Profile',
            //     icon: 'pi pi-fw pi-pencil',
            //     //routerLink: '/welcome'
                
            // },
            // {
                
            //     label: 'Role',
            //     icon: 'pi pi-fw pi-home',
            //     //routerLink: '/welcome'
                
            // },
            {
                
                label: 'Logout',
                icon: 'bi bi-arrow-right-square-fill',
                routerLink: '/',
                command: () => this.logout(),
                
            }


        ]
    }

    ngOnDestroy() {
       
    }

    toggle() {
        console.log('aaaaaaaa')
        this.istoggle = !this.istoggle
    }

    toggleSideMenu() {
        this.text = 'toggleSideMenu'
        //this.layout.isShow = !this.is_toggleSideMenu
        console.log('bbb')
        
        this.is_toggleSideMenu = !this.is_toggleSideMenu



        // if (this.is_toggleSideMenu ){
        //     $('.sidebarleft').addClass('sidebarleft closebar')
        //     $('.content').addClass('content closecontent')
        // }else{
        //     $('.sidebarleft').removeClass('closebar')
        //     $('.content').removeClass('closecontent')
        // }

    }

    logout() {
        this.authenService.logout()
    }
}
