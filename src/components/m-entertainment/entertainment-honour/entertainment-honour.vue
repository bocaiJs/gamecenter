<template>
    <transition name="slider">
        <div class="honour">
            <m-header :type='6' :canreturn=true exchange=exchange @server="getSelect" @confirm="goTips"></m-header>
            <div v-show="!showLoading">
                <div class="honour-box" ref="honourbox">
                    <scroll style="height:100%;overflow:hidden" :listenScroll=true :data=data>
                        <div>
                            <div v-show="!showItem">
                                <div class="item" v-for="item in honourRank" :key="item.nickname">
                                    <div class="topNum">
                                        <span class="top-1" v-if="item.rank ===1"></span>
                                        <span class="top-2" v-else-if="item.rank ===2"></span>
                                        <span class=" top-3 " v-else-if="item.rank===3"></span>
                                        <span class="top-common" v-else>{{item.rank}}</span>
                                    </div>
                                    <div class="left">
                                        <div class="h-a">
                                            <img src="../../../../static/avatar/1.png" alt="" class="avatar">
                                            <span :class="'vip'+item.vip"></span>
                                        </div>
                                        <p class="nick-name">{{item.nickname}}</p>
                                    </div>
                                    <div class="right">
                                        <p class="honour-dj">荣耀等级:
                                            <span class="c-green">{{item.level}}</span>
                                        </p>
                                        <span class="dj"> vip{{item.vip}}</span>
                                        <div class="jz-game">
                                            进驻游戏:
                                            <span v-for="sgame in item.game" :key="sgame.id"><img v-lazy="sgame.icon" alt=""></span>
                                            <!-- <span><img src="http://img.sdk.yxorange.com//icon/2018/05/16/5afba2ed365d2.png" alt=""></span>
                                        <span><img src="http://img.sdk.yxorange.com//icon/2018/05/16/5afba2ed365d2.png" alt=""></span> -->
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div v-show="showItem">
                                <div class="item" v-for="item in iqRank" :key="item.nickname">
                                    <div class="topNum">
                                        <span class="top-1" v-if="item.rank ===1"></span>
                                        <span class="top-2" v-else-if="item.rank ===2"></span>
                                        <span class=" top-3 " v-else-if="item.rank===3"></span>
                                        <span class="top-common" v-else>{{item.rank}}</span>
                                    </div>
                                    <div class="left">
                                        <div class="h-a">
                                            <img src="../../../../static/avatar/1.png" alt="" class="avatar">
                                            <span class="vip0"></span>
                                        </div>
                                        <p class="nick-name">{{item.nickname}}</p>
                                    </div>
                                    <div class="right">
                                        <p class="honour-dj">智力等级:
                                            <span class="c-green">{{item.level}}</span>
                                        </p>
                                        <span class="iq">
                                            IQ值 :
                                            <span>{{item.iq_value}}</span>
                                        </span>
                                        <div class="jz-game">
                                            进驻游戏:
                                            <span v-for="sgame in item.game" :key="sgame.id"><img v-lazy="sgame.icon" alt=""></span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </scroll>
                </div>
                <div class="self">
                    <span class="rank">{{userHonour.rank}}</span>
                    <div class="self-avatar">
                        <img v-lazy="userHonour.avatar" alt="" class="s-a-i">
                        <span class="vip-mask" :class="'v'+userHonour.vip"></span>
                    </div>
                    <div class="self-nickname">
                        {{userHonour.nickname}}
                    </div>
                    <div :class="showItem === 0?'self-dj':'self-iq'">
                        {{showItem === 0?userHonour.level:userIQ.level}}
                    </div>
                </div>
            </div>
            <div class="loading-container" v-if="showLoading">
                <loading></loading>
            </div>
            <m-tips ref="tips">
                <div class="tips-title">荣誉规则</div>
                <div class="tip-box">
                    <p>
                        1.富豪排行由积分值排名，积分越高，排名越高；
                    </p>
                    <p>
                        2.智力排行由智力值排名，智力越高，排名越高；
                    </p>
                    <p>
                        3.禁止恶意刷榜，违禁者停封帐号；
                    </p>
                </div>
            </m-tips>
            <router-view></router-view>
        </div>

    </transition>
