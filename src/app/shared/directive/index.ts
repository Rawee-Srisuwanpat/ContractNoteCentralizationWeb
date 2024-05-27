import { NgModule } from '@angular/core';
import { MyOffClickDirective } from './OffClick.directive';
import { NgbdSortableHeader } from './Sortable.directive';

const IMPORT_DIRECTIVE = [
  MyOffClickDirective,
  NgbdSortableHeader
]

@NgModule({
  declarations: [...IMPORT_DIRECTIVE],
  imports: [],
  exports: [...IMPORT_DIRECTIVE]
})
export class DirectiveModule { }