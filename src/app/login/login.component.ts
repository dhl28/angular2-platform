import {Component,Input}   from '@angular/core';
import {Router}      from '@angular/router';
import {AuthService} from './auth.service';
@Component({
  templateUrl:'./login-component.html'
})
export class LoginComponent {
  message: string = null;
  @Input() user:{}

  constructor(public authService: AuthService, public router: Router) {
    this.user = {username:'',password:''};
    // this.user = {};
  }

  keyDown(e) {
    if (e.keyCode === 13) {
      this.login();
    }
  }

  login() {
    this.authService.login(this.user).then((data) => {
      if (this.authService.isLoggedIn) {
        // Get the redirect URL from our auth service
        // If no redirect has been set, use the default
        let redirect = this.authService.redirectUrl ? this.authService.redirectUrl : '/workbench';
        // Redirect the user
        this.router.navigate([redirect]);
      }else{
        this.message = data.error;
      }
    });
  }
  onSubmit(){

  }

  logout() {
    this.authService.logout();
  }
}
