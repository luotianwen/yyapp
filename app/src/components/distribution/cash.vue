<template>
    <div id="cash">
        <!--header-->
        <div id="cash-header">
            <x-header :left-options="{showBack:true,backText:''}" :right-options="{showMore: true}"
                      @on-click-more="clickShowMenu">提现
            </x-header>
        </div>
        <!--content-->
        <div class="cash-content-wrapper">
            <!--佣金明细-->
            <div class="commission-desc-wrapper">
                <!--已收入佣金-->
                <div class="commission-wrapper">
                    <div class="txt">已收入佣金</div>
                    <div class="num">{{commission.costmoney}}</div>
                </div>
                <!--可提现佣金-->
                <div class="commission-wrapper">
                    <div class="txt">可提现佣金</div>
                    <div class="num">{{commission.money}}</div>
                </div>
                <!--待收益佣金-->
                <div class="commission-wrapper">
                    <div class="txt">待收益佣金</div>
                    <div class="num">{{commission.pending_income}}</div>
                </div>
            </div>
            <!--提现按钮-->
            <div class="btn-get-cash" :class="{'disable':commission.money==0}" @click="getCash">提现</div>
            <div class="other-wrapper">
                <span class="cash-notice" @click="cashNotice">提现须知</span>
                <span class="commission-detail" @click="commissionDetail">佣金明细</span>
            </div>
        </div>
        <message-menu ref="messagemenu"></message-menu>
    </div>
</template>

<script type="text/ecmascript-6">
    import {XHeader} from 'vux';
    import messageMenu from '../common/messagemenu.vue'
    import {isLogin} from '../../common/js/checkIsLogin'

    export default{
        components: {
            XHeader, messageMenu, isLogin
        },
        data () {
            return {
                userInfo: [],
                commission: {}
            }
        },
        methods: {
            //header right menu click event
            clickShowMenu(){
                this.$refs.messagemenu.show();
            },
            //跳转到提现页面
            getCash(){
                if (this.commission.money>0) {
                    this.$router.push({name: 'GetCash', params: {money: this.commission.money}});
                }
            },
            //提现须知
            cashNotice(){
                this.$router.push({name: 'CashNotice'});
            },
            //佣金明细
            commissionDetail(){
                this.$router.push({name: 'OrderDistribution', params: {type: 0}});
            }
        },
        created(){
            this.userInfo = this.$getStorage(this.$storage_key.USERINFO_STORAGE);
            let that = this;
            if (isLogin()) {
                that.$post(that.$interface_url.cash.getCommissionInfo, {
                    token: this.userInfo.token
                }, function (data, success) {
                    if (success) {
                        if (data) {
                            that.commission = data;
                        }
                    } else if (data == '10004') {
                        let returnurl = that.$route.path;
                        that.$router.push({name: 'login', query: {returnurl: returnurl}});
                    } else {
                        that.$vux.toast.show({text: data, type: 'warn', width: '18em'});
                    }
                });
            } else {
                let returnurl = that.$route.path;
                that.$router.replace({name: 'login', query: {returnurl: returnurl}});
            }
        },
    }

</script>

<style lang="less" rel="stylesheet/less">
    @import "../../assets/css/base.less";

    #cash {
        position: absolute;
        width: 100%;
        height: 100%;
        /*header*/
        #cash-header {
            width: 100%;
            position: fixed;
            top: 0;
            left: 0;
            .vux-header {
                height: 88rem/@font-size-base !important;
                background-color: @main-color !important;
                .vux-header-left {
                    .left-arrow {
                        &:before {
                            border-color: #ffffff !important;
                            border-width: 1px 0 0 1px !important;
                            width: 20rem/@font-size-base !important;
                            height: 20rem/@font-size-base !important;
                            top: 34rem/@font-size-base !important;
                            left: 34rem/@font-size-base !important;
                        }
                    }
                }
                h1 {
                    font-size: 34rem/@font-size-base !important;
                    color: #ffffff !important;
                }
                .vux-header-right {
                    a {
                        color: #ffffff !important;
                        line-height: 52rem/@font-size-base !important;
                    }
                }
            }
        }
        .cash-content-wrapper {
            position: fixed;
            width: 100%;
            height: 100%;
            background-color: @bg-color;
            margin-top: 88rem/@font-size-base;
            overflow: auto;
            /*佣金明细*/
            .commission-desc-wrapper {
                display: -webkit-box; /* 老版本语法: Safari, iOS, Android browser, older WebKit browsers. */
                display: -moz-box; /* 老版本语法: Firefox (buggy) */
                display: -ms-flexbox; /* 混合版本语法: IE 10 */
                display: -webkit-flex; /* 新版本语法: Chrome 21+ */
                display: flex; /* 新版本语法: Opera 12.1, Firefox 22+ */
                width: 100%;
                height: 134rem/@font-size-base;
                background-color: #04ad20;
                .commission-wrapper {
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
            /*提现按钮*/
            .btn-get-cash {
                margin: 54rem/@font-size-base 36rem/@font-size-base;
                color: @main-color;
                font-size: 30rem/@font-size-base;
                border: 1px solid @main-color;
                border-radius: 10rem/@font-size-base;
                text-align: center;
                line-height: 86rem/@font-size-base;
                height: 86rem/@font-size-base;
                background-color: #ffffff;
                &:active {
                    background-color: @color-white-to-gray;
                }
                &.disable {
                    color: #b4dbba;
                    border: 1px solid #b4dbba;
                    &:active {
                        background-color: #FFFFFF;
                    }
                }
            }
            .other-wrapper {
                margin: auto 36rem/@font-size-base;
                font-size: 26rem/@font-size-base;
                color: #707070;
                /*提现须知*/
                .cash-notice, .commission-detail {
                    display: inline-block;
                    &:active {
                        color: #a0a0a0;
                    }
                }
                .cash-notice {
                    float: left;
                }
                //佣金明细
                .commission-detail {
                    float: right;
                }
            }
        }
    }
</style>
