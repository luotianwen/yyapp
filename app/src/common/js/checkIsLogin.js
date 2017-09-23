/**
 * Created by shen on 2017/3/1.
 * 验证用户是否登录，如果已登录自动重新登录（token已过期情况下），如果在其他设备修改过密码，对用户进行提示，重新登录
 */
import {$storage_key,$system_key,$tip_message,$interface_url} from '../../common/public-variable'
import {$removeStorage,$setStorage,$getStorage} from '../../common/js/storage'
import {$post} from '../../common/js/public-resource'
import {urlParse} from '../../common/js/util'
import router from '../../router'
export function isLogin() {
  let userInfo = $getStorage($storage_key.USERINFO_STORAGE);

  if (userInfo) {
    if (userInfo.timeout&&userInfo.timeout > Date.now()) {
      return true;
    }
    else if(userInfo.account&&userInfo.password){

      $post($interface_url.login.login, {
        account: userInfo.account.trim(),
        password: userInfo.password.trim()
      }, function (data, success) {

        if (success) {
          if (data) {
            let today = new Date()
            data["timeout"] = today.setDate(today.getDate() + 1);//一天过期
            data["password"] = userInfo.password.trim();
            $setStorage($storage_key.USERINFO_STORAGE, data);
            return true;
          }
          else {
            return false;
          }
        }
        else {
          $removeStorage($storage_key.USERINFO_STORAGE);
          router.push({name:'login'});

        }
      });
    }
    else if(userInfo.loginType=='chat'){
      var href = location.origin;
      var url_search = urlParse();
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
      alert(href);
      var url = "https://open.weixin.qq.com/connect/oauth2/authorize?" +
        "appid=wxf577b8debcedeb58&redirect_uri=" + encodeURIComponent($system_key.wechatUrl) + "&" +
        "response_type=code&scope=snsapi_userinfo&state=" + encodeURIComponent(href) + "#wechat_redirect";
      location.href = url;
    }
    else{
      return false;
    }
  }
  else {
    return false;
  }
}

