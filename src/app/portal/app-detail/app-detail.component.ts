import {Component, AfterViewInit, ViewChild} from '@angular/core';
import {Router, ActivatedRoute, Params} from '@angular/router';
import {ModalDirective} from 'ng2-bootstrap/components/modal/modal.component';
import {ApiService} from '../../core/api.service';
import Util from '../../common/util';
import {AppRunModalComponent} from './app-run-modal'
import {ReportComponent} from '../../workbench/report'


declare var $: any;

@Component({
  selector: 'app-detail',
  styleUrls: ['./app-detail.component.css'],
  templateUrl: './app-detail.component.html'
})
export class AppDetailComponent implements AfterViewInit {

  constructor(public apiService: ApiService, private route: ActivatedRoute) {

  }

  @ViewChild('appRunModal')
  public appRunModal: AppRunModalComponent;
  @ViewChild('report')
  public report: ReportComponent;
  app: any = {};
  appPK: string;
  recordPK: string;
  isLiked: boolean = null;
  isOwned: boolean = null;
  isLoggedIn: boolean = false;
  breadCrumbs = [];
  isPlatform: boolean = false;
  appIsRunning: boolean = false;
  ngOnInit() {
    let url = window.location.href;
    if(url.indexOf('/workbench/') > -1){
      this.isPlatform = true;
    }
    let appPK = this.route.snapshot.params['pk'];
    this.appPK = appPK;
    this.loadData(appPK);
    this.dealBreadCrumbs();
  }

  ngAfterViewInit() {

  }

  dealBreadCrumbs() {
    let url = window.location.href;
    let path0 = {name: '我的应用', link: '/workbench'};
    let path1 = {name: '应用详情', link: null};

    if (url.indexOf("portal") != -1) {
      path0 = {name: '应用工厂', link: '/portal/app-market'};
    } else if (url.indexOf('running-result') != -1) {
      path0 = {name: '运行结果', link: '/workbench/app/running-result'};
    }else if(url.indexOf('workbench/app-market') != -1){
      path0 = {name: '应用工厂', link: '/workbench/app-market'};
    }
    this.breadCrumbs.push(path0);
    this.breadCrumbs.push(path1);
  }

  loadData(appPK) {
    this.apiService.getAppDetail(appPK).then(data=> {
      if(data.error) return;
      this.app = data.app ? data.app : {};
      this.isLoggedIn = data.isLoggedIn;
      this.isLiked = data.isLiked;
      this.isOwned = data.isOwned;
      this.recordPK = data.recordPK;
      this.appIsRunning = data.app.state === 'RUNNING' ? true:false;
      setTimeout(()=>{this.report.loadData();},50)

    })
  }

  //运行app
  runApp() {
    if(this.appIsRunning) return;
    this.apiService.getWFVars(this.app.pk).then(data=> {
      if (!data.error && data.wfVars && data.wfVars.length > 0) {//有工作流变量
        this.appRunModal.showChildModal();
      } else {
        this.doRunApp();
      }
    })

  }

  //运行app - 执行请求
  doRunApp() {
    this.apiService.ruApp(this.app.pk, []).then(d=> {
      if (!d.error && !d.info) {
        this.appIsRunning = true;
        Util.showMessage('已成功添加运行任务，请到“我的工作台 > 运行结果”中查看');
      }

    })
  }

  afterAppRun(flag: boolean) {
    if (flag) {
      console.log('app is running');
    }
  }

  //点赞/取消点赞
  likeOrUnlike() {
    this.apiService.likeOrUnlike(this.appPK).then(data=> {
      if (!data.error) {
        this.app.numberlike = data.count;
        this.isLiked = data.isLiked;
      }
    })
  }

  //复制到我的工作台
  duplicateAppToMyPlatform() {

    this.apiService.duplicateAppToMyPlatform(this.appPK, this.app.appName).then(d=> {
      if (!d.error) {
        Util.showMessage('该应用已复制到我的工作台');
      }
    })
  }
}
