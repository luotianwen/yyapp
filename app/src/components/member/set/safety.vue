<template>
	<!--修改手机号码-->
	<!--跳转页面--标题'修改手机号码'-->
	<!--下一步页面--标题'验证手机'-->
	<!--下一步跳转登陆页面-->
	<!--修改登录密码-->
	<!--跳转页面--标题'重置密码'-->
	<!--下一步跳转登陆页面-->
	<div class="sa_address">
		<div class="sa_header">
			<x-header :left-options="{showBack:true,backText:''}">账户与安全</x-header>
		</div>
		<div class="sa_content">
			<group>
				<cell :title="userInfo&&userInfo.phone?'修改手机号':'绑定手机号'" is-link @click.native="go" >
					<span>{{ userInfo&&userInfo.phone?(userInfo.phone.substr(0, 3) + '****' + userInfo.phone.substr(7)):''}}</span>
				</cell>
				<cell title="修改登录密码" is-link link="/retrieve?type=3"></cell>
			</group>
		</div>
	</div>
</template>
<script>
	import {XHeader, Cell, Group} from 'vux'
	export default {
    components: {
      XHeader,
      Cell,
      Group
    },
    data () {
      return {
          userInfo:{}
      }
    },
    methods: {
        go(){
            if(this.userInfo&&this.userInfo.phone){
              this.$vux.toast.show({
                text:'此版本暂不支持此功能，如需修改手机号，请登录PC版本。',
                type:'warn'
              });
            }
            else{
                this.$router.push({name:'retrieve',query:{type:2}});
              //link="/retrieve?type=2"
            }
        }
    },
    created(){
      this.userInfo=this.$getStorage(this.$storage_key.USERINFO_STORAGE);
    }
  }
</script>

<style rel="stylesheet/less" lang="less">
	@import "../../../assets/css/safety.less";
</style>
