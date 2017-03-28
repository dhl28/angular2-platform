/**
 * Created by dhl on 2016/10/21.
 */
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import {AuthService} from '../../login/auth.service'
import Util from '../../common/util'
/*
 * We're loading this component asynchronously
 * We are using some magic with es6-promise-loader that will wrap the module with a Promise
 * see https://github.com/gdi2290/es6-promise-loader for more info
 */

console.log('`About` component loaded asynchronously');

@Component({
  selector: 'header',
  styles: [``],
  templateUrl: './header.component.html'
})
export class HeaderComponent {
  localState: any;
  constructor(public route: Router,public authService:AuthService) {

  }
  logout(){
    this.authService.logout().then(data=>{
      if(!data.error){
        this.route.navigate(['/login'])
      }else{
        Util.createMsg(data.error,'error');
      }
    });
  }

  ngOnInit() {
    console.log('header init');
  }

}
