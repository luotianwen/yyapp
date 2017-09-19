<template>
	<div class="payment">
		<div class="pm_header">
			<x-header :left-options="{showBack:true}" :right-options="{showMore: true}">付款成功 <span class="amend"></span>
			</x-header>
		</div>
		<div class="pm_content">
			<div class="pm_title">
				<p style="margin-bottom: 15px">付款成功</p>

				<span>您的包裹整装待发~</span>

			</div>
	<!--		<div class="pm_site">
				<span class="pm_logo"><i></i></span>
				<div class="site_msg">
					<p class="recipients"><span class="name">收件人：<i>张三</i></span><span class="phone">17111564686</span></p>
					<p class="place">北京通州通州北京北京通州通州北京北京通州通州北京北京通州通州北京北京通州通州北京北京通州通州北京北京通州通州北京北京通州通州北京北京通州通州北京</p>
				</div>
			</div>-->
			<div class="information">
				<p>实付款：<span>￥<i>{{price|toFixed}}</i></span></p>
				<a class="check_btn" @click="goOrderList">查看订单</a>
			</div>
			<div class="pm_reminder">
				下单后，<i>给您发送链接办理退款</i>的都是骗子！悠氧商城不存在系统升级，订单异常等问题，谨防假冒客服电话诈骗！
			</div>
			<div class="guess_like">
				<div class="title"><divider>猜你喜欢</divider></div>
				<div class="shop_news">
					<h1>你可能还想买</h1>
					<ul class="shop_list">
						<li>
							<div class="list_item">
								<div class="p">
									<a href=""><img src="../../assets/image/home/262.jpg"/></a>
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
									<a href=""><img src="../../assets/image/home/262.jpg"/></a>
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
									<a href=""><img src="../../assets/image/home/262.jpg"/></a>
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

<script type="text/ecmascript-6">
	import { XHeader, Divider  } from 'vux'
  import {urlParse} from '../../common/js/util'
	export default {
		components: {
			XHeader,
			Divider
		},
		data() {
			return {
			    price:0,
        state:''
      }
		},
		methods: {
      goOrderList(){
          this.$router.push({name:'orderlist',query:{type:1,comment:0}});
      }
		},
    created(){
		    var obj=urlParse();
		    this.price=parseFloat(obj.total_fee);
		    this.state=obj.pay_result;
    }
	}
</script>

<style lang="less">
	@import "../../assets/css/payment.less";
	i,
	em {
		font-style: normal;
	}
</style>
