<template>
    <div id="count-down">
        <div class="countdown">
            <span class="txt">剩余</span>
            <span class="day">{{day}}</span>
            <span class="txt">天</span>
            <span class="hour">{{hour}}</span>
            <span class="txt">:</span>
            <span class="min">{{min}}</span>
            <span class="txt">:</span>
            <span class="second">{{second}}</span>
        </div>
    </div>
</template>
<script>
    export default {
        data(){
            return {
                day: '',
                hour: '',
                min: '',
                second: '',
                endText: '已结束'

            }
        },
        props: {
            endTime: {
                type: String,
                default: ''
            }
        },
        mounted () {
            this.countdowm(this.endTime)
        },
        methods: {
            countdowm(timestamp){
                let self = this;
                let timer = setInterval(function () {
                    let nowTime = new Date();
                    let end = Date.parse(new Date(timestamp));
                    let t = end - nowTime.getTime();
                    if (t > 0) {
                        self.day = Math.floor(t / 86400000);
                        self.hour = Math.floor((t / 3600000) % 24);
                        self.min = Math.floor((t / 60000) % 60);
                        self.second = Math.floor((t / 1000) % 60);
                        self.hour = self.hour < 10 ? "0" + self.hour : self.hour;
                        self.min = self.min < 10 ? "0" + self.min : self.min;
                        self.second = self.second < 10 ? "0" + self.second : self.second;
                    } else {
                        clearInterval(timer);
                        self.content = 0;
                        self.day = 0;
                        self.hour = 0;
                        self.min = 0;
                        self.second = 0;
                        self.hour = 0;
                        self.min = 0;
                        self.second = 0;
                        self._callback();
                    }
                }, 1000);
            },
            _callback(){
                if (this.callback && this.callback instanceof Function) {
                    this.callback(...this);
                }
            }
        }
    }
</script>

<style lang="less" rel="stylesheet/less">
    @import "../../assets/css/base.less";

    #count-down {
        background-color: #06b662;
        .countdown {
            height: 40rem/@font-size-base;
            color: #FFFFFF;
            font-size: 20rem/@font-size-base;
            margin-left: 21rem/@font-size-base;
            padding-left: 32rem/@font-size-base;
            background: url(./icon_countdown.png) no-repeat left center;
            background-size: 24rem/@font-size-base 24rem/@font-size-base;
            -webkit-background-size: 24rem/@font-size-base 24rem/@font-size-base;
            .txt {
                height: 40rem/@font-size-base;
                line-height: 40rem/@font-size-base;
            }
            .day, .hour, .min, .second {
                display: inline-block;
                margin-bottom: 3.5rem/@font-size-base;
                width: 33rem/@font-size-base;
                height: 33rem/@font-size-base;
                line-height: 33rem/@font-size-base;
                text-align: center;
                background: url(./icon_bg_count.png) no-repeat center;
                -webkit-background-size: 34rem/@font-size-base 34rem/@font-size-base;
                background-size: 34rem/@font-size-base 34rem/@font-size-base;
            }
        }
    }
</style>