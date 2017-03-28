import {Component, Input} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {ApiService} from "../core/api.service";
import Util from '../common/util';

declare var $:any;

@Component({
  selector: 'regist',
  templateUrl:'./app-regist.component.html',
  styleUrls:['./app-regist.component.css']
})
export class AppRegistComponent {
  msg: string = null;
  @Input() user:{}
  industryList = [];//行业分类
  departmentList = [];//部门分类
  repassword = '';
  noregisted = true;
  userNameLenthInfo = 0;//用户名长度校验，0：待验证，1：正确，2：错误
  userNameCodeInfo = 0;//用户名编码校验，0：待验证，1：正确，2：错误
  userNameHalfInfo = 0;//用户名半/全角校验，0：待验证，1：正确，2：错误
  mailInfo = 0;

  passwordLenthInfo = 0;
  passwordCodeInfo = 0;
  passwordHalfInfo = 0;

  repasswordInfo = 0;
  captchaInfo = 0;
  agreeMes = 0;
  isClickable = false;
  codeIsTrue = false;
  repassCanSee = 0;
  passCanSee = 0;
  undoTime = 0;
  constructor(public apiService: ApiService,  private route: ActivatedRoute) {
    this.user = {username:'',email:'',password:'',captcha:'',mobile:'',company:'',industry:'',department:'',address:''};
  }

  ngOnInit() {
    this.initApps();
    window.onresize = function () {
      let url = window.location.href;
      if(url.indexOf('/register') > -1){
        var scrollTop = document.body.scrollTop;
        var top1 = $('#userNameInput').offset().top - 25 - scrollTop;
        var left = $('#userNameInput').offset().left + 12;
        var width = $('#userNameInput').width();

        $('.float-box').css('left',width + left);
        $('.float-box-sm').css('left',width + left);
        $('.nameClear').css('top',$('#userNameInput').offset().top + 32);
        $('.name-float-box').css('top',top1);
        $('.name-float-box2').css('top',top1 + 22);

        var top2 = $('#mailInput').offset().top - 5 - scrollTop;
        $('.mailClear').css('top',$('#mailInput').offset().top + 32);
        $('.mail-float-box').css('top',top2);
        $('.mail-float-box2').css('top',top2);

        var top3 = $('#passwordInput').offset().top - 25 - scrollTop;
        $('.passwordClear').css('top',$('#passwordInput').offset().top + 32);
        $('.pass-float-box').css('top',top3);
        $('.pass-float-box2').css('top',top3 + 20);

        var top4 = $('#repasswordInput').offset().top - 5 - scrollTop;
        $('.repasswordClear').css('top',$('#repasswordInput').offset().top + 32);
        $('.repass-float-box').css('top',top4);

        var top5 = $('#captchaInput').offset().top - 5 - scrollTop;
        $('.captcha-float-box').css('top',top5);
        $('.captchaClear').css('top',$('#captchaInput').offset().top + 32);
      }
    }
    window.onscroll = function () {
      let url = window.location.href;
      if(url.indexOf('/register') > -1){
        var scrollTop = document.body.scrollTop;
        var top1 = $('#userNameInput').offset().top - 25 - scrollTop;
        var left = $('#userNameInput').offset().left + 12;
        var width = $('#userNameInput').width();

        $('.float-box').css('left',width + left);
        $('.float-box-sm').css('left',width + left);
        $('.nameClear').css('top',$('#userNameInput').offset().top + 32);
        $('.name-float-box').css('top',top1);
        $('.name-float-box2').css('top',top1 + 22);

        var top2 = $('#mailInput').offset().top - 5 - scrollTop;
        $('.mailClear').css('top',$('#mailInput').offset().top + 32);
        $('.mail-float-box').css('top',top2);
        $('.mail-float-box2').css('top',top2);

        var top3 = $('#passwordInput').offset().top - 25 - scrollTop;
        $('.passwordClear').css('top',$('#passwordInput').offset().top + 32);
        $('.pass-float-box').css('top',top3);
        $('.pass-float-box2').css('top',top3 + 20);

        var top4 = $('#repasswordInput').offset().top - 5 - scrollTop;
        $('.repasswordClear').css('top',$('#repasswordInput').offset().top + 32);
        $('.repass-float-box').css('top',top4);

        var top5 = $('#captchaInput').offset().top - 5 - scrollTop;
        $('.captcha-float-box').css('top',top5);
        $('.captchaClear').css('top',$('#captchaInput').offset().top + 32);
      }
    }
  }
  initApps (){
    this.getWorkTypeService().then(data=>{
      this.industryList = data;
    });
    this.getDepartmentList().then(data=>{
      this.departmentList = data;
    });
    this.getCaptchaCode();
  }
  couldClick(){
    if((!this.codeIsTrue) || this.agreeMes % 2 === 0 || this.userNameLenthInfo !== 1 || this.userNameCodeInfo !== 1 || this.userNameHalfInfo !== 1 || this.mailInfo !== 1
      || this.passwordLenthInfo !== 1 || this.passwordCodeInfo !== 1 || this.passwordHalfInfo !== 1 || this.repasswordInfo !== 1){
      this.isClickable = false;
      $('#btn-regist').css('background-color','#999999');
      $('#btn-regist').css('border-color','#999999')
    }else{
      this.isClickable = true;
      $('#btn-regist').css('background-color','#f28134');
      $('#btn-regist').css('border-color','#f28134')
    }
  }
  regist(){
    if(this.isClickable){
      this.apiService.register(this.user)
        .then(data=>{
          if(data._body === 'success'){
            this.noregisted = false;
            $('.registDiv').addClass('hides');
            $('.registSuccessDiv').removeClass('hides');
            $('.regist').addClass('registed');
          }else{
            this.noregisted = false;
          }
        })
    }
  }

