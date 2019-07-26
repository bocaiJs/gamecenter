<template>
    <transition name="slider">
        <div class="paihang">
            <m-header :canreturn=true :type="1" :titleText=titleText :search=true @search="goSearch"></m-header>
            <div class="paihang-box" ref="paihanbox">
                <scroll class="paihang-wrapper" :listenScroll=true>
                    <div>
                        <div class="top3">
                            <router-link tag="div" class="item" v-for="(item,index) in topGame" :class="{ large: index ===1 }" :key="index" :to="{path:'/index/paihang/gamedetail/'+item.id,query: { commentAddress: '/index/paihang/gamedetail' }}">
                                <!-- <div class="item-img"><img :src="item.icon" alt=""></div> -->
                                <div class="item-img"><img :src="item.icon" alt=""></div>
                                <span class="top" v-if="index===0"><img src="./top-2.png" alt=""></span>
                                <span class="top" v-if="index===1"><img src="./top-1.png" alt=""></span>
                                <span class="top" v-if="index===2"><img src="./top-3.png" alt=""></span>
                            </router-link>
                        </div>
                        <router-link tag="div" :to="{path:'/index/paihang/gamedetail/'+item.id,query: { commentAddress: '/index/paihang/gamedetail' }}" v-for="(item,index) in otherGame" :key="index">
                            <div class="gamelist">
                                <div class="item">
                                    <div class="order">
                                        {{index+4}}
                                    </div>
                                    <div class="icon">
                                        <img :src="item.icon" alt="">
                                    </div>
                                    <div class="item-content">
                                        <h3>{{item.name}}</h3>
                                        <div class="star">
                                            <div class="star-wrapper">
                                                <span class="star-icon" :style="{ width: item.star*20+'%' }"></span>
                                            </div>
                                            <div class="type">
                                                角色扮演 | {{item.size}}M
                                            </div>
                                        </div>
                                    </div>

                                    <button class="downbtn">详情</button>
                                </div>
                            </div>
                        </router-link>
                    </div>
                </scroll>

            </div>
            <div class="loading-container" v-show="!topGame.length">
                <loading></loading>
            </div>
            <router-view></router-view>
        </div>
    </transition>

</template>

<script type="text/ecmascript-6">
import MHeader from 'components/m-header/m-header';
import Scroll from '@/base/scroll/scroll';
import Loading from '@/base/loading/loading';
import { getCommonInfo } from '@/base/api/indexpage/getindexinfo';
import { mapGetters } from 'vuex';

export default {
    data() {
        return {
            titleText: '游戏排行',
            topGame: [],
            otherGame: [],
        };
    },
    created() {
        this._getCommonInfo();
    },
    mounted() {
        this.$refs.paihanbox.style.top = (44 + parseInt(this.statusbar)) + 'px';
    },
    components: {
        MHeader,
        Scroll,
        Loading,
    },
    methods: {
        _getCommonInfo() {
            const address = '/game/list';
            getCommonInfo(address).then((res) => {
                console.log(res.data);
                let game = res.data.slice(0, 3);
                this.topGame.push(game[1]);
                this.topGame.push(game[0]);
                this.topGame.push(game[2]);
                console.log(game);
                this.otherGame = res.data.slice(3, res.data.length);
            });
            console.log('创建排行页面');
        },
        goSearch() {
            console.log('dd');
            this.$router.push({
                path: '/index/paihang/search',
                query: {
                    address: 'index/paihang',
                },
            });
        },
    },
    computed: {
        ...mapGetters(['statusbar']),
    },
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~common/stylus/variable';
@import '~common/stylus/mixin';

slider();

.paihang {
    position: fixed;
    top: 0;
    bottom: 0;
    width: 100%;
    background: $color-background;
    background: #ffffff;

    .paihang-box {
        sub-position();

        .paihang-wrapper {
            height: 100%;
            overflow: hidden;

            .top3 {
                width: 100%;
                height: 160px;
                box-sizing: border-box;
                background: url('./top3-bg.png') no-repeat;
                background-size: cover;
                padding: 0 30px;
                padding-bottom: 15px;
                display: flex;
                align-items: flex-end;
                justify-content: space-between;

                .item {
                    width: 80px;
                    height: 80px;
                    border: 1px solid #ffffff;
                    box-shadow: 0 0 3px #ffc400;
                    border-radius: 15px;
                    position: relative;
                    background-size: 80px 80px;
                    position: relative;

                    &.large {
                        width: 100px;
                        height: 100px;
                        background-size: 100px 100px;
                    }

                    .item-img {
                        width: 100%;
                        height: 100%;
                        border-radius: 20px;
                        overflow: hidden;

                        img {
                            display: block;
                            width: 100%;
                            height: 100%;
                        }
                    }

                    .top {
                        width: 60%;
                        height: 40px;
                        position: absolute;
                        left: 50%;
                        top: -25px;
                        background-size: cover;
                        text-align: center;
                        line-height: 40px;
                        color: #ffffff;
                        transform: translate3d(-50%, 0, 0);

                        img {
                            width: 100%;
                        }
                    }
                }
            }

            .gamelist {
                padding: 0 15px;

                .item {
                    display: flex;
                    align-items: center;
                    flex-wrap: nowrap;
                    height: 90px;
                    padding-top: 1px;
                    box-sizing: border-box;
                    position: relative;
                    text-decoration: none;
                    border-bottom: 1px solid #eeeeee;

                    .order {
                        font-size: $font-size-large-xx;
                        color: $color-header-bg;
                        margin-right: 8px;
                        width: 26px;
                        text-align: center;
                    }

                    .icon {
                        height: 60px;
                        width: 60px;
                        margin-right: 10px;
                        border: 1px solid #cccccc;
                        border-radius: 10px;
                        overflow: hidden;

                        img {
                            height: 100%;
                        }
                    }

                    .item-content {
                        h3 {
                            font-size: $font-size-medium-x;
                            margin: 0;
                            color: #333333;
                        }

                        .star {
                            .star-wrapper {
                                width: 50px;
                                display: inline-block;
                                height: 10px;
                                position: relative;
                                overflow: hidden;
                                margin-top: 8px;

                                .star-icon {
                                    position: absolute;
                                    left: 0;
                                    top: 0;
                                    display: inline-block;
                                    height: 10px;
                                    background: url('./star.png');
                                    background-size: 10px 10px;
                                }
                            }

                            .score {
                                font-size: $font-size-small;
                                padding: 3px 0;
                                color: $color-font;
                            }
                        }
                    }

                    .type {
                        margin-top: 6px;
                        font-size: $font-size-small-s;
                        color: #01dbe9;
                    }

                    .downbtn {
                        position: absolute;
                        right: 0;
                        top: 30px;
                        downloadbtn();
                    }
                }
            }
        }
    }

    .loading-container {
        position: absolute;
        width: 100%;
        top: 50%;
        transform: translateY(-50%);
    }
}
</style>
