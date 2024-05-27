import { NgModule } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FooterComponent } from './footer/footer.component';
import { HeaderComponent } from './header/header.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { DirectiveModule } from '../directive';
import { NgTableComponent } from './ng-table/ng-table.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PipesModule } from "../pipes/index";


const components = [
  HeaderComponent,
  SidebarComponent,
  FooterComponent,
  NgTableComponent ,

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
        NgbModule,
        DecimalPipe,
        PipesModule
    ]
})
export class ComponentsModule { }
