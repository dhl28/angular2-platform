import {Component, AfterViewInit, ViewChild} from '@angular/core';
import {Router, ActivatedRoute, Params} from '@angular/router';
import {ModalDirective} from 'ng2-bootstrap/components/modal/modal.component';
import {ApiService} from '../../core/api.service';
import Util from '../../common/util';
import {AppRunModalComponent} from '../../portal/app-detail/app-run-modal';
import {MsgModalComponent} from '../../shared/msg-modal.component'

declare var $: any;

@Component({
  selector: 'my-application',
  styleUrls: ['./my-application.component.css'],
  templateUrl: './my-application.component.html'
})
export class MyApplicationComponent implements AfterViewInit {

  constructor(public apiService: ApiService, private router: Router) {
  }

  @ViewChild('appRunModal')
  public appRunModal: AppRunModalComponent;
  @ViewChild('msgModal')
  public msgModal: MsgModalComponent;
  @ViewChild('msgModal1')
  public msgModal1: MsgModalComponent;
  msg = '确定要删除吗？';

  ngOnInit() {
    // this.loadApps();
    this.listAppsByPageWithSort();
  }

  ngAfterViewInit() {

  }

  localState: any;
  originalApps = [];
  apps: any[];
  showApps: any[];
  log = {};
  seletedApp: any = {};
  keyWord = '';
  searchResult = [];
  isLoading: boolean = true;
  enableEditName: boolean = true;
  msgModalOpts0 = {type: 'delete'};//app删除--提示窗口配置项
  msgModalOpts1 = {type: 'info'};//app公开--提示窗口配置项

  //pagination
  public totalItems: number = 0;
  public currentPage: number = 1;
  public itemsPerPage: number = 10;
  public maxSize: number = 5;
  public showPagination = true;
  //sort
  public sortFieldName: string = 'modifyTime';
  public isDesc: boolean = true;


  public pageChanged(event: any): void {
    this.listAppsByPageWithSort(event.page);
    // this.showApps = this.apps.slice((event.page - 1) * event.itemsPerPage, event.page * event.itemsPerPage)
  };

  getPaginationParam() {
    return {
      pageSize: this.itemsPerPage,
      pageIndex: this.currentPage,
      sortFieldName: this.sortFieldName,
      isDesc: this.isDesc
    }
  }

  listAppsByPageWithSort(pageIndex = null) {
    this.isLoading = true;
    this.showApps = [];
    let paginationParam = this.getPaginationParam();
    if (pageIndex != null) {
      paginationParam.pageIndex = pageIndex;
    }
    if (!this.showPagination) {
      this.showPagination = true;
    }
    this.apiService.listAppsByPageWithSort(paginationParam, this.keyWord).then(data=> {
      if (data.error) return;
      this.isLoading = false;
      this.totalItems = data.total;
      this.showApps = data.rows;
    });
  }

  keyDown(e) {
    if (e.keyCode === 13) {
      this.search()
    }
  }

  search() {
    this.listAppsByPageWithSort();
    // if(!this.keyWord){
    //   this.listAppsByPageWithSort();
    //   return;
    // }
    // this.showPagination = false;
    // this.apiService.searchAppsByKeyWord(this.keyWord).then(data=>{
    //   this.showApps = data;
    // })
  }

  //排序
  order(sortField) {
    if (this.sortFieldName === sortField) {
      this.isDesc = !this.isDesc;
    } else {
      this.sortFieldName = sortField;
      this.isDesc = true;
    }
    this.listAppsByPageWithSort();
  }

  //上传
  upload() {

  }

  //app详情
  viewApp(item) {
    this.router.navigate(['/workbench/app', item.pk]);
  }

  //修改app名称
  editName(e, item) {
    var _this = this;
    if (!this.enableEditName) return;
    //去掉之前的name编辑控件
    $('.editable-popup').remove();
    var $a = $(e.target).closest('.edit-name').prev();
    $a.editable({onblur: 'ignore', placement: 'right', toggle: 'manual'});
    $a.off('save').on('save', function (e, params) {
      let app: any = {pk: item.pk};
      app.appName = params.newValue;
      _this.apiService.updateApp(app).then(d=> {
        Util.showMessage('名称修改成功');
        _this.listAppsByPageWithSort();
      })

    });
    $a.editable('show');
  }

  //运行app - 弹出窗口
  runApp(item) {
    if (item.state === 'RUNNING') return;
    this.seletedApp = item;
    this.apiService.getWFVars(item.pk).then(data=> {
      if (data.wfVars && data.wfVars.length > 0) {//有工作流变量
        setTimeout(()=> this.appRunModal.showChildModal(), 50);
      } else {
        this.doRunApp();
      }
    })
  }

  //运行app - 执行请求
  doRunApp() {
    this.seletedApp.state = 'RUNNING';
    this.apiService.ruApp(this.seletedApp.pk, []).then(d=> {
      Util.showMessage('已成功添加运行任务，请到“我的工作台 > 运行结果”中查看');
      this.listAppsByPageWithSort();
    })
  }

  afterAppRun(flag: boolean) {
    if (flag) {
      this.listAppsByPageWithSort();
      this.keyWord = '';
    }
  }

  // 设置公开
  setPublic(item) {
    this.seletedApp = item;
    this.msg = '确定要发布吗？';
    this.msgModal1.showChildModal();
  }

  // 取消公开
  cancelPublic(item) {
    this.seletedApp = item;
    this.msg = '确定要取消发布吗？';
    this.msgModal1.showChildModal();
  }

  dealWithPublic() {
    this.apiService.togglePublicStatus([this.seletedApp.pk],!this.seletedApp.ispublic).then(d=>{
      if(!d.error){
        let msg = this.seletedApp.ispublic ? '应用取消发布成功':'应用发布成功';
        Util.showMessage(msg);
        this.msgModal1.hideChildModal();
        this.listAppsByPageWithSort();
      }
    })
  }

  //删除应用
  deleteApp(item) {
    this.seletedApp = item;
    this.msgModal.showChildModal();
  }

  //app删除 -- 系统提示窗口按钮事件
  msgModalBtnEvent0(e) {
    if (e === 'confirm') {
      this.doDeleteApp();
    } else if (e === 'cancel') {
      //...
    }
  }
  //app公开 -- 系统提示窗口按钮事件
  msgModalBtnEvent1(e) {
    if (e === 'confirm') {
      this.dealWithPublic();
    }
  }

  doDeleteApp() {
    this.apiService.deleteAppByPk(this.seletedApp.pk).then(d=> {
      if (d.error) {
        Util.createMsg(d.error, 'error');
        return;
      }
      this.msgModal.hideChildModal();
      Util.showMessage('删除成功');
      let pageIndex = this.currentPage;
      if ((this.totalItems - 1) % this.itemsPerPage === 0) {
        this.currentPage = this.currentPage - 1;
      } else {
        this.listAppsByPageWithSort();
      }


    })
  }


}
