<template>
    <!-- <transition name="slider">

    </transition> -->
    <div class="game">
        <m-header :search=true :titleText=titleText @search='goSearch'></m-header>
        <div class="gamebox" ref="gamebox">
            <scroll style="height:100%;overflow:hidden" :data=data>
                <div>
                    <div class="game-wrapper" v-show="!isloading">
                        <div class="game-top" ref="picbox" @touchstart.prevent="sliderStart" @touchend.prevent="sliderEnd" @touchmove.prevent="sliderMove" v-if="addList.length">
                            <div style="width:36%;opacity:0;z-index:0;">
                                <img :src="addList[0].image_url" alt="" style="width:100%;">
                            </div>
                            <div class="pic left" @click="goGameDetial(addList[0].url)">
                                <img :src="addList[0].image_url" alt="">
                            </div>
                            <div class="pic mid" @click="goGameDetial(addList[1].url)">
                                <img :src="addList[1].image_url" alt="">
                            </div>
                            <div class="pic right" @click="goGameDetial(addList[2].url)">
                                <img :src="addList[2].image_url" alt="">
                            </div>
                        </div>
                    </div>
                    <div class="game-bottom" v-show="!isloading">
                        <div class="game-type">
                            <p>游戏类型</p>
                            <div class="game-box">
                                <div class="item" v-for="(type,index) in gameType.categories" :key=index @click="selectType(type.id,1)">{{type.cateName}}</div>
                            </div>
                        </div>
                        <div class="game-type">
                            <p>游戏特色</p>
                            <div class="game-box">
                                <div class="item" v-for="(type,index) in gameType.tags" :key=index @click="selectType(type.id,2)">{{type.tagName}}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </scroll>
        </div>
        <div class="loading-container" v-show="isloading">
            <loading></loading>
        </div>
        <!-- <keep-alive>
                <router-view></router-view>
            </keep-alive> -->
        <router-view></router-view>
    </div>

</template>

<script type="text/ecmascript-6">
import MHeader from 'components/m-header/m-header';
import Loading from '@/base/loading/loading';
import Scroll from '@/base/scroll/scroll';
import { getCommonInfo } from '@/base/api/indexpage/getindexinfo';
import { mapMutations, mapGetters } from 'vuex';

