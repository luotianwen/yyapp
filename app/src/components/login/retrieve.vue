<template>
	<!--找回密码-->
  <div>

	<div class="retrieve">
		<div class="re_header">
			<x-header :left-options="{showBack:true,backText:''}">
        {{type==1?'找回密码':type==2?'绑定手机号':'修改密码'}}
        </x-header>
		</div>
		<div class="re_content">
			<!--找回密码-->
			<!--手机号码格式错误 ，点击下一步提示--'手机号码输入有误！'-->
			<!--手机号码格式正确 ，点击下一步提示--'手机验证'，头部标题为'安全检测'-->
			<!--未输入值时button禁止点击，边框字体颜色为#99d9fa,获取焦点后颜色为#009ff2-->
			<div class="retrieve_password">
				<group>
			      	<x-input :title="type==3?'已验证手机号':'账号'" v-model="phone"  placeholder="请输入手机号码"
                       :is-type="type==3?'':'china-mobile'"
                       :show-clear="true" ref="phoneTxt" :max="11" type="text" keyboard='number' :disabled="type==3"></x-input>
			   	</group>
			    <div class="re_btn">
					<x-button type="primary" plain :class="{'weui-btn_plain-primary_active':isClick}" @click.native="nextClick">
            {{type==3?'获取短信验证码':'下一步'}}
          </x-button>
				</div>
			</div>
		</div>
	</div>
    <sms-code ref="smsCode" :phone="phone" :sendType="type" ></sms-code>
  </div>
</template>
<script>
	import {XHeader,XButton,XInput,Group} from 'vux'
  import {isLogin} from '../../common/js/checkIsLogin'
  import smsCode from './smscode.vue'
	export default {
    components: {
      XHeader,
      XButton,
      XInput,
      Group,
      smsCode
    },
    data () {
      return {
        isClick: false,
        phone:'',
        type:0,//1为找回密码，2为绑定手机号，3为登录状态下修改密码，默认为0为注册
        userInfo:{}
      }
    },
    methods: {
      nextClick(){
        if (!this.isClick)return;
        var para={};

        if(this.type!=3) {//修改密码 发送短信验证码不需要验证手机号
          var that = this;
          if(that.type==2){
              para.token=that.userInfo.token;
          }
          para.phone=that.phone;
          that.$post(
             that.type==2?that.$interface_url.safe.bindCheckPhoneExists:that.$interface_url.safe.checkPhoneExists,
            para,
            function (data, success) {
            if (success) {
              that.$refs.smsCode.show();
              that.$refs.smsCode.sendCode();
            }
            else {
              that.$vux.toast.show({text: data, type: 'warn', width: '18em'});
            }
          })
        }
        else {
          this.$refs.smsCode.show();
          this.$refs.smsCode.sendCode();
        }
      },
      initAccount(){//找回密码是根据token获取账号信息
          var that=this;
          that.$post(that.$interface_url.safe.account,{token:that.userInfo.token},function (data,success) {
            if(success){
                that.phone=data;
            }
          })
      },
    },
    watch:{
        'phone':{
          handler:function (val,oldval) {
              if(val.trim().length>0&&this.$refs.phoneTxt.valid){
                  this.isClick=true;
              }
              else{
                  this.isClick=false;
              }
            },
          deep:true
        }
    },
    created(){
      if(this.$route.query&&this.$route.query.type){
          this.type=this.$route.query.type;
      }
      if(this.type==2||this.type==3){
        if(!isLogin()){
            this.$router.push({name:'login',query:{returnurl:this.$route.fullPath}});
        }
        else{
          this.userInfo=this.$getStorage(this.$storage_key.USERINFO_STORAGE);
        }
      }
      if(this.type==3){
          this.isClick=true;
          this.initAccount();
      }
    }
  }
</script>

<style rel="stylesheet/less" lang="less">
	@import "../../assets/css/retrieve.less";
	i{
		font-style: normal;
	}
</style>
