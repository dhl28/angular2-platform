import { NgModule }     from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { WorkbenchComponent } from './workbench.component';
import { MyApplicationComponent } from './my-application';
import { RunningResultComponent } from './running-result';
import { AppMarketComponent } from '../portal/app-market';
import { AppDetailComponent } from '../portal/app-detail';
import { NoContentComponent } from '../no-content';

import { ReportComponent } from './report';
//service
import { AuthGuard }  from '../login/auth-guard.service';

export const ROUTES: Routes = [
  { path: 'workbench',
    component: WorkbenchComponent,
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
    children: [
      { path: '',  component: MyApplicationComponent },
      { path: 'app-market',  component: AppMarketComponent },
      { path: 'app/running-result',  component: RunningResultComponent },
      { path: 'app/:pk', component:AppDetailComponent},
      { path: 'app-market/app/:pk', component:AppDetailComponent},
      { path: 'running-result/app/:pk', component:AppDetailComponent},
      { path: 'report/:recordPK',  component: ReportComponent },
      { path: '**',    component: NoContentComponent }
    ]
  }
];


@NgModule({
  imports: [
    RouterModule.forChild(ROUTES)
  ],
  exports: [
    RouterModule
  ]
})
export class WorkbenchRoutingModule {}
