import {Component} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {ApiService} from "../../core/api.service";

@Component({
  selector: 'data-service',
  templateUrl:'./data-service.component.html',
  styleUrls:['./data-service.component.css']
})
export class DataServiceComponent {
  constructor(public apiService: ApiService,  private route: ActivatedRoute) {
  }
  services = [];
  appTypes = [];
  typePk = '全部应用';
  showApps;
  isLoading:boolean = false;
  showPagination = true;
  sortName = 'ts';
  isDesc = true;
  //pagination
  public totalItems: number = 0;
  public currentPage: number = 1;
  public itemsPerPage: number = 5;

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
    //this.appTypes = [];
    let paginationParam = this.getPaginationParam();
    if (pageIndex != null) {
      paginationParam.pageIndex = pageIndex;
    }
    if(!this.showPagination){
      this.showPagination = true;
    }
    this.apiService.getDataServicesPageList(paginationParam,typepk).then(data=> {
      console.log(data.APIList);
      this.isLoading = false;
      this.totalItems = data.total ? data.total : 0;
      this.showApps = data.APIList;
    });
  }
  ngOnInit() {
    this.initApps();
  }

  getAppTypes(){
    return this.apiService.getDataServerList();
  }
  initApps (){
    this.getAppTypes().then(data=>{
      if(data.error) return;
      this.appTypes = this.getDataCategory(data);
      this.getAppsByTypepk('全部应用');
    });
  }
  getDataCategory(data){
    var tmp0 = [];
    var tmp = [];
    for(var j in data){
      if(tmp0.indexOf(data[j].category) === -1){
        tmp0.push(data[j].category);
      }
    }
    tmp.push({
      pk:'allAppTab',
      name:'全部应用'
    });
    for(var i in tmp0){
      tmp.push({
        pk:'00'+ i,
        name:tmp0[i]
      });
    }
    return tmp;
  }
  getAppsByTypepk(typepk){
    this.isLoading = true;
    this.currentPage = 1;
    this.typePk = typepk;
    let paginationParam = this.getPaginationParam();
    this.apiService.getDataServicesPageList(paginationParam,typepk).then(data=> {
      this.isLoading = false;
      this.totalItems =  data.total ? data.total : 0;
      this.showApps = data.APIList;
      console.log(this.showApps);
    });
  }
  orderByTime(){
    this.sortName = 'ts';
    if(this.isDesc){
      this.isDesc = false;
    }else{
      this.isDesc = true;
    }
    this.pageListofAppFac(null,this.typePk);
  }
  orderByHeat(){
    this.sortName = 'create_time';
    if(this.isDesc){
      this.isDesc = false;
    }else{
      this.isDesc = true;
    }
    this.pageListofAppFac(null,this.typePk);
  }
}
