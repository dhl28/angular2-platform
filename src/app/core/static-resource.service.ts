import {Injectable}    from '@angular/core';
import {Headers, Http, URLSearchParams, Response} from '@angular/http';

import 'rxjs/add/operator/toPromise';
import Util from '../common/util'

@Injectable()
export class StaticResourceService {
  private headers = new Headers({'Content-Type': 'application/json'});
  private CTX = process.env.ENV === 'production' ? Util.PROD_CTX + '/dist' : '';

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

  constructor(private http: Http) {

  }

  //获取首页配置文件 -- 应用
  getAppConfig() {
    return this.http.get(this.CTX + '/assets/json/dashboard-app.json').map((res: Response) => res.json());
  }
  //获取首页配置文件 -- API
  getApiConfig() {
    return this.http.get(this.CTX + '/assets/json/dashboard-api.json').map((res: Response) => res.json());
  }
}
