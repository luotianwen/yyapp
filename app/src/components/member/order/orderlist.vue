<template>
  <div class="wait_buy">
    <div class="ot_header">
      <x-header :left-options="{showBack:true}" :right-options="{showMore: true}">{{formatTitle()}}
        <!--<span class="amend"></span>-->
      </x-header>
    </div>
    <div class="wb_tab">
      <tab :line-width=1>
        <tab-item v-for="(item,index) in typeList" @on-item-click="onItemClick" :key="index"
                  :selected="type == item.type">{{item.text}}
        </tab-item>

      </tab>
    </div>
    <!--无数据的时候-->
    <div class="ot_content_1" v-show="!(orderList&&orderList.length>0)">
      <p>
        <img src="../../../assets/image/mine/obligation.png"/>
        <span>您还没有相关订单</span>
      </p>
    </div>
    <!--有数据的时候-->
    <scroller lock-x scrollbar-y :use-pullup="true" v-model="scrollerStatus" :pullup-config="pullupConfig"
              @on-pullup-loading="upEvent" ref="scroller" v-show="orderList&&orderList.length>0">
      <div class="ot_content_2">
        <div class="information" v-for="order in orderList" :key="order.orderId">
          <div>
            <div class="title" @click="$router.push({name:'shop',query:{shopid:order.shopId}})">
              <p>{{order.shopName}}</p><span></span><i v-if="comment==0">{{format(order.orderStatus)}}</i>
            </div>
            <div class="purchase_details clearfix" v-for="good in order.wares" :class="{'detailborder':comment==2}">
              <img :src="good.productImage" alt=""/>
              <div class="msg" @click="goDetail(order.orderId)">
                <p>
                  {{good.productName}}</p>
                <span>￥<i>{{good.totalMoney.toFixed(2)}}</i></span>
                <em>x{{good.quantity}}</em>
              </div>

            </div>
          </div>
          <div class="sum_to">
            <div class="ot_prices clearfix" v-if="type!=3">
              <div class="oa_num">合计：<i>￥</i><span class="integer">{{order.order_payment.toFixed(2)}}</span>
                <!--.<span class="decimals">00</span>--><span
                  class="freight">(含运费￥<i>{{order.freight_price.toFixed(2)}}</i>)</span></div>
              <p>共<i class="num">{{order.wareNum}}</i>商品</p>
            </div>
            <div class="operating_btn" v-if="order.orderStatus==0">
              <span class="payment_btn" @click="goPay(order.orderId)">去支付</span>
              <span class="cancel_btn_1" v-on:click="showReason(order.orderId)">取消订单</span>
            </div>

            <div class="operating_btn" v-if="order.orderStatus==2">
              <span class="payment_btn" @click="confirmReceipt(order.orderId)">确认收货</span>
              <span class="cancel_btn_1" v-on:click="gologisticsMsg(order)">查看物流</span>
            </div>
            <div class="operating_btn" v-if="order.orderStatus==4||(order.orderStatus==3&&order.estatus==1)">
              <span class="payment_btn" @click="confirmReceipt(order.orderId)">再次购买</span>
              <span class="cancel_btn_1" v-on:click="gologisticsMsg(order)">删除订单</span>
            </div>

            <div class="operating_btn" v-if="order.orderStatus==3&&order.estatus==2">
              <span class="payment_btn" @click="goComment(order)">评价晒单</span>
            </div>
          </div>
        </div>
        <divider v-show="!hasNextPage&&currentPage>1">已经到底部了</divider>
      </div>


    </scroller>


    <actionsheet v-model="reasonShow" :menus="menus1" show-cancel
                 @on-click-menu="menuClick"></actionsheet>
  </div>
