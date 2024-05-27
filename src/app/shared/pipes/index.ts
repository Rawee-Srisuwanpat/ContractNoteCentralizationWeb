import { NgModule } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';

import { TranFrommTypePipe } from './filter.pipe';

const IMPORT_PIPE = [
    TranFrommTypePipe
]

@NgModule({
  declarations: [...IMPORT_PIPE],
  imports: [
    CommonModule
  ],
  exports: [...IMPORT_PIPE],
  providers: [DecimalPipe]
})
export class PipesModule { }