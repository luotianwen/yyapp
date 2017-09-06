<template>
    <transition name="move">
        <div id="distributor-add">
            <!--header-->
            <div class="distributor-header">
                <span class="cancel" v-show="true" @click="cancel">取消</span>
                <div class="empty"></div>
                <span class="title">新增分销商</span>
                <span class="header-ok" @click="addDistributor" :class="{'disabled':btnAddDisabled}">完成</span>
            </div>
            <!--content-->
            <div class="distributor-add-content">
                <ul>
                    <li class="item" v-for="(item, index) in items">
                        <swipeout>
                            <swipeout-item transition-mode="follow">
                                <div class="swipe-button-wrapper" slot="right-menu">
                                    <swipeout-button class="delete" @click.native="delItem(index)">删除
                                    </swipeout-button>
                                </div>
                                <div slot="content">
                                    <div class="distributor-info-wrapper">
                                        <img src="../../assets/image/distribution/icon_avatar_default.png">
                                        <div class="distributor-info">
                                            <div class="name-wrapper">
                                                <span class="txt">姓名</span>
                                                <input class="username" v-model="distributorList[index].name"
                                                       type="text"
                                                       placeholder="请输入姓名">
                                            </div>
                                            <div class="phone-wrapper">
                                                <span class="txt">手机</span>
                                                <input class="phone" v-model="distributorList[index].phone"
                                                       type="tel" maxlength="11"
                                                       placeholder="请输入手机号"
                                                       onchange="this.style.color='#3d4245'"
                                                       oninput="this.style.color='#3d4245'"
                                                       onkeyup="this.value=this.value.replace(/\D/g,'')"
                                                       onafterpaste="this.value=this.value.replace(/\D/g,'')">
                                            </div>
                                        </div>
                                    </div>
                                    <div class="remark-wrapper">
                                        <span class="txt">备注</span>
                                        <input class="remark" type="text" v-model="distributorList[index].remark"
                                               placeholder="请输入备注">
                                    </div>
                                </div>
                            </swipeout-item>
                        </swipeout>
                    </li>
                </ul>
            </div>

            <div class="btn-add-item" @click="addItem"></div>
            <!--空背景-->
            <div style="width:100%;height:100%;position: fixed;background-color: #ededed;top: 44px;z-index: 50;"></div>
        </div>
    </transition>
</template>

