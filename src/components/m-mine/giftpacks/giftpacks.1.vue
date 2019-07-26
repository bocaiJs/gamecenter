<template>
    <transition name="slider">
        <div class="giftpacks">
            <m-header :canreturn=true :titleText="titleText"></m-header>
            <div class="gift" ref="gift">
                <scroll class="giftwrapper" :data=data>
                    <div class="giftbox">
                        <div class="item" @click="showGiftCode(giftInfo.gift_code)" v-for="(giftInfo,index) in giftInfos" :key=index>
                            <div class="item-link">
                                <div class="icon">
                                    <img src="./gift.png" alt="" v-show="giftInfo.type ===1">
                                    <img v-lazy="giftInfo.icon" alt="" v-show="giftInfo.type ===2">
                                </div>
                                <div class="item-content">
                                    <h3>{{giftInfo.title}}</h3>
                                    <p>{{giftInfo.gift_code}}</p>
                                    <p class="libaodate">{{giftInfo.end_time}}</p>
                                </div>
                            </div>
                            <p class="libaodesc">{{giftInfo.description}}</p>
                        </div>
                    </div>
                </scroll>
            </div>
            <mask-common :showMask="showMask" @mask="hideMask" :maskInfo="maskInfo" :dhcode="dhcode"></mask-common>
        </div>
    </transition>
</template>

<script type="text/ecmascript-6">
import MHeader from '@/components/m-header/m-header';
import Scroll from '@/base/scroll/scroll';
import MaskCommon from '@/base/maskcommon/maskcommon';
import { mapGetters } from 'vuex';
import { getCommonInfoHasData } from '@/base/api/indexpage/getindexinfo';

export default {
    data() {
        return {
            data: 0, // 通知scroll组件 更新上拉状态
            titleText: '我的礼包',
            showMask: false,
            maskInfo: {
                content: '',
                btn: [],
            },
            dhcode: '',
            giftInfos: [],
            page: 1,
            messageList: [],
        };
    },
    methods: {
        showGiftCode(val) {
            this.showMask = true;
            this.dhcode = val;
            this.maskInfo = {
                content: '您的兑换码',
                btn: [{
                    btnTitle: '复制',
                    type: 'copy',
                }],
            };
        },
        hideMask() {
            this.showMask = false;
        },
        _getGift() {
            const address = '/user/gift';
            getCommonInfoHasData(address, {
                token: this.getToken,
            }).then((res) => {
                console.log(res);
                this.giftInfos.push.apply(this.giftInfos, res.data);
                this.page = res.data.currentPage + 1;
                this.data++;
            });
        },
    },
    created() {
        this._getGift();
    },
    mounted() {
        this.$refs.gift.style.top = 44 + parseInt(this.statusbar) + 'px';
    },
    components: {
        MHeader,
        Scroll,
        MaskCommon,
    },
    computed: {
        ...mapGetters(['getToken', 'getLoginState', 'statusbar']),
    },
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~common/stylus/variable';
@import '~common/stylus/mixin';

slider();

.giftpacks {
    position: fixed;
    width: 100%;
    top: 0;
    bottom: 0;
    background: #f2f2f2;

    .gift {
        sub-position();
        background: #f2f2f2;

        .giftwrapper {
            height: 100%;
            overflow: hidden;

            .giftbox {
                .item {
                    display: block;
                    height: 128px;
                    padding-top: 1px;
                    box-sizing: border-box;
                    position: relative;
                    text-decoration: none;
                    box-shadow: 0 2px 5px #d1d0d0;
                    margin-bottom: 10px;
                    background: #ffffff;

                    .item-link {
                        display: flex;
                        align-items: center;
                        min-height: 90px;

                        .icon {
                            height: 70px;
                            position: absolute;
                            left: 10px;
                            top: 9px;

                            img {
                                height: 100%;
                            }
                        }

                        .item-content {
                            max-height: 100%;
                            margin-left: 100px;

                            h3 {
                                font-size: $font-size-medium-x;
                                margin: 0;
                                color: #222222;
                            }

                            p {
                                font-size: $font-size-small;
                                margin-top: 6px;
                                color: #777777;

                                &.libaodate {
                                    color: $color-header-bg;
                                }
                            }
                        }
                    }

                    .libaodesc {
                        border-top: 1px solid #eeeeee;
                        line-height: 35px;
                        text-indent: 10px;
                        font-size: $font-size-small;
                    }

                    .type {
                        margin-top: 6px;

                        .game-desc {
                            width: 30px;
                            height: 15px;
                            border: 1px solid #febf01;
                            border-radius: 5px;
                            font-size: 12px;
                            color: #febf01;
                            padding: 2px 4px;
                        }
                    }
                }
            }
        }
    }
}
</style>
