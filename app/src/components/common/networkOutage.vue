<template>
	<div class="networkOutage">
		<img src="../../assets/image/home/networkOutage.png" alt="" />
		<p class="p_1">网络请求失败</p>
		<p class="p_2">请检查您的网络</p>
		<span @click="$router.back();">重新加载</span>
	</div>
</template>
<script>
	export default {
		components: {
		},
		data() {
			return {}
		},
		methods: {

		}
	}
</script>

<style rel="stylesheet/less" lang="less">
	i,em {
		font-style: normal;
	}
</style>

