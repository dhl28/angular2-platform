import {NgModule}            from '@angular/core';
import {CommonModule}   from '@angular/common';
import {BrowserModule} from '@angular/platform-browser';
import {FormsModule} from '@angular/forms';
import {HttpModule, JsonpModule} from '@angular/http';
import {RouterModule} from '@angular/router';
//third party module
import {Ng2BootstrapModule} from 'ng2-bootstrap/ng2-bootstrap';
//common component
import {BsTableComponent} from './bs-table.component';
import {MsgModalComponent} from './msg-modal.component';
// import {HeaderComponent} from '../workbench/layout/header.component';
import {footerComponent} from '../workbench/layout/footer.component';
import {ReportComponent} from '../workbench/report';
import {AppRunModalComponent} from '../portal/app-detail/app-run-modal';
import {BreadCrumbs} from './bread-crumbs';
import {LoadingEffect} from './loading-effect';

@NgModule({
  imports: [
    BrowserModule,
    CommonModule,
    FormsModule,
    HttpModule,
    JsonpModule,
    RouterModule,
    Ng2BootstrapModule],
  declarations: [BsTableComponent,
    MsgModalComponent,
    footerComponent,
    ReportComponent,
    AppRunModalComponent,
    BreadCrumbs,
    LoadingEffect
  ],
  exports: [
    BrowserModule,
    CommonModule,
    FormsModule,
    HttpModule,
    JsonpModule,
    RouterModule,
    Ng2BootstrapModule,
    BsTableComponent,
    MsgModalComponent,
    footerComponent,
    ReportComponent,
    AppRunModalComponent,
    BreadCrumbs,
    LoadingEffect
  ]
})
export class SharedModule {
}
