import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
//import * as moment from 'moment';

//import { AuthenticationService } from '../services/auth.service';
//import { NotificationService } from '../services/notification.service';

@Injectable()
export class AuthGuard implements CanActivate {

    constructor(private router: Router //,
        //private notificationService: NotificationService,
        //private authService: AuthenticationService
        ) { }

    canActivate() {
        //return false;
        // const user = this.authService.getCurrentUser();

        // if (user && user.expiration) {
            
        //     if (moment() < moment(user.expiration)) {
        //         return true;
        //     } else {
        //         //this.notificationService.openSnackBar('Your session has expired');
        //         this.router.navigate(['auth/login']);
        //         return false;
        //     }
        // }

        const aaa = localStorage.getItem('savedUser');

        if (aaa)
        {
            return true;
        }

        this.router.navigate(['/login']);
        return false;
    }
}
