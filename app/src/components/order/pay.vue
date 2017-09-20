<template>
  <transition enter-active-class="animated fadeInRight" leave-active-class="animated fadeOutRight">
    <div class="pay">
      <div class="p_header">
        <x-header :left-options="{showBack:type==2?true:false}">悠氧商城收银台</x-header>
      </div>
      <div class="p_content">
        <div class="pc_title">
          <div class="order_amount">订单金额</div>
          <div class="oa_num"><i>￥</i><span class="integer">{{price}}</span>.<span
            class="decimals">{{pricePoint}}</span></div>
        </div>
        <group>
          <cell title="微信支付" is-link is-link @click.native="weChatPay">
            <img slot="icon" width="20" style="display:block;margin-right:5px;" src="../../assets/image/cart/wx.png">
          </cell>
         <!-- <cell title="支付宝支付" is-link is-link :link="payData.aliPayUrl">
            <img slot="icon" width="20" style="display:block;margin-right:5px;" src="../../assets/image/cart/zfb.png">
          </cell>-->
        </group>
      </div>
    </div>
  </transition>
</template>
<script>
  import {XHeader, Group, Cell} from 'vux'
  import {mapGetters} from 'vuex'
  import {isLogin} from '../../common/js/checkIsLogin'
  export default {
    computed: {
      ...mapGetters({
        currentDevice: 'currentDevice'
      })
    },

    components: {
      XHeader,
      Group,
      Cell
    },
    data() {
      return {
        userInfo: {},
        payData: {},
        price: 0,
        type: 1,
        pricePoint: '00'
      }
    },
    methods: {
      initPay(){
        var that = this;
        that.$post(that.$interface_url.order.reqPay, {
          token: that.$getStorage(that.$storage_key.USERINFO_STORAGE).token,
          orderId: that.$route.params.order,
          type: that.type
        }, function (data, success) {
          if (success) {
            that.payData = data;
            that.price = data.total_fee.toFixed(2).split('.')[0];
            that.pricePoint = data.total_fee.toFixed(2).split('.')[1];
          }
          else {
            that.$vux.toast.show({text: '获取支付信息错误', type: 'warn'});
          }
        });
      },
      weChatPay(){

        if (this.currentDevice.deviceName == 'chat') {//微信浏览器，调用h5支付
          this.wxH5Pay();
        } else if (this.currentDevice.deviceName == 'android' || this.currentDevice.deviceName == 'ios') {

        }
        else if (this.currentDevice.deviceName == 'wap') {
          this.$vux.alert.show({
            title: '支付提示',
            content: '请使用微信浏览器进行微信支付'
          })
        }
      },
      alipay(){
        /*  if (this.currentDevice.deviceName == 'chat') {//微信浏览器，调用h5支付
         alert('微信浏览器请点击右上角在浏览器中打开进行支付');
         } else if (this.currentDevice.deviceName == 'android' || this.currentDevice.deviceName == 'ios') {
         window.alipay.pay({
         tradeNo: new Date().getTime(),
         subject: "世峰商城",
         body: "世峰商城商品",
         price: 0.02,
         notifyUrl: "http://your.server.notify.url"
         }, function (successResults) {
         alert(successResults)
         }, function (errorResults) {
         alert(errorResults)
         });
         }
         else if (this.currentDevice.deviceName == 'wap') {
         alert('当前浏览器不支持该付款方式');
         }*/
      },
      wxH5Pay(){

        var that = this;
        this.$get(this.payData.weChatPayUrl, function (data, success) {
          if (success) {

            that.$wechat.chooseWXPay({
              timestamp: data.timeStamp, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
              nonceStr: data.nonceStr, // 支付签名随机串，不长于 32 位
              package: data.package, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=***）
              signType: 'MD5', // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
              paySign: data.sign, // 支付签名
              success: function (res) {
                  alert(res.err_msg);

                if(res.err_msg == "get_brand_wcpay_request:ok" ){
                  that.$vux.alert.show({
                    title: '支付提示',
                    content: '支付成功',
                    onShow () {

                    },
                    onHide () {
                      that.$router.push({name:'payment',query:{total_fee:that.price,pay_result:1}});
                    }
                  })
                }
                /*  get_brand_wcpay_request:ok	支付成功
                 get_brand_wcpay_request:cancel	支付过程中用户取消
                 get_brand_wcpay_request:fail*/

              }
            });
          }
        });
      }
    },
    mounted(){
      /*   if(isLogin()) {
       this.userInfo=this.$getStorage(this.$storage_key.USERINFO_STORAGE);
       console.log(this.userInfo)
       this.initPay();
       }*/

    },
    created(){

      if (isLogin()) {

        this.userInfo = this.$getStorage(this.$storage_key.USERINFO_STORAGE);
        if (this.$route.params.type) {
          this.type = this.$route.params.type;
        }
        this.initPay();
      }
      else {
        this.$router.push({
          name: 'login', query: {
            returnurl: this.$route.fullPath
          }
        });
      }
    }
  }
</script>

<style rel="stylesheet/less" lang="less">
  @import "../../assets/css/pay.less";

  i, em {
    font-style: normal;
  }
</style>
