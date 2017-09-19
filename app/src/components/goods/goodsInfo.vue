<template>
    <transition enter-active-class="animated fadeInRight"
                leave-active-class="animated fadeOutLeft">
        <div class="goods-info" v-show="changeIndex==1" ref="goodsinfo" v-if="good">
            <div class="goods-info">
                <!--轮播图-->
                <swiper height="375px" dots-position="center">
                    <swiper-item class="swiper-img-list" v-for="(imgPath, index) in good.imgs" :key="index">
                        <img :src="imgPath">
                    </swiper-item>
                </swiper>
               <!-- <div id="flash-sale-detail">
                    <span class="rmb">¥</span>
                    <span class="sale-price">599.00</span>
                    <div class="old-price-wrapper">
                        <img class="img-flash-sale" src="../../assets/image/sale/icon_bg_flash_sale.png">
                        <div class="old-price">699</div>
                    </div>
                    <div class="count-down-wrapper">
                        <countdown class="count-down" :endTime="0"></countdown>
                    </div>
                </div>-->
                <!--商品描述-->
                <div class="goods-desc-wrapper">
                    <div class="goods-title-wrapper">
                        <p class="goods-title">{{good.pName}}</p>
                        <div class="shared-wrapper" @click="shared">
                            <img src="../../assets/image/goods/detail_shared.png"><span class="shared-txt">分享</span>
                        </div>
                    </div>
                    <div class="full-cut-content">{{good.goods_subtitle}}</div>
                    <div class="sale-price-wrapper">
                        <span class="rmb">¥</span><span class="sale-price">{{good.price|toFixed}}</span>
                    </div>
                    <div class="old-price-wrapper">
                        <span class="old-price-txt">价格¥</span><span
                            class="old-price">{{good.marketprice|toFixed}}</span>
                    </div>
                    <div class="other-wrapper">
                        <span class="express-fee">快递:0.00</span>
                        <span class="sale-count">月销102</span>
                        <span class="producer" @click="changeAddress">
                    {{good.originName}}
                    </span>
                    </div>
                </div>
                <!--购物券，促销信息-->
                <goods-coupon :sku="good.sku" :shopid="good.shopid" :cid="good.cid"></goods-coupon>
                <!--售后保障-->
                <div class="after-sales-wrapper">
                    <span class="txt">售后保障</span>
                    <span class="sales-content">{{good.after_service?good.after_service:'正品保证，七天退换货'}}</span>
                    <img src="../../assets/image/goods/icon_more_content.png">
                </div>
                <!--产品信息-->
                <goods-param :pid="good.pid" :colorName="good.colorName" :sku="good.sku" ref="goodParams"
                             :name="good.pName" :specName="good.specName" v-on:child-update="updateColor"
                             :state="good.state"
                             :shopid="good.shopid"></goods-param>
                <!--商品评价-->
                <goods-rated :pid="good.pid" v-on:child-update-index="_updateIndex"></goods-rated>
                <!--店家信息-->
                <goods-shop :shopid="good.shopid" :shopName="good.shopName" :shopLogo="good.shopLogo"></goods-shop>
                <!--为你推荐、排行榜-->
                <good-recommend :shopid="good.shopid"></good-recommend>
                <!--上拉查看图文详情-->
                <div class="pull-up-wrapper">
                    <span class="txt" @click="_updateIndex(2)">点击查看图文详情</span>
                    <img src="../../assets/image/goods/arrow_up.png">
                </div>
            </div>

            <share :url="url" :title="good.pName" :description="good.goods_subtitle" :imgSrc="good.imgs[0]"
                   ref="share"></share>

        </div>
    </transition>
</template>

