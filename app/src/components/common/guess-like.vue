<template>
  <div class="guess_like">
    <div class="title">
      <divider>猜你喜欢</divider>
    </div>
    <div class="shop_news">
      <h1>你可能还想买</h1>
      <ul class="shop_list">
        <li v-for="good in list">
          <div class="list_item">
            <div class="p">
              <a href=""><img :src="good.colorPic"/></a>
            </div>
            <div class="d">
              <a href="">{{good.pName}}</a>
              <p class="price"><span class="privilege">￥<i>{{good.price|toFixed}}</i></span><span class="original">￥<i>{{good.marketPrice|toFixed}}</i></span>
              </p>
            </div>
          </div>
        </li>

      </ul>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import {Divider} from 'vux'
    export default{
      props:{
          shopid:0
      },
        data(){
            return {
                list:[]
            }
        },
        components: {Divider},
        methods: {
            initData(){

                  var that = this;
                  that.$post(that.$interface_url.shop.hotWare, {shopid: that.shopid}, function (data, success) {
                    if (success) {
                        data.forEach(function (item,index) {
                          if(index<4){
                            that.list.push(item);
                          }
                        })

                    }
                  });
                }

        },
        computed: {},
        created(){
            this.$nextTick(function () {
              this.initData();
            })

        }
    }
</script>

<style lang="less">

</style>
