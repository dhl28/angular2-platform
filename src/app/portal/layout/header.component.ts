/**
 * Created by dhl on 2016/10/21.
 */
import {Component, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {AuthService} from '../../login/auth.service'
import {ModalDirective} from 'ng2-bootstrap/components/modal/modal.component';
import Util from '../../common/util';
/*
 * We're loading this component asynchronously
 * We are using some magic with es6-promise-loader that will wrap the module with a Promise
 * see https://github.com/gdi2290/es6-promise-loader for more info
 */
declare var $: any;

@Component({
  selector: 'header',
  styleUrls: ['./header.component.css'],
  templateUrl: './header.component.html'
})
export class HeaderComponent {
  localState: any;
  keyWord:string;

  constructor(public route: Router, public authService: AuthService) {

  }

  private user: any = {username: '', password: ''};
  private message = null;

  @ViewChild('staticModal')
  public childModal: ModalDirective;

  public showChildModal(): void {
    this.childModal.show();
  }

  public hideChildModal(): void {
    this.childModal.hide();
  }

  ngOnInit() {
    console.log('header init');
    var _this = this;
    $(window).scroll(function (e) {
      //若滚动条离顶部大于100元素
      if ($(window).scrollTop() > 200) {
        $('.login-pop').addClass('hidden');
      }
    })

    $(document).click(function (e) {
      var _con = $('.login-pop,.login-li');
      if (!_con.is(e.target) && _con.has(e.target).length === 0) { // Mark 1
        $('.login-pop').addClass('hidden');
      }
    });
  }


  login(e) {
    // this.showChildModal();
    var $logInPop = $('.login-pop');
    $logInPop.toggleClass('hidden');
  }

  doLogin() {
    this.authService.login(this.user).then((data) => {
      if (this.authService.isLoggedIn) {
        Util.showMessage('登录成功', 'success');
        this.message = null;
        this.user = {username: '', password: ''};
      } else {
        this.message = data.error;
      }
    });

  }
  keyDown(e) {
    if (e.keyCode === 13) {
      this.doLogin();
    }
  }
  keyDown1(e) {
    if (e.keyCode === 13) {
      this.search();
    }
  }
  search(){
    if(!this.keyWord) return;
    this.route.navigate(['/portal/search',this.keyWord]);
  }
  logout() {
    this.authService.logout();
  }

  accountSetting() {
    console.log('accountSetting');
  }

  mouseover() {
    // $('.login-pop').removeClass('hidden');
  }

}