  sendEmailAgain(name){
    this.apiService.sendEmailAgain(name)
      .then(data=>{
        if(data._body === 'success'){
          this.msg = '邮件发送成功!';
        }else{
          this.msg = '邮件发送失败!';
        }
      })
  }

  getWorkTypeService(){
    return this.apiService.getWorkTypeList();
  }
  getDepartmentList(){
    return this.apiService.getDepartmentList();
  }
  getCaptchaCode(){
    var path = Util.PROD_CTX + "/user/captchaCode?ts"+ new Date().getTime();
    var $img = $('<img/>', {
      src: path
    });
    $('#codeArea').html($img);
    $('#codeArea img').css({'height':'100%','width':'100%'});
    this.captchaChanged();
  }
  userNameFocus(){
    this.dealShowBox();
    $('.name-float-box').removeClass('hides');
    $('.name-float-box2').addClass('hides');
  }
  userNameChange(){
    var val = $('#userNameInput').val().replace(/(^\s*)|(\s*$)/g, "");
    if(val.length === 0){
      this.userNameLenthInfo = 0;
      this.userNameCodeInfo = 0;
      this.userNameHalfInfo = 0;
    }else if(val.length > 1 && val.length < 21){
      this.userNameLenthInfo = 1;
    }else{
      this.userNameLenthInfo = 2;
    }
    this.dealShowBox();
    //判断只含有英文、下划线、数字
    var rule = /^[a-z0-9A-Z_]{2,20}$/;
    if(rule.test(val)){
      this.userNameCodeInfo = 1;
    }else{
      this.userNameCodeInfo = 2;
    }

    if(this.checkHalf(val)){
      this.userNameHalfInfo = 1;
    }else{
      this.userNameHalfInfo = 2;
    }
  }
  //失去焦点时校验，以确定输入提示框是否隐藏
  userNameChanged(){
    $('.name-float-box').addClass('hides');
    $('.name-float-box2').removeClass('hides');
    this.userNameChange();
    this.dealShowBox();
    if(this.userNameLenthInfo === 1 && this.userNameCodeInfo === 1 && this.userNameHalfInfo === 1){
      this.apiService.getUsernameIsOnly($('#userNameInput').val().replace(/(^\s*)|(\s*$)/g, ""))
        .then(data=>{
          if(data){
            this.userNameLenthInfo = 1;
          }else{
            this.userNameLenthInfo = 3;
          }
        })
    }
    this.couldClick();
  }
  mailFocus(){
    this.dealShowBox();
    $('.mail-float-box2').addClass('hides');
  }
  mailChange(){
    this.mailChanged()
  }
  //失去焦点时校验，以确定输入提示框是否隐藏
  mailChanged(){
    $('.mail-float-box2').removeClass('hides');
    this.dealShowBox();
    var val = $('#mailInput').val().replace(/(^\s*)|(\s*$)/g, "");
    var rule = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
    if(val.length === 0){
      this.mailInfo = 0;
    }else if(!rule.test(val)){
      this.mailInfo = 2;
    }else{
      this.mailInfo = 1;
      $('.mail-float-box').addClass('hides');
      this.apiService.getEmailIsOnly($('#mailInput').val().replace(/(^\s*)|(\s*$)/g, ""))
        .then(data=>{
          if(data){
            this.mailInfo = 1;
          }else {
            this.mailInfo = 3;
          }
        })
    }
    this.couldClick();
  }
  passwordFocus(){
    $('.pass-float-box').removeClass('hides');
    $('.pass-float-box2').addClass('hides');
    this.dealShowBox();
  }
  passwordChange(){
    var val = $('#passwordInput').val();
    if(val.length === 0){
      this.passwordLenthInfo = 0;
      this.passwordCodeInfo = 0;
      this.passwordHalfInfo = 0;
    }else if(val.length > 5 && val.length < 19){
      this.passwordLenthInfo = 1;
    }else{
      this.passwordLenthInfo = 2;
    }
    //判断只含有英文、下划线、数字
    var rule = /^[\@A-Za-z0-9\!\#\$\%\^\&\*\_\-\~]{6,18}$/;
    if(rule.test(val)){
      this.passwordCodeInfo = 1;
    }else{
      this.passwordCodeInfo = 2;
    }

    if(this.checkHalf(val)){
      this.passwordHalfInfo = 1;
    }else{
      this.passwordHalfInfo = 2;
    }
    this.dealShowBox();
  }
  //失去焦点时校验，以确定输入提示框是否隐藏
  passwordChanged(){
    $('.pass-float-box2').removeClass('hides');
    $('.pass-float-box').addClass('hides');
    this.dealShowBox();
    this.passwordChange();
    this.couldClick();
    this.repasswordChanged();
  }

  repasswordFocus(){
    $('.repass-float-box').addClass('hides');
    this.dealShowBox();
  }
  repasswordChange(){
    this.dealShowBox();
    var val = $('#repasswordInput').val();
    var val0 = $('#passwordInput').val();
    if(val === val0){
      this.repasswordInfo = 1;
    }else{
      this.repasswordInfo = 2;
    }
  }
  //失去焦点时校验，以确定输入提示框是否隐藏
  repasswordChanged(){
    this.dealShowBox();
    this.repasswordChange();
    $('.repass-float-box').removeClass('hides');
    this.couldClick();
  }
  captchaChanged(){
    this.dealShowBox();
    if($('#captchaInput').val().length !== 0){
      this.apiService.getCaptchaIsTrue($('#captchaInput').val())
        .then(data=>{
          if(data){
            this.captchaInfo = 0;
            this.codeIsTrue = true;
          }else {
            this.captchaInfo = 3;
            this.codeIsTrue = false;
          }
          this.couldClick();
        })
    }else{
      this.captchaInfo = 0;
      this.codeIsTrue = false;
      this.couldClick();
    }

  }
  agreeMess(){
    this.agreeMes += 1;
    this.couldClick();
  }
  checkHalf(str){
    var strCode;
    for(var i = 0;i < str.length;i++){
      strCode = str.charCodeAt(i);
      if((strCode > 65248) || (strCode == 12288)){
        return false;
      }
    }
    return true;
  }

  dealShowBox(){
    var scrollTop = document.body.scrollTop;
    var top1 = $('#userNameInput').offset().top - 25 - scrollTop;
    var left = $('#userNameInput').offset().left + 12;
    var width = $('#userNameInput').width();

    $('.float-box').css('left',width + left);
    $('.float-box-sm').css('left',width + left);
    $('.nameClear').css('top',$('#userNameInput').offset().top + 32);
    $('.name-float-box').css('top',top1);
    $('.name-float-box2').css('top',top1 + 22);

    var top2 = $('#mailInput').offset().top - 5 - scrollTop;
    $('.mailClear').css('top',$('#mailInput').offset().top + 32);
    $('.mail-float-box').css('top',top2);
    $('.mail-float-box2').css('top',top2);

    var top3 = $('#passwordInput').offset().top - 25 - scrollTop;
    $('.passwordClear').css('top',$('#passwordInput').offset().top + 32);
    $('.pass-float-box').css('top',top3);
    $('.pass-float-box2').css('top',top3 + 20);

    var top4 = $('#repasswordInput').offset().top - 5 - scrollTop;
    $('.repasswordClear').css('top',$('#repasswordInput').offset().top + 32);
    $('.repass-float-box').css('top',top4);

    var top5 = $('#captchaInput').offset().top - 5 - scrollTop;
    $('.captcha-float-box').css('top',top5);
    $('.captchaClear').css('top',$('#captchaInput').offset().top + 32);
  }
}
