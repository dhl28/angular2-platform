import {Component, AfterViewInit, ViewChild,NgZone} from '@angular/core';
import {Router, ActivatedRoute, Params} from '@angular/router';
import {ModalDirective} from 'ng2-bootstrap/components/modal/modal.component';
import {ApiService} from '../../core/api.service';
import Util from '../../common/util';
import {MsgModalComponent} from '../../shared/msg-modal.component'

declare var $: any;

@Component({
  selector: 'running-result',
  styleUrls: ['./running-result.component.css'],
  templateUrl: './running-result.component.html'
})
export class RunningResultComponent implements AfterViewInit {

  constructor(public apiService: ApiService, private router: Router,private _ngZone: NgZone) {
  }

  @ViewChild('staticModal')
  public childModal: ModalDirective;

  @ViewChild('wfVarModal')
  public wfVarModal: ModalDirective;

  @ViewChild('msgModal')
  public msgModal: MsgModalComponent;

  public showChildModal(): void {
    this.childModal.show();
  }

  public hideChildModal(): void {
    this.childModal.hide();
  }

  localState: any;
  records: any[];
  showRecords: any[];
  log = {};
  wfVars = [];
  seletedItem:any = {};
  showPagination = true;
  isLoading:boolean = false;
  keyWord:string = '';

  //pagination
  public totalItems: number = 0;
  public currentPage: number = 1;
  public itemsPerPage: number = 10;
  public maxSize: number = 5;
  //sort
  public sortFieldName:string = 'startTime';
  public isDesc:boolean = true;

  public pageChanged(event: any): void {
    this.pageListExeRecords(event.page );
    // this.showRecords = this.records.slice((event.page - 1) * event.itemsPerPage, event.page * event.itemsPerPage)
  };
  public numPages(event: any): void {
    // this.showRecords = this.records.slice((this.currentPage-1) * this.itemsPerPage ,this.currentPage * this.itemsPerPage);
  };



  ngOnInit() {
    this.pageListExeRecords();
  }

  ngAfterViewInit() {

  }

  getPaginationParam() {
    return {
      pageSize: this.itemsPerPage,
      pageIndex: this.currentPage,
      sortFieldName: this.sortFieldName,
      isDesc: this.isDesc
    }
  }

  pageListExeRecords(pageIndex = null) {
    this.isLoading = true;
    this.showRecords = [];
    let paginationParam = this.getPaginationParam();
    if (pageIndex != null) {
      paginationParam.pageIndex = pageIndex;
    }
    if(!this.showPagination){
      this.showPagination = true;
    }
    this.apiService.pageListExeRecords(paginationParam,this.keyWord).then(data=> {
      if(data.error) return;
      this.isLoading = false;
      this.totalItems = data.total;
      this.showRecords = data.rows;
    });
  }


  getStatusChs(app) {
    let stateChs = '';
    switch (app.status) {
      case 1:
        stateChs = '运行中';
        break;
      case 2:
        stateChs = '成功';
        break;
      case 3:
        stateChs = '失败';
        break;
      default:
        stateChs = '未知'
    }
    return stateChs;
  }


  keyDown(e) {
    if (e.keyCode === 13) {
      this.search()
    }
  }

  search() {
    this.pageListExeRecords();
  }
  refresh() {
    this.pageListExeRecords();
  }

  //排序
  sort(sortField){
    if(this.sortFieldName === sortField){
      this.isDesc = !this.isDesc;
    }else{
      this.sortFieldName = sortField;
      this.isDesc = true;
    }
    this.pageListExeRecords();
  }

  //app详情
  viewApp(item){
    this.apiService.getAppDetail(item.pkApp).then(d=>{
      if(!d.error)
        this.router.navigate(['/workbench/running-result/app', item.pkApp]);
    })

  }
  //查看日志
  viewRecord(item) {
    if (!item.pk) {
      Util.showMessage('App[' + item.appName + ']日志记录为空', 'info');
      return;
    }
    this.seletedItem = item;
    this.apiService.getLastExeRecord({recordPK: item.pk}).then(d=> {
      this.log = d;
      this.showChildModal();
    })
  }
  //查看工作流参数
  viewWfVars(item){
    this.seletedItem = item;
    this.apiService.getVarModelByRecordPK({recordPK: item.pk}).then(d=> {
      this.wfVars = d;
      this.wfVarModal.show();
    })

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

  //查看报告
  viewReport(item) {
    this.router.navigate(['/workbench/report', item.pk]);
  }
  //删除应用
  removeRecord(item) {
    this.seletedItem = item;
    this.msgModal.showChildModal();
  }
  //系统提示窗口事件监听
  msgModalBtnEvent(e){
    if(e === 'confirm'){
      this.doDel();
    }
  }

  doDel(){
    this.apiService.removeRecord(this.seletedItem.pk).then(data=>{
      if(!data.error){
        this.msgModal.hideChildModal();
        Util.showMessage("删除成功");
        let pageIndex = this.currentPage;
        let _total =  (this.totalItems - 1);
        if (_total != 0 && _total % this.itemsPerPage === 0) {
          this.currentPage = this.currentPage - 1;
        } else {
          this.pageListExeRecords();
        }

      }
    })
  }

}
