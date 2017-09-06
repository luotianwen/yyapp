<template>
  <div class="afterSale">
    <div class="afs_header">
      <x-header :left-options="{showBack:true}" :right-options="{showMore: true}">申请售后服务<span class="amend"></span>
      </x-header>
    </div>
    <div class="afs_content">
      <div class="type_service">
        <div class="title">
          服务类型
        </div>
        <ul>
          <li :class="{'active':saleType==2}" @click="saleType=2"><i></i>退款<em>(未收到货)</em></li>
          <li :class="{'active':saleType==3}" @click="saleType=3"><i></i>退货<em>(已收到货)</em></li>
          <li :class="{'active':saleType==1}" @click="saleType=1"><i></i>换货<em>(已收到货)</em></li>
        </ul>
      </div>
      <div class="problem_description">
        <group>
          <x-textarea :max="500" placeholder="请您输入问题描述" v-model="apply.questionDesc"></x-textarea>
        </group>
        <div class="uploading_img clearfix">
          <!--最多添加五张图片，五张填满以后按钮隐藏-->
          <span class="u_btn" @click="changeFile" v-show="images.length<5"><i></i><em>添加图片</em></span>
          <ul>
            <li v-for="(image,$index) in images">
              <img :src="image"/>
              <i @click="deleteImage($index)"></i>
            </li>
          </ul>
        </div>
      </div>
      <div class="reminder">
        提交服务单后，售后专员可能与您电话沟通，请保持手机畅通。
      </div>
      <div class="ele_btn" @click="save">
        提交
      </div>
    </div>
  </div>
</template>
<script>

  import {XInput, XHeader, Group, XTextarea} from 'vux'
  import {mapGetters} from 'vuex'

  export default {
    computed: {
      ...mapGetters({
        device: 'currentDevice'
      })
    },
    components: {
      XInput,
      XHeader,
      Group,
      XTextarea
    },
    data() {
      return {
        orderId: '',
        sku: '',
        saleType: 2,//服务类型(1换货 2退款3退款退货,4维修 )
        apply: {},
        isShowPic: false,
        userInfo: {},
        images: []
      }
    },
    methods: {
      save(){

        if (!this.apply.questionDesc||this.apply.questionDesc.trim().length <= 10) {
          this.$vux.toast.show({text: '描述不得少于10个字', type: 'warn'});
          return;
        }

        var para = {
          order_id: this.orderId,
          applyType: this.saleType,
          wareId: this.sku,
          questionDesc: this.apply.questionDesc,
          imgs: this.images
        };
        var that = this;
        that.$post(that.$interface_url.order.serviceApply, {
          token: that.$getStorage(that.$storage_key.USERINFO_STORAGE).token,
          applyInfo: JSON.stringify(para)
        }, function (data, success) {
          if (success) {
            that.$vux.toast.show({text: '申请提交成功!'});
            that.$router.push({name: 'after'});
          }
          else {
            that.$vux.toast.show({text: '申请提交失败!请联系商城客服人员!', type: 'warn'});
          }
        });

      },
      changeFile(){
        navigator.camera.getPicture(this.takeSuccess, this.takeFail, {
          quality: 50,
          destinationType: Camera.DestinationType.DATA_URL,
          sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
          allowEdit: true,
          encodingType: Camera.EncodingType.JPEG,
          targetWidth: 100,
          targetHeight: 100
        });
      },
      takeSuccess(imageURI){
          var that=this;
        that.$post(that.$interface_url.upload.uploadImg,
          {
            token: that.userInfo.token,
            imgstr: imageURI
          },
          function (data, success) {
            if (success) {
              that.images.push(data);
            }
            else {
              alert('图片上传失败');
            }
          });
      },
      takeFail(){
          alert('失败');
      },
      deleteImage(index){
        this.images.splice(index,1)
        alert(this.images.length);
      }
    },
    created(){

      if (this.$route.params && this.$route.params.sku) {
        this.orderId = this.$route.params.orderId;
        this.sku = this.$route.params.sku;

      }
      else {
        this.$router.go(-1);
      }

      this.userInfo = this.$getStorage(this.$storage_key.USERINFO_STORAGE);
      if (this.device.deviceName == 'android' || this.device.deviceName == 'ios') {
        this.isShowPic = true;
      }
      else {
        this.isShowPic = false;
      }

    }
  }
</script>

<style rel="stylesheet/less" lang="less">
  @import "../../../assets/css/afterSale.less";

  i, em {
    font-style: normal;
  }
</style>

