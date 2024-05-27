import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';


const routes: Routes = [
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then(m => m.LoginModule),
    //canActivate: [AuthGuard]
  },
  {
    path: 'forgetpassword',
    loadChildren: () => import('./pages/forget-password/forget-password.module').then(m => m.ForgetPasswordModule),
    //canActivate: [AuthGuard]
  },
  {
    path: 'resetpassword',
    loadChildren: () => import('./pages/reset-password/reset-passwprd.module').then(m => m.ResetPasswordModule),
    //canActivate: [AuthGuard]
  },
  {
    path: 'register',
    loadChildren: () => import('./pages/register/register.module').then(m => m.RegisterModule),
    //canActivate: [AuthGuard]
  },
  {
    path: 'doSomething',
    loadChildren: () => import('./pages/do-something/do-something.module').then(m => m.DoSomethingModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'crud',
    loadChildren: () => import('./pages/crud/crud.module').then(m => m.CrudModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'contract-note',
    loadChildren: () => import('./pages/contract-note/contract-note.module').then(m => m.ContractNoteModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'contract-note-detail',
    loadChildren: () => import('./pages/contract-note-detail/contract-note-detail.module').then(m => m.ContractNoteDetailModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'master-system',
    loadChildren: () => import('./pages/master-system/master-system.module').then(m => m.MasterSystemModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'setting-followup',
    loadChildren: () => import('./pages/setting-followup/setting-followup.module').then(m => m.SettingFollowUpModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'log-api',
    loadChildren: () => import('./pages/log-api/log-api.module').then(m => m.LogApiModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'log-login',
    loadChildren: () => import('./pages/log-login/log-login.module').then(m => m.LogLoginModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'role',
    loadChildren: () => import('./pages/role/role.module').then(m => m.RoleModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'user',
    loadChildren: () => import('./pages/user/user.module').then(m => m.UserModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'manage-register',
    loadChildren: () => import('./pages/manage-register/manage-register.module').then(m => m.ManageRegisterModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'task',
    loadChildren: () => import('./pages/task/task.module').then(m => m.TaskModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'welcome',
    loadChildren: () => import('./pages/welcome/welcome.module').then(m => m.WelcomeModule),
    canActivate: [AuthGuard]
  },
  {
    path: '404',
    loadChildren: () => import('./pages/page-not-found/page-not-found.module').then(m => m.PageNotFoundModule),
    //canActivate: [AuthGuard]
  },
  {
    path: '401',
    loadChildren: () => import('./pages/page-Unauthorized/page-Unauthorized.module').then(m => m.PageUnauthorizedModule),
    //canActivate: [AuthGuard]
  },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: '**',
    redirectTo: '404',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
