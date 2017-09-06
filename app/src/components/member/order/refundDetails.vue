<template>
  <div class="refundDetails">
    <div class="rds_header">
      <x-header :left-options="{showBack:true}" :right-options="{showMore: true}">服务单详情<!--<span class="amend"></span>-->
      </x-header>
    </div>
    <div class="rds_content">
      <div class="rds_title">
        <p>{{formatRefundState(resultData.state)}}</p>
        <span>服务单号：<i>{{resultData.serviceNumber}}</i></span>
      </div>
    <!--  <div class="reimburse">
        <div class="rb_item_1">退款金额
          <p><span>￥<i>29</i>.<em>99</em></span></p>
        </div>
        <div class="rb_item_2">退回原付款卡
          <p><span>￥<i>29</i>.<em>99</em></span></p>
        </div>
      </div>-->
      <group>
        <cell title="审核进度：客服审核" is-link></cell>
      </group>
      <div class="step clearfix">
        <div class="stepInfo">
          <ul>
            <li class="active"></li>
            <li class=""></li>
            <li class=""></li>
            <li class=""></li>
          </ul>
          <div class="stepIco stepIco1" :class="{'active':resultData.state>0}">
            <div class="stepText">提交申请</div>
          </div>
          <div class="stepIco stepIco2" :class="{'active':resultData.state>=1}">
            <div class="stepText">{{resultData.state<=1?'待审核':resultData.state==2?'审核失败':'审核通过'}}</div>
          </div>
          <div class="stepIco stepIco3" :class="{'active':resultData.state>5}">
            <div class="stepText">商品处理</div>
          </div>
          <div class="stepIco stepIco4" :class="{'active':resultData.state>6}">
            <div class="stepText">完成</div>
          </div>
          <div class="stepIco stepIco5" :class="{'active':resultData.state>7}">
            <div class="stepText">客户确认</div>
          </div>

        </div>
      </div>
      <div class="pd">
        <div class="title">问题描述</div>
        <p>
          {{resultData.description}}</p>
        <span>{{resultData.subTime}}</span>
      </div>
      <div class="rds_btn">
        <p>取消申请</p>
      </div>
    </div>
  </div>
</template>
<script>
  import {XInput, XHeader, Group, Cell} from 'vux'
  import {formatRefundState} from '../../../common/js/util'
  //1：待审核；2：审核失败；3：等待买家发货；4：等待商家收货；5：等待商家发货/退款中；6：商家已发货/已退款；7：完成
  export default {
    components: {
      XInput,
      XHeader,
      Group,
      Cell
    },
    data() {
      return {
        userInfo: {},
        serviceNumber: '',
        resultData:{},

      }
    },
    methods: {
      formatRefundState(state){
          return formatRefundState(state);
      },
      initData(){
        var that = this;
        that.$post(that.$interface_url.order.repairDetail, {
          token: this.userInfo.token,
          serviceNumber: this.serviceNumber
        }, function (data, success) {
          if (success) {
            that.resultData=data;
          }
        });
      }
    },
    created(){
      this.userInfo = this.$getStorage(this.$storage_key.USERINFO_STORAGE);
      if (this.$route.query && this.$route.query.number) {
        this.serviceNumber = this.$route.query.number;
        this.initData();
      }
      else {
        this.$vux.toast.show({text: '非法访问', type: 'warn'});
        this.$router.back();
      }
    }
  }
</script>

<style rel="stylesheet/less" lang="less">
  @import "../../../assets/css/refundDetails.less";

  i,
  em {
    font-style: normal;
  }
</style>
