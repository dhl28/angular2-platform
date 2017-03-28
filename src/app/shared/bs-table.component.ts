import {Component, Input, ElementRef, OnChanges, SimpleChange} from '@angular/core';
/*
 * We're loading this component asynchronously
 * We are using some magic with es6-promise-loader that will wrap the module with a Promise
 * see https://github.com/gdi2290/es6-promise-loader for more info
 */
declare var $: any;
@Component({
  selector: '.bs-table',
  styles: [`
  `],
  template: `
  `
})
export class BsTableComponent implements OnChanges {
  localState: any;
  @Input() bsOpts: {}

  constructor(private el: ElementRef) {
  }

  ngOnInit() {
    console.log('------');
    console.log(this.bsOpts);
    console.log('------');
    $(this.el.nativeElement).bootstrapTable(this.bsOpts);
  }

  ngOnChanges(changes: {[propKey: string]: SimpleChange}) {

  }

  loadData(data) {
    $(this.el.nativeElement).bootstrapTable('load',data);
  }


}
