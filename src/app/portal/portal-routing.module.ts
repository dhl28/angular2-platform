import { NgModule }     from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PortalComponent } from './portal.component';
import { NoContentComponent } from '../no-content';
import { DashboardComponent } from './dashboard';
import { AppMarketComponent } from './app-market';
import { DataServiceComponent } from './data-service';
import { AppDetailComponent } from './app-detail';
import { DataServiceDetailComponent } from './data-service-detail';
import { SearchResultComponent } from './search-result';

export const ROUTES: Routes = [
  { path: 'portal',
    component: PortalComponent,
    children: [
      { path: '',  component:DashboardComponent },
      { path: 'app-market',  component:AppMarketComponent },
      { path: 'dataservice',  component:DataServiceComponent },
      { path: 'app/:pk', component:AppDetailComponent},
      { path: 'dataservice/:pk', component:DataServiceDetailComponent},
      { path: 'search/:keyWord', component:SearchResultComponent},
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
export class PortalRoutingModule {}
