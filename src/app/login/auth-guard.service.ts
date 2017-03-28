import {Injectable}       from '@angular/core';
import {Http} from '@angular/http';
import {CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';
import {AuthService}      from './auth.service';
import Util from '../common/util'

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private http: Http, private authService: AuthService, private router: Router) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    let url: string = state.url;
    return this.checkLogin(url);
  }
  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    return this.canActivate(route, state);
  }
  checkLogin(url: string): Promise<boolean> {
    let checkLogUrl = Util.PROD_CTX + '/checkLogin';
    return this.http.get(checkLogUrl)
      .toPromise().then(response => {
        let result =  response.json();
        let isLogin = false;
        if (result.isLogin) {
          this.authService.isLoggedIn = true;
          isLogin = true;
          this.authService.userInfo = result.user;
        } else {
          this.authService.isLoggedIn = false;
          this.authService.userInfo = {};
          this.authService.redirectUrl = url;
          // Navigate to the login page with extras
          this.router.navigate(['/login']);
        }
        return isLogin;
      })
      .catch(()=>{
        Util.showMessage('当前用户登录状态已失效，请重新登录','info');
        this.router.navigate(['/login']);
      });

  }

}
