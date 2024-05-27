import { Component,Input, OnInit, ChangeDetectorRef, OnDestroy, AfterViewInit, SimpleChanges, DoCheck, OnChanges } from '@angular/core';
import { MenuItem  ,PrimeIcons} from 'primeng/api';


import { Subject, filter, firstValueFrom, lastValueFrom, switchMap, take, takeUntil, timer } from 'rxjs';
import { Subscription } from 'rxjs';

//import * as listCollection from '../../../assets/document'// /mock-data-collections.json


import {TreeNode} from 'primeng/api'; 
import { Router } from '@angular/router';

@Component({
    selector: 'sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit, OnDestroy,DoCheck ,OnChanges {
    @Input() text_sidebar : string = ''

    @Input() isShowMenu : boolean = true
    private _mobileQueryListener: () => void;
    mobileQuery: MediaQueryList;
    userName: string = "";
    isAdmin: boolean = false;
    showNavbar: any;
    private autoLogoutSubscription: Subscription = new Subscription;
    destroyed$ = new Subject<void>();

    items: MenuItem[] | undefined;
    items2: MenuItem[] | undefined;

    itemsMenuRoleUser: MenuItem[] | undefined;

    data: TreeNode[];

    constructor(private router: Router) {

    }
    ngDoCheck(): void {
       // console.log(this.text_sidebar )
    }

    ngOnChanges(changes: SimpleChanges) {
        //console.log(this.text_sidebar )
        //console.log(this.isShowMenu )

        for (let property in changes) {
            if (property === 'count') {
              console.log('Previous:', changes[property].previousValue);
              console.log('Current:', changes[property].currentValue);
              console.log('firstChange:', changes[property].firstChange);
            } 
        }
    }

    ngOnInit() {
       


        this.items2 = [
            {
                
                label: 'Edit Profile',
                icon: 'pi pi-fw pi-home',
                routerLink: '/welcome'
                
            },
            {
                
                label: 'Role',
                icon: 'pi pi-fw pi-home',
                routerLink: '/welcome'
                
            },
            {
                
                label: 'Logout',
                icon: 'pi pi-fw pi-home',
                routerLink: '/welcome'
                
            }


        ]

        // this.items = [
        //     {
                
        //         label: 'Home',
        //         icon: 'pi pi-fw pi-home',
        //         routerLink: '/welcome'
                
        //     },
           
        //     {
        //         label: 'ContractNote',
        //         icon: 'pi pi-fw pi-pencil',
        //         items: [
        //             {
        //                 label: 'Transaction Contract Note',
        //                 icon: 'pi pi-fw pi-align-left',
        //                 routerLink: '/contract-note'
        //             },
        //             // {
        //             //     label: 'Right',
        //             //     icon: 'pi pi-fw pi-align-right'
        //             // },
        //             // {
        //             //     label: 'Center',
        //             //     icon: 'pi pi-fw pi-align-center'
        //             // },
        //             // {
        //             //     label: 'Justify',
        //             //     icon: 'pi pi-fw pi-align-justify'
        //             // }
        //         ]
        //     },
        //     {
        //         label: 'Log',
        //         icon: 'pi pi-fw pi-file',
        //         items: [
        //             {
        //                 label: 'Log API',
        //                 icon: 'pi pi-fw pi-user-plus',
        //                 routerLink: '/log-api'
        //             },
        //             {
        //                 label: 'Log login',
        //                 icon: 'pi pi-fw pi-user-minus',
        //                 routerLink: '/log-login'
        //             }
                  
        //         ]
        //     },
        //     {
        //         label: 'Master Data',
        //         icon: 'pi pi-fw pi-calendar',
        //         items: [
        //             {
        //                 label: 'System',
        //                 icon: 'pi pi-fw pi-pencil',
        //                 routerLink: '/master-system'
        //             }
        //         ]
        //     },
        //     {
        //         label: 'Administrator',
        //         icon: 'pi pi-fw pi-user',
        //         items: [
        //             {
        //                 label: 'Register',
        //                 icon: 'pi pi-fw pi-pencil',
        //                 routerLink: '/manage-register',
        //                 // items: [
        //                 //     {
        //                 //         label: 'Save',
        //                 //         icon: 'pi pi-fw pi-calendar-plus'
        //                 //     },
        //                 //     {
        //                 //         label: 'Delete',
        //                 //         icon: 'pi pi-fw pi-calendar-minus'
        //                 //     }
        //                 // ]
        //             },
        //             {
        //                 label: 'User',
        //                 icon: 'pi pi-fw pi-calendar-times',
        //                 routerLink: '/user',
        //                 // items: [
        //                 //     {
        //                 //         label: 'Remove',
        //                 //         icon: 'pi pi-fw pi-calendar-minus'
        //                 //     }
        //                 // ]
        //             },
        //             {
        //                 label: 'Role',
        //                 icon: 'pi pi-fw pi-calendar-times',
        //                 routerLink: '/role',
        //             }
        //         ]
        //     }
        // ];

        //**************************************** */

        this.itemsMenuRoleUser = [
            {
                
                label: 'Home',
                icon: 'pi pi-fw pi-home',
                routerLink: '/welcome'
                
            },
           
            {
                label: 'ContractNote',
                icon: 'pi pi-fw pi-pencil',
                items: [
                    {
                        label: 'Transaction Contract Note',
                        icon: 'pi pi-fw pi-align-left',
                        routerLink: '/contract-note'
                    },
                    // {
                    //     label: 'Right',
                    //     icon: 'pi pi-fw pi-align-right'
                    // },
                    // {
                    //     label: 'Center',
                    //     icon: 'pi pi-fw pi-align-center'
                    // },
                    // {
                    //     label: 'Justify',
                    //     icon: 'pi pi-fw pi-align-justify'
                    // }
                ]
            },
            {
                label: 'Log',
                icon: 'pi pi-fw pi-file',
                items: [
                    {
                        label: 'Log API',
                        icon: 'pi pi-fw pi-user-plus',
                        routerLink: '/log-api'
                    },
                    {
                        label: 'Log login',
                        icon: 'pi pi-fw pi-user-minus',
                        routerLink: '/log-login'
                    }
                  
                ]
            },
            {
                label: 'Master Data',
                icon: 'pi pi-fw pi-calendar',
                items: [
                    {
                        label: 'System',
                        icon: 'pi pi-fw pi-cog',
                        routerLink: '/master-system'
                    }
                ]
            }
        ];

        console.log(localStorage.getItem('Role'))
        if (localStorage.getItem('Role') == 'Admin' || true)
        {
            this.items =  [
                {
                    
                    label: 'Home',
                    icon: 'pi pi-fw pi-home',
                    routerLink: '/welcome'
                    
                },
               
                {
                    label: 'ContractNote',
                    icon: 'pi pi-fw pi-pencil',
                    items: [
                        {
                            label: 'Transaction Contract Note',
                            icon: 'pi pi-fw pi-align-left',
                            routerLink: '/contract-note'
                        },
                        // {
                        //     label: 'Right',
                        //     icon: 'pi pi-fw pi-align-right'
                        // },
                        // {
                        //     label: 'Center',
                        //     icon: 'pi pi-fw pi-align-center'
                        // },
                        // {
                        //     label: 'Justify',
                        //     icon: 'pi pi-fw pi-align-justify'
                        // }
                    ]
                },
                {
                    label: 'Log',
                    icon: 'pi pi-fw pi-file',
                    items: [
                        {
                            label: 'Log API',
                            icon: 'pi pi-fw pi-user-plus',
                            routerLink: '/log-api'
                        },
                        // {
                        //     label: 'Log login',
                        //     icon: 'pi pi-fw pi-user-minus',
                        //     routerLink: '/log-login'
                        // }
                      
                    ]
                },
                {
                    label: 'Master Data',
                    icon: 'pi pi-fw pi-calendar',
                    items: [
                        {
                            label: 'System',
                            icon: 'pi pi-fw pi-cog',
                            routerLink: '/master-system'
                        },
                        {
                            label: 'Setting Follow-up',
                            icon: 'pi pi-fw pi-user-plus ',
                            routerLink: '/setting-followup'
                        }
                    ]
                },
                {
                    label: 'Administrator',
                    icon: 'pi pi-fw pi-user',
                    items: [
                        {
                            label: 'Register',
                            icon: 'pi pi-fw pi-pencil',
                            routerLink: '/manage-register',
                            // items: [
                            //     {
                            //         label: 'Save',
                            //         icon: 'pi pi-fw pi-calendar-plus'
                            //     },
                            //     {
                            //         label: 'Delete',
                            //         icon: 'pi pi-fw pi-calendar-minus'
                            //     }
                            // ]
                        },
                        {
                            label: 'User',
                            icon: 'pi pi-fw pi-calendar-times',
                            routerLink: '/user',
                            // items: [
                            //     {
                            //         label: 'Remove',
                            //         icon: 'pi pi-fw pi-calendar-minus'
                            //     }
                            // ]
                        },
                        {
                            label: 'Role',
                            icon: 'pi pi-fw pi-calendar-times',
                            routerLink: '/role',
                        }
                    ]
                }
            ];
        }else{
            this.items = [
                {
                    
                    label: 'Home',
                    icon: 'pi pi-fw pi-home',
                    routerLink: '/welcome'
                    
                },
               
                {
                    label: 'ContractNote',
                    icon: 'pi pi-fw pi-pencil',
                    items: [
                        {
                            label: 'Transaction Contract Note',
                            icon: 'pi pi-fw pi-align-left',
                            routerLink: '/contract-note'
                        },
                        // {
                        //     label: 'Right',
                        //     icon: 'pi pi-fw pi-align-right'
                        // },
                        // {
                        //     label: 'Center',
                        //     icon: 'pi pi-fw pi-align-center'
                        // },
                        // {
                        //     label: 'Justify',
                        //     icon: 'pi pi-fw pi-align-justify'
                        // }
                    ]
                },
                {
                    label: 'Log',
                    icon: 'pi pi-fw pi-file',
                    items: [
                        {
                            label: 'Log API',
                            icon: 'pi pi-fw pi-user-plus',
                            routerLink: '/log-api'
                        },
                        // {
                        //     label: 'Log login',
                        //     icon: 'pi pi-fw pi-user-minus',
                        //     routerLink: '/log-login'
                        // }
                      
                    ]
                },
                {
                    label: 'Master Data',
                    icon: 'pi pi-fw pi-calendar',
                    items: [
                        {
                            label: 'System',
                            icon: 'pi pi-fw pi-pencil',
                            routerLink: '/master-system'
                        }
                    ]
                }
            ];


        }
      
        
    }

    


    ngOnDestroy() {
       
    }

    handleClick(event) {
        console.log(event)

        if (event.node.label == 'Data Structures')
            this.router.navigate(['/doSomething']);
        else if (event.node.label == 'Singly List')
            this.router.navigate(['/crud']);
        else
            this.router.navigate(['/welcome']);



    }

   
}
