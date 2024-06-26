import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { LayoutNoMenuComponent } from 'src/app/shared/layout-no-menu/layout-no-menu.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutNoMenuComponent,
    children: [
      { path: '', component: PageNotFoundComponent },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PageNotFoundRoutingModule { }
