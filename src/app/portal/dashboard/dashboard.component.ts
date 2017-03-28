import {Component} from '@angular/core';
import {Router}      from '@angular/router';
import Util from '../../common/util';
import {Headers, Http,Response, URLSearchParams} from '@angular/http';
import {ApiService} from '../../core/api.service';
import {StaticResourceService} from '../../core/static-resource.service';

var toastr = require('toastr');

@Component({
  selector: 'portal',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  constructor(public router: Router,private http: Http,public apiService: ApiService,
              public staticResourceService: StaticResourceService,) {

  }

  expected = '敬请期待';
  services = [];
  apiList = [];
  appList = [];
  ngOnInit() {
    this.loadJsonFile();
  }
  loadJsonFile(){
    this.staticResourceService.getAppConfig().subscribe(d => {
      console.log(d);
      this.appList = d;
    });
    this.staticResourceService.getApiConfig().subscribe(d => {
      console.log(d);
      let list = [];
      d.map(api=>{
        list = list.concat(api.children);
      });
      this.apiList = list;
      console.log(this.apiList);
    });
  }
  getAppByName(name){
    let _ = require('lodash');
    let app = this.appList.find(d=> name === d['appName'] )
    return app;
  }
  getApiByName(name){
    let _ = require('lodash');
    let api = this.apiList.find(d=> name === d['apiName'] )
    return api;
  }

  viewApp(item){
    if(!item) return;
    this.router.navigate(['/portal/app',item.pk])
  }
  viewApiDetail(e){
    debugger;
    let apiName = e.target.innerText;
    let api = this.getApiByName(apiName);
    if(api){
      this.router.navigate(['/portal/dataservice',api.apiPk])
    }else{
      Util.showMessage('该API暂时不可用','error');
    }
  }
}
