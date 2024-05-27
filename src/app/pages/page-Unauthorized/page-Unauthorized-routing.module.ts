import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LayoutNoMenuComponent } from 'src/app/shared/layout-no-menu/layout-no-menu.component';
import { PageUnauthorizedComponent } from './page-Unauthorized/page-Unauthorized.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutNoMenuComponent,
    children: [
      { path: '', component: PageUnauthorizedComponent },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PageUnauthorizedRoutingModule { }
