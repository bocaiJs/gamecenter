<template>
    <transition name="slider">
        <div class="recent-serve">
            <m-header :type='3' :canreturn=true @server="getServer"></m-header>
            <div class="serve-box" ref="serverbox">
                <scroll class="serve-wrapper" :listenScroll=true>
                    <div class="clearfix" v-if="showServer === 0">
                        <div class="s-b-item" v-for="(today,index) in todayServer " :key=index :data-id="today.gameId" @click="goGameDetail(today.gameId)">
                            <div class="g-i">
                                <img v-lazy="today.gameIcon" alt="">
                            </div>
                            <div class="desc">
                                <p class="g-i-title">{{today.gameName}}</p>
                                <p class="g-i-time">新服 {{today.openTime}}</p>
                                <div class="g-i-sn">{{today.server_id}} {{today.serverName}}</div>
                            </div>
                        </div>
                    </div>
                    <div class="clearfix" v-if="showServer === 1">
                        <div class="s-b-item" v-for="(today,index) in newServer " :key=index :data-id="today.gameId" @click="goGameDetail(today.gameId)">
                            <div class="g-i">
                                <img v-lazy="today.gameIcon" alt="">
                            </div>
                            <div class="desc">
                                <p class="g-i-title">{{today.gameName}}</p>
                                <p class="g-i-time">新服 {{today.openTime | filterDay}}</p>
                                <div class="g-i-sn">{{today.server_id}} {{today.serverName}}</div>
                            </div>
                        </div>
                    </div>
                </scroll>
                <div class="loading-container" v-show="showLoading">
                    <loading></loading>
                </div>
            </div>
            <router-view></router-view>
        </div>
    </transition>
</template>

<script type="text/ecmascript-6">
import MHeader from 'components/m-header/m-header';
import Scroll from '@/base/scroll/scroll';
import Loading from '@/base/loading/loading';
import { getCommonInfo, getCommonInfoHasData } from '@/base/api/indexpage/getindexinfo';
import { mapGetters } from 'vuex';

export default {
    data() {
        return {
            showServer: 0,
            newServer: [],
            todayServer: [],
            showLoading: true,
        };
    },
    created() {
        // 获取开服信息
        this.id = this.$route.query.id ? this.$route.query.id : false;
        this._getCommonInfo();
        console.log(this.id);
    },
    mounted() {
        this.$refs.serverbox.style.top = (44 + parseInt(this.statusbar)) + 'px';
    },
    filters: {
        filterDay(value) {
            if (!value) return '';
            return value.substr(0, 5);
        },
    },
    methods: {
        getServer(item) {
            //  item =0:今日新服 item=1:新服预告
            this.showServer = item;
        },
        _getCommonInfo() {
            const serverAddress = '/game/server';
            if (this.id) {
                getCommonInfoHasData(serverAddress, {
                    id: this.id,
                }).then((res) => {
                    console.log('获取特定ID');
                    this.showLoading = false;
                    this.newServer = res.data.newServer;
                    this.todayServer = res.data.todayServer;
                });
            } else {
                getCommonInfo(serverAddress).then((res) => {
                    console.log('获取所有');
                    console.log(res);
                    this.showLoading = false;
                    this.newServer = res.data.newServer;
                    this.todayServer = res.data.todayServer;
                });
            }
        },
        goGameDetail(gameId) {
            if (this.id) {
                this.$router.back(-1);
            } else {
                console.log('跳转详情页');
                this.$router.push({
                    path: `/index/kaifu/gamedetail/${gameId}`,
                    query: {
                        commentAddress: '/index/kaifu/gamedetail',
                    },
                });
            }
        },
    },
    computed: {
        ...mapGetters(['statusbar']),
    },
    components: {
        MHeader,
        Scroll,
        Loading,
    },
};

</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~common/stylus/variable';
@import '~common/stylus/mixin';

slider();

.recent-serve {
    position: fixed;
    top: 0;
    bottom: 0;
    width: 100%;
    background: $color-background;
    background: #ffffff;

    .serve-box {
        sub-position();
        box-sizing: border-box;

        .serve-wrapper {
            height: 100%;
            overflow: hidden;

            .clearfix {
                width: 100%;
                display: flex;
                align-items: center;
                flex-wrap: wrap;
                justify-content: space-between;
                padding: 0 15px;
                box-sizing: border-box;

                .s-b-item {
                    width: 46%;
                    height: 80px;
                    display: flex;
                    flex-direction: row;
                    flex-wrap: no-wrap;
                    align-items: center;
                    padding: 0 4px;
                    margin-top: 10px;
                    box-shadow: 0px 4px 4px #cccccc;
                    border-radius: 5px;

                    .g-i {
                        width: 60px;
                        height: 60px;
                        box-shadow: 0 0 3px #b5b3b3;
                        border-radius: 8px;
                        overflow: hidden;

                        img {
                            display: block;
                            // height: 100%;
                            width: 100%;
                        }
                    }

                    .desc {
                        margin-left: 8px;

                        .g-i-title {
                            font-size: $font-size-medium-x;
                            color: #222222;
                        }

                        .g-i-time {
                            font-size: $font-size-small;
                            color: $color-header-bg;
                            padding: 4px 0;
                        }

                        .g-i-sn {
                            width: 86px;
                            height: 20px;
                            font-size: $font-size-small-s;
                            background: $color-header-bg;
                            color: #ffffff;
                            line-height: 20px;
                            text-align: center;
                            border-radius: 10px;
                        }
                    }

                    &.left {
                        float: left;
                    }

                    &.right {
                        float: right;
                    }
                }
            }
        }

        .loading-container {
            loading();
        }
    }
}
</style>
