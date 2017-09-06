<template>
  <div class="aRefundAfter">
    <div class="ara_header">
      <x-header :left-options="{showBack:true}" :right-options="{showMore: true}">退货/售后</x-header>
    </div>
    <div class="ara_tab">
      <tab :line-width=1>
        <tab-item :selected="demo4 === item" v-for="(item, index) in list4" :key="index" @on-item-click="changeTab">{{item}}
        </tab-item>
      </tab>
    </div>
    <div class="ara_content_1" v-show="!hasList">
      <p>
        <img src="../../../assets/image/mine/obligation.png"/>
        <span>您还没有相关信息</span>
      </p>
    </div>
    <scroller lock-x scrollbar-y :use-pullup="true" v-model="scrollerStatus" :pullup-config="pullupConfig"
              @on-pullup-loading="orderUpEvent" ref="scroller" v-show="orderList&&orderList.length>0&&tabIndex==0">
      <div class="ara_content_2">
        <div class="information" v-for="order in orderList">
          <div class="title">
            <p>订单编号：</p><span>{{order.orderId}}</span><i>交易完成</i>
          </div>
          <div class="ara_msg" v-for="good in order.wareList">
            <div class="purchase_details clearfix"><img
              :src="good.productImage"
              alt="">
              <div class="msg">
                <p>{{good.productName}}</p>
                <em>x{{good.quantity}}</em>
              </div>
            </div>
            <div class="sum_to">
              <div class="operating_btn">
                <span class="payment_btn"@click="goAfterSale(order,good.sku)" v-show="good.sstatus==0">售后申请</span>
                <span class="payment_btn" style="border:none;width:150px;color:#3C3F41;!important;" v-show="good.sstatus!=0&&good.sstatus!=9">该商品已经申请售后</span>
                <span class="payment_btn" style="border:none;width:150px;float:left;color:#3C3F41;!important;" v-show="good.sstatus==9">该商品已超过售后期</span>

              </div>
            </div>
          </div>

        </div>

      </div>
    </scroller>
    <scroller lock-x scrollbar-y :use-pullup="true" v-model="scrollerStatus" :pullup-config="pullupConfig"
              @on-pullup-loading="orderUpEvent" ref="scroller1" v-show="afterList&&afterList.length>0&&tabIndex==1">
      <div class="ara_content_2">
        <div class="information" v-for="order in afterList">
          <div class="title">
            <p>服务单号：</p><span>{{order.serviceNumber}}</span><i></i>
          </div>
          <div class="ara_msg">
            <div class="purchase_details clearfix"><img
              :src="order.productImage"
              alt="">
              <div class="msg">
                <p>{{order.productName}}</p>
                <em></em>
              </div>
            </div>
            <div class="sum_to">
              <div class="operating_btn">
                <span class="payment_btn" style="margin-left:10px" @click="goDetails(order.serviceNumber)">查看详情</span>
                <span class="payment_btn">{{formatState(order.state)}}</span>

              </div>
            </div>
          </div>

        </div>

      </div>
    </scroller>
  </div>