</template>

<script type="text/ecmascript-6">
import MHeader from 'components/m-header/m-header';
import Scroll from '@/base/scroll/scroll';
import Loading from '@/base/loading/loading';
import MTips from '@/base/tips/tips';
import { mapGetters } from 'vuex';
import { getCommonInfoHasData } from '@/base/api/indexpage/getindexinfo';


export default {
    data() {
        return {
            showItem: 0,
            honourRank: [],
            iqRank: [],
            userHonour: {},
            userIQ: {},
            data: 0,
            showLoading: true,
            exchange: true,
        };
    },
    mounted() {
        this._getHonourRank();
        this._getIQRank();
        this.$refs.honourbox.style.top = (44 + parseInt(this.statusbar)) + 'px';
    },
    methods: {
        getSelect(index) {
            this.showItem = index;
            this.data++;
        },
        _getHonourRank() {
            getCommonInfoHasData('/user/score/rank', { token: this.getToken }).then((res) => {
                console.log(res);
                this.honourRank = res.rankList;
                this.userHonour = res.myRank;
                this.showLoading = false;
                this.data++;
            });
        },
        _getIQRank() {
            getCommonInfoHasData('/user/iq/rank', { token: this.getToken }).then((res) => {
                console.log(res);
                this.iqRank = res.rankList;
                this.userIQ = res.myRank;
            });
        },
        goTips() {
            console.log('展示详情');
            this.$refs.tips.show();
        },
    },
    computed: {
        ...mapGetters(['getToken', 'statusbar']),
    },
    components: {
        MHeader,
        Scroll,
        Loading,
        MTips,
    },
};

</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~common/stylus/variable';
@import '~common/stylus/mixin';

slider();

