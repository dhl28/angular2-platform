import { NgModule }     from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AppRegistComponent} from './regist/app-regist.component';
import {RedirectorComponent} from './regist/redirector/redirector.component';
import {AgreementComponent} from './regist/agreement/agreement.component';
import {ForgetPassComponent} from './password/forget-pass.component';
import {ResetPassComponent} from './password/reset/reset-pass.component';
import { NoContentComponent } from './no-content';

import { DataResolver } from './app.resolver';


export const ROUTES: Routes = [
  { path: '', redirectTo: 'portal',pathMatch:'full' },
  { path: 'register',  component:AppRegistComponent },
  { path: 'redirector',  component:RedirectorComponent },
  { path: 'agreement',  component:AgreementComponent },
  { path: 'forgetPass',  component:ForgetPassComponent },
  { path: 'resetPass',  component:ResetPassComponent },
  { path: '**',    redirectTo: 'portal' }
];


@NgModule({
  imports: [
    RouterModule.forRoot(ROUTES)
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule {}