</template>
<script>
  import {Tab, TabItem, XHeader, Scroller} from 'vux'
  //0正常 1退货2换货3维修,9已过售后期
  export default {
    components: {
      XHeader,
      Tab,
      TabItem,
      Scroller
    },
    data() {
      return {
        hasList: false,
        userInfo: {},
        afterList: [],
        orderList: [],
        currentPage: 1,
        currentPage_Order: 1,
        orderHasNextPage: true,
        afterHasNextPage: true,
        list4: ['售后申请', '申请记录'],
        demo4: '售后申请',
        tabIndex: 0,
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
      }
    },
    methods: {
      changeTab(index){
        this.tabIndex = index;
        if (index == 1 && !(this.afterList && this.afterList.length > 0)) {
          this.initData();
        }
        else if (this.afterList && this.afterList.length > 0) {
          this.hasList = true;
        }
        else if (index == 0 && this.orderList && this.orderList.length > 0) {
          this.hasList = true;
        }
        else {
          this.hasList = false;
        }
      },
      formatState(state){//状态 1：待审核；2：审核失败；3：等待买家发货；4：等待商家收货；5：等待商家发货/退款中；6：商家已发货/已退款；7：完成
        var text = "";
        switch (state) {
          case 1:
            text = '待审核';
            break;
          case 2:
            text = '审核失败';
            break;
          case 3:
            text = '等待买家发货';
            break;
          case 4:
            text = '等待商家收货';
            break;
          case 5:
            text = '等待商家发货/退款中';
            break;
          case 6:
            text = '商家已发货/已退款';
            break;
          case 7:
            text = '完成';
            break;
          default:
            text = '未知';
            break;

        }
        return text;
      },
      orderUpEvent(){
        if (this.tabIndex == 0) {
          if (!this.orderHasNextPage)return;
          this.currentPage_Order++;
          this.initAfterOrder();
        }
        else if (this.tabIndex == 1) {
          if (!this.afterHasNextPage)return;
          this.currentPage++;
          this.initData();
        }
      },
      initAfterOrder(){
        var that = this;
        var params = {
          token: that.userInfo.token,
        };
        params.currentPage = that.currentPage_Order;

        that.$post(that.$interface_url.order.repairWareList, params, function (data, success) {
          if (success) {
            if (!(data && data.resultData && data.resultData.length > 0)) {
              that.hasList = false;
              return;
            }
            else {
              that.hasList = true;
            }
            that.orderHasNextPage = data.hasNextPage;
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
                //that.scrollerStatus.pullupStatus = 'default';

                that.$refs.scroller.reset();
              });
            }
          }
          else {
            that.$vux.toast.show({text: '数据加载失败！', type: 'warn'});
          }
        });
      },
      initData(){
        var that = this;
        that.$post(that.$interface_url.order.repairList, {
          token: that.userInfo.token,
          currentPage: that.currentPage
        }, function (data, success) {
          if (success) {
            if (!(data && data.resultData && data.resultData.length > 0)) {
              that.hasList = false;
              return;
            }
            else {
              that.hasList = true;
            }
            that.afterHasNextPage = data.hasNextPage;
            data.resultData.forEach(function (item, index) {//拿到结果集后对结果集进行循环然后push到当前页面的数组里，因为分页，每次加载都将新结果push到之前的结果集里
              that.afterList.push(item);
            });
            if (data.hasNextPage) {//如果有下一页重置scroller
              that.$nextTick(() => {
                that.scrollerStatus.pullupStatus = 'default';
                that.$refs.scroller1.reset();
              });
            }
            else {//没有下一页隐藏下拉
              that.$nextTick(() => {
                //that.$refs.scroller.disablePullup();
                that.$refs.scroller1.disablePullup();
                //that.scrollerStatus.pullupStatus = 'default';

                that.$refs.scroller1.reset();
              });
            }
          }
          else {
            that.$vux.toast.show({text: '数据加载失败！', type: 'warn'});
          }
        });
      },
      goAfterSale(order, sku){
        this.$router.push({name: 'afterSale', params: {orderId: order.orderId, sku: sku}});
      },
      goDetails(number){
          this.$router.push({name:'refundDetails',query:{number:number}});
      }
    },
    created(){
      this.userInfo = this.$getStorage(this.$storage_key.USERINFO_STORAGE);
      this.initAfterOrder();
      this.initData();
    },
    mounted(){
      this.$nextTick(() => {
        this.scrollerStatus.pullupStatus = 'default';
        this.$refs.scroller.reset();
        this.$refs.scroller1.reset();
      });

    }
  }
</script>

<style rel="stylesheet/less" lang="less">
  @import "../../../assets/css/aRefundAfter.less";

  i,
  em {
    font-style: normal;
  }
</style>
