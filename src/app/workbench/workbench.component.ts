import { Component } from '@angular/core';
import Util from '../common/util';
declare var $:any;

@Component({
  selector: 'workbench',
  templateUrl:'./workbench.component.html'
})
export class WorkbenchComponent {
  constructor() {

  }

  ngOnInit() {
    Util.adjustLayout();
  }

}
