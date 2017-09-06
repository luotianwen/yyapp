<template>
  <div class="issue_evaluate">
    <div class="ele_header">
      <x-header :left-options="{showBack:true}" :right-options="{showMore: true}">发表评价
      </x-header>
    </div>
    <div class="ele_content">
      <div class="fill_in " v-for="good in order.wares">
        <div class="title clearfix">
          <img :src="good?good.productImage:''"/>
          <span>{{good?good.productName:''}}</span>
        </div>
        <group>
          <x-textarea :max="500" v-model="good.content" placeholder="商品满足您的期待吗？说说您的使用心得，分享给想买的小伙伴们吧。"></x-textarea>
        </group>
        <div class="uploading_img clearfix"
             v-show="currentDevice.deviceName == 'android' || currentDevice.deviceName == 'ios'">
          <!--最多添加五张图片，五张填满以后按钮隐藏-->
          <span class="u_btn"><i></i><em>添加图片</em></span>
          <ul>
            <li><img src="../../../assets/image/home/banner_img_1.jpg"/><i></i></li>
            <li><img src="../../../assets/image/home/banner_img_1.jpg"/><i></i></li>
            <li><img src="../../../assets/image/home/banner_img_1.jpg"/><i></i></li>
            <li><img src="../../../assets/image/home/banner_img_1.jpg"/><i></i></li>
          </ul>
        </div>

      </div>
      <div class="fill_in" style="border-top: none;!important;">
        <div class="anonymity" @click="anonymous=!anonymous">
          <span><i :class="{'active':anonymous}"></i><em>匿名</em></span>
          <p>您写的评价会以匿名形式展现</p>
        </div>
      </div>

      <div class="stars_evaluate">
        <div class="title"><i></i>店铺评分</div>
        <div class="grade g_item_1">
          <div class="list_item">
            <span>描述相符</span>
          </div>
          <div class="star">
            <p v-for="i in starNumber" :class="{'solid':descStar>=i}" @click="changeStar(i,1)"></p>
          </div>
          <div class="evaluate_msg">
            <span>{{formatStar(descStar)}}</span>
          </div>
        </div>
        <div class="grade">
          <div class="list_item">
            <span>物流服务</span>
          </div>
          <div class="star">
            <p v-for="i in starNumber" :class="{'solid':logisticsStar>=i}" @click="changeStar(i,2)"></p>
          </div>
          <div class="evaluate_msg">
            <span>{{formatStar(logisticsStar)}}</span>
          </div>
        </div>
        <div class="grade">
          <div class="list_item">
            <span>服务态度</span>
          </div>
          <div class="star">
            <p v-for="i in starNumber" :class="{'solid':serviceStar>=i}" @click="changeStar(i,3)"></p>
          </div>
          <div class="evaluate_msg">
            <span>{{formatStar(serviceStar)}}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="ele_btn" @click="subComment">
      发表评价
    </div>
  </div>
</template>
<script>
  import {XTextarea, XHeader, Group} from 'vux'
  import {mapGetters} from 'vuex'
  export default {
    computed: {
      ...mapGetters({
        currentDevice: 'currentDevice'
      })
    },
    components: {
      XTextarea,
      XHeader,
      Group
    },
    data() {
      return {
        order: {},
        anonymous: false,
        starNumber: 5,
        descStar: 5,
        logisticsStar: 5,
        serviceStar: 5,
        userInfo: {}
      }
    },
    methods: {
      changeStar(index, type){
        if (type == 1) {
          this.descStar = index;
        }
        else if (type == 2) {
          this.logisticsStar = index;
        }
        else if (type == 3) {
          this.serviceStar = index;
        }
      },
      formatStar(index){
        var desc = '';
        switch (index) {
          case 1:
            desc = '非常差';
            break;
          case 2:
            desc = '差';
            break;
          case 3:
            desc = '一般';
            break;
          case 4:
            desc = '好';
            break;
          case 5:
            desc = '非常好';
            break;
        }
        return desc;
      },
      subComment(){
        var that = this;
        var comment = {};
        comment.describe_score= that.descStar,
          comment.lservice= that.logisticsStar,
          comment.sservice= that.serviceStar,
          comment.wareComments= [];
        comment.anonymous=that.anonymous;

        that.order.wares.forEach(function (item, index) {
          if (item.content && item.content.length > 0) {
            comment.wareComments.push({
              sku: item.sku,
              content: item.content,
              score: 5,
              imgs:[]
            });
          }
        })


        that.$post(that.$interface_url.comment.commentOrder,
          {
            token: that.userInfo.token,
            comment: JSON.stringify(comment),
            orderId: that.order.orderId
          },
          function (data, success) {
            if (success) {
              that.$vux.toast.show({text:'评论发表成功！'});
              that.$router.push({name:'evaSuccess'});
            }
            else{
              that.$vux.toast.show({text:'评论发表失败！',type:'warn'});
            }
          });
      }
    },
    created(){
      if (this.$route.params && this.$route.params.order) {
        this.order = this.$route.params.order;
        this.userInfo = this.$getStorage(this.$storage_key.USERINFO_STORAGE);
      }
      else {
        this.$router.push({name: 'member'});
      }
    }
  }
</script>

<style rel="stylesheet/less" lang="less">
  @import "../../../assets/css/evaluate.less";

  i, em {
    font-style: normal;
  }
</style>

