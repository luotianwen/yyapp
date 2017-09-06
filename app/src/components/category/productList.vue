<template>
  <div>
    <div class="productList" v-show="isShow">
      <div class="pdt_header">
        <span class="back_btn" @click="goBack"><i></i></span>
        <div class="input" @click="goSearch">
          <span></span>{{$route.query&&$route.query.key?$route.query.key:'搜索商品'}}
        </div>
        <div class="menu"></div>
      </div>
      <div class="pdt_choice" v-show="goodList&&goodList.length>0">
        <ul >
          <li class="s_item" :class="{'active':isShowDesc}" @click="showDesc">{{sortText}}<i></i></li>
          <li @click="changeDesc(0)">销量</li>
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
      <div class="pdt_content_no" v-show="!(goodList&&goodList.length>0)">
        <img src="../../assets/image/mine/collect_img.png"/>
        <p>抱歉，没有找到商品...</p>
      </div>
      <div class="pdt_content" v-show="goodList&&goodList.length>0">
        <div class="pdt_list">
          <div class="pdt_item clearfix" v-for="good in goodList" @click="toProduct(good.skuList[0].sku)">
            <span class="img"><img :src="good.skuList[0].colorPic"/></span>
            <div class="pdt_msg">
              <div class="title" v-html="good.pName">

              </div>
              <div class="price">￥<span><i>{{good.skuList[0].price|toFixed}}</i><!--.<em>99</em>--></span></div>
              <div class="pdt_evaluate">
                <span class="pe_1"><!--<i>25</i>条评价</span><span class="pe_2"><i>98</i>%好评--></span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <v-search ref="search" v-on:child-update="updateShow"  from="productList"></v-search>
  </div>
</template>
<script>
  import {Radio, Group} from 'vux'
  import {urlParse} from '../../common/js/util'
  import VSearchItem from '../common/search_item.vue'
  import VSearch from '../search/search.vue'
  export default {
    components: {
      Radio,
      Group, VSearchItem,VSearch
    },
    data() {
      return {
        isShow:true,
        goodList: {},
        urlQuery: {},
        brandList: {},
        radio001: ['综合', '价格从高到低', '价格从低到高'],

        para: {
          sort: 0
        },
        currentPage: 1,
        propertyList: [],

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
        isShowDesc: false,
        sortText: '综合'
      }
    },
    methods: {
      goBack(){
        this.$router.back();
      },
      showSearch(){
        this.$refs.searchItem.showSearch();
      },
      goSearch() {
        this.$refs.search.show();
        this.isShow=false;
      },
      updateShow(type){
          if(type&&type==1) {
            this.urlQuery = this.$route.query;
            this.initData();
          }
          this.isShow=true;
      },
      toProduct(sku) {
        this.$router.push({
          name: 'Goods',
          params: {
            sku: sku
          }
        });
      },
      showDesc() {
        this.isShowDesc = !this.isShowDesc;
      },
      hideDesc() {
        this.isShowDesc = false;
      },
      changeDesc(index) {
        this.para.sort = index;
        this.sortText = this.sortVal.find(s => s.key == index).value;
        this.initData();
      },
      search(para){
        this.para = para;
        this.initData();
      },
      initData() {
        /* //搜索关键字
         private String keyword = "*";
         //Filter value  过滤参数  商品属性值  多个用,号隔开  例：2,3
         private String fv;
         //分类 Category  id
         private String c;
         //品牌brand id
         private String b;
         //搜索排序（0：综合；1：销量；2：价格从低到高；3：价格从高到低）
         private int sort = 0;
         //请求客户端ip
         private String ip;
         //是否开启关键词高亮 默认关闭
         private boolean isHighlight = false;
         //按价格区间筛选 最低价
         private double start_price;
         //按价格区间筛选 最高价
         private double end_price;
         //是否自定义价格 默认关闭
         private boolean isCustomPrice = false;
         //是否需要筛选属性property（1：需要；2：否）不传默认1
         private int p = 1;*/
        var that = this;
        if (that.urlQuery) {
          if (that.urlQuery.key) {
            that.para.keyword = that.urlQuery.key;
          }
          if (that.urlQuery.c) {
            that.para.c=that.urlQuery.c;
          }
        }
        that.para.pageNow = that.currentPage;

        that.$post(that.$interface_url.search.ware, that.para, function (data, success) {
          if (success) {
            that.goodList = data.result;
            that.brandList = data.brandList;
            that.propertyList = data.propertyList;
          }
        });
      }
    },
    created() {
      this.urlQuery = this.$route.query;
      this.initData();
    },

  }
</script>

<style rel="stylesheet/less" lang="less">
  @import "../../assets/css/productList.less";

  i,
  em {
    font-style: normal;
  }
</style>