<script type="text/ecmascript-6">
    import {Toast, Swipeout, SwipeoutItem, SwipeoutButton} from 'vux';
    export default{
        data(){
            return {
                btnAddDisabled: false,//记录是否能点击完成按钮
                num: 1,
                distributorList: [{name: '', phone: '', remark: ''}],
                distributor: {name: '', phone: '', remark: ''},
                userInfo: {},
                items: [0],
                repeatPhone: ''//记录重复手机号码
            }
        },
        methods: {
            cancel(){
                this.$router.back();
            },
            addItem(){
                this.items.push(this.num++);
                this.distributorList.push({name: '', phone: '', remark: ''});
            },
            delItem(index){
                this.items.splice(index, 1);
                this.distributorList.splice(index, 1);
            },
            //验证手机号是否合法
            checkPhone(phone){
                let reg = /^1[3|4|5|7|8][0-9]{9}$/; //验证规则
                return phone && reg.test(phone);
            },
            isRepeat(){
                for (let a = 0; a < this.items.length; a++) {
                    for (let b = a + 1; b < this.distributorList.length; b++) {
                        if (this.distributorList[a] && this.distributorList[b]
                            && this.distributorList[a].phone && this.distributorList[b].phone
                            && (this.distributorList[a].phone == this.distributorList[b].phone)) {
                            this.repeatPhone = this.distributorList[a].phone;
                            return true;
                        }
                    }
                }
                return false;
            },
            addDistributor(){
                if (this.btnAddDisabled) {
                    return;
                }
                let that = this;
                let hasName = true;
                let s = 0, f = 0, total = '';
                for (let a = 0; a < this.items.length; a++) {
                    if (this.distributorList[a].name == '') {
                        hasName = false;
                        this.$vux.toast.show({
                            text: '请填写分销商名字',
                            type: 'text',
                            position: 'middle'
                        });
                        break;
                    } else if (hasName && (!this.checkPhone(this.distributorList[a].phone))) {
                        hasName = false;
                        if (this.distributorList[a].phone) {
                            let input = document.getElementsByClassName('phone');
                            input[a].style.color = "#f00";
                            this.$vux.toast.show({
                                text: '手机号' + this.distributorList[a].phone + "输入不正确",
                                type: 'text',
                                position: 'middle'
                            });
                        } else {
                            this.$vux.toast.show({
                                text: '请填写手机号',
                                type: 'text',
                                position: 'middle'
                            });
                        }
                        break;
                    } else if (hasName && this.isRepeat()) {
                        hasName = false;
                        this.$vux.toast.show({
                            text: '手机号' + this.repeatPhone + "重复",
                            type: 'text',
                            position: 'middle'
                        });
                        break;
                    }
                }
                if (hasName) {
                    hasName = false;
                    for (let a = 0; a < this.items.length; a++) {
                        that.$post(that.$interface_url.distributor.distributorAdd, {
                            token: that.userInfo.token,
                            name: that.distributorList[a].name,
                            phone: that.distributorList[a].phone,
                            remark: that.distributorList[a].remark
                        }, function (data, success) {
                            console.log(" http request result is " + success);
                            if (success) {
                                s++;
                            } else {
                                f++;
                                total = total + that.distributorList[a].phone + data + "<br>";
                            }
                            if (s == that.distributorList.length) {
                                that.$vux.toast.show({
                                    text: that.$tip_message.add_success,
                                    type: 'text',
                                    position: 'middle'
                                });
                                history.go(-1);
                            } else if (s + f == that.distributorList.length) {
                                that.$vux.toast.show({
                                    text: total,
                                    type: 'text',
                                    position: 'middle',
                                    time: 3000,
                                    width: "80%"
                                });
                                if (s > 0) {
                                    history.go(-1);
                                }
                            }
                        })
                    }
                }

            }
        },
        components: {
            Toast, Swipeout, SwipeoutItem, SwipeoutButton
        },
        created(){
            this.userInfo = this.$getStorage(this.$storage_key.USERINFO_STORAGE);
        }
    }

</script>

