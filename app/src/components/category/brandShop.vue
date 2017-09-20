<template>
	<div class="brandShop">
		<div class="bsp_header">
			<span class="back_btn"><i></i></span>
			<div class="input">
				<span></span>搜索商品
			</div>
			<div class="menu"></div>
		</div>
		<div class="bsp_title">
			<div class="bt">
				<div class="bt-item_1"><img src="../../../../platforms/android/build/intermediates/res/merged/debug/drawable-port-hdpi/screen.png" alt="" /></div>
				<div class="bt-item_2"><p>悠氧商城官方旗舰店</p><span>品牌旗舰店</span></div>
				<!--关注之后active-->
				<div class="attention_btn">
					关注
				</div>
			</div>
		</div>
		<div class="bsp_choice">
			<ul>
				<li class="s_item active">综合<i></i></li>
				<li>销量</li>
				<li>筛选</li>
			</ul>
			<div class="synthesize clearfix">
				<group>
					<radio :options="radio001"></radio>
				</group>
			</div>
			<div class="filtrate" style="display:none;">
				<div class="f_item">
					<div class="price_cancel">
						<div class="title">价格区间</div>
						<div class="input">
							<input type="text" placeholder="最低价"/>
							<i>~</i>
							<input type="text" placeholder="最高价"/>
						</div>
					</div>
					<div class="trademark">
						<div class="title"><span class="tt">品牌</span><i></i><span class="name">品牌名称品牌名称品牌名称品牌品牌名称品牌</span></div>
						<div class="t_item">
							<span class="active">品牌名称品牌名称品牌名称</span>
							<span>品牌名称品牌名称品牌名称</span>
							<span>品牌名称品牌名称品牌名称</span>
							<span>品牌名称品牌名称品牌名称</span>
							<span>品牌名称品牌名称品牌名称</span>
							<span>品牌名称品牌名称品牌名称</span>
							<span>品牌名称品牌名称品牌名称</span>
						</div>
					</div>
					<div class="fle_btn">
						<span class="fbtn_1">重置</span>
						<span class="fbtn_2">确定</span>
					</div>
				</div>
			</div>
		</div>
		<div class="bsp_content">
			<div class="pdt_list">
				<div class="pdt_item">
					<span class="img"><img src="../../../../platforms/android/assets/www/static/img/app_img.ed2c0ab.png"/></span>
					<div class="pdt_msg">
						<div class="title">
							衣服衣服衣服衣服衣服衣服衣服衣服衣服衣服衣服衣服衣服衣服衣服衣服衣服衣服衣服衣服衣服衣服衣服衣服衣服衣服衣服衣服衣服衣服衣服衣服衣服衣服衣服衣服衣服衣服衣服衣服衣服衣服衣服衣服衣服衣服
						</div>
						<div class="price">￥<span><i>299</i>.<em>99</em></span></div>
						<div class="pdt_evaluate">
							<span class="pe_1"><i>25</i>条评价</span><span class="pe_2"><i>98</i>%好评</span>
						</div>
					</div>
				</div>
				<div class="pdt_item">
					<span class="img"><img src="../../../../platforms/android/assets/www/static/img/app_img.ed2c0ab.png"/></span>
					<div class="pdt_msg">
						<div class="title">
							衣服衣服衣服衣服衣服衣服衣服衣服衣服衣服衣服衣服衣服衣服衣服衣服衣服衣服衣服衣服衣服衣服衣服衣服衣服衣服衣服衣服衣服衣服衣服衣服衣服衣服衣服衣服衣服衣服衣服衣服衣服衣服衣服衣服衣服衣服
						</div>
						<div class="price">￥<span><i>299</i>.<em>99</em></span></div>
						<div class="pdt_evaluate">
							<span class="pe_1"><i>25</i>条评价</span><span class="pe_2"><i>98</i>%好评</span>
						</div>
					</div>
				</div>
				<div class="pdt_item">
					<span class="img"><img src="../../../../platforms/android/assets/www/static/img/app_img.ed2c0ab.png"/></span>
					<div class="pdt_msg">
						<div class="title">
							衣服衣服衣服衣服衣服衣服衣服衣服衣服衣服衣服衣服衣服衣服衣服衣服衣服衣服衣服衣服衣服衣服衣服衣服衣服衣服衣服衣服衣服衣服衣服衣服衣服衣服衣服衣服衣服衣服衣服衣服衣服衣服衣服衣服衣服衣服
						</div>
						<div class="price">￥<span><i>299</i>.<em>99</em></span></div>
						<div class="pdt_evaluate">
							<span class="pe_1"><i>25</i>条评价</span><span class="pe_2"><i>98</i>%好评</span>
						</div>
					</div>
				</div>
				<div class="pdt_item">
					<span class="img"><img src="../../../../platforms/android/assets/www/static/img/app_img.ed2c0ab.png"/></span>
					<div class="pdt_msg">
						<div class="title">
							衣服衣服衣服衣服衣服衣服衣服衣服衣服衣服衣服衣服衣服衣服衣服衣服衣服衣服衣服衣服衣服衣服衣服衣服衣服衣服衣服衣服衣服衣服衣服衣服衣服衣服衣服衣服衣服衣服衣服衣服衣服衣服衣服衣服衣服衣服
						</div>
						<div class="price">￥<span><i>299</i>.<em>99</em></span></div>
						<div class="pdt_evaluate">
							<span class="pe_1"><i>25</i>条评价</span><span class="pe_2"><i>98</i>%好评</span>
						</div>
					</div>
				</div>
				<div class="pdt_item">
					<span class="img"><img src="../../../../platforms/android/assets/www/static/img/app_img.ed2c0ab.png"/></span>
					<div class="pdt_msg">
						<div class="title">
							衣服衣服衣服衣服衣服衣服衣服衣服衣服衣服衣服衣服衣服衣服衣服衣服衣服衣服衣服衣服衣服衣服衣服衣服衣服衣服衣服衣服衣服衣服衣服衣服衣服衣服衣服衣服衣服衣服衣服衣服衣服衣服衣服衣服衣服衣服
						</div>
						<div class="price">￥<span><i>299</i>.<em>99</em></span></div>
						<div class="pdt_evaluate">
							<span class="pe_1"><i>25</i>条评价</span><span class="pe_2"><i>98</i>%好评</span>
						</div>
					</div>
				</div>
				<div class="pdt_item">
					<span class="img"><img src="../../../../platforms/android/assets/www/static/img/app_img.ed2c0ab.png"/></span>
					<div class="pdt_msg">
						<div class="title">
							衣服衣服衣服衣服衣服衣服衣服衣服衣服衣服衣服衣服衣服衣服衣服衣服衣服衣服衣服衣服衣服衣服衣服衣服衣服衣服衣服衣服衣服衣服衣服衣服衣服衣服衣服衣服衣服衣服衣服衣服衣服衣服衣服衣服衣服衣服
						</div>
						<div class="price">￥<span><i>299</i>.<em>99</em></span></div>
						<div class="pdt_evaluate">
							<span class="pe_1"><i>25</i>条评价</span><span class="pe_2"><i>98</i>%好评</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
	import { Radio, Group } from 'vux'
	export default {
		components: {
			Radio,
			Group
		},
		data() {
			return {
				radio001: ['综合', '价格从高到低', '价格从低到高']
			}
		},
		methods: {

		}
	}
</script>

<style rel="stylesheet/less" lang="less">
	@import "../../assets/css/brandShop.less";
	i,
	em {
		font-style: normal;
	}
</style>
