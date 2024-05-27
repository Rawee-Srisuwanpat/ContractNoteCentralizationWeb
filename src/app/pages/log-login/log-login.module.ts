import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../../shared/shared.module';

import { MatSlideToggleModule } from '@angular/material/slide-toggle';

import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { ButtonModule } from 'primeng/button';


import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast'

import { CalendarModule } from 'primeng/calendar';
import { MultiSelectModule } from 'primeng/multiselect';
import { LogLoginComponent } from './log-login/log-login.component';
import { LogLoginRoutingModule } from './log-login-routing.module';


@NgModule({
  declarations: [LogLoginComponent],
  imports: [
    CommonModule,
    SharedModule,
    LogLoginRoutingModule,

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

export class LogLoginModule { }
