import {Component, Input} from '@angular/core';
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'agreement',
  templateUrl:'./agreement.component.html',
  styleUrls: ['./agreement.component.css']
})
export class AgreementComponent {
  constructor(private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.initApps();
  }
  initApps (){
  }
}
