import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

//import { LayoutComponent } from '../../shared/layout/layout.component';
import { LoginComponent } from './login/login.component';
import { LayoutNoMenuComponent } from 'src/app/shared/layout-no-menu/layout-no-menu.component';

const routes: Routes = [
  {
    path: '',
    //component: LayoutComponent,
    component: LayoutNoMenuComponent,
    children: [
      { path: '', component: LoginComponent },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LoginRoutingModule { }
