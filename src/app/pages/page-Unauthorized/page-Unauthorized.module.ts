import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../../shared/shared.module';
import { PageUnauthorizedComponent } from './page-Unauthorized/page-Unauthorized.component';
import { PageUnauthorizedRoutingModule } from './page-Unauthorized-routing.module';


@NgModule({
  declarations: [PageUnauthorizedComponent],
  imports: [
    CommonModule,
    SharedModule,
    PageUnauthorizedRoutingModule
  ]
})

export class PageUnauthorizedModule { }
