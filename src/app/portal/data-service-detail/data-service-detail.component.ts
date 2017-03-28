import { Component ,Input } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Location } from '@angular/common';
import {ApiService} from "../../core/api.service";
import {link} from "fs";
declare var $: any;
@Component({
  selector: 'data-service',
  templateUrl:'./data-service-detail.component.html',
  styleUrls:['./data-service-detail.component.css']
})
export class DataServiceDetailComponent {
  constructor( public apiService: ApiService,  private route: ActivatedRoute, private location: Location) {

  }
  isLoggedIn: boolean = false;
  isLiked: boolean = null;
  numberlike: string = '0';
  apiPk: string = '';
  service = {};
  serviceResult = {};
  requestsampleParams = [];
  serviceResultColKeys = [];
  breadCrumbs = [{name:'数据服务',link:'portal/dataservice'},{name:'服务详情',link:null}];
  ngOnInit() {
    this.loadData();
  }
  dealBreadCrumbs(){
    this.breadCrumbs.push({name:this.service['category'],link:null});
  }
  loadData(){
    let pk = this.route.snapshot.params['pk'];
    this.apiPk = pk;
    this.getService(pk).then(data=>{
      if(data.error) return;
      this.isLoggedIn = data.isLoggedIn;
      this.isLiked = data.isLiked;
      let apiData = $.parseJSON(data.app ? data.app : {});
      console.log(apiData);
      this.service = {
        pk:pk,
        name:apiData.name ? apiData.name : '',
        note:apiData.comment ? apiData.comment : '',
        ts:apiData.ts ? apiData.ts : '',
        requestsample: apiData.requestsample ? apiData.requestsample : '',
        requesturl:apiData.requesturl ? apiData.requesturl : '',
        requestargs:apiData.requestargs ? apiData.requestargs : '',
        createTime:apiData.createTime ? apiData.createTime : '',
        returnfields:apiData.returnfields ? apiData.returnfields : '',
        requestmethod: apiData.requestmethod ? apiData.requestmethod : '',
        resultsample: apiData.resultsample ? apiData.resultsample : '',
        returntype: apiData.returntype ? apiData.returntype : '',
        category: apiData.category ? apiData.category : ''
      }
      this.serviceResult = $.parseJSON(apiData.resultsample ? apiData.resultsample : '');
      this.getReqSampleParams(apiData.requestsample ? apiData.requestsample : '');
      this.getReqSampleResultArray($.parseJSON(apiData.resultsample ? apiData.resultsample : ''))
      // this.dealBreadCrumbs();
    });

    this.getLikeCount(pk).then(data=>{
      if(data.error) return;
      console.log(data);
      if(data.liked === 'unlongin'){
        this.isLiked = false;
      }else{
        this.isLiked = data.liked;
      }
      this.numberlike = data.count;
    });
  }
  likeOrUnlike(){

    this.apiService.DsLikeOrUnlike(this.apiPk).then(data=> {
      if (!data.error) {
        this.isLiked = data.isLiked;
        this.numberlike = data.count;
      }
    })
  }
  getReqSampleParams(sapurl){
    var parray = sapurl.split('&');
    var nobj = {skey:'',svalue:''};
    nobj.skey = parray[0].substring(parray[0].indexOf('?') + 1).split('=')[0];
    nobj.svalue = parray[0].substring(parray[0].indexOf('?') + 1).split('=')[1];
    this.requestsampleParams.push(nobj);
    for(var i = 1;i < parray.length;i++){
      var nobjj = {skey:'',svalue:''};
      nobjj.skey = parray[i].split('=')[0];
      nobjj.svalue = parray[i].split('=')[1];
      this.requestsampleParams.push(nobjj);
    }
  }
  getReqSampleResultArray(obj){
    var datas = obj.result[0];
    this.serviceResultColKeys = Object.keys(datas);
  }
  getService(pk){
    return this.apiService.getDataServerDetail(pk);
  }
  goBack(){
    this.location.back();
  }
  getLikeCount(pk){
    return this.apiService.getLikeCount(pk);
  }
}
