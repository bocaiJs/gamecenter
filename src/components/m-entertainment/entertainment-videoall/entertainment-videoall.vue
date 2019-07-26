<template>
    <transition name="slider">
        <div class="all-video">
            <m-header :type="1" :titleText=titleText :canreturn=true></m-header>
            <div class="all-video-wrapper" ref="allvideo" v-show="!showLoading">
                <scroll style="height:100%;overflow:hidden" :data=data :pullUpLoad=pullUpLoad @pullingUp='getMoreVideo' ref="scroll">
                    <div class="a-v-box" v-show="videoList.length">
                        <div class="item" v-for="list in videoList" :key='list.id' @click="goVideo(list.id)">
                            <div class="info">
                                <img :src="list.thumb" alt="">
                                <div class="desc">
                                    <p class="title">{{list.title}}</p>
                                    <div class="v-time">0{{list.video_time | videoLength}}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </scroll>
            </div>
            <div class="loading-container " v-show="showLoading">
                <loading></loading>
            </div>
            <router-view></router-view>
        </div>
    </transition>

</template>

<script>
import MHeader from 'components/m-header/m-header';
import Scroll from '@/base/scroll/scroll';
import Loading from '@/base/loading/loading';
import { mapGetters } from 'vuex';
import { getCommonInfoHasData } from '@/base/api/indexpage/getindexinfo';

export default {
    data() {
        return {
            pullUpLoad: true, // 开启上拉加载
            titleText: '全部视频',
            showLoading: true,
            data: 0,
            page: 1,
            totalPage: 1,
            videoList: [],
        };
    },
    created() {
        this.getVideo();
    },
    mounted() {
        this.$refs.allvideo.style.top = (44 + parseInt(this.statusbar)) + 'px';
    },
    methods: {
        goTV(tvurl, title) {
            this.$router.push({
                path: '/service/video/tv',
                query: {
                    tvurl,
                    title: Base64.encode(title),
                },
            });
        },
        goVideo(id) {
            console.log(id);
            this.$router.push({
                path: '/service/video/all/detail',
                query: {
                    id,
                },
            });
        },
        getVideo() {
            const address = '/amuse/video/more';
            getCommonInfoHasData(address, { page: this.page }).then((res) => {
                console.log(res);
                this.videoList.push.apply(this.videoList, res.data.list);
                this.page = res.data.currentPage;
                this.totalPage = Math.ceil(res.data.total / res.data.pageSize);
                console.log(this.totalPage);
                this.$nextTick(() => {
                    this.showLoading = false;
                    this.data++;
                });
            });
        },
        //  上拉加载
        getMoreVideo() {
            if (this.page + 1 > this.totalPage) {
                this.$refs.scroll.endPullUp();
                return;
            }
            this.page += 1;
            this.getVideo();
        },
    },
    filters: {
        videoLength(val) {
            if (!val) return '0:00';
            let minutes = Math.floor(val / 60);
            let second = val % 60;
            return `${minutes}:${second}`;
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

.all-video {
    position: fixed;
    width: 100%;
    top: 0;
    bottom: 0;
    background: #ffffff;

    .all-video-wrapper {
        sub-position();
        box-sizing: border-box;
        padding: 1px 15px 1px 15px;

        .a-v-box {
            display: flex;
            flex-wrap: wrap;

            .item {
                width: 49%;
                border-radius: 5px;
                overflow: hidden;
                margin-top: 10px;
                margin-right: 2%;

                &:nth-child(2n) {
                    margin-right: 0;
                }

                .info {
                    width: 100%;
                    position: relative;
                    overflow: hidden;
                    height: 0;
                    padding-bottom: 75%;
                    background: #eeeeee;

                    img {
                        width: 100%;
                    }

                    .desc {
                        position: absolute;
                        bottom: 6px;
                        width: 100%;
                        box-sizing: border-box;
                        padding: 0 4px;
                        display: flex;
                        align-items: center;
                        justify-content: space-between;
                        font-size: 12px;
                        line-height: 12px;
                        color: #ffffff;

                        .title {
                            flex: 1;
                            text-over();
                            box-sizing: border-box;
                            padding-right: 10px;
                        }

                        .v-time {
                            height: 16px;
                            border-radius: 8px;
                            background: rgba(0, 0, 0, 0.5);
                            text-align: center;
                            line-height: 16px;
                            padding: 0 3px;
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

