import {Injectable}    from '@angular/core';
import {Headers, Http, URLSearchParams,Response} from '@angular/http';
import '../rxjs-operators';
// import 'rxjs/add/operator/toPromise';
import { Observable }     from 'rxjs/Observable';

import constant from  '../common/constant'
import Util from '../common/util'

@Injectable()
export class ApiService {
  public ctx = Util.PROD_CTX;
  private _userName = 'Sherlock Holmes';
  private headers = new Headers({'Content-Type': 'application/json'});
  private usersUrl = '/api/users';  // URL to web api

  private handleMessage(response: any) {
    if (response.error) {
      Util.showMessage(response.error, 'error');
    }
    if (response.info) {
      Util.showMessage(response.info, 'info');
    }
    return response;
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    var msg = "获取数据失败";
    if (error.status === 500) {
      msg = '500:调用远程服务获取数据失败（' + error.url + '）';
    } else if (error.status === 404) {
      msg = '404:未找到以下接口：' + error.url;
    }
    Util.createMsg(msg, 'error')
    return Promise.reject(error.message || error);
  }

  private extractData(res: Response) {
    let body:any = res.json();
    if(body.error){
      Util.showMessage('error',body.error);
    }
    return body || { };
  }

  constructor(private http: Http) {

  }
  //设置分页参数
  getPaginationParam(query:any):URLSearchParams{
    let params: URLSearchParams = new URLSearchParams();
    let fields = ['page','size','keywords','sort','desc'];
    fields.map(d => params.set(d,query[d]));
    return params;
  }
  //首页搜索 - app
  searchApp (query:any): Observable<any> {
    let url = this.ctx + '/api/searchApp';
    let params: URLSearchParams = new URLSearchParams();
    return this.http.get(url,{search:this.getPaginationParam(query)})
      .map(this.extractData)
      .catch(this.handleError);
  }
  searchApi (query:any): Promise<any> {
    let url = this.ctx + '/api/searchApi';
    let params: URLSearchParams = new URLSearchParams();
    return this.http.get(url,{search:this.getPaginationParam(query)})
      .toPromise()
      .then(response => response.json())
      .then(this.handleMessage)
      .catch(this.handleError);
  }

  //app 列表
  loadAllApps(): Promise<any> {
    let url = this.ctx + '/api/loadAllApp';
    return this.http.get(url)
      .toPromise()
      .then(response => response.json())
      .then(this.handleMessage)
      .catch(this.handleError);
  }
  //app 列表 - 分页
  listAppsByPageWithSort(query:any,name): Promise<any> {
    let url = this.ctx + '/api/listAppsByPageWithSort';
    let params: URLSearchParams = new URLSearchParams();
    if(name)
      params.set('name', name);
    return this.http.post(url,query,{search:params})
      .toPromise()
      .then(response => response.json())
      .then(this.handleMessage)
      .catch(this.handleError);
  }
  //app - 搜索
  searchAppsByKeyWord(keyWord:string): Promise<any> {
    let url = this.ctx + '/api/searchAppsByKeyWord';
    let params: URLSearchParams = new URLSearchParams();
    params.set('keyWord', keyWord);
    return this.http.get(url,{search:params})
      .toPromise()
      .then(response => response.json())
      .then(this.handleMessage)
      .catch(this.handleError);
  }

  //app详情
  getAppDetail(appPK): Promise<any> {
    let params: URLSearchParams = new URLSearchParams();
    params.set('appPK', appPK);
    let url = this.ctx + '/api/getAppDetail';
    return this.http.get(url, {search: params})
      .toPromise()
      .then(response => response.json())
      .then(this.handleMessage)
      .catch(this.handleError);
  }
  //app详情 -- app 点赞/取消赞
  likeOrUnlike(appPK): Promise<any> {
    let params: URLSearchParams = new URLSearchParams();
    params.set('appPk', appPK);
    let url = this.ctx + '/appfactory/likeOrUnlike';
    return this.http.post(url,{}, {search: params})
      .toPromise()
      .then(response => response.json())
      .then(this.handleMessage)
      .catch(this.handleError);
  }
  //app-修改
  updateApp(app): Promise<any> {
    let url = this.ctx + '/api/updateApp';
    return this.http.post(url,app)
      .toPromise()
      .then(response => response.json())
      .then(this.handleMessage)
      .catch(this.handleError);
  }

//获取app 工作流参数
  getWFVars(appPK): Promise<any> {
    let params: URLSearchParams = new URLSearchParams();
    params.set('appPK', appPK);
    let url = this.ctx + '/api/getWFVars';
    return this.http.get(url, {search: params})
      .toPromise()
      .then(response => response.json())
      .then(this.handleMessage)
      .catch(this.handleError);
  }

