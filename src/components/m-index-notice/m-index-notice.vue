<template>
    <transition name="slider">
        <div class="search-detail">
            <m-header :canreturn=true :type="1" :titleText=titleText></m-header>
            <div class="notice-box" ref="noticebox" v-show="!pageloading">
                <scroll class="search-d-wrapper" :listenScroll=true :data=noticeData :pullUpLoad=pullUpLoad @pullingUp='getMoreNotice'>
                    <div>
                        <slider v-if="adlist.length">
                            <div v-for="(item,index) in adlist" :key=index>
                                <div class="item" @click="goGameDetail(item.url)">
                                    <img :src="item.image_url" style="width:100%;" @load="imgload">
                                </div>
                            </div>
                        </slider>
                        <div class="tab-news">
                            <div class="tab-item" :class="{active:type===index+1}" @click.stop="changeNews(index+1)" ref="item3" v-for="(item,index) in items" :key=index>{{item.name}}</div>
                        </div>
                        <div>
                            <div class="news" v-show="type ===1">
                                <div class="news-item" v-for="(item,index) in newsitem.list" :key=index @click="goNotice(item.id)">
                                    <p>【{{item.typeName}}】{{item.title}}</p>
                                    <time>{{item.created_at | filterTime}}</time>
                                </div>
                            </div>
                            <div class="news " v-show="type===2 ">
                                <div class="news-item" v-for="(item,index) in notice.list" :key=index @click="goNotice(item.id)">
                                    <p>【{{item.typeName}}】{{item.title}}</p>
                                    <time>{{item.created_at | filterTime}}</time>
                                </div>
                            </div>
                        </div>
                    </div>
                </scroll>
                <router-view></router-view>
            </div>
            <div class="loading-container " v-show="pageloading">
                <loading></loading>
            </div>
        </div>
    </transition>

</template>

<script type="text/ecmascript-6">
import MHeader from 'components/m-header/m-header';
import Scroll from '@/base/scroll/scroll';
import Slider from '@/base/slider/slider';
import Loading from '@/base/loading/loading';
import { getCommonInfo, getCommonInfoHasData } from '@/base/api/indexpage/getindexinfo';
import { mapGetters } from 'vuex';

export default {
    data() {
        return {
            titleText: '新闻公告',
            adlist: [],
            type: 1,
            newsitem: {},
            notice: {},
            noticeData: 0,
            pageloading: true,
            pullUpLoad: true, // 是否监听上拉
            imageload: false,
            items: [
                { name: '游戏攻略' },
                { name: '新游上线' },
            ],
        };
    },
    created() {
        this._getCommonInfo();
    },
    mounted() {
        this.$refs.noticebox.style.top = (44 + parseInt(this.statusbar)) + 'px';
    },
    methods: {
        goNotice(id) {
            console.log(id);
            this.$router.push({
                path: `/index/notice/detail/${id}`,
            });
        },
        goGameDetail(id) {
            console.log(id);
            this.$router.push({
                path: `/index/notice/gamedetail/${id}`,
                query: {
                    commentAddress: '/index/notice/gamedetail',
                },
            });
        },
        changeNews(type) {
            this.type = type;
        },
        imgload() {
            if (this.imageload) {
                return;
            }
            console.log('imageload');
            this.noticeData++;
            this.imageload = true;
        },
        _getCommonInfo() {
            const address = '/article/index';
            getCommonInfo(address).then((res) => {
                setTimeout(() => {
                    this.pageloading = false;
                    this.adlist = res.adsList;
                    this.newsitem = res.news.news;
                    this.notice = res.news.notice;
                    this.noticeData++;
                }, 150);
            });
        },
        getMoreNotice() {
            console.log('父组件收到上拉请求');
            console.log(this.type);
            const moreNoticeAddress = '/article/more';
            let commentData = {
                type: this.type,
            };
            if (this.type === 1) {
                if (this.newsitem.currentPage < Math.ceil(this.newsitem.total / this.newsitem.pageSize)) {
                    this.newsitem.currentPage++;
                    commentData.page = this.newsitem.currentPage;
                } else {
                    console.log('没有更多');
                    return;
                }
                console.log(Math.ceil(this.newsitem.total / this.newsitem.pageSize));
            } else {
                if (this.notice.currentPage < Math.ceil(this.notice.total / this.notice.pageSize)) {
                    this.notice.currentPage++;
                    commentData.page = this.newsitem.currentPage;
                } else {
                    console.log('没有更多');
                    return;
                }
            }
            console.log('-----');
            console.log(this.type);
            getCommonInfoHasData(moreNoticeAddress, commentData).then((res) => {
                console.log('#####');
                console.log(this.type);
                console.log(res);
                console.log(res.article.list);
                if (this.type === 1) {
                    this.newsitem.list.push.apply(this.newsitem.list, res.article.list);
                } else {
                    this.notice.list.push.apply(this.notice.list, res.article.list);
                }
                this.noticeData++;
            });
        },
    },
    filters: {
        filterTime(value) {
            if (!value) return '';
            return value.substr(0, 10);
        },
    },
    computed: {
        ...mapGetters(['statusbar']),
    },
    components: {
        MHeader,
        Scroll,
        Slider,
        Loading,
    },
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~common/stylus/variable';
@import '~common/stylus/mixin';

slider();

.search-detail {
    position: fixed;
    top: 0;
    bottom: 0;
    width: 100%;
    background: $color-background;
    background: #ffffff;

    .notice-box {
        sub-position();

        .search-d-wrapper {
            overflow: hidden;
            height: 100%;

            .tab-news {
                display: flex;
                justify-content: space-between;
                height: 40px;
                box-shadow: 0px 1px 1px #cccccc;

                .tab-item {
                    touch-action: none;
                    flex: 1;
                    height: 100%;
                    text-align: center;
                    line-height: 40px;
                    font-size: $font-size-medium-x;
                    font-weight: bold;
                    border-right: 1px solid #eeeeee;

                    &.active {
                        background: url('./news_bg.png') no-repeat;
                        background-size: 100% 100%;
                        color: #ffffff;
                        border: none;
                    }
                }
            }

            .news {
                padding: 0 15px;
                min-height: 200px;

                .news-item {
                    height: 40px;
                    line-height: 40px;
                    position: relative;
                    border-bottom: 1px solid #eeeeee;

                    p {
                        font-size: $font-size-medium;
                        width: 80%;
                        color: #222222;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                    }

                    time {
                        position: absolute;
                        top: 0;
                        right: 0;
                        color: #777777;
                        font-size: $font-size-small;
                    }
                }
            }
        }
    }

    .loading-container {
        position: absolute;
        width: 100%;
        transform: translateY(100%);
    }
}
</style>
