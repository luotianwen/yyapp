<template>
    <!--分销订单-->
    <div id="distribution-order" :class="{'empty':orderList.length<4,'full':orderList.length >4}">
        <!--header-->
        <div class="distribution-order-header">
            <img class="back" v-show="true" @click="back" src="../../assets/image/distribution/icon_back_white.png">
            <div class="empty"></div>
            <div class="title-wrapper">
                <span class="title" :class="{'show-menu':isShowPanel}" @click="showMenu">分销订单</span>
            </div>
        </div>
        <div class="distribution-order-content">
            <div class="order-total-wrapper">
                <!--订单数量-->
                <div class="order-wrapper">
                    <div class="txt">订单数量</div>
                    <div class="num">{{orderTotal.total_order?orderTotal.total_order:0}}</div>
                </div>
                <!--总订单金额-->
                <div class="order-wrapper">
                    <div class="txt">总订单金额</div>
                    <div class="num">{{orderTotal.total_amount?orderTotal.total_amount:0}}</div>
                </div>
                <!--可提现金额-->
                <div class="order-wrapper">
                    <div class="txt">可提现金额</div>
                    <div class="num">{{orderTotal.total_exchange?orderTotal.total_exchange:0}}</div>
                </div>
            </div>
            <scroller lock-x scrollbar-y :use-pullup="true" height="-40" v-model="scrollerStatus"
                      :pullup-config="pullupConfig"
                      @on-pullup-loading="upEvent" ref="scroller" v-show="orderList&&orderList.length>0">
                <!--订单列表-->
                <div class="order-list-content">
                    <div class="order-item-wrapper" v-for="(order,index) in orderList">
                        <div class="time-wrapper">
                            <span class="txt-time">付款时间:</span><span class="time">{{order.order_time}}</span>
                        </div>
                        <div class="money-wrapper">
                            <span class="txt">订单总额</span><span
                                class="money"><span>¥</span>{{order.order_amount}}</span>
                        </div>
                        <div class="commission-wrapper">
                            <span class="txt">分销佣金</span><span class="commission"><span class="rmb">¥</span>{{order.commission}}<span
                                class="price-small"></span></span>
                        </div>
                        <div class="distributor-wrapper">
                            <span class="txt">我的分销商</span><span
                                class="distributor">{{order.recommended_userName}}</span>
                        </div>
                    </div>
                    <divider v-if="!hasNextPage&&currentPage>0&&orderList.length>3">已经到底部了</divider>
                </div>
            </scroller>
            <!--分销订单为空的页面-->
            <div class="empty-wrapper" v-if="orderList.length==0">
                <img src="../../assets/image/distribution/empty_order_tip.png">
                <span class="txt-empty-tip">您暂无分销订单</span>
            </div>
        </div>
        <!--条件筛选面板-->
        <transition name="fade">
            <div class="select-panel-wrapper" v-if="isShowPanel" @click="hide" transition="fade">
                <div class="condition-wrapper">
                    <span class="order-all" @click="selectCondition(dayType.all)">全部订单</span>
                    <span class="order-today" @click="selectCondition(dayType.today)">今日订单</span>
                    <span class="order-week" @click="selectCondition(dayType.week)">本周订单</span>
                    <span class="order-month" @click="selectCondition(dayType.month)">本月订单</span>
                </div>
            </div>
        </transition>
    </div>
</template>

