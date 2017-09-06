import Vue from 'vue'
import App from './App'
import store from './store'
import PostPlugin from './common/js/public-resource'
import StoreagePlugin from './common/js/storage'
import InterFaceUrlPlugin from './common/public-variable'

import router from './router'
import {ConfirmPlugin, ToastPlugin, WechatPlugin,AlertPlugin} from 'vux'
import VueFilter from './common/public-filter'
Vue.use(VueFilter);
require('es6-promise').polyfill();

Vue.use(StoreagePlugin);
Vue.use(InterFaceUrlPlugin);
Vue.use(PostPlugin);
Vue.use(ConfirmPlugin);
Vue.use(ToastPlugin);
Vue.use(WechatPlugin);
Vue.use(AlertPlugin);
import {isLogin} from './common/js/checkIsLogin'
import {urlParse} from './common/js/util'
import WxSharePlugin from './common/js/wxShare'
Vue.use(WxSharePlugin);

if (window.location.protocol === 'file:' || window.location.port === '3000') {
  var cordovaScript = document.createElement('script')
  cordovaScript.setAttribute('type', 'text/javascript')
  cordovaScript.setAttribute('src', 'cordova.js')
  document.body.appendChild(cordovaScript)
}
let device = detectOS();

//console.log('当前访问设备：' + device);

store.commit('CURRENT_ACCESS_DEVICE', {device: device});
if(device=='chat'){
  var url_search = urlParse();

  if (!isLogin()) {

    if (url_search && url_search.code) {
      wxLogin(url_search.code);
    }
    else {
      var href = location.origin;

      if (url_search) {
        var i=0;
        for (var p in url_search) {
          if (p != 'code') {
            if(i==0){
              href+='?'+p+'='+url_search[p];
            }
            else{
              href+='&'+p+'='+url_search[p];
            }
          }
          i++;
        }
      }
      var url = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx2e1deda16bcced1d&redirect_uri=" + encodeURIComponent(InterFaceUrlPlugin.$system_key.wechatUrl) + "&response_type=code&scope=snsapi_userinfo&state=" + encodeURIComponent(href) + "#wechat_redirect";
      location.href = url;
    }
  }
  getwxticket();
}

function detectOS() {
  var sUserAgent = window.navigator.userAgent;

  if (sUserAgent.toLowerCase().match(/MicroMessenger/i) == 'micromessenger') {

    return "chat";
  }
  var isWin = (navigator.platform == "Win32") || (navigator.platform == "Windows");
  var isMac = (navigator.platform == "Mac68K") || (navigator.platform == "MacPPC") || (navigator.platform == "Macintosh") || (navigator.platform == "MacIntel");
  var isUnix = (navigator.platform == "X11") && !isWin && !isMac;
  var isIphone = navigator.platform == "iPhone"
  if (isWin || isMac || isUnix || isIphone) {
    return "wap";
  }
  var isLinux = (String(navigator.platform).indexOf("Linux") > -1);
  var bIsAndroid = sUserAgent.toLowerCase().match(/android/i) == "android";
  var bIsIos = sUserAgent.toLowerCase().match(/ios/i) == "ios";
  if (isLinux) {
    if (bIsAndroid) return "android";
    else return "wap";
  }
  if (bIsIos) {
    return "ios";
  }
  if (isWin) {
    return "wap";
  }
  return "wap";//其他所有未识别类型都默认为wap
}
function getwxticket() {
  console.log(location.href.split('#')[0])
  PostPlugin.$post(InterFaceUrlPlugin.$interface_url.wechat.getShareSignature, {url: location.href.split('#')[0]}, function (data, success) {
    if (success) {
      console.log(data)
      WechatPlugin.$wechat.config({
        debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
        appId: data.appid, // 必填，公众号的唯一标识
        timestamp: data.timestamp, // 必填，生成签名的时间戳
        nonceStr: data.noncestr, // 必填，生成签名的随机串
        signature: data.signature,// 必填，签名，见附录1
        jsApiList: [
          'onMenuShareTimeline',
          'onMenuShareAppMessage',
          'onMenuShareQQ',

          'onMenuShareQZone'
        ] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
      });
    }
  });
  WxSharePlugin.$WxShareLoad(null);
}

function wxLogin(code) {//微信浏览器登录回调
  PostPlugin.$post(InterFaceUrlPlugin.$interface_url.login.wxlogin, {code: code}, function (data, success) {
    if (success) {
      let today = new Date()
      data["timeout"] = today.setDate(today.getDate() + 1);//一天过期
      data["loginType"] = 'chat';
      StoreagePlugin.$setStorage(InterFaceUrlPlugin.$storage_key.USERINFO_STORAGE, data);
    }
    else{
      StoreagePlugin.$removeStorage(InterFaceUrlPlugin.$storage_key.USERINFO_STORAGE)
    }
  });
}
//解决低版本浏览器不支持es6 Array.find()
if (!Array.prototype.find) {
  Array.prototype.find = function (predicate) {
    'use strict';
    if (this == null) {
      throw new TypeError('Array.prototype.find called on null or undefined');
    }
    if (typeof predicate !== 'function') {
      throw new TypeError('predicate must be a function');
    }
    var list = Object(this);
    var length = list.length >>> 0;
    var thisArg = arguments[1];
    var value;

    for (var i = 0; i < length; i++) {
      value = list[i];
      if (predicate.call(thisArg, value, i, list)) {
        return value;
      }
    }
    return undefined;
  };
}

/* eslint-disable no-new */
new Vue({
  el: 'app',
  router,
  store,
  // components: { App }
  render: h => h(App)
})

