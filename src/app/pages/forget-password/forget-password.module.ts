import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../../shared/shared.module';
import { ForgetPasswordRoutingModule } from './forget-password-routing.module';
import { ForgetPasswordComponent } from './forget-password/forget-password.component';


@NgModule({
  declarations: [ForgetPasswordComponent],
  imports: [
    CommonModule,
    SharedModule,
    ForgetPasswordRoutingModule
  ]
})

export class ForgetPasswordModule { }
