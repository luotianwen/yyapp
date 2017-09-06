<template>

  <div id="app">

    <transition :enter-active-class="inTranstion"
                :leave-active-class="outTranstion">
      <router-view ></router-view>
    </transition>

    <v-footer v-show="$route.meta.footerShow"></v-footer>

  </div>
</template>
<script type="text/ecmascript-6">
  import vFooter from './components/footer/footer.vue'

  import { mapGetters } from 'vuex'
  export default {

    data(){
      return {
          isWelCome:true,
        inTranstion:'animated fadeInRight',
      outTranstion:'animated fadeOutLeft'
      }
    },
    methods:{

    },
    components: {
      vFooter
    },
    created(){
    },
    computed: {
      ...mapGetters({
        direction: 'getDirection'
      })
    },
    watch:{
        'direction':function (val,oldVal) {
          if(this.direction=='forward'){
            this.inTranstion='animated fadeInRight';
            this.outTranstion='animated fadeOutLeft';
          }
          else if(this.direction=='reverse'){
            this.inTranstion='animated fadeInLeft';
            this.outTranstion='animated fadeOutRight';
          }
        }
    }
  }
</script>
<style rel="stylesheet/less" lang="less">
  @import "./assets/css/all.less";
  .router-view {
    position: absolute;
    width:100%;
    height:100%;
    transition: all .4s cubic-bezier(.55,0,.1,1);
  }


  .slide-left-enter, .slide-right-leave-active {
    opacity: 0;
    -webkit-transform: translate(50px, 0);
    transform: translate3d(100%, 0, 0);
  }
  .slide-left-leave-active, .slide-right-enter {
    opacity: 0;
    -webkit-transform: translate(-50px, 0);
    transform: translate3d(-100%, 0, 0);
  }
</style>
