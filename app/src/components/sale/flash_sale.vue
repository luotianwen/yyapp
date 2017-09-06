<template>
    <div id="flash-sale">
        <!--header-->
        <div class="flash-sale-header">
            <x-header :left-options="{showBack:true,backText:''}"><span class="share" @click="showShare"><i></i></span>
            </x-header>
        </div>
        <!--tab item-->
        <scroller style="background-color: #3D4245" lock-y :scrollbar-x=false v-show="false">
            <div id="tabs" class="tabs-wrapper">
                <div class="tab-item" v-for="(item,index) in tabList"
                     @click="clickTabItem(index)" :class="{'selected':clickItemIndex==index}">
                    {{item}}
                </div>
            </div>
        </scroller>
        <!--条件筛选面板-->
        <div class="condition-wrapper" v-show="false">
            <!--综合-->
            <div class="overall-wrapper" @click="selectedOverall">
                <span class="overall"
                      :class="{'selected-up':overallState==2,'normal':overallState==1,'selected-down':overallState==3}">{{txtOverall}}</span>
            </div>
            <!--价格-->
            <div class="price-wrapper" @click="selectedPrice">
                <span class="price">价格</span>
                <div class="arrow-wrapper">
                    <div class="arrow-up"
                         :class="{'selected-up':priceState==2,'normal':priceState==1,'normal':priceState==3}"></div>
                    <div class="arrow-down"
                         :class="{'normal':priceState==2,'normal':priceState==1,'selected-down':priceState==3}"></div>
                </div>
            </div>
            <!--折扣-->
            <div class="rebate-wrapper" @click="selectedRebate">
                <span class="rebate">折扣</span>
                <div class="arrow-wrapper">
                    <div class="arrow-up"
                         :class="{'selected-up':rebateState==2,'normal':rebateState==1,'normal':rebateState==3}"></div>
                    <div class="arrow-down"
                         :class="{'normal':rebateState==2,'normal':rebateState==1,'selected-down':rebateState==3}"></div>
                </div>
            </div>
        </div>
        <!--综合条件面板，默认隐藏-->
        <transition name="fade">
            <div id="overall-item-wrapper" v-show="showOverall" @click="hideOverall">
                <div class="cond-wrapper">
                    <div class="cond" :class="{'selected': overallCond == 1}" @click="overallCondSelected(1)">综合排序</div>
                    <div class="cond" :class="{'selected': overallCond == 2}" @click="overallCondSelected(2)">新品优先</div>
                    <div class="cond" :class="{'selected': overallCond == 3}" @click="overallCondSelected(3)">评论数从高到低
                    </div>
                </div>
                <div class="bg-empty" @click="hideOverall"></div>
            </div>
        </transition>
        <!--content goods list-->
        <scroller lock-x scrollbar-y :use-pullup="true" v-model="scrollerStatus"
                  :pullup-config="pullupConfig"
                  @on-pullup-loading="upEvent" ref="scroller" v-show="goodsList&&goodsList.length>0">
            <div class="flash-sale-content-wrapper">
                <grid :rows="2">
                    <grid-item style="border: none;" v-for="(item, index) in goodsList">
                        <div class="sale-item-wrapper" @click="toProduct(item.sku)"
                             :class="{'right-space':index%2==0,'left-space':index%2==1,'first-line':index==0 || index==1}">
                            <img class="goods-img" :src="item.logo">
                            <countdown :endTime="item.endtime"></countdown>
                            <div class="title">{{item.pName}}</div>
                            <div class="desc" v-show="">时尚字母图案 柔软不变形</div>
                            <div class="sale-price"><span class="rmb">¥ </span>{{item.activityprice}}</div>
                            <div class="old-price">¥ {{item.marketprice}}</div>
                            <!--打折图标-->
                            <div class="discount"
                                 :class="{'first-line':index==0||index==1,'left':index%2==0,'right':index%2==1}">
                                {{item.discount}}折
                            </div>
                            <!--立即抢购按钮-->
                            <div class="btn-snap-up" :class="{'left':index%2==0, 'right':index%2==1}"
                                 @click.stop="clickSnapUp(index)">立即抢购
                            </div>
                        </div>
                    </grid-item>
                </grid>
                <divider v-if="!hasNextPage&&currentPage>0&&goodsList.length>3">已经到底部了</divider>
            </div>
        </scroller>
        <!--share panel-->
        <share ref="share"></share>
    </div>
