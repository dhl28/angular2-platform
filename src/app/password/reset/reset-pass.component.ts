import {Component, Input} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {ApiService} from "../../core/api.service";
import Util from '../../common/util';

declare var $:any;

@Component({
  selector: 'resetPass',
  templateUrl:'./reset-pass.component.html',
  styleUrls:['./reset-pass.component.css']
})
export class ResetPassComponent {
  msg: string = null;
  thisToken: string = '';
  @Input() email:String;
  resetInfo = 0;
  passwordInfo = 0;
  rePasswordInfo = 0;
  constructor(public apiService: ApiService,  private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.initApps();
  }
  initApps (){
    var url = window.location.toString();
    var info = url.split('=');
    this.thisToken = info[info.length - 1];
  }
  passwordFocus(){
  }
  passwordChange(){
    var val = $('#passwordInput').val();
    if(val.length > 5 && val.length < 19){
      this.passwordInfo = 1;
    }else{
      this.passwordInfo = 2;
      return;
    }
    //判断只含有英文、下划线、数字
    var rule = /^[\@A-Za-z0-9\!\#\$\%\^\&\*\_\-\~]{6,18}$/;
    if(rule.test(val)){
      this.passwordInfo = 1;
    }else{
      this.passwordInfo = 3;
      return;
    }
  }
  //失去焦点时校验，以确定输入提示框是否隐藏
  passwordChanged(){
    this.passwordChange();
    this.repasswordChanged();
  }

  //失去焦点时校验，以确定输入提示框是否隐藏
  repasswordChanged(){
    var val = $('#repasswordInput').val();
    var val0 = $('#passwordInput').val();
    if(val === val0){
      this.rePasswordInfo = 1;
    }else{
      this.rePasswordInfo = 2;
    }
  }
  resetPassword(){
    this.passwordChanged();
    this.repasswordChanged();
    if(this.rePasswordInfo ===1 && this.passwordInfo === 1){
      this.apiService.resetPassword($('#passwordInput').val(),this.thisToken)
        .then(data=>{
          if(data._body === 'success'){
            this.resetInfo = 1;
          }else if(data._body.indexOf('userNotExist') > -1){
            this.passwordInfo = 6;
          }else if(data._body.indexOf('LinkFailure') > -1){
            this.passwordInfo = 4;
          }
          else if(data._body.indexOf('PasswordHasReseted') > -1){
            this.passwordInfo = 5;
          }else{
            this.passwordInfo = 7;
          }
        })
    }
  }
}
