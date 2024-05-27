import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DirectiveModule } from '../directive';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PopupExampleComponent } from './popup-example/popup-example.component';


const components = [
  PopupExampleComponent
]

@NgModule({
    declarations: [components],
    exports: [components],
    imports: [
        CommonModule,
        RouterModule,
        FormsModule,
        ReactiveFormsModule,
        DirectiveModule,
        NgbModule
    ]
})
export class PopupModule { }
