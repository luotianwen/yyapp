<template>
	<div class="refundDetail">
		<div class="rfdl_header">
			<x-header :left-options="{showBack:true}" :right-options="{showMore: true}">退款/退换货进度<span class="amend"></span>
			</x-header>
		</div>
		<div class="rfdl_content">
		<!--	<div class="refund_amount">
				<div class="raitem ra_item1">退款金额<span>￥<i>29</i>.<em>99</em></span></div>
				<div class="raitem ra_item2">退回原付款账号<span>￥<i>29</i>.<em>99</em></span></div>
			</div>-->
			<div class="time">
				<div class="time_item1">申请时间：<span>2017-2-07<i>13:58:58</i></span></div>
				<div class="time_item2"><p>退款状态：</p><span>退款完成<i>（世峰退款完成，请您耐心等待银行打款，周期为1-12工作日）</i></span></div>
			</div>
		</div>
	</div>
</template>
<script>
	import { XHeader } from 'vux'
	export default {
		components: {
			XHeader
		},
		data() {
			return {}
		},
		methods: {

		}
	}
</script>

<style rel="stylesheet/less" lang="less">
	@import "../../assets/css/refundDetail.less";
	i,
	em {
		font-style: normal;
	}
</style>
