/**
 * Created by dhl on 2016/11/22.
 */
declare var $: any;
import constant from  './constant'
//context
const PROD_CTX = constant.PROD_CTX;

let _ = require('lodash');

let createMsg = function (msg, type = 'success', opts = {}, title = '系统提示') {
  let toastr = require('toastr');
  let defaultOpts = {
    "positionClass": "toast-top-right",
    "timeOut": "3000",
    "closeButton": true,
  }
  $.extend(true, defaultOpts, opts);
  toastr[type](msg, title, defaultOpts);
}
//计算content最小高度
let calcMinHeight = function (isPortal) {
  let winHeight = $(window).height();
  let headerHeight = 55 + 1;//box-shadow
  let footerHeight = 0; //isPortal ? 33 : 0;
  return (winHeight - headerHeight - footerHeight );
}
//调整布局
let adjustLayout = function () {
  let isPortal = window.location.href.indexOf('platform') < 0;
  let minHeight = calcMinHeight(isPortal);
  let $pageContent = $('.page-content');
  $pageContent.css('min-height', minHeight + 'px');
  $pageContent.find('.content-wrapper').css('min-height', minHeight - 40 + 'px');
  if (!isPortal) {
    $pageContent.find('.content-wrapper').css('min-height', (minHeight - 20 * 2) + 'px');
  }
}
//整型校验
let validateInteger = function (v) {
  if (isNaN(v)) return false;
  return Number.isInteger(+v);
}
//浮点型校验
let validateDouble = function (v) {
  return !isNaN(v);
}
//日期类型校验
let validateDate = function (v) {
  let reg = /(?!0000)[0-9]{4}-((0[1-9]|1[0-2])-(0[1-9]|1[0-9]|2[0-8])|(0[13-9]|1[0-2])-(29|30)|(0[13578]|1[02])-31)/;
  if (v === 'date_new()') {
    return true;
  } else {
    return reg.test(v);
  }
}
//goTop
let initGoTop = function () {
  //点击回到顶部的元素
  $("#goTop").click(function (e) {
    $('body,html').animate({scrollTop: 0}, 500);
  });
  //实现回到顶部元素的渐显与渐隐
  $(window).scroll(function (e) {
    //若滚动条离顶部大于100元素
    if ($(window).scrollTop() > 100)
      $("#goTop").fadeIn(500);
    else
      $("#goTop").fadeOut(500);
  })
}
//消息提示框
let showMessage = function (msg, type = 'success', opts: any = {timeOut: 3000}) {
  var $msgTpl = $('#msg-tpl').clone();
  $msgTpl.removeAttr("id");
  $msgTpl.addClass(type);
  $msgTpl.find('.msg-content').html(msg);
  //add event
  $msgTpl.find('.btn-close').on('click', function () {
    $(this).closest('.msg-tips').remove();
  })
  let msgCount = $(".msg-container").children().length;
  let top: string = '55px';
  if (msgCount > 0) {
    top = (msgCount + 1) * 55 + 'px';
  }
  $(".msg-container").append($msgTpl);

  $msgTpl.show().animate({top: top, opacity: '1'}).delay(opts.timeOut).fadeOut(0, function () {
    $(this).remove();
  });

}

export default {
  PROD_CTX,
  createMsg,
  adjustLayout,
  validateInteger,
  validateDouble,
  validateDate,
  initGoTop,
  showMessage
}
