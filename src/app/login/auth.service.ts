import { Injectable } from '@angular/core';
import { Headers, Http ,URLSearchParams} from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/delay';

import constant from  '../common/constant'
import Util from  '../common/util'

@Injectable()
export class AuthService {
  constructor(private http: Http) {

  }
  public ctx = constant.PROD_CTX;
  isLoggedIn: boolean = false;
  userInfo = {};

  // store the URL so we can redirect after logging in
  redirectUrl: string;

  login(user): Promise<any> {
    // return Observable.of(true).delay(1000).do(val => this.isLoggedIn = true);
    let url = this.ctx + '/login';
    let params: URLSearchParams = new URLSearchParams();
    params.set('username', user.username);
    params.set('password', user.password);
    return this.http.post(url,user,{search: params})
      .toPromise()
      .then(response => response.json())
      .then(d=>{
        if(d.status=='success'){
          this.isLoggedIn = true;
          this.userInfo = d.user;
        }else{
          this.isLoggedIn = false;
          this.userInfo = {};
        }
        return d;
      })
      .catch(this.handleError);
  }
  loginMock(){
    return Observable.of(true).delay(1000).do(val => this.isLoggedIn = true);
  }

  logout(): Promise<any>  {

    let url = this.ctx + '/logout';
    return this.http.post(url,{})
      .toPromise().then(response=>{
        var result = {};
        if(response['_body']==='success'){
          this.isLoggedIn = false;
          this.userInfo = {};
          result = {}
        }else{
          result = response.json();
        }
        return result;
      })
  }
  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    var msg = "登录失败";
    if(error.status===500){
      msg = '500:服务器连接失败（'+error.url+'）';
    }else if(error.status===404){
      msg = '404:未找到以下接口：'+ error.url;
    }
    Util.createMsg(msg,'error')
    return Promise.reject(error.message || error);
  }

}
