import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LayoutComponent } from '../../shared/layout/layout.component';
import { ForgetPasswordComponent } from './forget-password/forget-password.component';

import {LoginComponent } from '../login/login/login.component'
import { LayoutNoMenuComponent } from 'src/app/shared/layout-no-menu/layout-no-menu.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutNoMenuComponent,
    children: [
      { path: '', component: ForgetPasswordComponent },
      //{ path: '/login', component: LoginComponent },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ForgetPasswordRoutingModule { }
