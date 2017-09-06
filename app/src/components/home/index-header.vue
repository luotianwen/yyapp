<template>
  <!--header头部-->
  <div class="header p_fixed">
    <div class="input_btn">
      <a></a>
      <input type="search" @click="goSearch" placeholder="户外跑鞋" />
    </div>
    <span>
			</span>

  </div>
</template>

<script type="text/ecmascript-6">

export default{
      components:{

      },
  methods:{
      goSearch(){
          this.$router.push({name:'search'});
      }
  }
}
</script>

<style>

</style>
