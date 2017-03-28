import { Component } from '@angular/core';
import Util from '../common/util';
declare  var $:any;
@Component({
  selector: 'portal',
  templateUrl:'./portal.component.html',
  styles:['']
})
export class PortalComponent {
  constructor() {

  }

  ngOnInit() {
    Util.adjustLayout();
  }

}
