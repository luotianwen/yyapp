<template>
  <div class="evaSuccess">
    <div class="evs_header">
      <x-header :left-options="{showBack:true}">评价成功 <span class="save" @click="over">完成</span>
      </x-header>
    </div>
    <div class="evs_content">
      <div class="evs_title">
        <p>评价成功!</p>
      </div>
      <div class="continue">
        <div class="title">
          <divider>接着评价下去吧</divider>
        </div>
      </div>
      <div class="eva_list" v-for="order in list">
        <div class="list_item clearfix" v-for="good in order.wares">
          <div class="img">
            <img :src="good.productImage"/>
          </div>
          <span class="shop_name">
						{{good.productName}}
					</span>
          <div class="eva_btn" @click="goEva(order)">
            去评价
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import {XHeader, Divider} from 'vux'
  export default {
    components: {
      XHeader,
      Divider
    },
    data() {
      return {
        list: {},
        userInfo: {},
        currentPage: 1
      }
    },
    methods: {
      initData(){
        var that = this;
        var params = {
          token: that.userInfo.token,
        };
        params.state = 3;

        params.comment = 2;
        params.currentPage = that.currentPage;

        that.$post(that.$interface_url.order.list, params, function (data, success) {
          if (success) {
            that.list = data.resultData;

          }
          else {
            that.$vux.toast.show({text: '数据加载失败！', type: 'warn'});
          }
        });
      },
      goEva(order){

          this.$router.push({name:'evaluate',params:{order:order}});
      },
      over(){
          this.$router.push({name:'member'});
      }
    },
    created(){
      this.userInfo = this.$getStorage(this.$storage_key.USERINFO_STORAGE);
      this.initData();
    }
  }
</script>

<style rel="stylesheet/less" lang="less">
  @import "../../../assets/css/evaSuccess.less";

  i, em {
    font-style: normal;
  }
</style>

