<template>
  <transition enter-active-class="animated fadeInRight" leave-active-class="animated fadeOutRight">
    <div class="filtrate clearfix" v-show="isShowSearch">
      <div class="shade" @click="hideSearch"></div>
      <div class="f_item">
        <div class="f_content">
          <div class="fc clearfix">
            <div class="price_cancel">
              <div class="title">价格区间</div>
              <div class="input">
                <input type="number" v-model="para.start_price" placeholder="最低价" />
                <i>~</i>
                <input type="number" v-model="para.end_price" placeholder="最高价" />
              </div>
            </div>
            <div class="trademark">
              <div class="title"><span class="tt">品牌</span><i></i>
                <span class="name" id="brandAll" @click="unfold('brandAll')">
                    {{para.b && para.b>0?brandList.find(b=>b.id==para.b).brandName:'全部'}}
                  </span></div>
              <div class="t_item clearfix unfold">
                <span v-for="brand in brandList" :class="{'active':para.b==brand.id}" @click="$set(para,'b',brand.id)">{{brand.brandName}}</span>
              </div>
            </div>
            <div class="trademark" v-for="property in propertyList">
              <div class="title"><span class="tt">{{property.propertyName}}</span>
                <i></i>
                <span class="name" :id="md5(property.propertyName)"  @click="unfold(md5(property.propertyName))">
                    {{selectedPropertyList&&selectedPropertyList[property.propertyName]?selectedPropertyList[property.propertyName].content:'全部'}}
                    </span>
              </div>
              <div class="t_item clearfix unfold">
										<span v-for="value in property.propertyValueList" @click="chooseProperty(property.propertyName,value)"
                          :class="{'active':selectedPropertyList&&selectedPropertyList[property.propertyName]&&selectedPropertyList[property.propertyName].id==value.id}">
                      {{value.content}}</span>
              </div>
            </div>
          </div>

        </div>

        <div class="fle_btn">
          <span class="fbtn_1" @click="reset()">重置</span>
          <span class="fbtn_2" @click="search">确定</span>
        </div>
      </div>
    </div>
  </transition>

</template>

<script type="text/ecmascript-6">
  import {md5} from 'vux'
    export default{
        props:{
            brandList:{},
          propertyList:{},
          para:{},

        },
        data(){
            return {
              isShowSearch:false,
              selectedPropertyList:[],
            }
        },
        components: {},
        methods: {
          md5(val){
            return md5(val);
          },
          showSearch() {
            this.isShowSearch = true;
          },
          hideSearch() {
            this.isShowSearch = false;
          },
          unfold(obj){
            var t=document.getElementById(obj).parentNode.nextSibling;
            var tclassName =t.nextSibling.className;
            if(tclassName==='t_item clearfix unfold'){
              t.nextSibling.className='t_item clearfix';
            }
            else{
              t.nextSibling.className='t_item clearfix unfold'
            }
            var p=document.getElementById(obj).previousSibling;
            if(p.previousSibling.className){
              p.previousSibling.className='';
            }
            else{
              p.previousSibling.className='active';
            }
          },
          search() {
            if (this.selectedPropertyList) {
              var fv='';
              for (var p in this.selectedPropertyList) {
                fv += this.selectedPropertyList[p].id + ',';
              }
              if(fv&&fv.length>0) {
                this.para.fv = fv.substr(0, fv.length - 1);
              }
            }
            this.$emit('child-update',this.para)
            this.isShowSearch = false;

          },
          chooseProperty(name,val){
            this.$set(this.selectedPropertyList, name, val);
            //this.selectedPropertyList[name]=val;

          },
          reset(){
              this.para.start_price='';
            this.para.end_price='';
            this.para.b=0;
            this.para.fv='';
            this.selectedPropertyList=[];

          }
        },
        computed: {},
        created(){

        }
    }
</script>

<style lang="less">

</style>