  //执行app
  ruApp(appPK, wfVars): Promise<any> {
    let url = this.ctx + '/api/runApp';
    let params: URLSearchParams = new URLSearchParams();
    params.set('appPK', appPK);
    return this.http.post(url, wfVars, {search: params})
      .toPromise()
      .then(response => response.json())
      .then(this.handleMessage)
      .catch(this.handleError);
  }

  //删除app
  deleteAppByPk(appPK): Promise<any> {
    let url = this.ctx + '/api/deleteAppByPk';
    let params: URLSearchParams = new URLSearchParams();
    params.set('appPK', appPK);
    return this.http.post(url, {}, {search: params})
      .toPromise()
      .then(response => response.json())
      .then(this.handleMessage)
      .catch(this.handleError);
  }
  //app发布|取消发布
  togglePublicStatus(appPks,status): Promise<any> {
    let url = this.ctx + '/api/togglePublicStatus';
    let params: URLSearchParams = new URLSearchParams();
    params.set('appPks', appPks);
    params.set('status', status);
    return this.http.post(url, {}, {search: params})
      .toPromise()
      .then(response => response.json())
      .then(this.handleMessage)
      .catch(this.handleError);
  }
  //app复制到我的工作台
  duplicateAppToMyPlatform(appPK,appName): Promise<any> {
    let params: URLSearchParams = new URLSearchParams();
    params.set('appPk', appPK);
    params.set('appName', appName);
    let url = this.ctx + '/api/duplicateAppToMyPlatform';
    return this.http.post(url, {'pk':appPK,'appName':appName})
      .toPromise()
      .then(response => response.json())
      .then(this.handleMessage)
      .catch(this.handleError);
  }
  //获取所有的执行结果
  getAllRecords(): Promise<any> {
    let url = this.ctx + '/api/getAllRecords';
    return this.http.get(url)
      .toPromise()
      .then(response => response.json())
      .then(this.handleMessage)
      .catch(this.handleError);
  }
  //执行结果 - 分页
  pageListExeRecords(query:any,name): Promise<any> {
    let url = this.ctx + '/api/pageListExeRecords';
    let params: URLSearchParams = new URLSearchParams();
    if(name)
      params.set('name', name);
    return this.http.post(url,query ,{search: params})
      .toPromise()
      .then(response => response.json())
      .then(this.handleMessage)
      .catch(this.handleError);
  }

  //运行结果 - 搜索
  searchRecordsByName(keyWord:string): Promise<any> {
    let url = this.ctx + '/api/searchRecordsByName';
    let params: URLSearchParams = new URLSearchParams();
    params.set('keyWord', keyWord);
    return this.http.get(url,{search:params})
      .toPromise()
      .then(response => response.json())
      .then(this.handleMessage)
      .catch(this.handleError);
  }

  //获取最近一次的执行日志
  getLastExeRecord(query): Promise<any> {
    let params: URLSearchParams = new URLSearchParams();
    params.set('recordPK', query.recordPK);
    let url = this.ctx + '/api/getRecordByPK';
    return this.http.get(url, {search: params})
      .toPromise()
      .then(response => response.json())
      .then(this.handleMessage)
      .catch(this.handleError);
  }

