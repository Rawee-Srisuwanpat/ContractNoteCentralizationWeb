import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../../shared/shared.module';
import { CEUDExampleRoutingModule } from './crud-example-routing.module';
import { CEUDExampleComponent } from './crud-example/crud-example.component';


@NgModule({
  declarations: [CEUDExampleComponent],
  imports: [
    CommonModule,
    SharedModule,
    CEUDExampleRoutingModule
  ]
})

export class CEUDExampleModule { }
