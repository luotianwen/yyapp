<template>
  <transition :enter-active-class="inTranName"
              :leave-active-class="outTranName">
    <div class="goods-detail" v-show="changeIndex==2" ref="goodsdetail">
      <div  id="detailHtmlDiv" v-html="detail">
      </div>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
  export default{
    props: {
      detail: '',
      changeIndex:''
    },
    data(){
      return {
        isShow: false,
        inTranName:'animated fadeInRight',
        outTranName:'animated fadeOutLeft',

      }
    },
    methods: {

    },
    created(){

    },
    mounted(){
      let width = window.screen.width;//如果手机端详情没有，显示pc端详情，适配图片尺寸，（好像没作用，时好时坏）
      let obj = document.getElementById('detailHtmlDiv');
      let imgs = obj.getElementsByTagName('img');
      let tables=obj.getElementsByTagName('table');
      if(tables){
          for(var i=0;i<tables.length;i++){
              tables.width=width;
          }
      }
      for (var i = 0; i < imgs.length; i++) {
        imgs[i].width = width;
      }
    },
    watch:{
        'changeIndex':{
            handler: function (val, oldVal) {
              if(oldVal==1&&val==2){
                this.inTranName = 'animated fadeInRight';
                this.outTranName = 'animated fadeOutLeft';
              }
              else if(oldVal==3&&val==2){
                this.inTranName='animated fadeInLeft';
                this.outTranName='animated fadeOutRight';
              }
              else if(oldVal==2&&val==3){
                this.inTranName = 'animated fadeInRight';
                this.outTranName = 'animated fadeOutLeft';
              }
              else if(oldVal==2&&val==1){
                this.inTranName='animated fadeInLeft';
                this.outTranName='animated fadeOutRight';
              }
            }
        }
    }

  };
</script>

<style lang="less" rel="stylesheet/less">
  @font-size-base : 75;

  .goods-detail {
    position: relative;
    width:100% !important;
    top: 88rem/@font-size-base;
		div{
			width: 100%;
			img{
				width: 100%;
			}
		}
  }
  .goods-detail {
    position: relative;
    width: 100%;
    overflow: hidden;
    margin-bottom: 141rem/@font-size-base;
  }


</style>
