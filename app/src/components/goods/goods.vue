<template>
	<div id="goods">
		<div class="goods-header">
			<img class="back" @click="back" src="../../assets/image/set/Back_btn_img.png">

			<div class="tab-wrapper">
				<div class="tab-item">
					<a @click="changeIndex=1" :class="{'active':changeIndex==1}" replace>商品</a>
				</div>
				<div class="tab-item">
					<a @click="changeIndex=2" :class="{'active':changeIndex==2}" replace>详情</a>

				</div>
				<div class="tab-item">
					<a @click="changeIndex=3" :class="{'active':changeIndex==3}" replace>评价</a>

				</div>
			</div>
			<div class="shop-cart have_shop">
				<img class="" @click="clickShopCart" src="../../assets/image/goods/menu_shopping_cart.png">
			</div>

			<img class="menu" @click="clickMore" src="../../assets/image/goods/menu_more.png">
		</div>
		<!--<router-view></router-view>-->
		<!--<swiper style="height:100%">
      <swiper-item >
        <keep-alive>
          <v-info ref="goodsinfo" :changeIndex="changeIndex" :good="goodInfo.goodInfo" v-on:child-update_index="updateIndex"></v-info>
        </keep-alive>
      </swiper-item>
      <swiper-item >
        <keep-alive>
          <v-detail ref="goodsdetail" :detail="description" :changeIndex="changeIndex"></v-detail>
        </keep-alive>
      </swiper-item>
      <swiper-item >
        <keep-alive>
          <v-comment :productId="pid" v-if="pid>0" :changeIndex="changeIndex"></v-comment>
        </keep-alive>
      </swiper-item>
    </swiper>-->

		<keep-alive>
			<v-info ref="goodsinfo" :changeIndex="changeIndex" :good="goodInfo.goodInfo" v-on:child-update_index="updateIndex"></v-info>
		</keep-alive>
		<keep-alive>
			<v-detail ref="goodsdetail" :detail="description" :changeIndex="changeIndex"></v-detail>
		</keep-alive>
		<keep-alive>
			<v-comment :productId="pid" v-if="pid>0" :changeIndex="changeIndex"></v-comment>
		</keep-alive>

		<div class="goods-footer">
			<div class="customer-service" @click="contact">
				<div class="img-wrapper">
					<img src="../../assets/image/goods/footer_customer_service.png">
				</div>
				<span class="txt">客服</span>
			</div>
			<div class="shopping" @click="shopping">
				 <div class="img-wrapper">
					<img src="../../assets/image/goods/footer_shopping.png">
				</div>
				<span class="txt" @click="goShop">店铺</span>
			</div>
			<div class="mark" :class="{'active':isFollowWare}" @click="mark">
				<div class="img-wrapper">
					<i></i>
				</div>
				<span class="txt">{{isFollowWare?'已收藏':'收藏'}}</span>
			</div>
			<span class="add-in-cart" @click="addInCart" :class="{'yellow':!(state==1&&stocks>0)}">
        {{state==1&&stocks>0?'加入购物车':stocks<=0?'到货通知':'商品已下架'}}
      </span>
			<span class="buy-now" @click="buyNow" v-if="state==1&&stocks>0">立即购买</span>
		</div>
	</div>
</template>

