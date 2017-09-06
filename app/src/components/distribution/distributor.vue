<template>
    <!--我的分销-->
    <div id="distributor">
        <v-search ref="distributor_search" :control="control" :distributorList="distributorList"></v-search>
        <!--header-->
        <div class="distributor-header">
            <img class="back" v-show="true" @click="back" src="../../assets/image/set/Back_btn_img.png">
            <div class="empty"></div>
            <span class="title">我的分销商</span>
            <img class="header-add" @click="addDistributor" src="../../assets/image/distribution/icon_add.png">
        </div>
        <!--content-->
        <div class="distributor-content-wrapper" v-if="distributorList.length>0 && control.show">
            <!--search-->
            <div class="search-wrapper" @click="showSearchPager">
                <div class="search">
                    <img src="../../assets/image/distribution/icon_search.png">
                    <span class="txt">搜索分销商</span>
                </div>
            </div>
            <!--分销商列表-->
            <ul>
                <li class="distributor-item-wrapper" v-for="(distributor,index) in distributorList"
                    @click="detail(index)">
                    <div class="distributor">
                        <img src="../../assets/image/distribution/icon_avatar_default.png">
                        <div class="info">
                            <div class="name">{{distributor.name}}</div>
                            <div class="phone">{{distributor.phone}}</div>
                        </div>
                    </div>
                    <div class="remark-wrapper">
                        <span class="txt">备注</span>
                        <span class="remark">{{distributor.remark}}</span>
                    </div>
                </li>
            </ul>
        </div>

        <!--empty content-->
        <div class="empty-wrapper" v-if="distributorList.length==0">
            <img src="../../assets/image/distribution/empty_person_tip.png">
            <span class="txt-empty-tip">您暂无分销商<br/>赶快去添加吧</span>
        </div>
        <!--空背景-->
        <div style="width:100%;height:100%;position: fixed;background-color: #ededed;top: 44px;z-index: 50;"></div>
    </div>
</template>

<script type="text/ecmascript-6">
    import {Toast} from 'vux';
    import VSearch from './distributor_search.vue'
    import {isLogin} from '../../common/js/checkIsLogin'

    export default{
        data(){
            return {
                page: 1,
                userInfo: [],
                distributorList: [],
                control: {show: true}
            }
        },
        components: {
            Toast, VSearch,isLogin
        },
        methods: {
            back(){
                this.$router.back();
            },
            addDistributor(){
                this.$router.push({name: 'DistributorAdd'});
            },
            detail(index){
                this.$router.push({
                    name: 'DistributorDetail',
                    params: {
                        name: this.distributorList[index].name,
                        phone: this.distributorList[index].phone,
                        remark: this.distributorList[index].remark,
                        recommended_userid: this.distributorList[index].recommended_userid
                    }
                });
            },
            showSearchPager(){
                this.$refs.distributor_search.show();
                this.control.show = false;
            }
        },
        created(){
            this.userInfo = this.$getStorage(this.$storage_key.USERINFO_STORAGE);
            let that = this;
            if (!isLogin()) {
                this.$router.replace({
                    name: 'login', query: {
                        returnurl: this.$route.fullPath
                    }
                });
            } else {
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
                        let returnurl = that.$route.path;
                        that.$router.push({name: 'login', query: {returnurl: returnurl}});
                    } else {
                        that.$vux.toast.show({text: data, type: 'warn', width: '18em'});
                    }
                })
            }
        }
    }
</script>

