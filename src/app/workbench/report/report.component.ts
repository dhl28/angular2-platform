import {Component, AfterViewInit, ViewChild,Input} from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Location } from '@angular/common';
import {ApiService} from '../../core/api.service';
import RptUtil from './report-util';


declare var $:any;

@Component({
  selector: 'report',
  styleUrls: ['./report.component.css'],
  templateUrl:'./report.component.html'
})
export class ReportComponent implements AfterViewInit {

  constructor(public apiService: ApiService,  private route: ActivatedRoute, private location: Location) {

  }
  // @Input() appPK;
  @Input() hideBreadcrumbs:boolean = false;
  @Input() recordPK:string;
  reportName;
  noContent:boolean = false;
  breadCrumbs = [];

  ngOnInit() {
    if(this.route.snapshot.params['recordPK'])
       this.recordPK = this.route.snapshot.params['recordPK'];
    this.loadData();
    this.breadCrumbs = [{name:'运行结果',link:'/workbench/app/running-result'}];
  }

  ngAfterViewInit() {
  }
  dealBreadcrumbs(){
    this.breadCrumbs.push({name:this.reportName});
  }
  //根据有没有appPK参数，返回不同的service方法
  getService(){
    return  this.apiService.getReportByRecordPK(this.recordPK);
  }

  loadData (){
    if(!this.recordPK) return;
    this.getService().then(data=>{
      if(data.rpt && data.rpt.div) {
        this.reportName = data.rpt.reportName;
        this.dealBreadcrumbs();
        RptUtil.renders(data.rpt,this.recordPK)
      }else {
        this.noContent = true;
      }
    });
  }

  goBack(){
    this.location.back();
  }
}
