<template>
    <div id="silver">
        <!--header-->
        <div class="silver-header">
            <x-header :left-options="{showBack:true,backText:''}" :right-options="{showMore: true}"
                      @on-click-more="clickShowMenu">我的银币
            </x-header>
        </div>
        <!--content-->
        <div class="silver-content-wrapper">
            <div class="silver-info-wrapper">
                <div class="txt">银币资产(个)</div>
                <div class="silver-count">{{silver.lastsilver}}</div>
            </div>
            <div class="btn-exchange" @click="clickExchange" :class="{'disable':silver.lastsilver == 0}">兑换到世峰E卡</div>
            <div class="other-wrapper">
                <span class="silver-notice" @click="silverNotice">兑换须知</span>
                <span class="commission-detail" @click="commissionDetail">兑换记录</span>
            </div>
        </div>
        <transition name="fade">
            <div id="get-cash-dialog" v-show="showDialog" transition="fade">
                <div class="dialog-wrapper">
                    <div class="txt-tip">确定将银币兑换到世峰E卡吗？</div>
                    <div class="action-wrapper">
                        <span class="cancel" @click="cancel">取消</span><span class="confirm"
                                                                            @click="confirmExchange">确定</span>
                    </div>
                </div>
            </div>
        </transition>
        <message-menu ref="messagemenu"></message-menu>
    </div>
</template>

<script type="text/ecmascript-6">
    import {XHeader, Toast} from 'vux';
    import messageMenu from '../common/messagemenu.vue'
    import {isLogin} from '../../common/js/checkIsLogin'

    export default{
        data(){
            return {
                userInfo: [],
                showDialog: false,
                silver: {}
            }
        },
        methods: {
            //header right menu click event
            clickShowMenu(){
                this.$refs.messagemenu.show();
            },
            //兑换按钮
            clickExchange(){
                if (this.silver.lastsilver > 0) {
                    this.showDialog = true;
                }
            },
            //取消兑换
            cancel(){
                this.showDialog = false;
            },
            //确认兑换
            confirmExchange(){
                let that = this;
                that.$post(that.$interface_url.silver.exchange, {
                    token: this.userInfo.token
                }, function (data, success) {
                    if (success) {
                        that.silver.lastsilver = 0;
                        if (data) {
                            that.$vux.toast.show({
                                text: "兑换成功," + data,
                                type: 'text',
                                time: 3000,
                                position: 'middle'
                            });
                        }
                    } else if (data == '10004') {
                    } else {
                        that.$vux.toast.show({text: data, type: 'warn', width: '18em'});
                    }
                });
            },
            //兑换须知
            silverNotice(){
                this.$router.push({name: 'SilverNotice'});
            },
            //佣金明细
            commissionDetail(){
                this.$router.push({name: 'CommissionDetail'});
            }
        },
        created(){
            this.userInfo = this.$getStorage(this.$storage_key.USERINFO_STORAGE);
            let that = this;
            if (isLogin()) {
                that.$post(that.$interface_url.silver.silverGet, {
                    token: this.userInfo.token
                }, function (data, success) {
                    if (success) {
                        if (data) {
                            console.log(data);
                            that.silver = data;
                        }
                    } else if (data == '10004') {
                        let returnurl = that.$route.path;
                        that.$router.push({name: 'login', query: {returnurl: returnurl}});
                    } else {
                        that.$vux.toast.show({text: data, type: 'warn', width: '18em'});
                    }
                })
            } else {
                let returnurl = that.$route.path;
                that.$router.replace({name: 'login', query: {returnurl: returnurl}});
            }

        },
        components: {
            XHeader, Toast, messageMenu, isLogin
        }
    }
</script>

<style lang="less" rel="stylesheet/less">
    @import "../../assets/css/base.less";

    #silver {
        position: absolute;
        width: 100%;
        height: 100%;
        .silver-header {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
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
                    font-size: 32rem/@font-size-base !important;
                    color: #161616 !important;
                }
                .vux-header-right {
                    a {
                        color: #646973 !important;
                        line-height: 52rem/@font-size-base !important;
                    }
                }
            }
        }
        .silver-content-wrapper {
            position: fixed;
            width: 100%;
            height: 100%;
            margin-top: 88rem/@font-size-base;
            overflow: auto;
            background-color: #ffffff;
            .silver-info-wrapper {
                width: 100%;
                height: 200rem/@font-size-base;
                text-align: center;
                background-color: @main-color;
                .txt {
                    margin-bottom: 30rem/@font-size-base;
                    padding-top: 54rem/@font-size-base;
                    font-size: 22rem/@font-size-base;
                    color: #a5f9ad;
                }
                .silver-count {
                    font-size: 40rem/@font-size-base;
                    color: #ffffff;
                }
            }
            //兑换按钮
            .btn-exchange {
                margin: 54rem/@font-size-base 36rem/@font-size-base;
                border: 1px solid @main-color;
                border-radius: 10rem/@font-size-base;
                color: @main-color;
                text-align: center;
                height: 86rem/@font-size-base;
                line-height: 86rem/@font-size-base;
                font-size: 30rem/@font-size-base;
                &:active {
                    background-color: #e0e0e0;
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
                /*兑换须知*/
                .silver-notice, .commission-detail {
                    display: inline-block;
                    &:active {
                        color: #a0a0a0;
                    }
                }
                .silver-notice {
                    float: left;
                }
                //佣金明细
                .commission-detail {
                    float: right;
                }
            }
        }
        #get-cash-dialog {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 9999;
            background-color: rgba(0, 0, 0, 0.4);
            transition: all 0.5s;
            &.fade-transition {
                opacity: 1;
                background: rgba(0, 0, 0, 0.4);
            }
            &.fade-enter, &.fade-leave-active {
                opacity: 0;
            }
            .dialog-wrapper {
                background-color: #FFFFFF;
                border-radius: 10rem/@font-size-base;
                margin: 64% 10%;
                .txt-tip {
                    color: #161616;
                    text-align: center;
                    height: 107rem/@font-size-base;
                    line-height: 107rem/@font-size-base;
                    font-size: 30rem/@font-size-base;
                    border-bottom: 1px solid #e0e0e0;
                }
                .action-wrapper {
                    position: relative;
                    display: -webkit-box; /* 老版本语法: Safari, iOS, Android browser, older WebKit browsers. */
                    display: -moz-box; /* 老版本语法: Firefox (buggy) */
                    display: -ms-flexbox; /* 混合版本语法: IE 10 */
                    display: -webkit-flex; /* 新版本语法: Chrome 21+ */
                    display: flex; /* 新版本语法: Opera 12.1, Firefox 22+ */
                    height: 88rem/@font-size-base;
                    .cancel {
                        flex: 1;
                        text-align: center;
                        line-height: 88rem/@font-size-base;
                        color: #454545;
                        border-right: 1px solid #e0e0e0;
                        font-size: 30rem/@font-size-base;
                        &:active {
                            background-color: #e0e0e0;
                        }
                    }
                    .confirm {
                        flex: 1;
                        text-align: center;
                        line-height: 88rem/@font-size-base;
                        font-size: 30rem/@font-size-base;
                        color: @main-color;
                        &:active {
                            background-color: #e0e0e0;
                        }
                    }
                }
            }
        }
    }
</style>
