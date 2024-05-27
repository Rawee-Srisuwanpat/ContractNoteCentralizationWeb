import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LayoutComponent } from '../../shared/layout/layout.component';
import { RegisterComponent } from './register/register.component';
import { LayoutNoMenuComponent } from 'src/app/shared/layout-no-menu/layout-no-menu.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutNoMenuComponent,
    children: [
      { path: '', component: RegisterComponent },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RegisterRoutingModule { }