<script type="text/ecmascript-6">
    import {Scroller, Divider} from 'vux'
    import {isLogin} from '../../common/js/checkIsLogin'

    export default{
        data(){
            return {
                userInfo: [],
                orderTotal: {},
                typeDefault: {'type': 0},
                dayType: {'all': 0, 'today': 1, 'yesterday': 2, 'week': 3, 'month': 4},//0-全部订单，1-今日订单， 2-昨日订单，3-本周订单，4-本月订单
                isShowPanel: false,
                orderList: [],
                currentPage: 1,
                hasNextPage: false,
                pullupConfig: {
                    content: '上拉加载内容',
                    pullUpHeight: 60,
                    height: 40,
                    autoRefresh: true,
                    downContent: '松开刷新',
                    upContent: '上拉加载内容',
                    loadingContent: '正在加载',
                    clsPrefix: 'xs-plugin-pullup-'
                },
                scrollerStatus: {
                    pullupStatus: 'default'
                }
            }
        },
        methods: {
            back(){
                history.go(-1);
            },
            showMenu(){
                this.isShowPanel = !this.isShowPanel;
            },
            //隐藏条件筛选末班
            hide(){
                this.isShowPanel = false;
            },
            //上拉事件
            upEvent () {
                if (this.hasNextPage) {
                    this.currentPage++;
                    this.initData();
                }
                else {
                    this.$nextTick(() => {//重置scroller状态
                        this.$refs.scroller.disablePullup();
                        this.scrollerStatus.pullupStatus = 'default';
                        this.$refs.scroller.reset();
                    });
                }

            },
            initData(){
                let that = this;
                that.$post(that.$interface_url.distribution.getOrderList, {
                    token: this.userInfo.token,
                    day: that.typeDefault.type,//0-全部订单，1-今日订单， 2-昨日订单，3-本周订单，4-本月订单
                    currentPage: that.currentPage
                }, function (data, success) {
                    if (success) {
                        that.hasNextPage = data.hasNextPage;
                        if (data) {
                            data.resultData.forEach(function (item, index) {
                                that.orderList.push(item);
                            });
                        }
                        if (data.hasNextPage) {//如果有下一页重置scroller
                            that.$nextTick(function () {
                                that.scrollerStatus.pullupStatus = 'default';
                                that.$refs.scroller.reset();
                            });
                        } else {//没有下一页隐藏下拉
                            that.$nextTick(function () {
                                this.$refs.scroller.disablePullup();
                                that.scrollerStatus.pullupStatus = 'default';
                                that.$refs.scroller.reset();
                            });
                        }
                    } else if (data == '10004') {
                        let returnurl = that.$route.path;
                        that.$router.push({name: 'login', query: {returnurl: returnurl}});
                    } else {
                        that.$nextTick(function () {
                            that.scrollerStatus.pullupStatus = 'default';
                            that.$refs.scroller.reset();
                        });
                        that.$vux.toast.show({text: data, type: 'warn', width: '18em'});
                    }
                });
            },
            //0-全部订单，1-今日订单，2-本周订单，3-本月订单
            selectCondition(type){
                //进行type相对应得网络请求
                this.$refs.scroller.enablePullup();
                let that = this;
                that.$post(that.$interface_url.distribution.getOrderList, {
                    token: this.userInfo.token,
                    day: type,
                    currentPage: 1
                }, function (data, success) {
                    if (success) {
                        that.currentPage = 1;
                        that.hasNextPage = data.hasNextPage;
                        if (data) {
                            that.hasNextPage = data.hasNextPage;
                            that.orderList = data.resultData;
                        }
                        if (data.hasNextPage) {//如果有下一页重置scroller
                            that.$nextTick(() => {
                                that.scrollerStatus.pullupStatus = 'default';
                                that.$refs.scroller.reset({
                                    top: 0
                                });
                            });
                        } else {//没有下一页隐藏下拉
                            that.$nextTick(() => {
                                that.$refs.scroller.disablePullup();
                                that.scrollerStatus.pullupStatus = 'default';
                                that.$refs.scroller.reset();
                            });
                        }
                    } else if (data == '10004') {
                        let returnurl = that.$route.path;
                        that.$router.push({name: 'login', query: {returnurl: returnurl}});
                    } else {
                        that.$vux.toast.show({text: data, type: 'warn', width: '18em'});
                    }
                });
            }
        },
        created(){
            this.typeDefault = this.$route.params;
            this.userInfo = this.$getStorage(this.$storage_key.USERINFO_STORAGE);
            let that = this;
            if (isLogin()) {
                //订单列表
                that.$post(that.$interface_url.distribution.getOrderList, {
                    token: this.userInfo.token,
                    day: that.typeDefault.type,//0-全部订单，1-今日订单， 2-昨日订单，3-本周订单，4-本月订单
                    currentPage: 1
                }, function (data, success) {
                    if (success) {
                        if (data) {
                            that.hasNextPage = data.hasNextPage;
                            that.orderList = data.resultData;
                        }
                        if (data.hasNextPage) {//如果有下一页重置scroller
                            that.$nextTick(() => {
                                that.scrollerStatus.pullupStatus = 'default';
                                that.$refs.scroller.reset();
                            });
                        } else {//没有下一页隐藏下拉
                            that.$nextTick(() => {
                                that.$refs.scroller.disablePullup();
                                that.scrollerStatus.pullupStatus = 'default';
                                that.$refs.scroller.reset();
                            });
                        }
                    } else if (data == '10004') {
                        let returnurl = that.$route.path;
                        that.$router.push({name: 'login', query: {returnurl: returnurl}});
                    } else {
                        that.$vux.toast.show({text: data, type: 'warn', width: '18em'});
                    }
                });
                //订单总信息
                that.$post(that.$interface_url.distribution.getTotal, {
                    token: this.userInfo.token
                }, function (data, success) {
                    if (success) {
                        if (data) {
                            that.orderTotal = data;
                        }
                    } else if (data == '10004') {
                    } else {
                        that.$vux.toast.show({text: data, type: 'warn', width: '18em'});
                    }
                });
            } else {
                let returnurl = that.$route.path;
                that.$router.replace({name: 'login', query: {returnurl: returnurl}});
            }


        },
        components: {
            isLogin, Scroller, Divider
        }
    }
