/**
 * Created by dhl on 2017/1/3.
 */
/**
 * Created by dhl on 2016/10/28.
 */
import {Component,EventEmitter, Output, Input} from '@angular/core';

@Component({
  selector: 'loading-effect',
  templateUrl: './loading-effect.component.html'
})
export class LoadingEffect {
  constructor(){

  }
  @Input() isLoading = false;

}
