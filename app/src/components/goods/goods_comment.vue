<template>
  <div id="goods-comment" v-show="changeIndex==3">
<div v-show="commentList&&commentList.length>0">
    <div class="tally clearfix">
      <ul>
        <li class="whole">全部<i>(555)</i></li>
        <li class="fine">追加评价<i>(54)</i></li>
        <li class="fine">有图评价<i>(54)</i></li>
        <li class="fine">质量很好<i>(54)</i></li>
        <li class="fine">尺码刚刚好<i>(34)</i></li>
      </ul>
    </div>
    <scroller lock-x scrollbar-y :use-pullup="true"  v-model="scrollerStatus" :pullup-config="pullupConfig"
              @on-pullup-loading="upEvent" ref="scroller" >
      <div>
    <div v-for="item in commentList" class="gc_item">
      <div class="star-user-wrapper clearfix">
        <div id="star" class="star">
          <span class="start-item on"></span>
          <span class="start-item on"></span>
          <span class="start-item on"></span>
          <span class="start-item on"></span>
          <span class="start-item on"></span>
        </div>
        <span class="user">{{item.receiveName}}</span>
      </div>
      <p class="comment-content">
        {{item.content}}
      </p>
      <span class="color-class"><i>{{item.cdate}}</i>颜色分类:{{item.colorName}};尺码:{{item.specName}}</span>
      <div class="picture" v-if="item.commentImgs&&item.commentImgs.length" v-for="img in item.commentImgs">
        <span><img :src="img.imagePath"/></span>
      </div>
      <!--<div class="add_review">
              <span>19天后追评</span>
              <p>
                  第二次买了！穿着舒服轻松！便宜，质量也还不错！第二次买了！穿着舒服轻松！便宜，质量也还不错！第二次买了！穿着舒服轻松！便宜，质量也还不错！
              </p>
          </div>-->
    </div>
      </div>
    </scroller>
</div>
  </div>
</template>

<script type="text/ecmascript-6">
  import {Scroller} from 'vux'
  export default {
    props: {
      productId: 0,
      changeIndex: 0
    },
    components: {Scroller},
    data() {
      return {
        currentPage: 1,
        pageSize: 10,
        commentList: [],
        currentPage: 1,
        hasNextPage: false,
        pullupConfig: {
          content: '上拉加载内容',
          pullUpHeight: 60,
          height: 40,
          autoRefresh: false,
          downContent: '松开刷新',
          upContent: '上拉加载内容',
          loadingContent: '正在加载',
          clsPrefix: 'xs-plugin-pullup-'
        },
        scrollerStatus: {
          pullupStatus: 'default'
        },
      }
    },
    methods: {
      initData(){
        var that = this;
        that.$post(that.$interface_url.comment.wareComments,
          {
            productId: that.productId,
            currentPage: that.currentPage,
            pageSize: that.pageSize
          },
          function (data, success) {
            if (success) {
              that.hasNextPage = data.hasNextPage;

              data.resultData.forEach(function (item, index) {
                that.commentList.push(item);
              })
              if (data.hasNextPage) {//如果有下一页重置scroller
                that.$nextTick(() => {
                  that.scrollerStatus.pullupStatus = 'default';
                  that.$refs.scroller.reset();
                });
              }
              else {//没有下一页隐藏下拉
                that.$nextTick(() => {
                  //that.$refs.scroller.disablePullup();
                  that.$refs.scroller.disablePullup();
                  that.scrollerStatus.pullupStatus = 'default';

                  that.$refs.scroller.reset();
                });
              }


            }
          });
      },
      upEvent(){
        if (this.hasNextPage) {
          this.currentPage++;
          this.initData();
        }
        else {
          this.$nextTick(() => {//重置scroller状态
            //that.$refs.scroller.disablePullup();
            this.$refs.scroller.disablePullup();
            this.scrollerStatus.pullupStatus = 'default';

            this.$refs.scroller.reset();
          });
        }
      }
    },
    created(){
      this.initData();
    }
  }
</script>

<style lang="less" rel="stylesheet/less">

</style>
