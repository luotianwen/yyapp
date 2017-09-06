<template>
  <div class="mine">
    <div class="mine_user" :class="{'not':!userInfo,'already':userInfo}">
      <!--已登录状态 already 未登录状态 not-->
      <div class="user_msg">
				<span class="head_img">
					<!--<img src="../../../../platforms/android/build/intermediates/res/merged/debug/drawable-land-mdpi/screen.png"/>-->
					<img :src="userInfo&&userInfo.portrait?userInfo.portrait:'../../static/image/friends_img.png'"
               v-show="userInfo&&userInfo.portrait&&userInfo.portrait.trim().length>0"/>

          <!--性别男显示 man 女显示 woman-->
					<i :class="{'woman':userInfo&&userInfo.sex==2,'man':userInfo&&userInfo.sex==1}"></i>
				</span>

        <p class="user_name">
					<span class="n_enter" v-show="!userInfo"><router-link to="/login">登录 </router-link>/<span>
          <router-link to="/regiter"> 注册</router-link></span></span>
          <span class="y_enter" v-show="userInfo">{{userInfo?userInfo.name:''}}</span>
        </p>
      </div>
      <div class="menu">
        <span class="menu_news"></span>
        <router-link to="/member/set"><span class="menu_set"></span></router-link>
      </div>
    </div>
    <div class="browsing_history">
      <ul>
        <li class="integral"><span>{{resultData.point}}</span><i>我的积分</i></li>
        <li class="collect">
          <router-link to="/member/collect"><span>{{resultData.followWare}}</span><i>商品收藏</i></router-link>
        </li>
        <li class="attention">
          <router-link to="/member/shopfollow"><span>{{resultData.followVender}}</span><i>店铺关注</i></router-link>
        </li>
      </ul>
    </div>
    <div class="buy_msg">
      <group>
        <cell title="我的订单" value="查看更多订单" is-link link="/member/orderlist?type=&comment=0"></cell>
      </group>
      <div class="line_item">
        <ul>
          <li class="obligation">
            <router-link :to="{name:'orderlist',query:{type:0,comment:0}}"><img
              src="../../assets/image/mine/obligation_img.png"/><i>待付款</i></router-link>
            <sup v-show="resultData.order.daifukuan>0">
              <badge :text="resultData.order.daifukuan"></badge>
            </sup>
          </li>
          <li class="shipments">
            <router-link :to="{name:'orderlist',query:{type:1,comment:0 }}"><img
              src="../../assets/image/mine/shipments_img.png" alt=""/><i>待发货</i></router-link>
            <sup v-show="resultData.order.daifahuo>0">
              <badge :text="resultData.order.daifahuo"></badge>
            </sup>
          </li>
          <li class="delivery">
            <router-link :to="{name:'orderlist',query:{type:2,comment:0}}"><img
              src="../../assets/image/mine/delivery_img.png" alt=""/><i>待收货</i></router-link>
            <sup v-show="resultData.order.daishouhuo>0">
              <badge :text="resultData.order.daishouhuo"></badge>
            </sup>
          </li>
          <li class="evaluate">
            <router-link :to="{name:'orderlist',query:{type:3,comment:2}}"><img
              src="../../assets/image/mine/evaluate_img.png"/><i>待评价</i></router-link>
            <sup v-show="resultData.order.daipingjia>0">
              <badge :text="resultData.order.daipingjia"></badge>
            </sup>
          </li>
          <li class="sales">
            <router-link :to="{name:'after'}"><img
              src="../../assets/image/mine/sales_img.png"/><i>退货/售后</i></router-link>
            <sup v-show="resultData.order.shouhou>0">
              <badge :text="resultData.order.shouhou"></badge>
            </sup>
          </li>
        </ul>
      </div>
    </div>
    <div class="rest_function">
      <ul>
        <li class="distributor" @click="goDistribution"><img src="../../assets/image/mine/distributor_img.png"/><i>我的分销</i></li>
        <li class="discount_coupon"><img src="../../assets/image/mine/discount_coupon_img.png"/><i>优惠券</i></li>
        <li class="sfcard"><img src="../../assets/image/mine/sfcard_img.png"/><i>世峰E卡</i></li>
        <li class="service"><img src="../../assets/image/mine/service_img.png"/><i>客服</i></li>
      </ul>
    </div>
  </div>
</template>
<script>
  import {Group, Cell,Badge} from 'vux'
  import {isLogin} from '../../common/js/checkIsLogin'
  export default {
    components: {
      Group,
      Cell,Badge
    },
    data () {
      return {
        userInfo: {},
        resultData: {
          followVender:0,
          followWare:0,
          order:{
            daifahuo:0,
            daifukuan:0,
            daipingjia:0,
            daishouhuo:0,
            daituikuan:0,
            shouhou:0
          },
          point:0
        },
      }
    },
    methods: {
        //跳转到分销
        goDistribution(){
            this.$router.push({name: 'distribution'});
        },
      initData(){
        var that = this;
        that.$post(that.$interface_url.user.getStatistic, {token: that.userInfo.token}, function (data, success) {
          if (success) {
            that.resultData = data;
          }
        });
      }

    },
    created(){
      this.userInfo = this.$getStorage(this.$storage_key.USERINFO_STORAGE);

        if(isLogin()) {
          this.initData();
        }
    }

  }
</script>

<style rel="stylesheet/less" lang="less">
  @import "../../assets/css/mine.less";

  i {
    font-style: normal;
  }
</style>
