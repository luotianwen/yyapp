<template>
  <div>
    <div class="brandShop" v-show="isShow">
      <div class="bsp_header">
        <span class="back_btn" @click="goBack"><i></i></span>
        <div class="input" @click="showSearchPage">
          <span></span>搜索商品
        </div>
        <div class="menu"></div>
      </div>
      <div class="bsp_title">
        <div class="bt">
          <div class="bt-item_1"><img :src="shopInfo.logo" alt=""/></div>
          <div class="bt-item_2">
            <p>{{shopInfo.shopName}}</p><span v-show="shopInfo.grade==1">品牌旗舰店</span></div>
          <!--关注之后active-->
          <div class="attention_btn" :class="{'active':isFollowShop}" v-show="isLogin" @click="followShop">
            {{isFollowShop?'已关注':'关注'}}
          </div>
        </div>
      </div>
      <div class="bsp_choice">
        <ul>
          <li class="s_item" :class="{'active':isShowDesc}" @click="showDesc">
            {{sortVal.find(s=>s.key==para.sort)?sortVal.find(s=>s.key==para.sort).value:'综合'}}<i></i></li>
          <li @click="changeDesc(1)">销量</li>
          <li @click="showSearch">筛选</li>
        </ul>
        <div class="synthesize clearfix" v-show="isShowDesc" @click="hideDesc">
          <group>
            <radio :options="sortVal" @on-change="changeDesc"></radio>
          </group>
        </div>
        <v-search-item :brandList="brandList" :propertyList="propertyList" :para="para" ref="searchItem"
                       v-on:child-update="search"></v-search-item>
      </div>
      <div class="bsp_content_no" v-show="!(goodList&&goodList.length>0)">
        <img src="../../assets/image/mine/collect_img.png"/>
        <p>抱歉，没找到商品额~</p>
      </div>
      <div class="bsp_content" v-show="goodList&&goodList.length>0">
        <scroller lock-x scrollbar-y :use-pullup="true" v-model="scrollerStatus" :pullup-config="pullupConfig"
                  @on-pullup-loading="upEvent" ref="scroller" v-show="goodList&&goodList.length>0">
          <div class="pdt_list">
            <div class="pdt_item clearfix" v-for="good in goodList" @click="$router.push({name:'Goods',params:{sku:good.skuList[0].sku}})">
              <span class="img"><img :src="good.skuList[0].colorPic"/></span>
              <div class="pdt_msg">
                <div class="title">
                  {{good.pName}}
                </div>
                <div class="price">￥<span><!--<i>299</i>.<em>99</em>-->{{good.skuList[0].price|toFixed}}</span></div>
                <div class="pdt_evaluate">
                  <span class="pe_1"><i>25</i>条评价</span><span class="pe_2"><i>98</i>%好评</span>
                </div>
              </div>
            </div>

          </div>
        </scroller>
      </div>
    </div>
    <v-search ref="search" v-on:child-update="updateShow" from="shop" :shopId="shopId"></v-search>
  </div>
</template>
<script>
  import {Radio, Group, Scroller} from 'vux'
  import {isLogin} from '../../common/js/checkIsLogin'
  import VSearchItem from '../common/search_item.vue'
  import VSearch from '../search/search.vue'
  export default {
    components: {
      Radio,
      Group,
      Scroller,
      VSearchItem,
      VSearch
    },
    data() {
      return {
        isShow: true,
        shopId: 0,
        shopInfo: {},
        userInfo: {},
        isLogin: false,
        goodList: [],
        isFollowShop: false,
        currentPage: 1,
        isShowDesc: false,

        sortVal: [{
          key: '0',
          value: '综合'
        },
          {
            key: '3',
            value: '价格从高到低'
          },
          {
            key: '2',
            value: '价格从低到高'
          }
        ],
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
        para: { //搜索查询条件集合
          sort: 0
        },
        urlQuery: {},
        brandList: {},
        propertyList: {}
      }
    },
    methods: {
      showSearchPage() {

        this.$refs.search.show();
        this.isShow = false;
      },
      updateShow(){
          this.isShow=true;
      },
      initData() { //加载店铺基本信息
        var that = this;
        that.$post(that.$interface_url.shop.getShopInfo, {
          shopid: that.urlQuery.shopid
        }, function (data, success) {
          if (success) {
            that.shopInfo = data;
          }
        });
      },
      isFollowVender() { //获取店铺是否关注
        var that = this;
        that.$post(that.$interface_url.user.isFollowVender, {
          token: that.userInfo.token,
          shopId: that.urlQuery.shopid
        }, function (data, success) {
          if (success) {
            that.isFollowShop = data;
          }
        });
      },
      goBack() {
        this.$router.back();
      },
      showDesc() {
        this.isShowDesc = !this.isShowDesc;
      },
      hideDesc() {
        this.isShowDesc = false;
      },
      changeDesc(index) {
        this.para.sort = index;
        this.goodList = [];
        this.initShopWare();
      },
      followShop() { //关注店铺事件
        var that = this;
        that.$post(that.isFollowShop ? that.$interface_url.user.deleteFollowVender : that.$interface_url.user.followVender, {
          token: that.userInfo.token,
          shopId: that.urlQuery.shopid,
        }, function (data, success) {
          if (success) {
            that.isFollowShop = !that.isFollowShop;
          }
        });
      },
      initShopWare() { //加载店铺商品信息
        var that = this;
        if (that.urlQuery.key) {
          that.para.keyword = that.urlQuery.key;
        }
        that.para.shopId = that.urlQuery.shopid;
        that.para.pageNow = that.currentPage;
        /*		if(!(that.para.start_price > 0)) {
         that.para.start_price = 0;
         }
         if(!(that.para.end_price > 0)) {
         that.para.end_price = 0;
         }*/
        that.$post(that.$interface_url.shop.wares, that.para, function (data, success) {
          if (success) {
            data.result.forEach(function (item, index) {
              that.goodList.push(item);
            })
            that.propertyList = data.propertyList;
            that.brandList = data.brandList;
            /*		if(that.para.start_price === 0) that.para.start_price = '';
             if(that.para.end_price === 0) that.para.end_price = '';*/
            if (data.pageCount == that.currentPage) {
              that.$nextTick(() => {
                that.$refs.scroller.disablePullup();
                that.scrollerStatus.pullupStatus = 'default';
                that.$refs.scroller.reset();
              });
            } else {
              that.$nextTick(() => {

                that.scrollerStatus.pullupStatus = 'default';
                that.$refs.scroller.reset();
              });
            }
          }
        });
      },
      showSearch(){
        this.$refs.searchItem.showSearch();
      },
      search(para) {
        this.para = para;

        this.initShopWare();
      },
      upEvent() {
        this.currentPage++;
        this.initShopWare();
      }
    },
    created() {
      this.urlQuery = this.$route.query;
      if (this.urlQuery && this.urlQuery.shopid) {
        this.initData();
        this.initShopWare();
        this.userInfo = this.$getStorage(this.$storage_key.USERINFO_STORAGE);
        if (isLogin()) {
          this.isLogin = true;
          this.isFollowVender();

        }
      } else {
        this.$vux.toast.show({
          text: '无效的访问',
          type: 'warn'
        });
        this.$route.go(-1);
      }

    },
    mounted() {
      this.$nextTick(() => {
        this.scrollerStatus.pullupStatus = 'default';
        this.$refs.scroller.reset();
      });
    },
  }
</script>

<style rel="stylesheet/less" lang="less">
  @import "../../assets/css/brandShop.less";

  i,
  em {
    font-style: normal;
  }
</style>