</script>

<style lang="less" rel="stylesheet/less">
    @import "../../assets/css/base.less";

    #distribution-order {
        position: absolute;
        width: 100%;
        height: 100%;
        background-color: #ededed;
        overflow: hidden;
        &.empty {
            position: fixed;
        }
        &.full {
            position: absolute;
        }
        /*header*/
        .distribution-order-header {
            display: -webkit-box; /* 老版本语法: Safari, iOS, Android browser, older WebKit browsers. */
            display: -moz-box; /* 老版本语法: Firefox (buggy) */
            display: -ms-flexbox; /* 混合版本语法: IE 10 */
            display: -webkit-flex; /* 新版本语法: Chrome 21+ */
            display: flex; /* 新版本语法: Opera 12.1, Firefox 22+ */
            width: 100%;
            height: 88rem/@font-size-base;
            position: fixed;
            top: 0;
            left: 0;
            z-index: 999999;
            background-color: #04ad20;
            .back {
                flex: 0 0 auto;
                width: 18rem/@font-size-base;
                height: 32rem/@font-size-base;
                padding: 10rem/@font-size-base;
                margin-left: 24rem/@font-size-base;
                margin-top: 16rem/@font-size-base;
            }
            .empty {
                flex: 1;
            }
            .title-wrapper {
                position: absolute;
                text-align: center;
                left: 30%;
                right: 30%;
                .title {
                    display: inline-block;
                    color: #ffffff;
                    font-size: 34rem/@font-size-base;
                    height: 88rem/@font-size-base;
                    line-height: 88rem/@font-size-base;
                    background: url('../../assets/image/distribution/arrow_down_white.png') no-repeat right;
                    -webkit-background-size: 6px 3px;
                    background-size: 6px 3px;
                    padding-right: 10px;
                    &.show-menu {
                        background: url('../../assets/image/distribution/arrow_up_white.png') no-repeat right;
                        -webkit-background-size: 6px 3px;
                        background-size: 6px 3px;
                    }
                }
            }

        }
        /*订单统计：订单数量，订单总金额，可提现金额*/
        .distribution-order-content {
            position: relative;
            width: 100%;
            height: 100%;
            background-color: @bg-color;
            margin-top: 88rem/@font-size-base;
            /*订单统计*/
            .order-total-wrapper {
                display: -webkit-box; /* 老版本语法: Safari, iOS, Android browser, older WebKit browsers. */
                display: -moz-box; /* 老版本语法: Firefox (buggy) */
                display: -ms-flexbox; /* 混合版本语法: IE 10 */
                display: -webkit-flex; /* 新版本语法: Chrome 21+ */
                display: flex; /* 新版本语法: Opera 12.1, Firefox 22+ */
                position: fixed;
                width: 100%;
                z-index: 80;
                height: 134rem/@font-size-base;
                background-color: #04ad20;
                .order-wrapper {
                    flex: 1;
                    text-align: center;
                    margin: auto;
                    .txt {
                        font-size: 22rem/@font-size-base;
                        color: #a5f9ad;
                        margin-bottom: 18rem/@font-size-base;
                    }
                    .num {
                        font-size: 32rem/@font-size-base;
                        color: #ffffff;
                    }
                }
            }
            /*订单列表*/
            .order-list-content {
                z-index: 60;
                position: relative;
                padding-top: 132rem/@font-size-base;
                .order-item-wrapper {
                    padding: 0 22rem/@font-size-base;
                    background-color: #ffffff;
                    border-top: 18rem/@font-size-base solid #ededed;
                    .time-wrapper {
                        height: 88rem/@font-size-base;
                        font-size: 24rem/@font-size-base;
                        color: @normal-font-gray;
                        line-height: 88rem/@font-size-base;
                        border-bottom: 1px solid #ededed;
                        background-color: #ffffff;
                        .txt-time {
                            display: inline-block;
                            margin-right: 10rem/@font-size-base;
                        }
                    }
                    .money-wrapper {
                        margin-top: 24rem/@font-size-base;
                        .txt {
                            display: inline-block;
                            font-size: 24rem/@font-size-base;
                            color: #999999;
                        }
                        .money {
                            float: right;
                            display: inline-block;
                            font-size: 24rem/@font-size-base;
                            color: #999999;
                            span {
                                display: inline-block;
                                margin-right: 8rem/@font-size-base;
                            }

                        }
                    }
                    .commission-wrapper {
                        margin: 20rem/@font-size-base 0;
                        .txt {
                            font-size: 24rem/@font-size-base;
                            color: @normal-font-gray;
                        }
                        .commission {
                            float: right;
                            display: inline-block;
                            font-size: 32rem/@font-size-base;
                            color: @red;
                            .rmb, .price-small {
                                display: inline-block;
                                font-size: 24rem/@font-size-base;
                            }
                            .rmb {
                                margin-right: 8rem/@font-size-base;
                            }
                        }
                    }
                    .distributor-wrapper {
                        padding-bottom: 24rem/@font-size-base;
                        .txt {
                            font-size: 24rem/@font-size-base;
                            color: #999999;
                        }
                        .distributor {
                            float: right;
                            font-size: 24rem/@font-size-base;
                            color: #999999;
                        }
                    }
                }
            }

            /*订单为空时的提示*/
            .empty-wrapper {
                position: fixed;
                width: 100%;
                margin: 420rem/@font-size-base auto auto;
                img {
                    display: block;
                    margin: auto;
                    width: 180rem/@font-size-base;
                    height: 180rem/@font-size-base;
                }
                .txt-empty-tip {
                    display: inline-block;
                    width: 100%;
                    text-align: center;
                    font-size: 28rem/@font-size-base;
                    color: #707070;
                    margin-top: 24rem/@font-size-base;
                }
            }
            .bottom-divider-wrapper {
                position: relative;
                background-color: #00000000;
                height: 180rem/@font-size-base;
                .loading-tip {
                    font-size: 24rem/@font-size-base;
                    color: #666677;
                    margin: 30rem/@font-size-base 0;
                    text-align: center;
                }
            }
        }
        .select-panel-wrapper {
            display: -webkit-box; /* 老版本语法: Safari, iOS, Android browser, older WebKit browsers. */
            display: -moz-box; /* 老版本语法: Firefox (buggy) */
            display: -ms-flexbox; /* 混合版本语法: IE 10 */
            display: -webkit-flex; /* 新版本语法: Chrome 21+ */
            display: flex; /* 新版本语法: Opera 12.1, Firefox 22+ */
            position: fixed;
            width: 100%;
            height: 100%;
            left: 0;
            top: 88rem/@font-size-base;
            background-color: rgba(0, 0, 0, 0.4);
            z-index: 100;
            transition: all 0.5s;
            &.fade-enter-active {
                opacity: 1;
            }
            &.fade-enter, &.fade-leave-active {
                opacity: 0;
            }
            .condition-wrapper {
                width: 100%;
                background: #FFFFFF;
                display: -webkit-box; /* 老版本语法: Safari, iOS, Android browser, older WebKit browsers. */
                display: -moz-box; /* 老版本语法: Firefox (buggy) */
                display: -ms-flexbox; /* 混合版本语法: IE 10 */
                display: -webkit-flex; /* 新版本语法: Chrome 21+ */
                display: flex; /* 新版本语法: Opera 12.1, Firefox 22+ */
                height: 88rem/@font-size-base;
                .order-all, .order-today, .order-week, .order-month {
                    flex: 1;
                    font-size: 24rem/@font-size-base;
                    color: @normal-font-gray;
                    line-height: 88rem/@font-size-base;
                    text-align: center;
                    background-color: #ffffff;
                    &:active {
                        color: @main-color;
                        background-color: #f0f0f0;
                    }
                }
            }
        }
    }
</style>
