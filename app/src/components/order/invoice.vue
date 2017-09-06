<template>
  <transition enter-active-class="animated fadeInRight" leave-active-class="animated fadeOutRight">
    <div class="invoice" ref="invoice" v-show="isShow">
      <div class="i_header">

        <x-header :left-options="{showBack:false,backText:'eee'}">
          <span class="back_btn" @click="hide"><i></i></span>
          发票信息
        </x-header>
      </div>
      <div class="i_content">
        <!--点击明细之后-->
        <div class="genre">
          <div class="title">
            发票类型
          </div>
          <div class="o_name">
            <span>纸质发票</span>
          </div>
        </div>
        <div class="particulars">
          <div class="title">
            发票抬头
          </div>
          <div class="rise">
            <div class="option">
              <span class="personage " :class="{'active':invoiceType==1}" @click="changeInvoiceType(1)"><i></i>个人</span>
              <span class="unit" :class="{'active':invoiceType==2}" @click="changeInvoiceType(2)"><i></i>单位</span>
            </div>
            <group v-if="invoiceType==2">
              <x-input title="发票抬头" v-model="invoiceTitle"></x-input>
            </group>
          </div>
        </div>
        <!--最初显示-->
        <div class="whether_bill">
          <group>
            <cell title="发票内容"></cell>
          </group>
          <div class="option">
            <span class="y_bill" :class="{'active':needInvoice}" @click="changeNeedInvoice(true)"><i></i>明细</span>
            <span class="n_bill" :class="{'active':!needInvoice}" @click="changeNeedInvoice(false)"><i></i>不开发票</span>
          </div>
        </div>
      </div>
      <div class="new_btn">
        <x-button type="primary" @click.native="confrimInvoice">确定</x-button>
      </div>
    </div>


  </transition>
</template>
<script>
  import {XInput, XHeader, Group, Cell, Popup, XButton} from 'vux'
  export default {
    props: {},
    components: {
      XInput,
      XHeader,
      Group,
      Cell,
      Popup, XButton
    },
    data() {
      return {
        isShow: false,
        invoiceType: 1,
        invoiceTitle: '',
        needInvoice: false,
        shopid: ''
      }
    },
    methods: {
      show(){
        this.isShow = true;
      },
      hide(){
        this.isShow = false;
      },
      changeInvoiceType(type){
        this.invoiceType = type;
        this.invoiceTitle = '';
      },
      changeNeedInvoice(val){

        this.needInvoice = val;
      },
      confrimInvoice(){
        this.$emit('update_invoice', {
          shopid: this.shopid,
          needInvoice: this.needInvoice,
          invoiceTitle: this.invoiceTitle,
          invoiceType: this.invoiceType
        })
        this.hide();
      },
      getInvoiceList(){
          var that=this;
        this.$post(this.$interface_url.invoice.getInvoiceList,
          {token: this.$getStorage(this.$storage_key.USERINFO_STORAGE).token}, function (data, success) {
          if(success){

          }
        });
      }
    },
    created(){
      this.getInvoiceList();
    }
  }
</script>

<style rel="stylesheet/less" lang="less">
  @import "../../assets/css/invoice.less";

  i, em {
    font-style: normal;
  }
</style>