<style lang="less" rel="stylesheet/less">
    @import "../../assets/css/base.less";

    #distributor-add {
        display: -webkit-box; /* 老版本语法: Safari, iOS, Android browser, older WebKit browsers. */
        display: -moz-box; /* 老版本语法: Firefox (buggy) */
        display: -ms-flexbox; /* 混合版本语法: IE 10 */
        display: -webkit-flex; /* 新版本语法: Chrome 21+ */
        display: flex; /* 新版本语法: Opera 12.1, Firefox 22+ */
        flex-direction: column;
        -ms-flex-direction: column;
        -webkit-flex-direction: column;
        position: fixed;
        background-color: #ededed;
        width: 100%;
        height: 100%;
        transition: all 0.3s;
        &.move-enter-active {
            transform: translate3d(0, 0, 0);
            opacity: 1;
        }
        &.move-enter, &.move-leave-active {
            transform: translate3d(100%, 0, 0);
            opacity: 0.5;
        }
        .distributor-header {
            display: -webkit-box; /* 老版本语法: Safari, iOS, Android browser, older WebKit browsers. */
            display: -moz-box; /* 老版本语法: Firefox (buggy) */
            display: -ms-flexbox; /* 混合版本语法: IE 10 */
            display: -webkit-flex; /* 新版本语法: Chrome 21+ */
            display: flex; /* 新版本语法: Opera 12.1, Firefox 22+ */
            width: 100%;
            height: 88rem/@font-size-base;
            flex: 0 0 auto;
            position: fixed;
            z-index: 1000;
            background-color: #ffffff;
            .cancel {
                flex: 0 0 auto;
                display: inline-block;
                font-size: 30rem/@font-size-base;
                color: #5f646e;
                line-height: 68rem/@font-size-base;
                padding: 10rem/@font-size-base;
                margin-left: 18rem/@font-size-base;
            }
            .empty {
                flex: 1;
            }
            .title {
                position: absolute;
                text-align: center;
                color: #161616;
                left: 30%;
                right: 30%;
                font-size: 34rem/@font-size-base;
                height: 88rem/@font-size-base;
                line-height: 88rem/@font-size-base;
            }
            .header-ok {
                flex: 0 0 auto;
                display: inline-block;
                font-size: 30rem/@font-size-base;
                color: #5f646e;
                padding: 10rem/@font-size-base;
                line-height: 68rem/@font-size-base;
                margin-right: 18rem/@font-size-base;
                &:active {
                    color: #c9c9c9;
                }
                &.disabled {
                    color: #c9c9c9;
                }

            }
        }
        .distributor-add-content {
            position: relative;
            overflow: auto;
            background-color: #EDEDED;
            flex: 1;
            margin-top: 88rem/@font-size-base;
            align-items: stretch;
            z-index: 60;
            .item {
                border-bottom: 18rem/@font-size-base solid #ededed;
                .swipe-button-wrapper {
                    .delete {
                        background-color: #ff5b28;
                        color: #ffffff;
                        &:active {
                            background-color: #e05b28;
                        }
                    }
                }
                .distributor-info-wrapper {
                    display: -webkit-box; /* 老版本语法: Safari, iOS, Android browser, older WebKit browsers. */
                    display: -moz-box; /* 老版本语法: Firefox (buggy) */
                    display: -ms-flexbox; /* 混合版本语法: IE 10 */
                    display: -webkit-flex; /* 新版本语法: Chrome 21+ */
                    display: flex; /* 新版本语法: Opera 12.1, Firefox 22+ */
                    margin-left: 22rem/@font-size-base;
                    border-bottom: 1px solid #e0e0e0;
                    img {
                        flex: 0 0 auto;
                        width: 100rem/@font-size-base;
                        height: 100rem/@font-size-base;
                        display: block;
                        margin: auto 24rem/@font-size-base auto 0;
                    }
                    .distributor-info {
                        flex: 1;
                        .name-wrapper {
                            font-size: 28rem/@font-size-base;
                            color: @normal-font-gray;
                            padding: 30rem/@font-size-base 0;
                            border-bottom: 1px solid #e0e0e0;
                            .txt {
                                display: inline-block;
                                margin-right: 24rem/@font-size-base;
                            }
                            input {
                                display: inline-block;
                            }
                        }
                        .phone-wrapper {
                            font-size: 28rem/@font-size-base;
                            padding: 30rem/@font-size-base 0;
                            .txt {
                                display: inline-block;
                                color: @normal-font-gray;
                                margin-right: 24rem/@font-size-base;
                            }
                            input {
                                display: inline-block;
                                color: @normal-font-gray;
                                &:focus {
                                    color: @normal-font-gray;
                                }
                            }
                        }
                    }
                }
                .remark-wrapper {
                    display: -webkit-box; /* 老版本语法: Safari, iOS, Android browser, older WebKit browsers. */
                    display: -moz-box; /* 老版本语法: Firefox (buggy) */
                    display: -ms-flexbox; /* 混合版本语法: IE 10 */
                    display: -webkit-flex; /* 新版本语法: Chrome 21+ */
                    display: flex; /* 新版本语法: Opera 12.1, Firefox 22+ */
                    padding: 16rem/@font-size-base 0 42rem/@font-size-base;
                    .txt {
                        flex: 0 0 auto;
                        margin: 0 22rem/@font-size-base 0 24rem/@font-size-base;
                        font-size: 28rem/@font-size-base;
                        color: @normal-font-gray;
                        line-height: 44rem/@font-size-base;
                    }
                    .remark {
                        flex: 1;
                        display: inline-block;
                        margin-right: 22rem/@font-size-base;
                        font-size: 28rem/@font-size-base;
                        color: #757575;
                        line-height: 44rem/@font-size-base;
                    }
                }
            }
        }
        .btn-add-item {
            position: fixed;
            border-bottom: 54rem/@font-size-base;
            right: 34rem/@font-size-base;
            bottom: 54rem/@font-size-base;
            background: #18b435 url('../../assets/image/distribution/icon_add_item.png') no-repeat center;
            background-size: 40rem/@font-size-base 40rem/@font-size-base;
            border-radius: 40rem/@font-size-base;
            width: 80rem/@font-size-base;
            height: 80rem/@font-size-base;
            z-index: 70;
            &:active {
                background-color: #048c28;
            }
        }
    }
</style>

