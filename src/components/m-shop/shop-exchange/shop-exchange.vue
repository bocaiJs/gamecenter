<template>
    <transition name="slider">
        <div class="exchangerank">
            <m-header :canreturn=true :titleText="titleText"></m-header>
            <div class="rankbox" v-show="!showloading" ref="rankbox">
                <scroll class="wrapper">
                    <div>
                        <!-- <div class="item" v-for="(item,index) in rankList" :key='index' v-show="rankList.lenght">
                            <div class="left">{{index+1}}</div>
                            <div class="right">
                                <div class="img">
                                    <img :src="item.image" alt="">
                                </div>
                                <div class="info">
                                    <h3>{{item.title}}</h3>
                                    <p class="blue">所需积分:{{item.score}}</p>
                                    <p class="blue">剩余：{{item.goods_code_count - item.receive_num}}个</p>
                                    <div class="btn" @click="exchangeGoods(item.id)">立即兑换</div>
                                </div>
                            </div>
                            <div class="bottom">
                                {{item.description}}
                            </div>
                        </div> -->

                        <div>
                            <div class="rankitem" v-for="(item,index) in rankList" :key='index'>
                                <div class="icon yi" v-if="index ===0">1</div>
                                <div class="icon er" v-if="index ===1">2</div>
                                <div class="icon san" v-if="index ===2">3</div>
                                <div class="icon" v-if="index >2">{{index+1}}</div>
                                <div class="goodsimg">
                                    <img :src="item.image" alt="">
                                </div>
                                <div class="title">
                                    <p>{{item.title}}</p>
                                    <div class="score"><img src="./jinbi@3x.png" alt="">
                                        <span>所需积分 : </span>
                                        <span>{{item.score}}</span>
                                    </div>
                                </div>
                                <div class="btn" @click="exchangeGoods(item.id)">
                                    兑换
                                </div>
                            </div>
                        </div>
                        <p style="text-align:center;color:#bbbbbb;margin-top:100px;" v-show="rankList.lenght === 0">没有兑换信息{{rankList.lenght}}</p>
                    </div>
                </scroll>
            </div>
            <mask-common :showMask="showMask" :maskInfo="maskInfo" @mask="hideMask" :dhcode="dhcode"></mask-common>
            <div class="loading-container" v-show="showloading">
                <loading></loading>
            </div>
        </div>
    </transition>
</template>

<script type="text/ecmascript-6">
import MHeader from '@/components/m-header/m-header';
import Loading from '@/base/loading/loading';
import Scroll from '@/base/scroll/scroll';
import MaskCommon from '@/base/maskcommon/maskcommon';
import { getCommonInfo, postInfo } from '@/base/api/indexpage/getindexinfo';
import { mapGetters } from 'vuex';

