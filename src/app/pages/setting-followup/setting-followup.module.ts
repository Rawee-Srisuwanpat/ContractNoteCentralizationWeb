import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../../shared/shared.module';
import { SettingFollowUpRoutingModule } from './setting-followup-routing.module';
import { SettingFollowUpComponent } from './setting-followup/setting-followup.component';

import { MatSlideToggleModule } from '@angular/material/slide-toggle';

import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { ButtonModule } from 'primeng/button';


import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast'

import { CalendarModule } from 'primeng/calendar';
import { MultiSelectModule } from 'primeng/multiselect';
import { ActionCodeComponent } from 'src/app/shared/components/action-code/action-code.component';



@NgModule({
  declarations: [
    SettingFollowUpComponent ,
    ActionCodeComponent 
  ],
  imports: [
    CommonModule,
    SharedModule,
    SettingFollowUpRoutingModule,
   

    MatSlideToggleModule,
    MatInputModule,
    MatFormFieldModule,
    MatTableModule,
    ButtonModule,
    ConfirmDialogModule,
    ToastModule,
    CalendarModule,
    MultiSelectModule,
    
    
  ]
})

export class SettingFollowUpModule { }
