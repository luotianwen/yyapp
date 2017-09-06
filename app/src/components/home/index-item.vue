<template>
	<div class="a_show_item" v-if="adManage.wareList&&adManage.wareList.length>0" :name="adManage.id">
		<div class="a_item_img">

        <router-link :to="adManage.link">
				<img :src="adManage.imgPath" />
        </router-link>

		</div>
		<div class="a_item_msg">
      <swiper  :show-dots="false"  height="240px">
        <swiper-item class="black" v-for="item in showList" >
          <div class="a_menu">
            <div class="am_item" v-for="(good,index) in item" :key="index" @click="$router.push({name:'Goods',params:{sku:good.sku}})">

                <div class="as_img" >
                  <h1 class="bc-ed8da0" v-show="good.activitytype&&good.activitytype>0">{{formatActivityType(good.activitytype)}}</h1>
                  <img :src="good.imgPath" />
                </div>
                <div class="shop_msg">{{good.pname}}</div>
                <div class="shop_price">
                  <span class="s_favorable"><i>￥</i>{{good.activityprice&&good.activityprice>0?good.activityprice:good.price|toFixed}}</span>
                  <span class="s_original">￥{{good.marketprice|toFixed}}</span>
                </div>

            </div>


          </div>
        </swiper-item>

      </swiper>


		</div>

	</div>
</template>

<script type="text/ecmascript-6">
  import {SwiperItem,Swiper} from 'vux'
	export default {
		data() {
			return {
          count:0,
        showList:[]
			}
		},
		props: {
			adManage: {}
		},
		created() {

      if(this.adManage.wareList.length/3==0) {
        this.count =this.adManage.wareList.length / 3;
      }
      else{
        this.count = Math.ceil(this.adManage.wareList.length / 3);
      }
      for (var i=1;i<=this.count;i++){
        var l=i*3;
        var list=[];
        this.adManage.wareList.forEach(function (item,index) {
          if(index<l&&index>=(i-1)*3){
              list.push(item)
          }
        })
        this.showList.push(list);
      }

		},
		components: {
      SwiperItem,Swiper
		},
		methods: {
			formatActivityType(type) {
				//0正常1秒杀2特价3团购4一元购
				if(type) {
					var text = '';
					switch(type) {
						case 1:
							text = '秒杀';
							break;
						case 2:
							text = '特价';
							break;
						case 3:
							text = '团购';
							break;
						case 4:
							text = '一元购';
							break;
						default:
							text = '';
							break;
					}
					return text;
				} else {
					return '';
				}
			}

		}
	}
</script>

<style>

</style>