export default {
    data() {
        return {
            titleText: '兑换排行',
            rankList: [],
            showMask: false,
            dhcode: '',
            maskInfo: {
                content: '',
                btn: [],
            },
            showloading: true,
        };
    },
    created() {
        this._getRankInfo();
    },
    mounted() {
        this.$refs.rankbox.style.top = (44 + parseInt(this.statusbar)) + 'px';
    },
    methods: {
        _getRankInfo() {
            const path = '/shop/ranking';
            getCommonInfo(path).then((res) => {
                this.showloading = false;
                console.log(res);
                this.rankList = res;
                console.log(this.rankList.length);
            });
        },
        exchangeGoods(id) {
            console.log(id);
            if (!this.getLoginState) {
                this.showMask = true;
                this.maskInfo.content = '请先登录';
                this.maskInfo.btn[0] = {
                    btnTitle: '知道了',
                    type: 'hide',
                };
                this.maskInfo.btn[1] = {
                    btnTitle: '去登录',
                    type: 'login',
                };
                return;
            }
            const path = '/shop/getShopGood';
            postInfo(path, {
                good_id: id,
                token: this.getToken,
            }).then((res) => {
                this.maskInfo.btn = [];
                if (res.status_code === 200) {
                    this.showMask = true;
                    this.maskInfo.extendtips = '(请将兑换码发给客服)';
                    this.maskInfo.content = '您的验证码为:';
                    this.maskInfo.btn[0] = {
                        btnTitle: '复制',
                        type: 'copy',
                    };
                    console.log(this.dhcode);
                    this.dhcode = res.code;
                } else {
                    this.showMask = true;
                    this.maskInfo.content = res.message;
                    this.maskInfo.extendtips = '';
                    this.maskInfo.btn[0] = {
                        btnTitle: '知道了',
                        type: 'hide',
                    };
                    this.dhcode = '';
                }
            });
        },
        hideMask() {
            this.showMask = false;
        },
    },
    computed: {
        getIcon() {
            return 'icon yi';
        },
        ...mapGetters(['getToken', 'getLoginState', 'statusbar']),
    },
    components: {
        MHeader,
        Scroll,
        Loading,
        MaskCommon,
    },
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~common/stylus/variable';
@import '~common/stylus/mixin';

slider();

.exchangerank {
    position: fixed;
    width: 100%;
    top: 0;
    bottom: 0;
    background: #f2f2f2;

    .rankbox {
        sub-position();
        background: #f2f2f2;

        .wrapper {
            height: 100%;
            overflow: hidden;

            // padding: 15px;
            .item {
                height: 110px;
                width: 100%;
                background: #ffffff;
                display: flex;
                flex-wrap: wrap;
                margin-top: 15px;
                position: relative;
                padding-bottom: 42px;

                &:first-child {
                    margin-top: 0;
                }

                &:last-child {
                }

                .left {
                    width: 10%;
                    border-right: 1px solid #eeeeee;
                    font-size: $font-size-large;
                    color: #000000;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    box-sizing: border-box;
                }

                .right {
                    width: 90%;
                    padding: 12px 0;
                    padding: 12px 0 12px 10px;
                    height: 100%;
                    box-sizing: border-box;
                    display: flex;
                    align-items: center;

                    .img {
                        height: 100%;
                        min-width: 40%;
                        background: #cccccc;

                        img {
                            display: block;
                            height: 100%;
                        }
                    }

                    .info {
                        height: 100%;
                        padding-left: 10px;
                        display: flex;
                        flex-direction: column;
                        justify-content: space-between;

                        h3 {
                            color: #222222;
                            font-size: $font-size-small;
                        }

                        p {
                            font-size: $font-size-small-s;

                            &.blue {
                                color: #58d2ec;
                            }
                        }

                        .btn {
                            width: 60px;
                            height: 24px;
                            background: #ffc400;
                            color: #ffffff;
                            line-height: 24px;
                            text-align: center;
                            font-size: $font-size-small-s;
                            border-radius: 5px;
                        }
                    }
                }

                .bottom {
                    padding: 4px 0;
                    width: 100%;
                    line-height: 16px;
                    font-size: $font-size-medium;
                    background: #ffffff;
                    color: #555555;
                    padding-left: 10%;
                    box-sizing: border-box;
                    border-top: 1px solid #eeeeee;
                }
            }

            .rankitem {
                display: flex;
                align-items: center;
                width: 100%;
                height: 75px;
                padding: 0 15px;
                box-sizing: border-box;
                border-bottom: 1px solid #cccccc;
                position: relative;

                .icon {
                    height: 20px;
                    width: 20px;
                    text-align: center;
                    line-height: 20px;
                    color: #333333;
                    font-size: 12px;
                    margin-right: 10px;

                    &.yi {
                        background: url('./yi@3x.png') no-repeat;
                        background-size: 20px 20px;
                        color: #ffffff;
                    }

                    &.er {
                        background: url('./er@3x.png') no-repeat;
                        background-size: 20px 20px;
                        color: #ffffff;
                    }

                    &.san {
                        background: url('./san@3x.png') no-repeat;
                        background-size: 20px 20px;
                        color: #ffffff;
                    }
                }

                .goodsimg {
                    width: 80px;
                    margin-right: 16px;

                    img {
                        display: block;
                        width: 100%;
                    }
                }

                .title {
                    width: 150px;
                    font-size: 12px;

                    p {
                        width: 100%;
                        color: #333333;
                        padding-bottom: 4px;
                        overflow: hidden;
                        white-space: nowrap;
                        text-overflow: ellipsis;
                    }
                }

                .score {
                    width: 100%;
                    height: 20px;
                    line-height: 20px;
                    display: flex;
                    align-items: center;

                    img {
                        display: inline-block;
                        width: 14px;
                        height: 14px;
                    }

                    span {
                        display: inline-block;
                        color: #201e1e;
                        margin-left: 4px;

                        &:last-child {
                            color: #ffae00;
                        }
                    }
                }

                .btn {
                    position: absolute;
                    width: 50px;
                    height: 30px;
                    box-sizing: border-box;
                    border-radius: 5px;
                    border: 1px solid #ffae00;
                    background: #fff7e5;
                    text-align: center;
                    line-height: 30px;
                    color: #ffae00;
                    font-size: 16px;
                    right: 15px;
                    top: 22px;
                }
            }
        }
    }

    .loading-container {
        loading();
    }
}
</style>

