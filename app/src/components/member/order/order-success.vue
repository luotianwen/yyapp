<template>
  <div class="dealSuccess">
    <div class="ds_header">
      <x-header :left-options="{showBack:true}" :right-options="{showMore: true}">交易成功 <span class="amend"></span>
      </x-header>
    </div>
    <div class="ds_content">
      <div class="ds_title" >
        <p>交易成功!</p>
      </div>
      <div class="deal_msg">
        <p><!--本次交易获得<i>12</i>积分--></p>
        <div class="function_btn">
          <span class="btn_1" @click="goDetail">查看订单</span>
          <span class="btn_2">立即评价</span>
        </div>
      </div>
      <div class="guess_like">
        <div class="title"><divider>猜你喜欢</divider></div>
        <div class="shop_news">
          <h1>你可能还想买</h1>
          <ul class="shop_list">
            <li>
              <div class="list_item">
                <div class="p">
                  <a href=""><img src="../../../assets/image/home/262.jpg"/></a>
                </div>
                <div class="d">
                  <a href="">衣服衣服衣服衣服衣服衣服衣服衣服衣服衣服衣服衣服衣服衣服衣服衣服衣服衣服</a>
                  <p class="price"><span class="privilege">￥<i>39.9</i></span><span class="original">￥<i>99.9</i></span></p>
                </div>
              </div>
            </li>
            <li>
              <div class="list_item">
                <div class="p">
                  <a href=""><img src="../../../assets/image/home/262.jpg"/></a>
                </div>
                <div class="d">
                  <a href="">衣服衣服衣服衣服衣服衣服衣服衣服衣服衣服衣服衣服衣服衣服衣服衣服衣服衣服</a>
                  <p class="price"><span class="privilege">￥<i>39.9</i></span><span class="original">￥<i>99.9</i></span></p>
                </div>
              </div>
            </li>
            <li>
              <div class="list_item">
                <div class="p">
                  <a href=""><img src="../../../assets/image/home/262.jpg"/></a>
                </div>
                <div class="d">
                  <a href="">衣服衣服衣服衣服衣服衣服衣服衣服衣服衣服衣服衣服衣服衣服衣服衣服衣服衣服</a>
                  <p class="price"><span class="privilege">￥<i>39.9</i></span><span class="original">￥<i>99.9</i></span></p>
                </div>
              </div>
            </li>
            <li>
              <div class="list_item">
                <div class="p">
                  <a href=""><img src="../../../assets/image/home/262.jpg"/></a>
                </div>
                <div class="d">
                  <a href="">衣服衣服衣服衣服衣服衣服衣服衣服衣服衣服衣服衣服衣服衣服衣服衣服衣服衣服</a>
                  <p class="price"><span class="privilege">￥<i>39.9</i></span><span class="original">￥<i>99.9</i></span></p>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import { XHeader,Divider} from 'vux'
  export default {
    components: {
      XHeader,
      Divider
    },
    data() {
      return {
          orderId:''
      }
    },
    methods: {
      goDetail(){
          this.$router.push({name:'orderdetail',params:{orderId:this.orderId}});
      }
    },
    created(){
        if(this.$route.query&&this.$route.query.orderId){
            this.orderId=this.$route.query.orderId;
        }else{
            this.$router.push({name:'member'});
        }
    }
  }
</script>

<style rel="stylesheet/less" lang="less">
  @import "../../../assets/css/dealSuccess.less";
  i,em {
    font-style: normal;
  }
</style>

