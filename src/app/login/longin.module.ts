
import { NgModule}       from '@angular/core';
import { CommonModule }      from '@angular/common';
import {SharedModule} from '../shared/shared.module'
import { LoginRoutingModule }       from './login-routing.module';

import {LoginComponent} from './login.component'

@NgModule({
  imports:      [ CommonModule ,SharedModule,LoginRoutingModule],
  declarations: [ LoginComponent ],
  exports:      [  ],
  providers:    [  ]
})
export class LoginModule {

  // constructor (@Optional() @SkipSelf() parentModule: CoreModule) {
  //   if (parentModule) {
  //     throw new Error(
  //       'CoreModule is already loaded. Import it in the AppModule only');
  //   }
  // }
  //
  // static forRoot(config: UserServiceConfig): ModuleWithProviders {
  //   return {
  //     ngModule: CoreModule,
  //     providers: [
  //       {provide: UserServiceConfig, useValue: config }
  //     ]
  //   };
  // }
}
