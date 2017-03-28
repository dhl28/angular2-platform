import { NgModule }       from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { WorkbenchRoutingModule } from './workbench-routing.module';

import { WorkbenchComponent } from './workbench.component';
import { MyApplicationComponent } from './my-application';
import { RunningResultComponent } from './running-result';
import { HeaderComponent } from '../workbench/layout/header.component';
import { sideBarComponent } from './layout/side-bar.component';
import { ReportComponent } from './report';


@NgModule({
  imports: [
    SharedModule,
    WorkbenchRoutingModule
  ],
  declarations: [
    WorkbenchComponent,
    sideBarComponent,
    MyApplicationComponent,
    RunningResultComponent,
    HeaderComponent,
    // ReportComponent
  ]
})
export class WorkbenchModule {}
