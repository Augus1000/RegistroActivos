import { LoginGuard } from './services/login-guard.service';
import { CreateAccountComponent } from './components/create-account/create-account.component';
import { LoginComponent } from './components/login/login.component';
import { GraphicsComponent } from './components/graphics/graphics.component';
import { ResumeComponent } from './components/resume/resume.component';

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RedirectGuard } from './services/redirect-guard.service';



const routes: Routes = [
  { path: 'resume', component: ResumeComponent, canActivate: [LoginGuard] },
  { path: 'graphics', component: GraphicsComponent, canActivate: [LoginGuard] },
  { path: 'login', component: LoginComponent, canActivate: [RedirectGuard] },
  { path: 'create-account', component: CreateAccountComponent, canActivate: [RedirectGuard] },
  { path: 'forgot-password', loadChildren: () => import('./components/forgot-password/forgot-password.module').then(m => m.ForgotPasswordModule) },

  { path: '**', pathMatch: 'full', redirectTo: 'resume' },

];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
