import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../../shared/shared.module';
import { TaskRoutingModule } from './task-routing.module';
import { TaskComponent } from './task/task.component';

import { MatSlideToggleModule } from '@angular/material/slide-toggle';

import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { ButtonModule } from 'primeng/button';


import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast'

import { CalendarModule } from 'primeng/calendar';
import { MultiSelectModule } from 'primeng/multiselect';


@NgModule({
  declarations: [TaskComponent],
  imports: [
    CommonModule,
    SharedModule,
    TaskRoutingModule,

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

export class TaskModule { }