<style lang="less" rel="stylesheet/less">
    @import "../../assets/css/base.less";

    #distributor {
        position: absolute;
        width: 100%;
        height: 100%;
        /*header*/
        .distributor-header {
            display: -webkit-box; /* 老版本语法: Safari, iOS, Android browser, older WebKit browsers. */
            display: -moz-box; /* 老版本语法: Firefox (buggy) */
            display: -ms-flexbox; /* 混合版本语法: IE 10 */
            display: -webkit-flex; /* 新版本语法: Chrome 21+ */
            display: flex; /* 新版本语法: Opera 12.1, Firefox 22+ */
            width: 100%;
            height: 88rem/@font-size-base;
            border-bottom: 1px solid @header-border-color;
            position: fixed;
            top: 0;
            left: 0;
            z-index: 1000;
            background-color: #ffffff;
            .back {
                flex: 0 0 auto;
                width: 20rem/@font-size-base;
                height: 34rem/@font-size-base;
                padding: 10rem/@font-size-base;
                margin-left: 24rem/@font-size-base;
                margin-top: 16rem/@font-size-base;
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
                font-size: 32rem/@font-size-base;
                height: 88rem/@font-size-base;
                line-height: 88rem/@font-size-base;
            }
            .header-add {
                flex: 0 0 auto;
                display: block;
                width: 32rem/@font-size-base;
                height: 32rem/@font-size-base;
                padding: 10rem/@font-size-base;
                margin: auto 24rem/@font-size-base;
            }
        }
        /*content*/
        .distributor-content-wrapper {
            position: relative;
            z-index: 88;
            margin-top: 88rem/@font-size-base;
            overflow: hidden;
            /*search*/
            .search-wrapper {
                width: 100%;
                background-color: #ffffff;
                padding: 16rem/@font-size-base 0;
                .search {
                    position: relative;
                    margin: auto 22rem/@font-size-base;
                    height: 56rem/@font-size-base;
                    background-color: #e8e9eb;
                    border-radius: 10rem/@font-size-base;
                    text-align: center;
                    font-size: 0;
                    img {
                        position: relative;
                        margin: auto;
                        top: 1px;
                        width: 24rem/@font-size-base;
                        height: 24rem/@font-size-base;
                    }
                    .txt {
                        display: inline-block;
                        font-size: 24rem/@font-size-base;
                        color: #444444;
                        margin-left: 16rem/@font-size-base;
                        line-height: 56rem/@font-size-base;
                    }
                }
            }
            /*distributor list*/
            .distributor-item-wrapper {
                background-color: #ffffff;
                border-top: 18rem/@font-size-base solid #ededed;
                &:active {
                    background-color: #f0f0f0;
                }
                .distributor {
                    display: -webkit-box; /* 老版本语法: Safari, iOS, Android browser, older WebKit browsers. */
                    display: -moz-box; /* 老版本语法: Firefox (buggy) */
                    display: -ms-flexbox; /* 混合版本语法: IE 10 */
                    display: -webkit-flex; /* 新版本语法: Chrome 21+ */
                    display: flex; /* 新版本语法: Opera 12.1, Firefox 22+ */
                    border-bottom: 1px solid #e0e0e0;
                    margin: 0 22rem/@font-size-base;
                    img {
                        flex: 0 0 auto;
                        display: block;
                        width: 100rem/@font-size-base;
                        height: 100rem/@font-size-base;
                        margin: 24rem/@font-size-base 22rem/@font-size-base 24rem/@font-size-base 0;
                    }
                    .info {
                        flex: 1;
                        margin: auto;
                        .name {
                            font-size: 32rem/@font-size-base;
                            color: @normal-font-gray;
                            margin-bottom: 16rem/@font-size-base;
                        }
                        .phone {
                            font-size: 28rem/@font-size-base;
                            color: #757575;
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
        /*empty content*/
        .empty-wrapper {
            position: fixed;
            top: 88rem/@font-size-base;
            width: 100%;
            height: 100%;
            background-color: #ededed;
            z-index: 60;
            img {
                display: block;
                width: 180rem/@font-size-base;
                height: 180rem/@font-size-base;
                margin: 315rem/@font-size-base auto auto;
            }
            .txt-empty-tip {
                display: inline-block;
                width: 100%;
                text-align: center;
                font-size: 28rem/@font-size-base;
                line-height: 36rem/@font-size-base;
                color: #707070;
                margin-top: 24rem/@font-size-base;
            }
        }

    }
</style>
