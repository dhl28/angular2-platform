import {Component, Input} from '@angular/core';
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'redirector',
  templateUrl:'./redirector.component.html',
  styleUrls:['./redirector.component.css']
})

export class RedirectorComponent {
  message: string = null;
  firstUrls: string = '';
  constructor(private route: ActivatedRoute) {
  }
  ngOnInit() {
    this.initApps();
  }
  initApps (){
    var url = window.location.toString();
    console.log(url);
    var info = url.split('=');
    this.message = decodeURI(info[info.length - 1]);
    this.firstUrls = url.split('/re')[0];
    window.setTimeout("window.location='/cloud'",3000);
  }
}