<script type="text/ecmascript-6">
	import VComment from './goods_comment.vue'
	import VDetail from './goods_detail.vue'
	import VInfo from './goodsInfo.vue'
	import { Scroller, Swiper, SwiperItem, Badge } from 'vux'
	import { isLogin } from '../../common/js/checkIsLogin'
	export default {
		components: {
			VComment,
			VDetail,
			VInfo,
			Scroller,
			Swiper,
			SwiperItem,
			Badge
		},
		data() {
			return {
				sku: '',
				changeIndex: 1,
				goodInfo: {},
				userInfo: {},
				isFollowWare: false,
				scrollerStatus: {
					pullupStatus: 'default',

				},
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
				description: '',
				pid: 0,
				state: 0,
				stocks: 0
			}
		},
		methods: {
			goShop() {

				if(this.goodInfo.goodInfo && this.goodInfo.goodInfo.shopid) {
					this.$router.push({
						name: 'shop',
						query: {
							shopid: this.goodInfo.goodInfo.shopid
						}
					});
				}
			},
			up() {
				this.changeIndex = 2;
			},
			initData(callback) {
				var that = this;

				this.$post(this.$interface_url.product.detail, {
					sku: this.sku
				}, function(data, success) {
					if(success && data) {
					    if(typeof callback === "function"){
                callback();
              }
						that.$set(that.goodInfo, 'goodInfo', data);

            that.$WxShareLoad({title:that.goodInfo.goodInfo.pName,desc:that.goodInfo.goodInfo.goods_subtitle,imgUrl:that.goodInfo.goodInfo.imgs[0],link:location.href});
						that.description = that.goodInfo.goodInfo.phone_describe ? that.goodInfo.goodInfo.phone_describe : that.goodInfo.goodInfo.description
						that.pid = that.goodInfo.goodInfo.pid;
						that.state = that.goodInfo.goodInfo.state;
						that.stocks = that.goodInfo.goodInfo.stocks;
					} else {
						that.$vux.toast.show({
							text: data,
							type: 'warn'
						});
					}
				});
				if(isLogin()) {
					this.$post(this.$interface_url.user.isFollowWare, {
						token: that.userInfo.token,
						sku: that.sku
					}, function(data, success) {
						if(success) {
							that.isFollowWare = data;

						}
					});
				}
			},
			up() {

			},
			//返回
			back() {
				history.go(-1);
			},
			//商品/详情/评价
			selectTab(item) {
				this.type = item;
			},
			//菜单购物车
			clickShopCart() {
				this.$router.push({
					name: 'cart'
				});
			},
			//菜单更多
			clickMore() {
        this.$refs.share.show();
			},
			//联系客服
			contact() {
				this.$vux.toast.show({
					text: '联系客服',
					type: 'text',
					position: 'middle'
				});
			},
			//店铺
			shopping() {

			},
			//收藏
			mark() { //商品收藏
				if(this.userInfo) {
					var that = this;
					if(this.userInfo.timeout && this.userInfo.timeout < Date.now()) {
						this.$router.push({
							name: 'login'
						});
					} else {
						this.$post(this.isFollowWare ? this.$interface_url.user.deleteFollowWare : this.$interface_url.user.followWare, {
							token: this.userInfo.token,
							sku: this.sku
						}, function(data, success) {
							if(success) {
								that.isFollowWare = !that.isFollowWare;
							} else {
								that.$vux.toast.show({
									text: data,
									width: '16em'
								});
							}
						});
					}
				} else {
					this.$router.push({
						name: 'login'
					});
				}

			},
			//加入购物车
			addInCart() {
				if(this.goodInfo.goodInfo.state == 1 && this.goodInfo.goodInfo.stocks > 0) {
					console.log(this.goodInfo)
					var good = {
						shopid: this.goodInfo.goodInfo.shopid,
						shopName: this.goodInfo.goodInfo.shopName,
						sku: this.goodInfo.goodInfo.sku,
						price: this.goodInfo.goodInfo.price,
						pName: this.goodInfo.goodInfo.pName,
						colorName: this.goodInfo.goodInfo.colorName,
						specName: this.goodInfo.goodInfo.specName,
						colorPic: this.goodInfo.goodInfo.imgs ? this.goodInfo.goodInfo.imgs[0] : '',
						number: 1

					};

					this.$store.dispatch('addToCart', good);
				} else if(this.goodInfo.goodInfo.state != 1) {
          this.$vux.toast.show({
            text: '下架',
            type: 'text',
            position: 'middle'
          });
				} else if(this.goodInfo.stocks <= 0) {
          this.$vux.toast.show({
            text: '缺货',
            type: 'text',
            position: 'middle'
          });
				}
			},
			updateIndex(index) {
				this.changeIndex = index;
			},
			//立即购买
			buyNow() {
				if(this.goodInfo.goodInfo.state == 1 && this.goodInfo.goodInfo.stocks > 0) {
					this.$router.push({
						name: 'orderSubmit',
						query: {
							sku: this.goodInfo.goodInfo.sku,
							type: 1
						}
					});
				}
			}
		},
		computed: {},
		created() {
			this.userInfo = this.$getStorage(this.$storage_key.USERINFO_STORAGE);
			this.sku = this.$route.params.sku;
			this.initData(null);
      document.documentElement.scrollTop = document.body.scrollTop = 0;

		},
		mounted() {
			/*var that=this;
			 window.onscroll = function () {
			 var height=document.getElementsByClassName('pull-up-wrapper')[0].offsetTop/2+260;
			 console.log(height)
			 var t = document.body.scrollTop;
			 console.log(t)
			 if(t>height){
			 that.changeIndex=2;
			 }
			 }*/

		},
		watch: {
			'$route': {
				handler: function(val, oldVal) {
					if(val.params.sku != oldVal.params.sku) {
						this.sku = this.$route.params.sku;
						var that=this;
            that.initData(function () {
              that.$refs.goodsinfo.initColorData();
            });

						document.documentElement.scrollTop = document.body.scrollTop = 0;
					}
				},
				deep: true
			},
			deep: true
		}

	}
</script>

<style lang="less" rel="stylesheet/less">
	@import "../../assets/css/good.less";
</style>