export default {
    data() {
        return {
            data: 0,
            titleText: '游戏',
            canSlider: true,
            gameType: {},
            isloading: true,
            addList: [],
        };
    },
    created() {
        this.touch = {};
        this._getGameInfo();
    },
    activated() {
        this.data++;
    },
    mounted() {
        this.$refs.gamebox.style.top = (44 + parseInt(this.statusbar)) + 'px';
    },
    methods: {
        onSearchGame(searchVals) {
            console.log(searchVals);
        },
        selectType(id, type) {
            if (type === 1) {
                this.setgametags(this.gameType.categories);
            } else {
                this.setgametags(this.gameType.tags);
            }
            this.$router.push({
                path: `/gamemod/type/${id}`,
                query: {
                    type,
                    id,
                },
            });
        },
        goGameDetial(id) {
            console.log(id);
            this.$router.push({
                path: `/gamemod/type/999/gamedetail/${id}`,
                query: {
                    commentAddress: '/gamemod/type/999/gamedetail',
                },
            });
        },
        sliderStart(e) {
            this.touch.initiated = true;//  表示已经初始化
            this.touch.startX = e.touches[0].pageX;//  记录触摸的开始横坐标
            this.touch.deltaX = 0;
        },
        sliderMove(e) {
            // 如果没有touch没有初始化， 也就是说没有经过touchStart 直接touchMove的话， 是要给return掉
            if (!this.touch.initiated) return;
            this.touch.deltaX = e.touches[0].pageX - this.touch.startX; // 偏移量
        },
        sliderEnd() {
            this.touch.initiated = false;
            this._sliderPage();
        },
        goSearch() {
            this.$router.push({
                path: '/gamemod/search',
                query: {
                    address: 'gamemod',
                },
            });
        },
        _sliderPage() {
            if (Math.abs(this.touch.deltaX) < 60) return;
            if (this.canSlider === false) return;
            this.canSlider = false;
            let left;
            let mid;
            let right;
            const leftClass = 'pic left';
            const midClass = 'pic mid';
            const rightClass = 'pic right';
            for (let i = 0; i < this.$refs.picbox.children.length; i++) {
                let item = this.$refs.picbox.children[i];
                if (item.className === leftClass) {
                    left = item;
                }
                if (item.className === midClass) {
                    mid = item;
                }
                if (item.className === rightClass) {
                    right = item;
                }
            }
            if (this.touch.deltaX < 0) {
                left.style.zIndex = 1;
                right.style.zIndex = 2;
                left.className = 'pic right';
                mid.className = 'pic left';
                right.className = 'pic mid';
            } else {
                left.style.zIndex = 2;
                right.style.zIndex = 1;
                left.className = 'pic mid';
                mid.className = 'pic right';
                right.className = 'pic left';
            }

            setTimeout(() => {
                this.canSlider = true;
            }, 400);
        },
        _getGameInfo() {
            const address = '/game';
            getCommonInfo(address).then((res) => {
                this.gameType = res.data;
                console.log(res.data);
                this.isloading = false;
                this.addList = res.data.adsList;
                console.log(this.addList);
            });
        },
        ...mapMutations([
            'setgametags',
        ]),
    },
    computed: {
        ...mapGetters(['statusbar']),
    },
    components: {
        MHeader,
        Loading,
        Scroll,
    },
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~common/stylus/variable';
@import '~common/stylus/mixin';

.game {
    position: fixed;
    top: 0;
    bottom: 50px;
    width: 100%;
    background: $color-background;

    .gamebox {
        sub-position();

        .game-wrapper {
            padding: 5px 15px;
            box-shadow: 0 2px 5px #d1d0d0;
            background: #ffffff;

            .game-top {
                display: block;
                width: 100%;
                min-height: 100px;
                position: relative;
                box-sizing: border-box;

                .pic {
                    position: absolute;
                    top: 0;
                    transition-property: top, left, height, width;
                    transition-duration: 0.4s;
                    transition-timing-function: linear;
                    position: absolute;

                    &.left {
                        width: 32%;
                        left: 0;
                        top: 50%;
                        z-index: 1;
                        transform: translate3d(0, -50%, 0);

                        &:after {
                            display: block;
                            content: '';
                            position: absolute;
                            left: 0;
                            top: 0;
                            width: 100%;
                            height: 100%;
                            background: rgba(0, 0, 0, 0.3);
                        }
                    }

                    &.mid {
                        width: 36%;
                        left: 32%;
                        z-index: 3;
                        top: 50%;
                        transform: translate3d(0, -50%, 0);
                    }

                    &.right {
                        width: 32%;
                        left: 68%;
                        top: 50%;
                        z-index: 2;
                        transform: translate3d(0, -50%, 0);

                        &:after {
                            display: block;
                            content: '';
                            position: absolute;
                            left: 0;
                            top: 0;
                            width: 100%;
                            height: 100%;
                            background: rgba(0, 0, 0, 0.3);
                        }
                    }

                    img {
                        width: 100%;
                    }
                }
            }
        }

        .game-bottom {
            margin-top: 15px;
            background: #ffffff;

            .game-type {
                margin-top: 15px;

                p {
                    font-size: $font-size-medium-x;
                    color: #222222;
                    line-height: 44px;
                    text-align: center;
                    font-weight: bold;
                    border-bottom: 1px solid #eeeeee;
                }

                .game-box {
                    display: flex;
                    flex-wrap: wrap;

                    .item {
                        width: 33.3%;
                        height: 50px;
                        border-bottom: 1px solid #eeeeee;
                        box-sizing: border-box;
                        line-height: 50px;
                        text-align: center;
                        border-right: 1px solid #eeeeee;

                        &:nth-child(3n+0) {
                            border-right: none;
                        }
                    }
                }
            }
        }
    }

    .loading-container {
        loading();
    }
}
</style>
