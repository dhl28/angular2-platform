/**
 * Created by dhl on 2017/1/3.
 */
/**
 * Created by dhl on 2016/10/28.
 */
import {Component,EventEmitter, Output, Input} from '@angular/core';
import {Router, ActivatedRoute, Params} from '@angular/router';

@Component({
  selector: 'bread-crumbs',
  templateUrl: './bread-crumbs.component.html'
})
export class BreadCrumbs {
  constructor(private router: Router){

  }
  @Input() breadCrumbs = [];
  @Input() hidden = false;
  linkTo(item){
    if(item.link){
      this.router.navigate([item.link]);
    }
  }
}
