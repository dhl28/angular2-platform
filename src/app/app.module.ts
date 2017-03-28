import { NgModule, ApplicationRef } from '@angular/core';
import {SharedModule} from  './shared/shared.module'
import { removeNgStyles, createNewHosts, createInputTransfer } from '@angularclass/hmr';
import { HttpModule, Http, XHRBackend, RequestOptions } from '@angular/http';

/*
 * Platform and Environment providers/directives/pipes
 */
import { ENV_PROVIDERS } from './environment';
import { AppRoutingModule } from './app.routes';
//service

/* Feature Modules */
import {CoreModule} from  './core/core.module';
import {PortalModule} from  './portal';
import {WorkbenchModule} from  './workbench';
import {LoginModule}   from './login/longin.module';

// App is our top level component
import { AppComponent } from './app.component';
import { PortalComponent } from './portal/portal.component';



import { APP_RESOLVER_PROVIDERS } from './app.resolver';
import { AppService, InternalStateType } from './app.service';
import { NoContentComponent } from './no-content';
import {AppRegistComponent} from './regist/app-regist.component';
import {RedirectorComponent} from './regist/redirector/redirector.component';
import {AgreementComponent} from './regist/agreement/agreement.component';
import {ForgetPassComponent} from './password/forget-pass.component';
import {ResetPassComponent} from './password/reset/reset-pass.component';
import {CustomHttp} from './core/customHttp.service'

// Application wide providers
const APP_PROVIDERS = [
  ...APP_RESOLVER_PROVIDERS,
  AppService
];
declare var jQuery:any;  //定义jquery

type StoreType = {
  state: InternalStateType,
  restoreInputValues: () => void,
  disposeOldHosts: () => void
};

/**
 * `AppModule` is the main entry point into Angular2's bootstraping process
 */
@NgModule({
  bootstrap: [ AppComponent ],
  declarations: [
    AppComponent,
    NoContentComponent,
    AppRegistComponent,
    AgreementComponent,
    RedirectorComponent,
    ForgetPassComponent,
    ResetPassComponent
  ],
  imports: [ // import Angular's modules
    CoreModule,
    SharedModule,
    PortalModule,
    WorkbenchModule,
    LoginModule,
    AppRoutingModule
  ],
  providers: [ // expose our Services and Providers into Angular's dependency injection
    ENV_PROVIDERS,
    APP_PROVIDERS,
    {
      provide: Http,
      useFactory: (backend: XHRBackend, defaultOptions: RequestOptions) => {
        return new CustomHttp(backend, defaultOptions);
      },
      deps: [ XHRBackend, RequestOptions]
    }
  ]
})
export class AppModule {
  constructor(public appRef: ApplicationRef, public appState: AppService) {}

  hmrOnInit(store: StoreType) {
    if (!store || !store.state) return;
    console.log('HMR store', JSON.stringify(store, null, 2));
    // set state
    this.appState._state = store.state;
    // set input values
    if ('restoreInputValues' in store) {
      let restoreInputValues = store.restoreInputValues;
      setTimeout(restoreInputValues);
    }

    this.appRef.tick();
    delete store.state;
    delete store.restoreInputValues;
  }

  hmrOnDestroy(store: StoreType) {
    const cmpLocation = this.appRef.components.map(cmp => cmp.location.nativeElement);
    // save state
    const state = this.appState._state;
    store.state = state;
    // recreate root elements
    store.disposeOldHosts = createNewHosts(cmpLocation);
    // save input values
    store.restoreInputValues  = createInputTransfer();
    // remove styles
    removeNgStyles();
  }

  hmrAfterDestroy(store: StoreType) {
    // display new elements
    store.disposeOldHosts();
    delete store.disposeOldHosts;
  }

}

