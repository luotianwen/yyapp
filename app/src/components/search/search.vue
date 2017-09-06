<template>
  <div class="all_search" v-show="isShow">
    <div class="search_input">
      <search :results="results" v-model="value" @on-change="getResult" @on-cancel="cancelSearch" auto-scroll-to-top
              ref="search"  @result-click="search" @on-submit="search"></search>
    </div>
    <div class="history" v-show="isShowHistory">
      <div class="title" v-show="historyList&&historyList.length>0">
        <p @click="setFocus()">历史记录<span><i @click="deleteHistory"></i></span></p>
      </div>
      <ul>
        <li v-for="history in historyList" @click="search(history)">{{history}}</li>

      </ul>
    </div>
  </div>
</template>
<script>
  import {Search} from 'vux'
  export default {
      props:{
          from:'',
        shopId:'',

      },
    components: {
      Search
    },
    data() {
      return {
        isShow: false,
        isShowHistory: true,
        historyList:[],
        results: [],
        value: ''
      }
    },
    methods: {
      cancelSearch(){
        this.hide();
        this.$emit('child-update');
      },
      getResult (val) {
        if (val.trim().length ==0)return;
        this.isShowHistory = false;
        var that = this;
        that.$post(that.$interface_url.search.suggest, {keyword: val}, function (data, success) {
          if (success) {
            let result = [];
            data.forEach(function (item, index) {
              result.push({
                title: `${item.key}`,
                other: index
              })
            })
            that.results = result;
          }
        });
      },
      search(item){
          var text='';
        if(!(Object.prototype.toString.call(item) === "[object String]")) {
          this.storageSearchText(item.title);
          text=item.title;
        }
        else{
            if(item===''){text=this.value}
            else {
              text = item;
            }
        }
        if(this.from&&this.shopId&&this.from=='shop'){
          this.$router.push({name: 'shop', query: {shopid:this.shopId,key: text}});
        }else if(this.from&&this.from=='productList'){
          this.$router.replace({name:'productList', query: {key: text}});
          this.hide();
          this.$emit('child-update',1);
        }
        else{
          this.$router.push({name: 'productList', query: {key: text}});
        }
      },
      storageSearchText(text){
          var list=this.$getStorage(this.$storage_key.SEARCH_STORAGE);
          if(list){
            if(list.length==12){list.pop();}
            if(!list.find(l=>l==text)) {
              list.unshift(text)
            }
          }
          else{
              list=[];
              list.unshift(text);
          }
          this.$setStorage(this.$storage_key.SEARCH_STORAGE,list);
      },
      deleteHistory(){
          this.$removeStorage(this.$storage_key.SEARCH_STORAGE);
          this.$vux.toast.show({text:'清除成功!'});
          this.historyList=[];
      },
      show(){
          this.isShow=true;
          var that=this;
          setTimeout(function () {//如果直接调用setfocus，无法起作用，应该是vux的组件文件，所以折中使用settimeout延迟调用
            that.setFocus();
          },100);

      },
      hide(){
          this.isShow=false;
      },
      setFocus() {
        this.$refs.search.setFocus()
      }
    },
    created(){
      this.historyList=this.$getStorage(this.$storage_key.SEARCH_STORAGE);
    },
    mounted(){

    }
  }

  function getResult(val) {
    let rs = []
    for (let i = 0; i < 8; i++) {
      rs.push({
        title: `${val} result: ${i + 1} `,
        other: i
      })
    }
    return rs
  }
</script>

<style rel="stylesheet/less" lang="less">
  @import "../../assets/css/search.less";

  i,
  em {
    font-style: normal;
  }
</style>
