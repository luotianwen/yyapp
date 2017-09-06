<template>
  <popup v-model="isShow" style="height: auto !important;" @on-hide="updateChooseColor">
    <div class="body" ref="goodColor">
      <scroller lock-y :scrollbar-x="false">
        <div class="sku-control">
          <ul class="sku-list">
            <li>
              <h2>颜色:</h2>
              <div class="items">
                <label v-for="(color,$index) in colors" :key="color.sku"
                       :class="{'checked':color.colorid==nowColor.colorid}" @click="changeColor(color.colorid)">{{color.colorName}}</label>
              </div>
            </li>
            <li>
              <h2 id="J_Sku_a11y_20509">规格:</h2>
              <div class="items">

                <label v-for="(spec,$index) in specs" :key="spec.specid"
                       :class="{'checked':spec.specid==nowColor.specid}" @click="changespec(spec.specid)">{{spec.specName}}</label>
              </div>
            </li>

          </ul>
        </div>
        <div class="number">
          <h2>数量</h2>
          <div class="content">
            <div class="number-control">
              <div class="mui-number">
                <button type="button" class="decrease" @click="addNumberToCart(-1)">-</button>
                <input type="number" class="num" v-model="goodNumber" min="1" max="4786" step="" name="quantity">
                <button type="button" class="increase" @click="addNumberToCart(1)">+</button>
              </div>
            </div>
          </div>
        </div>
      </scroller>
    </div>
    <div class="summary">
      <div class="img"><img :src="nowColor.colorPic" alt=""></div>
      <div class="main">
        <div class="priceContainer"><span class="price">¥<i>{{nowColor.price|toFixed}}</i></span></div>
        <div class="sku-dtips">已选择: <span>{{nowColor.colorName+nowColor.specName}}</span></div>
      </div>
      <a class="sback" aria-label="关闭" @click="hide"></a>
    </div>
    <div class="option" v-if="state==1&&nowColor.stocks>0">
      <button class="cart cell" style="" @click="addInCart">加入购物车</button>
      <button class="buy cell" @click="buyNow">立即购买</button>
    </div>
    <div class="option" v-if="!(state==1&&nowColor.stocks>0)">
      <button class="cart cell yellow" style="">{{state!=1?'商品已下架':nowColor.stocks<=0?'到货通知':'商品已下架'}}</button>
    </div>
  </popup>
</template>

<script type="text/ecmascript-6">
  import {Popup, Scroller} from 'vux'
  import {mapGetters} from 'vuex'
  export default {
    computed: {
      ...mapGetters({
        cartInfo: 'getCartInfo',
      })
    },
    props: {
      pid: '',
      sku: '',
      name: '',
      state: '',
      shopid: ''
    },
    data() {
      return {
        isShow: false,
        colors: [], //颜色集合
        specs: [], //规格集合
        nowColor: {}, //当前选择对象
        dataColor: [], //查询所有的集合
        goodNumber: 1,
        initType: 0
      }
    },
    components: {
      Popup,
      Scroller
    },
    methods: {
      show() {
        this.isShow = true;
      },
      hide() {
        this.isShow = false;
      },
      initData() {

        this.colors = [];
        this.specs = [];
        this.dataColor = [];
        this.goodNumber = 1;
        var that = this;
        that.$post(that.$interface_url.product.skuList, {
          pid: that.pid
        }, function (data, success) {
          if (success && data) {
            data.forEach(function (item, index) {
              let obj = that.colors.find(c => c.colorid == item.colorid);
              if (!obj) { //填充非重复颜色集合
                that.colors.push(item)
              }
              let spec_obj = that.specs.find(c => c.specid == item.specid);
              if (!spec_obj) { //填充非重复规格集合
                that.specs.push(item)
              }
            })
            that.nowColor = data.find(d => d.sku == that.sku); //当前选择对象

            if (that.cartInfo.cartInfo) {
              var shop = that.cartInfo.cartInfo.find(c => c.shopid == that.shopid);
              if (shop) {
                var good = shop.wareList.find(g => g.sku == that.sku);
                if (good) {
                  that.goodNumber = good.number;
                }
              }
            }
            that.dataColor = data;
          } else {
            that.$vux.toast.show({
              text: data,
              type: 'warn',
              width: '15em'
            });
          }
        });
      },
      changeColor(id) { //改变颜色时对应改变当前选择对象集合
        let obj = this.dataColor.find(d => d.colorid == id && d.specid == this.nowColor.specid);
        this.nowColor = obj;
        this.goodNumber = 1;
        var that = this;
        if (that.cartInfo.cartInfo) {
          var shop = that.cartInfo.cartInfo.find(c => c.shopid == that.shopid);
          if (shop) {
            var good = shop.wareList.find(g => g.sku == that.nowColor.sku);
            if (good) {
              that.goodNumber = good.number;
            }
          }
        }
      },
      changespec(id) { //改变规格时对应改变当前选择对象集合
        let obj = this.dataColor.find(d => d.colorid == this.nowColor.colorid && d.specid == id);
        this.nowColor = obj;
        this.goodNumber = 1;
        var that = this;
        if (that.cartInfo.cartInfo) {
          var shop = that.cartInfo.cartInfo.find(c => c.shopid == that.shopid);
          if (shop) {
            var good = shop.wareList.find(g => g.sku == that.nowColor.sku);
            if (good) {
              that.goodNumber = good.number;
            }
          }
        }
      },
      updateChooseColor() { //当关闭当前选择窗体时，更新父级当前选择的颜色和规格（由于当前嵌套了2层，稍微麻烦，后期修改）
        this.$emit('child-update', this.nowColor)
      },
      addInCart() {
        if (this.state == 1 && this.nowColor.stocks > 0) {
          var good = {
            shopid: this.shopid,
            shopName: this.nowColor.shopName,
            sku: this.nowColor.sku,
            price: this.nowColor.price,
            pName: this.nowColor.pName,
            colorName: this.nowColor.colorName,
            specName: this.nowColor.specName,
            colorPic: this.nowColor.imgs ? this.nowColor.imgs[0] : '',
            number: this.goodNumber

          };

          this.$store.dispatch('addToCart', good);
          this.hide();
        } else if (this.state != 1) {
          //alert('下架');
        } else if (this.nowColor.stocks <= 0) {
          //alert('缺货');
        }
      },
      addNumberToCart(number){
        this.goodNumber += number;
        this.$store.dispatch('addNumberToCart', {
          shopid: this.shopid,
          sku: this.nowColor.sku,
          number: number,
          type: 'add'
        })
      },
      buyNow(){
        if (this.state == 1 && this.nowColor.stocks > 0) {
          this.$router.push({name: 'orderSubmit', query: {sku: this.nowColor.sku, type: 1}});
        }
      },
      changeInitType(){
        this.initType = 1;
      }
    },
    created() {
      this.initType = 0;
    },
    mounted() {
      this.initData();
    },
    watch: {
      'sku': {
        handler: function (val, oldVal) {
          if (this.initType == 1) {
            this.initData();
          }
        }
      }
    }


  }
</script>


