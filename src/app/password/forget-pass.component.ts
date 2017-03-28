import {Component, Input} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {ApiService} from "../core/api.service";
import Util from '../common/util';

declare var $:any;

@Component({
  selector: 'forgetPass',
  templateUrl:'./forget-pass.component.html',
  styleUrls:['./forget-pass.component.css']
})
export class ForgetPassComponent {
  msg: string = null;
  @Input() email:String;
  mailInfo = 0;

  constructor(public apiService: ApiService,  private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.initApps();
  }
  initApps (){
  }
  mailFocus(){
  }

  //失去焦点时校验，以确定输入提示框是否隐藏
  mailChanged(){
    var val = $('#mailInput').val().replace(/(^\s*)|(\s*$)/g, "");
    var rule = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
    if(val.length === 0){
      this.mailInfo = 3;
    }else if(!rule.test(val)){
      this.mailInfo = 2;
    }else{
      this.mailInfo = 1;
    }
  }

  sendEmail(){
    if(this.mailInfo === 1){
      this.apiService.sendResetMail($('#mailInput').val().replace(/(^\s*)|(\s*$)/g, ""))
        .then(data=>{
          if(data._body === 'success'){
            this.mailInfo = 5;
          }else if(data._body.indexOf('未注册邮箱') > -1){
            this.mailInfo = 4;
          }else{
            this.mailInfo = 6;
            console.log(data._body);
          }
        })
    }
  }
}