.honour {
    position: fixed;
    top: 0;
    bottom: 0;
    width: 100%;
    background: $color-background;
    background: #ffffff;
    tips();

    .self {
        position: absolute;
        width: 100%;
        height: 50px;
        bottom: 0;
        background: #3d5869;
        display: flex;
        align-items: center;
        box-sizing: border-box;
        padding: 0 15px;
        overflow: hidden;

        .rank {
            font-size: $font-size-large;
            color: #fffbfb;
        }

        .self-avatar {
            width: 30px;
            height: 30px;
            margin: 0 10px 0 15px;
            border-radius: 50%;
            position: relative;

            .s-a-i {
                width: 100%;
                border-radius: 50%;
            }

            .vip-mask {
                position: absolute;
                display: block;

                &.v0 {
                    position: absolute;
                    width: 30px;
                    height: 30px;
                    box-sizing: border-box;
                    border-radius: 50%;
                    border: 2px solid #ffffff;
                    top: 0;
                    left: 0;
                }

                &.v1 {
                    position: absolute;
                    width: 41px;
                    height: 35px;
                    background: url('../../../../static/va/1@3x.png') no-repeat;
                    background-size: 41px 35px;
                    top: -2px;
                    left: -6px;
                }

                &.v2 {
                    position: absolute;
                    width: 33px;
                    height: 33px;
                    top: -2px;
                    left: -1px;
                    background: url('../../../../static/va/2@3x.png') no-repeat;
                    background-size: 33px 33px;
                }

                &.v3 {
                    position: absolute;
                    width: 41px;
                    height: 41px;
                    top: -5px;
                    left: -5px;
                    background: url('../../../../static/va/3@3x.png') no-repeat;
                    background-size: 41px 41px;
                }

                &.v4 {
                    position: absolute;
                    width: 34px;
                    height: 34px;
                    top: -2px;
                    left: -2px;
                    background: url('../../../../static/va/4@3x.png') no-repeat;
                    background-size: 34px 34px;
                }

                &.v5 {
                    position: absolute;
                    width: 41px;
                    height: 41px;
                    top: -5px;
                    left: -5px;
                    background: url('../../../../static/va/5@3x.png') no-repeat;
                    background-size: 41px 41px;
                }

                &.v6 {
                    position: absolute;
                    width: 34px;
                    height: 36px;
                    top: -4px;
                    left: -1px;
                    background: url('../../../../static/va/6@3x.png') no-repeat;
                    background-size: 34px 36px;
                }

                &.v7 {
                    position: absolute;
                    width: 41px;
                    height: 40px;
                    top: -5px;
                    left: -5px;
                    background: url('../../../../static/va/7@3x.png') no-repeat;
                    background-size: 41px 40px;
                }

                &.v8 {
                    position: absolute;
                    width: 36px;
                    height: 36px;
                    top: -5px;
                    left: -1px;
                    background: url('../../../../static/va/8@3x.png') no-repeat;
                    background-size: 36px 36px;
                }

                &.v9 {
                    position: absolute;
                    width: 40px;
                    height: 40px;
                    top: -4px;
                    left: -4px;
                    background: url('../../../../static/va/9@3x.png') no-repeat;
                    background-size: 40px 40px;
                }

                &.v10 {
                    position: absolute;
                    width: 35px;
                    height: 36px;
                    top: -5px;
                    left: -1px;
                    background: url('../../../../static/va/10@3x.png') no-repeat;
                    background-size: 35px 36px;
                }
            }
        }

        .self-dj {
            font-size: $font-size-small-s;
            color: #ffe323;
            margin-left: 40px;
            position: relative;

            &::before {
                content: '';
                position: absolute;
                top: 0;
                left: -16px;
                width: 10px;
                height: 9px;
                background: url('../../../../static/crown.png');
                background-size: cover;
            }
        }

        .self-iq {
            font-size: $font-size-small-s;
            color: #ffe323;
            margin-left: 40px;
            position: relative;

            &::before {
                content: '';
                position: absolute;
                top: 0;
                left: -16px;
                width: 12px;
                height: 10px;
                background: url('./book@2x.png') no-repeat;
                background-size: cover;
            }
        }

        .self-nickname {
            font-size: $font-size-small;
            color: #ffffff;
        }
    }

    .honour-box {
        sub-position();
        box-sizing: border-box;
        padding: 0 15px;
        padding-top: 15px;
        bottom: 50px;

        .item {
            width: 100%;
            height: 115px;
            margin-bottom: 15px;
            background: url('./honour-item.png') no-repeat;
            background-size: cover;
            border-radius: 5px;
            display: flex;
            align-items: center;
            position: relative;
            overflow: hidden;

            .topNum {
                width: 36px;
                height: 36px;
                border-radius: 0 0 100% 0;
                background: #ffde1a;
                position: absolute;
                left: 0;
                top: 0;

                .top-1 {
                    display: block;
                    width: 18px;
                    height: 22px;
                    margin-top: 3px;
                    margin-left: 4px;
                    background: url('./11@3x.png') no-repeat;
                    background-size: 18px 22px;
                }

                .top-2 {
                    display: block;
                    width: 18px;
                    height: 22px;
                    margin-top: 3px;
                    margin-left: 4px;
                    background: url('./22@3x.png') no-repeat;
                    background-size: 18px 22px;
                }

                .top-3 {
                    display: block;
                    width: 18px;
                    height: 22px;
                    margin-top: 3px;
                    margin-left: 4px;
                    background: url('./33@3x.png') no-repeat;
                    background-size: 18px 22px;
                }

                .top-common {
                    display: block;
                    width: 16px;
                    height: 16px;
                    margin-top: 8px;
                    margin-left: 6px;
                    background: url('./yy@3x.png') no-repeat;
                    background-size: 16px 16px;
                    font-size: $font-size-small-s;
                    color: #ed5900;
                    text-align: center;
                    line-height: 16px;
                }
            }

            .left {
                border-right: 1px dashed #ffffff;
                height: 80%;
                display: flex;
                flex-direction: column;
                box-sizing: border-box;
                padding-top: 10px;

                .h-a {
                    width: 60px;
                    height: 60px;
                    margin-left: 40px;
                    margin-right: 30px;
                    position: relative;

                    .avatar {
                        width: 60px;
                        height: 60px;
                        border-radius: 50%;
                    }

                    .vip0 {
                        position: absolute;
                        width: 60px;
                        height: 60px;
                        top: 0px;
                        left: 0px;
                        border: 2px solid #ffffff;
                        border-radius: 50%;
                        box-sizing: border-box;
                    }

                    .vip1 {
                        position: absolute;
                        width: 83px;
                        height: 70px;
                        background: url('../../../../static/va/1@3x.png') no-repeat;
                        background-size: 83px 70px;
                        top: -5px;
                        left: -8px;
                    }

                    .vip2 {
                        position: absolute;
                        width: 66px;
                        height: 66px;
                        top: -5px;
                        left: -2px;
                        background: url('../../../../static/va/2@3x.png') no-repeat;
                        background-size: 66px 66px;
                    }

                    .vip3 {
                        position: absolute;
                        width: 82px;
                        height: 82px;
                        top: -10px;
                        left: -12px;
                        background: url('../../../../static/va/3@3x.png') no-repeat;
                        background-size: 82px 82px;
                    }

                    .vip4 {
                        position: absolute;
                        width: 68px;
                        height: 69px;
                        top: -5px;
                        left: -3px;
                        background: url('../../../../static/va/4@3x.png') no-repeat;
                        background-size: 68px 69px;
                    }

                    .vip5 {
                        position: absolute;
                        width: 84px;
                        height: 84px;
                        top: -12px;
                        left: -14px;
                        background: url('../../../../static/va/5@3x.png') no-repeat;
                        background-size: 84px 84px;
                    }

                    .vip6 {
                        position: absolute;
                        width: 68px;
                        height: 72px;
                        top: -9px;
                        left: -2px;
                        background: url('../../../../static/va/6@3x.png') no-repeat;
                        background-size: 68px 72px;
                    }

                    .vip7 {
                        position: absolute;
                        width: 82px;
                        height: 80px;
                        top: -9px;
                        left: -9px;
                        background: url('../../../../static/va/7@3x.png') no-repeat;
                        background-size: 82px 80px;
                    }

                    .vip8 {
                        position: absolute;
                        width: 73px;
                        height: 78px;
                        top: -12px;
                        left: -6px;
                        background: url('../../../../static/va/8@3x.png') no-repeat;
                        background-size: 73px 78px;
                    }

                    .vip9 {
                        position: absolute;
                        width: 81px;
                        height: 79px;
                        top: -9px;
                        left: -9px;
                        background: url('../../../../static/va/9@3x.png') no-repeat;
                        background-size: 81px 79px;
                    }

                    .vip10 {
                        position: absolute;
                        width: 71px;
                        height: 77px;
                        top: -11px;
                        left: -6px;
                        background: url('../../../../static/va/10@3x.png') no-repeat;
                        background-size: 71px 77px;
                    }
                }

                .nick-name {
                    margin-top: 10px;
                    font-size: 12px;
                    color: #ffffff;
                    text-align: center;
                }
            }

            .right {
                height: 80%;
                box-sizing: border-box;
                padding: 10px 15px;
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                font-size: $font-size-small;
                color: #ffffff;

                .honour-dj {
                    .c-green {
                        color: #00fcff;
                    }
                }

                .dj {
                    position: relative;
                    font-size: $font-size-small;
                    color: #01f2ff;
                    text-indent: 16px;
                    margin-top: 5px;

                    &:before {
                        content: '';
                        position: absolute;
                        top: 0;
                        left: 0;
                        width: 12px;
                        height: 12px;
                        background: url('../../../../static/vip-icon@3x.png') no-repeat;
                        background-size: 100% 100%;
                    }
                }

                .iq {
                    font-size: $font-size-small-s;
                    color: #fed100;
                }

                .jz-game {
                    display: flex;
                    align-items: center;
                    overflow: hidden;

                    span {
                        width: 28px;
                        height: 28px;
                        display: inline-block;
                        margin-left: 10px;

                        img {
                            width: 100%;
                        }
                    }
                }
            }
        }
    }
}

.loading-container {
    loading();
    z-index: 99999;
}
</style>
