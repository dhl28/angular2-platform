/*
 * Angular 2 decorators and services
 */
import {Component, ViewEncapsulation, ViewContainerRef} from '@angular/core';
import { Router,NavigationEnd } from '@angular/router';

import {AppService} from './app.service';
import Util = jasmine.Util;
import Utils from  './common/util';
// import '../../bower_components/bootstrap/dist/css/bootstrap.css';
declare var $: any;

/*
 * App Component
 * Top Level Component
 */
@Component({
  selector: 'app',
  encapsulation: ViewEncapsulation.None,
  styleUrls: [
    // './app.component.css'
  ],
  templateUrl: './app.component.html'
})
export class AppComponent {
  hideSpinner = true;
  logged = true;

  constructor(public viewContainerRef: ViewContainerRef, private router: Router,
              public appService: AppService) {
    // You need this small hack in order to catch application root view container ref
    this.viewContainerRef = viewContainerRef;
    router.events.subscribe((val) => {
      if(val instanceof NavigationEnd){
        $('body,html').animate({scrollTop: 0}, 500);
      }
    });

  }

  ngOnInit() {
    console.log('Initial App State', this.appService.state);
    this.appService.checkLogin();
    Utils.initGoTop();
    window.onresize = function () {
      Utils.adjustLayout();
    }
  }

}

/*
 * Please review the https://github.com/AngularClass/angular2-examples/ repo for
 * more angular app examples that you may copy/paste
 * (The examples may not be updated as quickly. Please open an issue on github for us to update it)
 * For help or questions please contact us at @AngularClass on twitter
 * or our chat on Slack at https://AngularClass.com/slack-join
 */
