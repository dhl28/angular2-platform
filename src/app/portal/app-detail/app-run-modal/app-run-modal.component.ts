import {Component, AfterViewInit, ViewChild,Input,Output,EventEmitter} from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ModalDirective } from 'ng2-bootstrap/components/modal/modal.component';
import {ApiService} from '../../../core/api.service';
import Util from '../../../common/util';


declare var $:any;

@Component({
  selector: 'app-run-modal',
  styleUrls: [],
  templateUrl:'./app-run-modal.component.html'
})
export class AppRunModalComponent implements AfterViewInit {

  constructor(public apiService: ApiService,  private route: ActivatedRoute) {

  }
  @Input() app;
  @Output() afterAppRun = new EventEmitter<boolean>();

  wfVars:any = [];
  validationMsg = [];

  @ViewChild('staticModal')
  public childModal: ModalDirective;

  public showChildModal(): void {
    this.wfVars = [];
    this.childModal.show();
    this.loadData();

  }

  public hideChildModal(): void {
    this.childModal.hide();
  }

  ngOnInit() {
   console.log(this.app);
  }

  ngAfterViewInit() {

  }
  loadData (){
    this.apiService.getWFVars(this.app.pk).then(data=>{
      this.wfVars = data.wfVars;
    })
  }

  //运行app - 执行请求
  doRunApp(){
    if(!this.validateWfVar()) {
      return;
    }
    this.app.state = 'RUNNING';
    this.apiService.ruApp(this.app.pk,this.wfVars).then(d=> {
      if(!d.info && !d.error){
        Util.showMessage('已成功添加运行任务，请到“我的工作台 > 运行结果”中查看');
        this.afterAppRun.emit(true);
      }

    })

    this.hideChildModal();
  }

  getVarTpeChs(item){
    let varTpeChs:string;
    switch (item.varType){
      case 'DOUBLE':varTpeChs = '浮点型';break;
      case 'INTEGER':varTpeChs = '整型';break;
      case 'STRING':varTpeChs = '字符型';break;
      case 'DATE':varTpeChs = '日期型';break;
      default: varTpeChs = '-';
    }
    return varTpeChs;
  }
  validateWfVar(){
    this.validationMsg = [];
    this.wfVars.map(item=>this.validateSingleWfVar(item));
    return this.validationMsg.length  == 0;
  }
  validateSingleWfVar(item){
    switch (item.varType){
      case 'DOUBLE': {
        if(!Util.validateDouble(item.varValue)){
          this.validationMsg.push("变量["+item.varName+"]值与类型不匹配");
        }
        break;
      }
      case 'INTEGER':{
        if(!Util.validateInteger(item.varValue)){
          this.validationMsg.push("变量["+item.varName+"]值与类型不匹配");
        }
        break;
      }
      case 'DATE':{
        if(!Util.validateDate(item.varValue)){
          this.validationMsg.push("变量["+item.varName+"]值与类型不匹配");
        }
        break;
      }
      case 'STRING': break;
    }
  }
}