<script type="text/ecmascript-6">
    import {
        Swiper,
        SwiperItem,
        XButton,
        Flexbox,
        FlexboxItem,
        XAddress,
        ChinaAddressV3Data,
        Value2nameFilter as value2name
    } from 'vux'
    import star from '../star/star.vue'
    import GoodsCoupon from './goods_coupon.vue'
    import GoodsParam from './goods_param.vue'
    import GoodsRated from './goods_rated'
    import GoodsShop from './goods_shop.vue'
    import GoodRecommend from './goods_recommend.vue'
    import Share from '../common/share.vue'
    import countdown from '../sale/count_down2.vue';

    export default{
        props: {
            changeIndex: '',
            good: {},
            goodImg: ''
        },
        components: {
            Swiper,
            SwiperItem,
            XButton,
            Flexbox,
            FlexboxItem,
            star,
            countdown,
            GoodsCoupon,
            GoodsParam,
            GoodsRated,
            GoodsShop,
            GoodRecommend,
            Share,
            XAddress,
            ChinaAddressV3Data,
            value2name
        },
        data(){
            return {
                url: '',
                showAddress: false,
                addressData: ChinaAddressV3Data,
                defaultAddress: [],
                pid: 0
            }
        },
        computed: {},
        methods: {
            //分享
            shared(){

                this.$refs.share.show();
            },
            updateColor(data){//提供给子组件更新的方法
                this.good.imgs = data.imgs;
                this.good.colorid = data.colorid;
                this.good.specid = data.specid;
                this.good.sku = data.sku;
                this.good.colorName = data.colorName;
                this.good.specName = data.specName;
                this.good.price = data.price;
                this.good.stocks = data.stocks;

            },
            _updateIndex(index){
                this.$emit('child-update_index', index)
            },
            changeAddress(){
                this.showAddress = true;
            },
            initColorData(){
                this.$refs.goodParams.initColorData();
            }
        },
        created(){

        },
        mounted(){

        },
        watch: {
            'changeIndex': {
                handler: function (val, oldVal) {
                    if (oldVal == 2 && val == 1) {
                        this.inTranName = 'animated fadeInLeft';
                        this.outTranName = 'animated fadeOutRight';
                    }
                    else if (oldVal == 3 && val == 1) {
                        this.inTranName = 'animated fadeInLeft';
                        this.outTranName = 'animated fadeOutRight';
                    }
                    else
                        this.inTranName = 'animated fadeInRight';
                    this.outTranName = 'animated fadeOutLeft';
                }

            }
        }
    };
</script>

<style lang="less" rel="stylesheet/less">
    @import "../../assets/css/base.less";

   /* #flash-sale-detail {
        display: -webkit-box; !* 老版本语法: Safari, iOS, Android browser, older WebKit browsers. *!
        display: -moz-box; !* 老版本语法: Firefox (buggy) *!
        display: -ms-flexbox; !* 混合版本语法: IE 10 *!
        display: -webkit-flex; !* 新版本语法: Chrome 21+ *!
        display: flex; !* 新版本语法: Opera 12.1, Firefox 22+ *!
        width: 100%;
        height: 88rem/@font-size-base;
        background-color: #06b670;
        align-items: center;
        .rmb {
            flex: 0 0 auto;
            color: #ffffff;
            font-size: 24rem/@font-size-base;
            align-self: flex-end;
            margin-bottom: 25rem/@font-size-base;
            margin-left: 24rem/@font-size-base;
            margin-right: 8rem/@font-size-base;
        }
        .sale-price {
            flex: 0 0 auto;
            color: #ffffff;
            font-size: 50rem/@font-size-base;
        }
        .old-price-wrapper {
            flex: 1;
            margin-left: 18rem/@font-size-base;
            .img-flash-sale {
                width: 110rem/@font-size-base;
                height: 26rem/@font-size-base;
            }
            .old-price {
                color: #8dffc9;
                font-size: 24rem/@font-size-base;
                text-decoration: line-through;
            }
        }
        .count-down-wrapper {
            flex: 0 0 auto;
            width: 316rem/@font-size-base;
            height: 58rem/@font-size-base;
            background: url(../../assets/image/sale/icon_bg_sale_detail.png) no-repeat;
            background-size: 316rem/@font-size-base 58rem/@font-size-base;
            -webkit-background-size: 316rem/@font-size-base 58rem/@font-size-base;
            .count-down {
                text-align: right;
                margin-top: 9rem/@font-size-base;
                margin-right: 24rem/@font-size-base;
            }
        }
    }*/
</style>
