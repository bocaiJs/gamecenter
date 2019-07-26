<template>
    <transition name="slider">
        <div class="entertainmentvideo">
            <m-header :type="1" :titleText=titleText :canreturn=true></m-header>
            <div class="wrapper" ref="entertainmentvideo" v-show="!showLoading">
                <scroll style="height:100%;overflow:hidden" :data=data :pullUpLoad=pullUpLoad @pullingUp='getMoreTV'>
                    <div>
                        <div class="game-video">
                            <div class="title">游戏视频
                                <span @click="goAllVideo">更多</span>
                            </div>
                            <div class="newgame-swiper">
                                <div class="swiper-container new-swiper" ref="swiper">
                                    <div class="swiper-wrapper">
                                        <div class="swiper-slide" v-for="video in videoList" :key="video.video_time" @click="goDetail(video.id)">
                                            <img :src="video.thumb" alt="">
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="anchor-video">
                            <div class="title">主播视频</div>
                            <div class="anchor-wrapper">
                                <div class="anchor-item" @click="goTV(tv.url,tv.title)" v-for="(tv,index) in tvList" :key="index">
                                    <div class="a-i-title"><img :src="tv.thumb" alt=""></div>
                                    <p class="a-name">{{tv.title}}</p>
                                    <p class="a-desc">{{tv.description}}</p>
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
// import Swiper from 'swiper';
import Scroll from '@/base/scroll/scroll';
import Loading from '@/base/loading/loading';
import { mapGetters } from 'vuex';
import Swiper from 'swiper/dist/js/swiper';
import 'swiper/dist/css/swiper.min.css';
import { getCommonInfo, getCommonInfoHasData } from '@/base/api/indexpage/getindexinfo';
import { Base64 } from 'js-base64';

export default {
    data() {
        return {
            pullUpLoad: true, // 开启上拉加载
            titleText: '视频',
            showLoading: true,
            data: 0,
            page: 1,
            totalPage: 1,
            tvList: [],
            videoList: [],
        };
    },
    created() {
        this._getVideoList();
    },
    mounted() {
        this.$refs.entertainmentvideo.style.top = (44 + parseInt(this.statusbar)) + 'px';
    },
    methods: {
        goDetail(id) {
            this.$router.push({
                path: '/service/video/detail',
                query: {
                    id,
                },
            });
        },
        goTV(tvurl, title) {
            this.$router.push({
                path: '/service/video/tv',
                query: {
                    tvurl,
                    title: Base64.encode(title),
                },
            });
        },
        goAllVideo() {
            this.$router.push({
                path: '/service/video/all',
            });
        },
        _getVideoList() {
            const amuseVideo = '/amuse/video';
            getCommonInfo(amuseVideo).then((res) => {
                this.tvList = res.tvList.list;
                this.videoList = res.videoList;
                this.page = res.tvList.currentPage;
                console.log(this.videoList);
                this.totalPage = Math.ceil(res.tvList.total / res.tvList.pageSize);
                this.showLoading = false;
                this.$nextTick(() => {
                    this.initSlider();
                });
            });
        },
        //  上拉加载
        getMoreTV() {
            let page = this.page + 1;
            if (page <= this.totalPage) {
                getCommonInfoHasData('/amuse/tv', { page }).then((res) => {
                    console.log(res.tvList);
                    this.page = res.tvList.currentPage;
                    this.tvList.push.apply(this.tvList, res.tvList.list);
                    this.data++;
                });
            }
        },
        initSlider() {
            this.newSwiper = new Swiper(this.$refs.swiper, {
                slidesPerView: 1.5,
                spaceBetween: 20,
                loop: true,
                touchMoveStopPropagation: false,
                speed: 500,
            });
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

.entertainmentvideo {
    position: fixed;
    width: 100%;
    top: 0;
    bottom: 0;
    background: #ffffff;

    .wrapper {
        sub-position();

        .title {
            line-height: 44px;
            font-size: $font-size-medium-x;
            font-weight: bold;
            color: #222222;
            position: relative;

            span {
                display: block;
                height: 100%;
                position: absolute;
                right: 0;
                padding: 0 26px 0 15px;
                box-sizing: border-box;
                top: 0;
                font-size: 12px;
                line-height: 44px;
                color: #555555;

                &::before {
                    content: '';
                    position: absolute;
                    right: 15px;
                    top: 15px;
                    display: block;
                    width: 7px;
                    height: 12px;
                    background: url('./a-r.png') no-repeat;
                    background-size: 7px 12px;
                }
            }
        }

        .game-video {
            padding-left: 15px;
            box-sizing: border-box;

            .swiper-slide {
                overflow: hidden;

                img {
                    width: 100%;
                    border-radius: 5px;
                }
            }
        }

        .anchor-video {
            padding: 0 15px;
            box-sizing: border-box;

            .anchor-wrapper {
                width: 100%;
                display: flex;
                flex-wrap: wrap;

                .anchor-item {
                    width: 32%;
                    min-height: 100px;
                    margin-right: 2%;
                    margin-bottom: 10px;
                    border-radius: 5px;
                    overflow: hidden;
                    border: 1px solid #e5e5e5;
                    box-sizing: border-box;
                    box-shadow: 0 1px 1px #dddddd;

                    &:nth-child(3n) {
                        margin-right: 0;
                    }

                    .a-i-title {
                        position: relative;
                        overflow: hidden;
                        height: 0;
                        padding-bottom: 100%;
                        background: #eeeeee;

                        img {
                            width: 100%;
                        }
                    }

                    .a-name {
                        font-size: $font-size-medium;
                        color: #222222;
                        box-sizing: border-box;
                        padding: 10px 10px 5px 5px;
                        font-weight: bold;
                        text-over();
                    }

                    .a-desc {
                        box-sizing: border-box;
                        padding: 0 10px 10px 5px;
                        font-size: $font-size-small;
                        color: #1fbfbd;
                        text-over();
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

