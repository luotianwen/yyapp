<template>
	<div class="lmsg">
		<div class="lmsg_header">
			<x-header :left-options="{showBack:true}" :right-options="{showMore: true}">物流信息
			</x-header>
		</div>
		<div class="lmsg_content" v-for="express in expressData">
			<div class="delivery_status clearfix">
				<span class="shop_img"><img src="../../../assets/image/home/262.jpg"/></span>
				<div class="msg">
					<div class="state_msg">
						物流状态<span>{{express.expressStatus}}</span>
					</div>
					<ul class="clearfix">
						<li>承运来源：<span>{{express.expressName}}</span></li>
						<li>运单编号：<span>{{express.expressNumber}}</span></li>
						<li>官方电话：<span>{{express.expressPhone}}</span></li>
					</ul>
				</div>
			</div>
			<div class="trace_msg">
				物流跟踪
			</div>
			<div class="g-mohe clearfix" id="mohe-kuaidi_new">
				<div class="mohe-wrap mh-wrap clearfix">
					<div class="mh-cont mh-list-wrap mh-unfold clearfix">
						<div class="mh-list clearfix">
							<ul>
								<li :class="{'first':$index==0}" v-for="(item,$index) in express.expressTraceList" >
									<p>{{item.context}}</p>
									<p>{{item.time}}</p>
									<span class="before"></span><span class="after"></span></li>


							</ul>
						</div>
					</div>
				</div>
			</div>
			<!--<v-guess :shopid=""></v-guess>-->
		</div>
	</div>
</template>
<script>
	import { Divider, XHeader } from 'vux'
  import VGuess from '../../common/guess-like.vue'
	export default {
		components: {
			Divider,
			XHeader,
      VGuess
		},
		data() {
			return {
			    userInfo:{},
        expressData:{},
        orderId:''
      }
		},
		methods: {
      initData(){
          var that=this;

        that.$post(that.$interface_url.order.getOrderExpress,
          {
            token:that.userInfo.token,
            order_id:that.orderId
          },
          function (data,success) {
            if(success){
                that.expressData=data;
            }
            else{
                that.$vux.toast.show({text:'未查询到当前快递信息',type:'warn'});
            }
          });
      }
		},
    created(){
      this.userInfo=this.$getStorage(this.$storage_key.USERINFO_STORAGE);
      if(this.$route.query&&this.$route.query.orderid){
          this.orderId=this.$route.query.orderid;
      }
      this.initData();

    }
	}
</script>

<style rel="stylesheet/less" lang="less">
	@import "../../../assets/css/logisticsMsg.less";
	i,
	em {
		font-style: normal;
	}
</style>