</template>
<script>
  import {XHeader, Actionsheet} from 'vux'
  import {formatOrderState} from '../../../common/js/util'
  import {Scroller, Divider, Tab, TabItem} from 'vux'
  //state	订单状态（0：等待付款；1：等待发货；2：等待收货；3：交易成功；4：取消订单；5：交易关闭；6：退货；）
  const list = () => [
    {type: 999, comment: 0, text: '全部订单'},
    {type: 0, comment: 0, text: '待付款'},
    {type: 1, comment: 0, text: '待发货'},
    {type: 2, comment: 0, text: '待收货'},
    {type: 3, comment: 2, text: '待评价'},
    {type: 4, comment: 0, text: '已取消'},
  ]
  export default {
    components: {
      XHeader,
      Actionsheet,
      Scroller, Divider, Tab, TabItem
    },
    data() {
      return {
        typeList: list(),
        type: 0,//参数
        comment: 0,//参数
        reasonShow: false,
        currentPage: 1,
        userInfo: {},
        orderList: [],
        hasNextPage: false,
        selectedOrderId: '',//当前选择的订单号，取消订单时使用
        pullupConfig: {
          content: '上拉加载内容',
          pullUpHeight: 60,
          height: 40,
          autoRefresh: false,
          downContent: '松开刷新',
          upContent: '上拉加载内容',
          loadingContent: '正在加载',
          clsPrefix: 'xs-plugin-pullup-'
        },
        scrollerStatus: {
          pullupStatus: 'default'
        },
        menus1: {
          1: '我不想买了',
          2: '填写信息错误，重拍',
          3: '卖家缺货',
          4: '其他原因',
        }
      }
    },
    methods: {
      onItemClick (index) {
        this.type = this.typeList[index].type;
        this.comment = this.typeList[index].comment;
        this.orderList = [];
        this.initData();
      },
      //上拉事件
      upEvent () {
        if (this.hasNextPage) {
          this.currentPage++;
          this.initData();
        }
        else {
          this.$nextTick(() => {//重置scroller状态
            //that.$refs.scroller.disablePullup();
            this.$refs.scroller.disablePullup();
            this.scrollerStatus.pullupStatus = 'default';

            this.$refs.scroller.reset();
          });
        }
      },
      showReason: function (orderId) {
        this.reasonShow = true;
        this.selectedOrderId = orderId;
      },
      //格式化订单状态，公共js里的方法导入后再表达式里无法直接使用，所以重新写了个方法，待研究解决
      format(state){
        return formatOrderState(state)
      },
      //页面加载方法
      initData(){
        var that = this;
        var params = {
          token: that.userInfo.token,
        };

        if (that.type === 0) {
          params.state = that.type;
        } else if (that.type && that.type != 999) {
          params.state = that.type;
        }
        params.comment = that.comment;
        params.currentPage = that.currentPage;
        that.$post(that.$interface_url.order.list, params, function (data, success) {
          if (success) {
            that.hasNextPage = data.hasNextPage;
            data.resultData.forEach(function (item, index) {//拿到结果集后对结果集进行循环然后push到当前页面的数组里，因为分页，每次加载都将新结果push到之前的结果集里
              that.orderList.push(item);
            });
            if (data.hasNextPage) {//如果有下一页重置scroller
              that.$nextTick(() => {
                that.scrollerStatus.pullupStatus = 'default';
                that.$refs.scroller.reset();
              });
            }
            else {//没有下一页隐藏下拉
              that.$nextTick(() => {
                //that.$refs.scroller.disablePullup();
                that.$refs.scroller.disablePullup();
                that.scrollerStatus.pullupStatus = 'default';

                that.$refs.scroller.reset();
              });
            }
          }
          else {
            that.$vux.toast.show({text: '数据加载失败！', type: 'warn'});
          }
        });
      },
      //去支付
      goPay(orderId){
        this.$router.push({name: 'pay', params: {order: orderId, type: 2}});
      },
      //跳转详情页
      goDetail(orderId){
        this.$router.push({name: 'orderdetail', params: {orderId: orderId}});
      },
      //物流详情
      gologisticsMsg(order){
        this.$router.push({name: 'logisticsMsg', query: {orderid: order.orderId}});
      },
      //格式化标题
      formatTitle(){
        if (this.type == 999) {
          return '全部订单';
        }
        else if (this.type == 0) {
          return '待付款';
        }
        else if (this.type == 1) {
          return '待发货'
        }
        else if (this.type == 2) {
          return '待收货'
        }
        else if (this.type == 3 && this.comment == 2) {
          return '待评价'
        }
        else if (this.type == 6) {
          return '退货/售后'
        }
        else if (this.type == 4) {
          return '已取消';
        }
      },
      //取消订单菜单点击事件
      menuClick(key){
        if (key == 'cancel') {
          this.reasonShow = false;
          return;
        }
        var that = this;
        this.$vux.confirm.show({
          content: '确认取消?',
          confirmText: '确认',
          cancelText: '取消',
          // 组件除show外的属性
          onCancel () {

          },
          onConfirm () {
            that.$post(that.$interface_url.order.cancel, {
              token: that.userInfo.token,
              order_id: that.selectedOrderId,
              reason: key
            }, function (data, success) {
              if (success) {
                that.orderList.forEach(function (item, index) {
                  if (item.orderId == that.selectedOrderId) {
                    that.orderList.splice(index, 1);
                  }
                })
                that.$vux.toast.show({text: '取消成功', width: '18em'});
              }
              else {
                that.$vux.toast.show({text: '订单取消失败，请联系客服人员！', type: 'warn', width: '18em'})
              }
            })
          }
        })
      },
      //确认收货事件
      confirmReceipt(orderId){//确认收货
        var that = this;
        this.$vux.confirm.show({
          content: '确认已收到货物?',
          confirmText: '确认',
          cancelText: '取消',
          // 组件除show外的属性
          onCancel () {

          },
          onConfirm () {
            that.$post(that.$interface_url.order.confirm, {
              token: that.userInfo.token,
              order_id: orderId
            }, function (data, success) {
              if (success) {

                that.$vux.toast.show({text: '操作成功', width: '18em'});
                that.$router.push({name: 'OrderSuccess', query: {orderId: orderId}});
              }
              else {
                that.$vux.toast.show({text: '操作失败，请联系客服人员！', type: 'warn', width: '18em'})
              }
            })
          }
        })
      },
      //去评价
      goComment(order){
        this.$router.push({name: 'evaluate', params: {order: order}});
      }
    },
    created(){
      this.userInfo = this.$getStorage(this.$storage_key.USERINFO_STORAGE);
      if (this.$route.query) {
        this.type = this.$route.query.type === '' ? 999 : this.$route.query.type;
        this.comment = this.$route.query.comment;
      }
      this.initData();
    }
  }
</script>

<style rel="stylesheet/less" lang="less">
  @import "../../../assets/css/obligation.less";

  i,
  em {
    font-style: normal;
  }

  .tabContent {
    position: relative;
    top: 88rem / @font-size-base;
  }
</style>