</template>

<script type="text/ecmascript-6">
    import {XHeader, Scroller, Grid, GridItem, Divider} from 'vux';
    import countdown from './count_down.vue';
    import share from '../share/share.vue';
    const NORMAL = 1, UP = 2, DOWN = 3;//未选中，选中朝上，选中朝下

    export default{
        data(){
            return {
                currentPage: 1,
                userInfo: [],
                txtOverall: '综合',
                clickItemIndex: 0,
                overallCond: 1,//综合条件展开面板，0-综合，1-排序，2-价格默认为0
                showOverall: false,
                overallState: DOWN,//标记综合状态，默认为选中箭头朝下
                priceState: NORMAL,//标记价格排序状态，默认为未选中
                rebateState: NORMAL,//标记折扣状态，默认为未选中
                tabList: ['徒步登山', '露营', '跑步', '骑行', '男士户外', '女士户外', '自驾游'],
                goodsList: [],
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
            // share panel control
            showShare(){
                this.$refs.share.show();
            },
            clickTabItem(index){
                this.clickItemIndex = index;
                let tabList = document.getElementsByClassName('tab-item');
                if (tabList) {
                }
            },
            //点击综合
            selectedOverall(){
                this.showOverall = true;
                this.priceState = NORMAL;
                this.rebateState = NORMAL;
                let index = this.overallState;
                if (index == NORMAL || index == DOWN) {
                    this.overallState = UP;
                } else if (index == UP) {
                    this.overallState = DOWN;
                }
            },
            overallCondSelected(index){
                this.overallCond = index;//改变综合条件筛选
                switch (index) {
                    case 1:
                        this.txtOverall = '综合';
                        break;
                    case 2:
                        this.txtOverall = '新品';
                        break;
                    case 3:
                        this.txtOverall = '评论';
                        break;
                    default:
                        break;
                }
            },
            hideOverall(){
                this.showOverall = false;
                this.overallState = DOWN;
            },
            //点击价格
            selectedPrice(){
                this.overallState = NORMAL;
                this.rebateState = NORMAL;
                let index = this.priceState;
                if (index == NORMAL || index == DOWN) {
                    this.priceState = UP;
                } else if (index == UP) {
                    this.priceState = DOWN;
                }
            },
            //点击折扣
            selectedRebate(){
                this.priceState = NORMAL;
                this.overallState = NORMAL;
                let index = this.rebateState;
                if (index == NORMAL || index == DOWN) {
                    this.rebateState = UP;
                } else if (index == UP) {
                    this.rebateState = DOWN;
                }
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
            //点击立即抢购
            clickSnapUp(index){
                console.log("click index is " + index);
                this.$router.push({
                    name: 'orderSubmit',
                    query: {
                        sku: this.goodsList[index].sku,
                        type: 1
                    }
                });
            },
            //查看商品详情
            toProduct(sku) {
                this.$router.push({
                    name: 'Goods',
                    params: {
                        sku: sku
                    }
                });
            },
            onScroll(pos){
//                console.log("*********************** top is " + pos.top);
            },
            initData(){
                let that = this;
                //订单列表
                that.$post(that.$interface_url.product.flashSale, {
                    currentPage: that.currentPage
                }, function (data, success) {
                    if (success) {
                        that.hasNextPage = data.hasNextPage;
                        if (data) {
                            data.resultData.forEach(function (item, index) {
                                that.goodsList.push(item);
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
                    } else {
                        that.$nextTick(function () {
                            that.scrollerStatus.pullupStatus = 'default';
                            that.$refs.scroller.reset();
                        });
                        that.$vux.toast.show({text: data, type: 'warn', width: '18em'});
                    }
                });
            }
        },
        created(){
            let tabW = this.tabList.length * 154 + 24;
            this.$nextTick(() => {
                let tabWrapper = document.getElementById('tabs');
                if (tabWrapper) {
                    tabWrapper.style.width = tabW / 75 + "rem";
                }
            });

            this.userInfo = this.$getStorage(this.$storage_key.USERINFO_STORAGE);
            let that = this;
            //订单列表
            that.$post(that.$interface_url.product.flashSale, {
                currentPage: that.currentPage
            }, function (data, success) {
                if (success) {
                    if (data) {
                        that.hasNextPage = data.hasNextPage;
                        that.goodsList = data.resultData;
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
                } else {
                    that.$vux.toast.show({text: data, type: 'warn', width: '18em'});
                }
            });
        },
        components: {
            XHeader, Scroller, share, Grid, GridItem, countdown, Divider
        }
    }
</script>

<style lang="less" rel="stylesheet/less">
    @import "../../assets/css/base.less";

    #flash-sale {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        width: 100%;
        height: 100%;
        overflow: hidden;
        /*header*/
        .flash-sale-header {
            width: 100%;
            position: fixed;
            top: 0;
            left: 0;
            z-index: 9990;
            .vux-header {
                height: 88rem/@font-size-base !important;
                background-color: #ffffff !important;
                .vux-header-left {
                    .left-arrow {
                        &:before {
                            border-color: #646973 !important;
                            border-width: 1px 0 0 1px !important;
                            width: 22rem/@font-size-base !important;
                            height: 22rem/@font-size-base !important;
                            top: 34rem/@font-size-base !important;
                            left: 34rem/@font-size-base !important;
                        }
                    }
                }
                h1 {
                    background: url(./icon_flash_sale.png) no-repeat center;
                    background-size: 150rem/@font-size-base 46rem/@font-size-base;
                    -webkit-background-size: 150rem/@font-size-base 46rem/@font-size-base;
                }
                .share {
                    position: absolute;
                    right: 0;
                    width: 73rem/@font-size-base;
                    height: 86rem/@font-size-base;
                    i {
                        display: inline-block;
                        width: 39rem/@font-size-base;
                        height: 39rem/@font-size-base;
                        background: url(../../assets/image/set/share_img.png) no-repeat;
                        background-size: 100%;
                        margin-right: 43rem/@font-size-base;
                        margin-top: 24rem/@font-size-base;
                    }
                }
            }
        }
        /*tabs*/
        .tabs-wrapper {
            position: relative;
            margin-top: 88rem/@font-size-base;
            height: 70rem/@font-size-base;
            background-color: #3D4245;
            width: 300px;
            .tab-item {
                display: inline-block;
                /*background: url(./sale_tab_selected.png) no-repeat;*/
                font-size: 24rem/@font-size-base;
                text-align: center;
                width: 130rem/@font-size-base;
                height: 38rem/@font-size-base;
                line-height: 40rem/@font-size-base;
                color: #ffffff;
                margin: 16rem/@font-size-base 0 auto 24rem/@font-size-base;
                &.selected {
                    background-color: #06b67d;
                    border-radius: 8px;
                }
            }
        }
        /*条件排序面板*/
        .condition-wrapper {
            display: -webkit-box; /* 老版本语法: Safari, iOS, Android browser, older WebKit browsers. */
            display: -moz-box; /* 老版本语法: Firefox (buggy) */
            display: -ms-flexbox; /* 混合版本语法: IE 10 */
            display: -webkit-flex; /* 新版本语法: Chrome 21+ */
            display: flex; /* 新版本语法: Opera 12.1, Firefox 22+ */
            width: 100%;
            height: 70rem/@font-size-base;
            border-bottom: 1px solid @border-color;
            .overall-wrapper, .price-wrapper, .rebate-wrapper {
                flex: 1;
                margin: 10rem/@font-size-base 0;
                color: #3D4245;
                border-right: 1px solid #dcdcdc;
                text-align: center;
                &:last-child {
                    border-right: 0px solid #dcdcdc;
                }
            }
            .overall-wrapper {
                .overall {
                    font-size: 24rem/@font-size-base;
                    display: inline-block;
                    margin: 13rem/@font-size-base auto;
                    padding-right: 25rem/@font-size-base;
                    background: url(../../assets/image/sale/icon_arrow_down_normal.png) no-repeat right;
                    background-size: 17rem/@font-size-base 10rem/@font-size-base;
                    -webkit-background-size: 17rem/@font-size-base 10rem/@font-size-base;
                    &.selected-up {
                        color: #06b639;
                        background: url(../../assets/image/sale/icon_arrow_up_selected.png) no-repeat right;
                        background-size: 17rem/@font-size-base 10rem/@font-size-base;
                        -webkit-background-size: 17rem/@font-size-base 10rem/@font-size-base;
                    }
                    &.selected-down {
                        color: #06b639;
                        background: url(../../assets/image/sale/icon_arrow_down_selected.png) no-repeat right;
                        background-size: 17rem/@font-size-base 10rem/@font-size-base;
                        -webkit-background-size: 17rem/@font-size-base 10rem/@font-size-base;
                    }
                    &.normal {
                        color: #3D4245;
                        background: url(../../assets/image/sale/icon_arrow_down_normal.png) no-repeat right;
                        background-size: 17rem/@font-size-base 10rem/@font-size-base;
                        -webkit-background-size: 17rem/@font-size-base 10rem/@font-size-base;
                    }
                }
            }
            .price-wrapper, .rebate-wrapper {
                font-size: 0;
                .price, .rebate {
                    display: inline-block;
                    margin: 13rem/@font-size-base 8rem/@font-size-base 13rem/@font-size-base 0;
                    font-size: 24rem/@font-size-base;
                    &.selected-down, .selected-up {
                        color: #06b639;
                    }
                }
                .arrow-wrapper {
                    display: inline-block;
                    margin: 13rem/@font-size-base 0;
                    width: 15rem/@font-size-base;
                    font-size: 0;
                    .arrow-up {
                        display: block;
                        width: 15rem/@font-size-base;
                        height: 8rem/@font-size-base;
                        background: url(../../assets/image/sale/icon_arrow_up_normal.png) no-repeat;
                        background-size: 15rem/@font-size-base 8rem/@font-size-base;
                        -webkit-background-size: 15rem/@font-size-base 8rem/@font-size-base;
                        &.selected-up {
                            background: url(../../assets/image/sale/icon_arrow_up_selected.png) no-repeat right;
                            background-size: 15rem/@font-size-base 8rem/@font-size-base;
                            -webkit-background-size: 15rem/@font-size-base 8rem/@font-size-base;
                        }
                        &.normal, &.selected-down {
                            background: url(../../assets/image/sale/icon_arrow_up_normal.png) no-repeat right;
                            background-size: 15rem/@font-size-base 8rem/@font-size-base;
                            -webkit-background-size: 15rem/@font-size-base 8rem/@font-size-base;
                        }
                    }
                    .arrow-down {
                        display: inline-block;
                        margin-top: 4rem/@font-size-base;
                        width: 15rem/@font-size-base;
                        height: 8rem/@font-size-base;
                        background: url(../../assets/image/sale/icon_arrow_down_normal.png) no-repeat;
                        background-size: 15rem/@font-size-base 8rem/@font-size-base;
                        -webkit-background-size: 15rem/@font-size-base 8rem/@font-size-base;
                        &.selected-down {
                            background: url(../../assets/image/sale/icon_arrow_down_selected.png) no-repeat right;
                            background-size: 15rem/@font-size-base 8rem/@font-size-base;
                            -webkit-background-size: 15rem/@font-size-base 8rem/@font-size-base;
                        }
                        &.normal, &.selected-up {
                            background: url(../../assets/image/sale/icon_arrow_down_normal.png) no-repeat right;
                            background-size: 15rem/@font-size-base 8rem/@font-size-base;
                            -webkit-background-size: 15rem/@font-size-base 8rem/@font-size-base;
                        }
                    }
                }
            }
        }
        /*综合条件面板，默认隐藏*/
        #overall-item-wrapper {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 9991;
            background-color: #00000000;
            display: -webkit-box; /* 老版本语法: Safari, iOS, Android browser, older WebKit browsers. */
            display: -moz-box; /* 老版本语法: Firefox (buggy) */
            display: -ms-flexbox; /* 混合版本语法: IE 10 */
            display: -webkit-flex; /* 新版本语法: Chrome 21+ */
            display: flex; /* 新版本语法: Opera 12.1, Firefox 22+ */
            flex-direction: column;
            -ms-flex-direction: column;
            -webkit-flex-direction: column;
            padding-top: 232rem/@font-size-base;
            transition: all 0.3s;
            &.fade-enter-active {
                opacity: 1;
            }
            &.fade-enter, &.fade-leave-active {
                opacity: 0;
            }
            .cond-wrapper {
                flex: 0 0 auto;
                background-color: #FFFFFF;
                .cond {
                    height: 70rem/@font-size-base;
                    line-height: 70rem/@font-size-base;
                    font-size: 22rem/@font-size-base;
                    color: #787878;
                    margin: auto 90rem/@font-size-base;
                    &.selected {
                        color: #06b639;
                        background: url(../../assets/image/sale/icon_cond_selected.png) no-repeat right;
                        background-size: 30rem/@font-size-base 20rem/@font-size-base;
                        -webkit-background-size: 34rem/@font-size-base 24rem/@font-size-base;
                    }
                }
            }
            .bg-empty {
                flex: 1;
                background-color: rgba(0, 0, 0, 0.7);
            }
        }
        .flash-sale-content-wrapper {
            position: relative;
            width: 100%;
            height: 100%;
            padding-top: 88rem/@font-size-base;
            .weui-grids {
                &:before {
                    border: 0 !important;
                }
                a {
                    padding: 0 !important;
                    &:before {
                        border-right: 0 !important;
                    }
                    &:after {
                        border-bottom: 0 !important;
                    }
                    &:active {
                        background-color: #00000000 !important;
                    }
                }
            }
            .sale-item-wrapper {
                margin-bottom: 22rem/@font-size-base;
                border-radius: 3px;
                -webkit-box-shadow: #bbb 0 0 6px;
                -moz-box-shadow: #bbb 0 0 6px;
                box-shadow: #bbb 0 0 6px;
                &.right-space {
                    margin-right: 11rem/@font-size-base;
                    margin-left: 22rem/@font-size-base;
                }
                &.left-space {
                    margin-left: 11rem/@font-size-base;
                    margin-right: 22rem/@font-size-base;
                }
                &.first-line {
                    margin-top: 22rem/@font-size-base;
                }
                .goods-img {
                    height: 320rem/@font-size-base;
                    width: 340rem/@font-size-base;
                }
                .title {
                    color: @normal-font-gray;
                    font-size: 24rem/@font-size-base;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    margin: 13rem/@font-size-base 17rem/@font-size-base 10rem/@font-size-base;
                }
                .desc {
                    color: #999999;
                    font-size: 20rem/@font-size-base;
                    margin: 0 17rem/@font-size-base 16rem/@font-size-base;
                }
                .sale-price {
                    color: #fd4d00;
                    font-size: 28rem/@font-size-base;
                    margin-left: 17rem/@font-size-base;
                    margin-bottom: 8rem/@font-size-base;
                    .rmb {
                        font-size: 20rem/@font-size-base;
                    }
                }
                .old-price {
                    margin-left: 17rem/@font-size-base;
                    padding-bottom: 16rem/@font-size-base;
                    text-decoration: line-through;
                    font-size: 20rem/@font-size-base;
                    color: #999;
                }
                .discount {
                    position: absolute;
                    top: -4rem/@font-size-base;
                    width: 76rem/@font-size-base;
                    height: 82rem/@font-size-base;
                    background: url(./icon_discount.png) no-repeat;
                    background-size: 100%;
                    text-align: center;
                    color: #FFFFFF;
                    font-size: 20rem/@font-size-base;
                    line-height: 71rem/@font-size-base;
                    font-weight: bold;
                    &.first-line {
                        top: 16rem/@font-size-base;
                    }
                    &.left {
                        right: 31rem/@font-size-base;
                    }
                    &.right {
                        right: 42rem/@font-size-base;
                    }
                }
                .btn-snap-up {
                    position: absolute;
                    bottom: 37rem/@font-size-base;
                    right: 20rem/@font-size-base;
                    width: 130rem/@font-size-base;
                    height: 40rem/@font-size-base;
                    color: #fff;
                    font-size: 24rem/@font-size-base;
                    text-align: center;
                    line-height: 40rem/@font-size-base;
                    background: -webkit-linear-gradient(left, #fd4e01, #fe6c15); /* Safari 5.1 - 6.0 */
                    background: -o-linear-gradient(right, #fd4e01, #fe6c15); /* Opera 11.1 - 12.0 */
                    background: -moz-linear-gradient(right, #fd4e01, #fe6c15); /* Firefox 3.6 - 15 */
                    background: linear-gradient(to right, #fd4e01, #fe6c15); /* 标准的语法 */
                    border-radius: 10px;
                    &.left {
                        right: 31rem/@font-size-base;
                    }
                    &.right {
                        right: 42rem/@font-size-base;
                    }
                    &:active {
                        background-color: #fd2e00;
                    }
                }
            }
        }

    }
</style>
