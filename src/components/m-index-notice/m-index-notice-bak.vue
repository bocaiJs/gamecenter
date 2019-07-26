<template>
    <transition name="slider">
        <div class="search-detail">
            <m-header :canreturn=true :type="1" :titleText=titleText></m-header>
            <div class="notice-box" ref="noticebox">
                <scroll class="search-d-wrapper" :listenScroll=true :data=noticeData :pullUpLoad=pullUpLoad @pullingUp='getMoreNotice'>
                    <div>
                        <slider v-if="adlist.length">
                            <div v-for="(item,index) in adlist" :key=index>
                                <div class="item" @click="goNotice(item.url)">
                                    <img :src="item.image_url" style="width:100%;" @load="imgload">
                                </div>
                            </div>
                        </slider>
                        <div class="tab-news">
                            <div class="tab-item" :class="{active:type===1}" @click="changeNews(1)">最新资讯</div>
                            <div class="tab-item" :class="{active:type===2}" @click="changeNews(2)">平台新闻</div>
                            <div class="tab-item" :class="{active:type===3}" @click="changeNews(3)">平台公告</div>
                        </div>
                        <div class="news" v-show="type ===1">
                            <div class="news-item" v-for="(item,index) in newitem.list" :key=index @click="goNotice(item.id)">
                                <p>【{{item.typeName}}】{{item.title}}</p>
                                <time>{{item.created_at | filterTime}}</time>
                            </div>
                        </div>
                        <div class="news" v-show="type ===2">
                            <div class="news-item" v-for="(item,index) in newsitem.list" :key=index @click="goNotice(item.id)">
                                <p>【{{item.typeName}}】{{item.title}}</p>
                                <time>{{item.created_at | filterTime}}</time>
                            </div>
                        </div>
                        <div class="news " v-show="type===3 ">
                            <div class="news-item" v-for="(item,index) in notice.list" :key=index @click="goNotice(item.id)">
                                <p>【{{item.typeName}}】{{item.title}}</p>
                                <time>{{item.created_at | filterTime}}</time>
                            </div>
                        </div>

                        <div class="loading-container " v-show="pageloading ">
                            <loading></loading>
                        </div>
                    </div>
                </scroll>
            </div>
            <router-view></router-view>
        </div>
    </transition>

</template>

<script type="text/ecmascript-6">
import MHeader from 'components/m-header/m-header';
import Slider from '@/base/slider/slider';
import Scroll from '@/base/scroll/scroll';
import Loading from '@/base/loading/loading';
import { getCommonInfo, getCommonInfoHasData } from '@/base/api/indexpage/getindexinfo';
import { mapGetters } from 'vuex';

export default {
    data() {
        return {
            titleText: '新闻公告',
            adlist: [],
            type: 1,
            newitem: {},
            newsitem: {},
            notice: {},
            noticeData: 0,
            pageloading: true,
            pullUpLoad: true, // 是否监听上拉
            imageload: false,
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
        _getCommonInfo() {
            const address = '/article/index';
            getCommonInfo(address).then((res) => {
                this.pageloading = false;
                console.log(res);
                this.adlist = res.adsList;
                this.newitem = res.news.new;
                this.newsitem = res.news.news;
                this.notice = res.news.notice;
                this.noticeData++;
            });
        },
        imgload() {
            if (this.imageload) {
                return;
            }
            console.log('imageload');
            this.noticeData++;
            this.imageload = true;
        },
        getMoreNotice() {
            console.log('父组件收到上拉请求');
            console.log(this.type);
            const moreNoticeAddress = '/article/more';
            let commentData = {
                type: this.type,
            };
            if (this.type === 1) {
                commentData.page = this.newitem.currentPage;
            } else if (this.type === 2) {
                commentData.page = this.newsitem.currentPage;
            } else {
                commentData.page = this.notice.currentPage;
            }
            console.log('-----');
            console.log(this.type);
            getCommonInfoHasData(moreNoticeAddress, commentData).then((res) => {
                console.log('#####');
                console.log(this.type);
                console.log(res);
                if (this.type === 1) {
                    commentData.page = this.newitem.currentPage;
                } else if (this.type === 2) {
                    commentData.page = this.newsitem.currentPage;
                } else {
                    commentData.page = this.notice.currentPage;
                }
            });
        },
        changeNews(type) {
            console.log('type:' + type);
            this.type = type;
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
        Slider,
        Loading,
        Scroll,
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
            height: 100%;
            overflow: hidden;

            .hot-search {
                padding: 15px;
                font-size: $font-size-medium-x;
                color: $color-font;

                .search-title {
                    width: 100%;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;

                    h3 {
                        width: 30%;
                    }

                    p {
                        width: 17%;
                        font-size: $font-size-small;

                        .icon {
                            img {
                                width: 12px;
                                transform: translate3d(2px, 2px, 0);
                            }
                        }
                    }
                }

                .hot-game {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 15px 0;

                    a {
                        width: 76px;
                        height: 76px;
                        background: #b8b7b7;
                        border-radius: 12px;

                        img {
                            display: block;
                            width: 100%;
                            height: 100%;
                        }
                    }
                }

                .search-record {
                    display: flex;
                    flex-direction: row;
                    flex-wrap: wrap;

                    .record-item {
                        margin-top: 15px;
                        height: 30px;
                        width: 80px;
                        border-radius: 15px;
                        background: #eeeeee;
                        text-align: center;
                        line-height: 30px;
                        font-size: $font-size-small;
                        margin-left: 10px;
                    }
                }
            }

            .tab-news {
                display: flex;
                justify-content: space-between;
                height: 40px;
                box-shadow: 0px 1px 1px #cccccc;

                .tab-item {
                    width: 33%;
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

                    &:last-child() {
                        border: none;
                        width: 34%;
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

            .loading-container {
                position: fixed;
                width: 100%;
                transform: translateY(-50%);
            }
        }
    }
}
</style>
