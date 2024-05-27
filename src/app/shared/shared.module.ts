import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LayoutComponent } from './layout/layout.component';
import { HeaderComponent } from './header-menu/header-menu.component';
import { SidebarComponent } from './sidebar/sidebar.component';

import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { LayoutNoMenuComponent } from './layout-no-menu/layout-no-menu.component';
import { MenuModule } from 'primeng/menu';
import { PanelMenuModule } from 'primeng/panelmenu';

import {TreeModule} from 'primeng/tree';
import { CommonModule } from '@angular/common';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon'

import {MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import {MatCheckboxModule} from '@angular/material/checkbox'

import { SplitButtonModule } from 'primeng/splitbutton';
import { TabViewModule } from 'primeng/tabview';
import { TreeTableModule } from 'primeng/treetable';
import { PaginatorModule } from 'primeng/paginator';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';

import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { BlockUIModule } from 'primeng/blockui';
import { PanelModule } from 'primeng/panel';
import {AutoCompleteModule} from 'primeng/autocomplete';


const modules = [
    LayoutComponent,
]

@NgModule({
    imports: [
        RouterModule,
        FormsModule,    
        ReactiveFormsModule,
        ButtonModule,
        SplitButtonModule,
        DialogModule,
        MenuModule,
        PanelMenuModule,
        TreeModule,
        CommonModule,
        TabViewModule,
        ConfirmDialogModule, 
        TreeTableModule,
        PaginatorModule ,
        ToastModule,
        ProgressSpinnerModule,
        BlockUIModule,
        PanelModule,
        AutoCompleteModule,
        


        MatPaginatorModule,
        MatIconModule,
        MatTableModule,
        MatSortModule,
        MatCheckboxModule,
        

       

        
    ],
    declarations: [
        ...modules,
        [LayoutComponent],
        [HeaderComponent],
        [SidebarComponent],
        [LayoutNoMenuComponent],
    ],
    exports: [
        ...modules,
        FormsModule,
        ReactiveFormsModule,
        ButtonModule,
        SplitButtonModule,
        DialogModule,
        TabViewModule,
        ConfirmDialogModule,
        TreeTableModule,
        PaginatorModule,
        ToastModule,
        ProgressSpinnerModule,
        BlockUIModule,
        PanelModule,
        AutoCompleteModule,
        
        MenuModule,
        PanelMenuModule,
        TreeModule,
        CommonModule,
        MatPaginatorModule,
        MatIconModule,
        MatTableModule,
        MatSortModule,
        MatCheckboxModule,

        

    ]  
})
export class SharedModule { }
