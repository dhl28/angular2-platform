import { Injectable } from '@angular/core';
import {Http} from '@angular/http';
import {CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';
import {AuthService}      from './login/auth.service';
import Util from './common/util'

export type InternalStateType = {
  [key: string]: any
};

@Injectable()
export class AppService {
  _state: InternalStateType = { };

  constructor(private http: Http, private authService: AuthService, private router: Router) {

  }

  checkLogin(): Promise<boolean> {
    let checkLogUrl = Util.PROD_CTX + '/checkLogin';
    return this.http.get(checkLogUrl)
      .toPromise().then(response => {
        let result =  response.json();
        let isLogin = false;
        if (result.isLogin) {
          this.authService.isLoggedIn = true;
          this.authService.userInfo = result.user;
          isLogin = true;
        } else {
          this.authService.isLoggedIn = false;
          this.authService.userInfo = {};
        }
        return isLogin;
      });

  }

  // already return a clone of the current state
  get state() {
    return this._state = this._clone(this._state);
  }
  // never allow mutation
  set state(value) {
    throw new Error('do not mutate the `.state` directly');
  }


  get(prop?: any) {
    // use our state getter for the clone
    const state = this.state;
    return state.hasOwnProperty(prop) ? state[prop] : state;
  }

  set(prop: string, value: any) {
    // internally mutate our state
    return this._state[prop] = value;
  }


  private _clone(object: InternalStateType) {
    // simple object clone
    return JSON.parse(JSON.stringify( object ));
  }
}