  //删除日志
  removeRecord(recordPK): Promise<any> {
    let url = this.ctx + '/api/removeRecord';
    let params: URLSearchParams = new URLSearchParams();
    params.set('recordPK', recordPK);
    return this.http.post(url, {}, {search: params})
      .toPromise()
      .then(response => response.json())
      .then(this.handleMessage)
      .catch(this.handleError);
  }
//查看工作流参数 - 运行结果
  getVarModelByRecordPK(query): Promise<any> {
    let params: URLSearchParams = new URLSearchParams();
    params.set('recordPK', query.recordPK);
    let url = this.ctx + '/api/getVarModelByRecordPK';
    return this.http.get(url, {search: params})
      .toPromise()
      .then(response => response.json())
      .then(this.handleMessage)
      .catch(this.handleError);
  }

  //查看报告 -- 根据appPK
  showAppReport(appPk): Promise<any> {
    let params: URLSearchParams = new URLSearchParams();
    params.set('appPk', appPk);
    let url = this.ctx + '/api/showAppReport';
    return this.http.get(url, {search: params})
      .toPromise()
      .then(response => response.json())
      .then(this.handleMessage)
      .catch(this.handleError);
  }

  //查看报告 -- 根据recordPK
  getReportByRecordPK(recordPK): Promise<any> {
    let params: URLSearchParams = new URLSearchParams();
    params.set('recordPK', recordPK);
    let url = this.ctx + '/api/getReportByRecordPK';
    return this.http.get(url, {search: params})
      .toPromise()
      .then(response => response.json())
      .then(this.handleMessage)
      .catch(this.handleError);
  }


  /**
   * 数据服务相关
   * */
  //数据服务列表
  getDataServerList(): Promise<any> {
    let params: URLSearchParams = new URLSearchParams();
    let url = this.ctx + '/api/list';
    return this.http.get(url, {search: params})
      .toPromise()
      .then(response => response.json())
      .then(this.handleMessage)
      .catch(this.handleError);
  }
  //数据服务列表 - 分页展示
  getDataServicesPageList(query:any,appTypePk:any): Promise<any> {
    let url = this.ctx + '/api/query';
    let params: URLSearchParams = new URLSearchParams();
    params.set('pageSize', query.pageSize);
    params.set('pageNo', query.pageIndex);
    params.set('category', appTypePk);
    params.set('sortField', query.sortFieldName);
    params.set('desc', query.isDesc);
    return this.http.post(url, {}, {search: params})
      .toPromise()
      .then(response => response.json())
      .then(this.handleMessage)
      .catch(this.handleError);
  }

  //数据服务详情
  getDataServerDetail(id): Promise<any> {
    let params: URLSearchParams = new URLSearchParams();
    //params.set('id', id);
    let url = this.ctx + '/api/' + id;
    return this.http.get(url, {search: params})
      .toPromise()
      .then(response => response.json())
      .then(this.handleMessage)
      .catch(this.handleError);
  }
  //数据服务详情 -- 数据服务点赞/取消赞
  DsLikeOrUnlike(id): Promise<any> {
    let params: URLSearchParams = new URLSearchParams();
    params.set('appPk', id);
    let url = this.ctx + '/api/likeOrUnlike';
    return this.http.post(url,{}, {search: params})
      .toPromise()
      .then(response => response.json())
      .then(this.handleMessage)
      .catch(this.handleError);
  }
  getLikeCount(id): Promise<any> {
    let params: URLSearchParams = new URLSearchParams();
    params.set('appPk', id);
    let url = this.ctx + '/api/countLiked';
    return this.http.get(url,{search: params})
      .toPromise()
      .then(response => response.json())
      .then(this.handleMessage)
      .catch(this.handleError);
  }

  /**
   * 应用工厂相关
   * */
  //获取所有应用工程分类
  getAppTypeList(): Promise<any> {
    let params: URLSearchParams = new URLSearchParams();
    let url = this.ctx + '/appfactory/getAllAppsType';
    return this.http.get(url, {search: params})
      .toPromise()
      .then(response => response.json())
      .then(this.handleMessage)
      .catch(this.handleError);
  }

  //应用工厂 - 分页展示加搜索功能
  getAppsFactoryPageList(query:any,appTypePk:any,keyword:any): Promise<any> {
    let url = this.ctx + '/appfactory/getAppsFactoryByGroupPKAndKeyWord';
    let params: URLSearchParams = new URLSearchParams();
    params.set('pageSize', query.pageSize);
    params.set('pageIndex', query.pageIndex);
    params.set('appTypePk', appTypePk);
    params.set('sortFieldName', query.sortFieldName);
    params.set('isDesc', query.isDesc);
    params.set('keyword', keyword);
    return this.http.post(url, {}, {search: params})
      .toPromise()
      .then(response => response.json())
      .then(this.handleMessage)
      .catch(this.handleError);
  }

