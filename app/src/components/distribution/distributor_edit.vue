<template>
    <transition name="move">
        <div id="distributor-edit" v-show="isShow">
            <!--header-->
            <div class="distributor-header">
                <span class="cancel" v-show="true" @click="cancel">取消</span>
                <div class="empty"></div>
                <span class="header-ok" @click="ok">完成</span>
            </div>
            <!--content-->
            <div class="distributor-edit-content">
                <div class="distributor-info-wrapper">
                    <img src="../../assets/image/distribution/icon_avatar_default.png">
                    <div class="distributor-info">
                        <div class="name-wrapper">
                            <span class="txt">姓名</span>
                            <input v-model="name" type="text" maxlength="15" placeholder="请输入姓名">
                        </div>
                        <div class="phone-wrapper">
                            <span class="txt">手机</span>
                            <span class="phone">{{distributor.phone}}</span>
                        </div>
                    </div>
                </div>
                <div class="remark-wrapper">
                    <span class="txt">备注</span>
                    <input class="remark" type="text" v-model="remark" placeholder="请输入备注">
                </div>
            </div>
            <!--delete button-->
            <div class="btn-delete" @click="deleteDistributor">删除分销商</div>
        </div>
    </transition>
</template>

<script type="text/ecmascript-6">
    export default{
        props: {
            distributor: {}
        },
        data(){
            return {
                name: '',
                remark: '',
                userInfo: {},
                isShow: false
            }
        },
        methods: {
            show(){
                this.isShow = true;
            },
            hide(){
                this.isShow = false;
            },
            cancel(){
                this.isShow = false;
                this.name = this.distributor.name;
                this.remark = this.distributor.remark;
            },
            ok(){
                if (!this.name) {
                    this.$vux.toast.show({
                        text: '请填写分销商名字',
                        type: 'text',
                        position: 'middle'
                    });
                } else {
                    let that = this;
                    that.$post(that.$interface_url.distributor.distributorModify, {
                        token: that.userInfo.token,
                        recommended_userid: that.distributor.recommended_userid,
                        name: that.name,
                        remark: that.remark
                    }, function (data, success) {
                        if (success) {
                            that.$vux.toast.show({
                                text: that.$tip_message.update_success,
                                type: 'text',
                                position: 'middle'
                            });
                            that.distributor.name = that.name;
                            that.distributor.remark = that.remark;
                            that.isShow = false;
                        } else {
                            that.$vux.toast.show({
                                text: data,
                                type: 'text',
                                position: 'middle'
                            });
                        }
                    })
                }
            },
            deleteDistributor(){
                let that = this;
                that.$post(that.$interface_url.distributor.distributorDelete, {
                    token: that.userInfo.token,
                    recommended_userid: that.distributor.recommended_userid
                }, function (data, success) {
                    if (success) {
                        that.$vux.toast.show({
                            text: that.$tip_message.delete_success,
                            type: 'text',
                            position: 'middle'
                        });
                        history.go(-1);
                    } else {
                        that.$vux.toast.show({
                            text: data,
                            type: 'text',
                            position: 'middle'
                        });
                    }
                })
            }
        },
        created(){
            this.name = this.distributor.name;
            this.remark = this.distributor.remark;
            this.userInfo = this.$getStorage(this.$storage_key.USERINFO_STORAGE);
            let that = this;
            that.$post(that.$interface_url.distributor.distributorList, {
                token: this.userInfo.token,
                currentPage: 1
            }, function (data, success) {
                if (success) {
                    if (data) {
                        console.log(data);
                        that.distributorList = data.resultData;
                    }
                } else if (data == '10004') {
                } else {
                    that.$vux.toast.show({text: data, type: 'warn', width: '18em'});
                }
            });
        }
    }

</script>

<style lang="less" rel="stylesheet/less">
    @import "../../assets/css/base.less";

    #distributor-edit {
        position: fixed;
        top: 0;
        left: 0;
        background-color: #ededed;
        width: 100%;
        height: 100%;
        z-index: 1010;
        transition: all 0.3s;
        &.move-enter-active{
            transform: translate3d(0, 0, 0);
            opacity: 1;
        }
        &.move-enter, &.move-leave-active{
            transform: translate3d(100%,0, 0);
            opacity:0.5;
        }
        .distributor-header {
            display: -webkit-box; /* 老版本语法: Safari, iOS, Android browser, older WebKit browsers. */
            display: -moz-box; /* 老版本语法: Firefox (buggy) */
            display: -ms-flexbox; /* 混合版本语法: IE 10 */
            display: -webkit-flex; /* 新版本语法: Chrome 21+ */
            display: flex; /* 新版本语法: Opera 12.1, Firefox 22+ */
            width: 100%;
            height: 88rem/@font-size-base;
            position: relative;
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

            }
        }
        .distributor-edit-content {
            position: relative;
            background-color: #ffffff;
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
                        color: @normal-font-gray;
                        padding: 30rem/@font-size-base 0;
                        .txt {
                            display: inline-block;
                            margin-right: 24rem/@font-size-base;
                        }
                        .phone {
                            display: inline-block;
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
        .btn-delete {
            height: 86rem/@font-size-base;
            margin: 54rem/@font-size-base;
            font-size: 30rem/@font-size-base;
            color: @red;
            text-align: center;
            line-height: 86rem/@font-size-base;
            border: 1px solid @red;
            border-radius: 10rem/@font-size-base;
            background-color: #ffffff;
            &:active {
                background-color: @color-white-to-gray;
            }
        }
    }
</style>
