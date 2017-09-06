<template>
  <div class="odd">
    <div class="odd_header">
      <x-header :left-options="{showBack:true}" :right-options="{showMore: true}">订单详情
      </x-header>
    </div>
    <div class="odd_content">
      <div class="odd_title">
        <p>{{formatStatus(order.orderStatus)}}</p>
      </div>
   <!--   <div class="new_logistics" v-show="order.express&&order.express.length>0">
        <span class="lm_logo"><i></i></span>
        <div class="logistics_msg">
          <p class="lm_site">
            北京通州通州北京北京通州通州北京北京通州通州北京北京通州通州北京北京通州通州北京北京通州通州北京北京通州通州北京北京通州通州北京北京通州通州北京北京通州通州北京北京通州通州北京北京通州通州北京北京通州通州北京北京通州通州北京北京通州通州北京北京通州通州北京北京通州通州北京北京通州通州北京北京通州通州北京北京通州通州北京北京通州通州北京北京通州通州北京北京通州通州北京北京通州通州北京北京通州通州北京北京通州通州北京北京通州通州北京北京通州通州北京北京通州通州北京北京通州通州北京北京通州通州北京北京通州通州北京北京通州通州北京北京通州通州北京北京通州通州北京北京通州通州北京北京通州通州北京北京通州通州北京北京通州通州北京北京通州通州北京北京通州通州北京北京通州通州北京北京通州通州北京北京通州通州北京北京通州通州北京</p>
          <p class="lm_time">2017-14-11 15:15:20</p>
        </div>
        <span class="arrows"><i></i></span>
      </div>-->
      <div class="odd_site">
        <span class="pm_logo"><i></i></span>
        <div class="site_msg">
          <p class="recipients"><span class="name">收件人：<i>{{order.addressee}}</i></span>
            <span class="phone">{{order.phone|subPhone}}</span></p>
          <p class="place">{{order.address}}</p>
        </div>
      </div>
      <div class="information">
        <div class="title">
          <span>{{order.shopName}}</span><i></i>
        </div>
        <div class="purchase_details clearfix">
          <div v-for="good in order.wares" class="purchase_details clearfix">
            <img :src="good.productImage" alt=""/>
            <div class="msg">
              <p>{{good.productName}}</p>
              <span>￥<i>{{good.totalMoney|toFixed}}</i></span>
              <em>x{{good.quantity}}</em>
            </div>
          </div>
          <div class="refund" v-if="order.orderStatus==1" @click="showReason">
            <a class="r_btn">退款</a>
          </div>

          <div class="refund" v-if="order.orderStatus==2" @click="goLogistics(order.orderId)">
            <a class="r_btn" >查看物流</a>
          </div>
          <div class="refund" v-if="order.orderStatus==7" @click="showReason">
            <div class="msgspan">退款申请中，等待工作人员审核，将在1-2个工作日到账...</div>
          </div>
          <div class="expense">
            <ul>
              <li><em>商品总价</em><span>￥<i>{{goodPrice}}</i></span></li>
              <li><em>运费(快递)</em><span>+￥<i>{{order.freight_price|toFixed}}</i></span></li>
              <li><em>商品优惠</em><span>-￥<i></i>0.00</span></li>
              <li class="aggregate"><em>订单总价</em><span>￥<i>{{order.order_payment|toFixed}}</i></span></li>
            </ul>
          </div>
          <div class="actual_payment" v-if="order.orderStatus!=0">
            <div class="order_amount">实付款</div>
            <div class="oa_num"><i>￥</i><span class="integer">{{order.order_payment|toFixed}}</span>
              <!--.<span class="decimals">{{order_payment.toFixed(2).split('.')[1]}}</span>-->
            </div>
          </div>
        </div>
      </div>
      <div class="seller">
        <!-- 	<div class="integral">
                   <em>积分</em><span>返回积分<i>12</i>点</span>
               </div>-->
        <p><i></i>联系卖家</p>

      </div>
      <div class="order_msg">
        <ul>
          <li>订单编号：<span>{{orderId}}</span></li>
          <li>创建时间：{{order.subTime}}</li>
          <li v-show="order.paytime">付款时间：<span>{{order.paytime}}</span></li>
          <li>支付方式：<span>在线支付</span></li>
        </ul>
        <a>复制</a>
      </div>
      <div class="invoice_msg" v-show="invoice">
        <ul>
          <li>发票类型：<span>{{invoice.type==1?'普通发票':'增值税发票'}}</span></li>
          <li class="name">发票抬头：<span>{{invoice.content}}</span>
          </li>
          <li>发票内容：<span>{{invoice.content}}</span></li>
        </ul>
      </div>
<v-guess :shopid="order.shopId"></v-guess>
    </div>
    <div class="merge_buy" @click="goPay(orderId)" v-if="order.orderStatus==0">
      <span>去支付</span>
    </div>

    <actionsheet v-model="reasonShow" :menus="menus1" show-cancel
                 @on-click-menu="menuClick"></actionsheet>
  </div>

</template>

<script type="text/ecmascript-6">
  import {XHeader, Divider, Actionsheet} from 'vux'
  import {formatOrderState} from '../../../common/js/util'
  import VGuess from '../../common/guess-like.vue'
  export default {
    components: {
      XHeader,
      Divider, Actionsheet,VGuess
    },
    data() {
      return {
        reasonShow: false,
        orderId: '',
        userInfo: {},
        order: {},
        shopid:0,
        invoice:{},
        goodPrice:0,
        menus1: {
          1: '拍错/误拍',
          2: '填写信息错误，重拍',
          3: '卖家缺货',
          4: '其他原因',
        }
      }
    },
    methods: {
        showReason(){
            this.reasonShow=true;
        },
      menuClick(key){
            this.refundOrder(key);
      },
      goPay(orderId){
        this.$router.push({name: 'pay', params: {order: orderId, type: 2}});
      },
      formatStatus(state){
        return formatOrderState(state);
      },
      refundOrder(key){
        if(key=='cancel'){
          this.reasonShow=false;return;
        }
        var that = this;
        this.$vux.confirm.show({
          content: '确认退款?',
          confirmText: '确认',
          cancelText: '取消',
          // 组件除show外的属性
          onCancel () {

          },
          onConfirm () {
            that.$post(that.$interface_url.order.refund, {
              token: that.userInfo.token,
              order_id: that.orderId,
              reason: key
            }, function (data, success) {
              if (success) {
                  that.order.orderStatus=7;
                that.$vux.toast.show({text: '申请成功，将在1-2个工作日到账！', width: '18em'});
              }
              else {
                that.$vux.toast.show({text: '操作失败，请联系客服人员！', type: 'warn', width: '18em'})
              }
            })
          }
        })
      },
      initData(){

        var that = this;
        that.$post(that.$interface_url.order.details, {
          token: that.userInfo.token,
          order_id: that.orderId
        }, function (data, success) {
          if (success) {
              that.order=data;
              that.shopid=data.shopid;
              that.invoce=data.invoce;
              data.wares.forEach(function (good,index) {
                that.goodPrice+=parseFloat(good.totalMoney)*parseInt(good.quantity);
              })
          }
        });
      },
      goLogistics(orderId){
          this.$router.push({name:'logisticsMsg',query:{orderid:orderId}});
      }
    },
    created(){
      this.orderId = this.$route.params.orderId;
      this.userInfo = this.$getStorage(this.$storage_key.USERINFO_STORAGE);

      this.initData();

    },
    ready: function (){


    }
  }
</script>

<style lang="less">
  @import "../../../assets/css/orderdetail.less";

  i,
  em {
    font-style: normal;
  }
</style>
