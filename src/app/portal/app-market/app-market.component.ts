import { Component } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {ApiService} from "../../core/api.service";

declare var $:any;

@Component({
  selector: 'app-market',
  templateUrl:'./app-market.component.html',
  styleUrls:['./app-market.component.css']
})
export class AppMarketComponent {
  constructor(public apiService: ApiService,  private route: ActivatedRoute) {

  }
  appTypes = [];
  typePk = 'allAppTab';
  showApps = [];
  isLoading:boolean = false;
  showPagination = true;
  keyWord = '';
  sortName = 'DATETIME';
  isDesc = true;
  isPlatform = false;
  //pagination
  public totalItems: number = 0;
  public currentPage: number = 1;
  public itemsPerPage: number = 12;

  public maxSize: number = 5;

  public pageChanged(event: any): void {
    this.pageListofAppFac(event.page,this.typePk);
  };
  public numPages(event: any): void {
  };

  getPaginationParam() {
    return {
      pageSize: this.itemsPerPage,
      pageIndex: this.currentPage,
      sortFieldName: this.sortName,
      isDesc: this.isDesc
    }
  }

  pageListofAppFac(pageIndex = null,typepk) {
    this.isLoading = true;
    this.showApps = [];
    let paginationParam = this.getPaginationParam();
    if (pageIndex != null) {
      paginationParam.pageIndex = pageIndex;
    }
    if(!this.showPagination){
      this.showPagination = true;
    }
    this.apiService.getAppsFactoryPageList(paginationParam,typepk,this.keyWord).then(data=> {
      console.log(data.showApps);
      this.isLoading = false;
      this.totalItems = data.total ? data.total : 0;
      this.showApps = data.showApps;
    });
  }
  ngOnInit() {
    this.initApps();
  }

  initApps (){
    let url = window.location.href;
    if(url.indexOf('/workbench/') > -1){
      this.isPlatform = true;
    }
    this.getService().then(data=>{
      console.log(data);
      this.appTypes = this.getAppData(data);
    });
  }
  getService(){
    return this.apiService.getAppTypeList();
  }

  getAppData(data){
    let services = [];
    services.push({
      pk:'allAppTab',
      name:'全部应用',
      children: this.pageListofAppFac(1,'allAppTab')
    });
    for(let i in data){
      services.push({
        pk:data[i].pk,
        name:data[i].name
      });
    }
    return services;
  }
  getAppsByTypepk(typepk){
    this.currentPage = 1;
    this.typePk = typepk;
    let paginationParam = this.getPaginationParam();
    this.apiService.getAppsFactoryPageList(paginationParam,typepk,this.keyWord).then(data=> {
      this.isLoading = false;
      this.totalItems =  data.total ? data.total : 0;
      this.showApps = data.showApps;
    });
  }
  orderByTime(){
    this.sortName = 'DATETIME';
    if(this.isDesc){
      this.isDesc = false;
    }else{
      this.isDesc = true;
    }
    this.pageListofAppFac(null,this.typePk);
  }
  orderByHeat(){
    this.sortName = 'DEGREEOFHEAT';
    if(this.isDesc){
      this.isDesc = false;
    }else{
      this.isDesc = true;
    }
    this.pageListofAppFac(null,this.typePk);
  }
  keyDown(e) {
    if (e.keyCode === 13) {
      this.search()
    }
  }
  search() {
    this.pageListofAppFac(null,this.typePk);
  }
}
