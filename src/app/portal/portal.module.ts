import { NgModule }       from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { PortalRoutingModule } from './portal-routing.module';

import { PortalComponent } from './portal.component';
import {HeaderComponent} from './layout/header.component';
import { DashboardComponent } from './dashboard';
import { AppMarketComponent } from './app-market';
import { DataServiceComponent } from './data-service';
import { DataServiceDetailComponent } from './data-service-detail';
import { AppDetailComponent } from './app-detail';
import { BannerComponent } from './dashboard/banner';
import { AppUnitComponent } from './dashboard/app-unit';
import { ServiceUnitComponent } from './dashboard/service-unit';
import { SearchResultComponent } from './search-result';


// import { HeaderComponent } from './layout/header.component';

@NgModule({
  imports: [
    SharedModule,
    PortalRoutingModule,
  ],
  exports:[
    AppMarketComponent,
    DataServiceComponent,
    AppUnitComponent,
    AppDetailComponent,
    ServiceUnitComponent
  ],
  declarations: [
    PortalComponent,
    HeaderComponent,
    DashboardComponent,
    AppMarketComponent,
    DataServiceComponent,
    BannerComponent,
    AppUnitComponent,
    ServiceUnitComponent,
    AppDetailComponent,
    DataServiceDetailComponent,
    SearchResultComponent
  ]
})
export class PortalModule {}
