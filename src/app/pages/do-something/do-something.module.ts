import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../../shared/shared.module';
import { DoSomethingRoutingModule } from './do-something-routing.module';
import { DoSomethingComponent } from './do-something/do-something.component';


@NgModule({
  declarations: [DoSomethingComponent],
  imports: [
    CommonModule,
    SharedModule,
    DoSomethingRoutingModule
  ]
})

export class DoSomethingModule { }