  /**
   * 注册相关
   * */
  //获取所有行业分类
  getWorkTypeList(): Promise<any> {
    let params: URLSearchParams = new URLSearchParams();
    let url = this.ctx + '/user/industryList';
    return this.http.get(url, {search: params})
      .toPromise()
      .then(response => response.json())
      .then(this.handleMessage)
      .catch(this.handleError);
  }
  //获取所有部门分类
  getDepartmentList(): Promise<any> {
    let params: URLSearchParams = new URLSearchParams();
    let url = this.ctx + '/user/departmentList';
    return this.http.get(url, {search: params})
      .toPromise()
      .then(response => response.json())
      .then(this.handleMessage)
      .catch(this.handleError);
  }

  //注册--用户名唯一性验证
  getUsernameIsOnly(username:any): Promise<any> {
    let url = this.ctx + '/user/userNotExist';
    let params: URLSearchParams = new URLSearchParams();
    params.set('username', username);
    return this.http.post(url, {}, {search: params})
      .toPromise()
      .then(response => response.json())
      .then(this.handleMessage)
      .catch(this.handleError);
  }
  //注册--邮箱唯一性验证
  getEmailIsOnly(email:any): Promise<any> {
    let url = this.ctx + '/user/emailNotExist';
    let params: URLSearchParams = new URLSearchParams();
    params.set('email', email);
    return this.http.post(url, {}, {search: params})
      .toPromise()
      .then(response => response.json())
      .then(this.handleMessage)
      .catch(this.handleError);
  }
  //注册--验证码正确性验证
  getCaptchaIsTrue(captcha:any): Promise<any> {
    let url = this.ctx + '/user/confirmcaptcha';
    let params: URLSearchParams = new URLSearchParams();
    params.set('captcha', captcha);
    return this.http.post(url, {}, {search: params})
      .toPromise()
      .then(response => response.json())
      .then(this.handleMessage)
      .catch(this.handleError);
  }
  //注册
  register(user:any): Promise<any> {
    let url = this.ctx + '/user/register';
    let params: URLSearchParams = new URLSearchParams();
    params.set('username', user.username);
    params.set('password', user.password);
    params.set('email', user.email);
    params.set('company', user.company);
    params.set('department', user.department);
    params.set('industry', user.industry);
    params.set('mobile', user.mobile);
    params.set('address', user.address);
    params.set('captcha', user.captcha);
    return this.http.post(url, {}, {search: params})
      .toPromise()
      // .then(response => response.json())
      .then(this.handleMessage)
      .catch(this.handleError);
  }

  //注册--重新发送电子邮件
  sendEmailAgain(username:any): Promise<any> {
    let url = this.ctx + '/user/resendEMail';
    let params: URLSearchParams = new URLSearchParams();
    params.set('username', username);
    return this.http.post(url, {}, {search: params})
      .toPromise()
      //.then(response => response.json())
      .then(this.handleMessage)
      .catch(this.handleError);
  }

  /**
   * 忘记密码相关
   * */
  //发送忘记密码邮件
  sendResetMail(email:any): Promise<any> {
    let url = this.ctx + '/user/password/resetByEmail';
    let params: URLSearchParams = new URLSearchParams();
    params.set('email', email);
    return this.http.post(url, {}, {search: params})
      .toPromise()
      //.then(response => response.json())
      .then(this.handleMessage)
      .catch(this.handleError);
  }

  //重新设置密码
  resetPassword(newPassword:any,token:any): Promise<any> {
    let url = this.ctx + '/user/password/reset';
    let params: URLSearchParams = new URLSearchParams();
    params.set('newPassword', newPassword);
    params.set('token', token);
    return this.http.post(url, {}, {search: params})
      .toPromise()
      //.then(response => response.json())
      .then(this.handleMessage)
      .catch(this.handleError);
  }
}
