import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';


@Injectable({
    providedIn: 'root',
})
export class PermissionRegisterService {



    is_view: boolean = false
    is_edit: boolean = false
    is_delete: boolean = false
    is_create: boolean = false


    constructor() {
    }

    readPermission(screen: string) : Observable<any> {
        const role_obj = JSON.parse(localStorage.getItem('Role_obj'))

        console.log(role_obj.screens)
        if (role_obj.screens == undefined) {
            console.log('screens undefined')
            this.is_view = false
            this.is_edit = false
            this.is_delete = false
            this.is_create = false

            return of(true)

        } else {
            console.log(screen)

            const actions_obj = role_obj.screens.filter(x => x.Screen_name == screen)

            if (actions_obj[0] == undefined) {
                this.is_view = false
                this.is_edit = false
                this.is_delete = false
                this.is_create = false
            }

            console.log(actions_obj[0]?.actions)

            actions_obj[0]?.actions.forEach(element => {
                console.log(element)
                if (element.Action_name == 'View') {
                    this.is_view = true
                }

                if (element.Action_name == 'Edit') {
                    this.is_edit = true
                }

                if (element.Action_name == 'Delete') {
                    this.is_delete = true
                }

                if (element.Action_name == 'Save') {
                    this.is_create = true
                }

            })

            return of(true)


        }


    }

    getViewPermission() {
        
        return this.is_view
    }

    getEditPermission() {
        return this.is_edit
    }

    getDeletePermission() {
        return this.is_delete
    }

    getCreatePermission() {
        return this.is_create
    }


}