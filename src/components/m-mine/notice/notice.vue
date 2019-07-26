<template>
  <transition name="slider">
    <div class="notice">
      <m-header>
        <template slot="header">
          <back-icon></back-icon>
          <p style="padding-right:46px">{{titleText}}</p>
        </template>
      </m-header>
      <div
        class="notice-box"
        ref="noticebox"
        v-show="!isLoading"
      >
        <scroll
          class="search-d-wrapper"
          :listenScroll=true
          :data=noticeData
          :pullUpLoad=pullUpLoad
          @pullingUp='getMoreNotice'
        >
          <div>
            <div
              class="swiper-box"
              v-if="adList.length"
            >
              <!-- <notice-swiper :swiperData="adList"></notice-swiper> -->
              <slider :loop="adList.length>1?true:false">
                <div
                  class="slider-item"
                  v-for="(ad,index) in adList"
                  :key="index"
                >
                  <router-link
                    tag="div"
                    class="item"
                    :to="'/articledetail/'+ad.url+'?title=公告详情'"
                    style="background:red"
                  >
                    <img
                      :src="ad.image_url"
                      style="width:100%"
                    >
                  </router-link>
                </div>
              </slider>
            </div>
            <div class="new-box">
              <div
                class="news-item"
                v-for="(item,index) in noticeList"
                :key="index"
                @click="goNotice(item.id)"
              >
                <p>{{item.title}}</p>
                <time>{{item.created_at | filterTime}}</time>
              </div>
            </div>
            <loading-more v-if=" currentPage < totalPage"></loading-more>
          </div>
        </scroll>
        <router-view></router-view>
      </div>
      <div
        class="loading-container "
        v-show="isLoading"
      >
        <loading></loading>
      </div>
    </div>
  </transition>
</template>
<script type="text/ecmascript-6">
import MHeader from '@/components/m-header/m-header';
import Scroll from '@/base/scroll/scroll';
import BackIcon from '@/base/icon_widget/arrow_back';
import LoadingMore from '@/base/loadingmore/loading';
import Loading from '@/base/loading/loading';
import { getCommonInfoHasData } from '@/base/api/indexpage/getindexinfo';
import { mapGetters } from 'vuex';
import Slider from 'base/slider/slider';
// import NoticeSwiper from './swiper';
// import NoticeSwiper from '../../m-index/item/swiper';

export default {
  components: {
    BackIcon,
    MHeader,
    LoadingMore,
    Loading,
    Scroll,
    Slider,
  },
  data() {
    return {
      isLoading: true,
      titleText: '平台公告',
      noticeData: 0,
      pageloading: false,
      pullUpLoad: true,
      currentPage: 0,
      totalPage: 0,
      adList: [],
      noticeList: [],
    };
  },
  mounted() {
    this.getNoticeList();
    this.$refs.noticebox.style.top = (44 + parseInt(this.statusbar)) + 'px';
  },
  methods: {
    goNotice(id) {
      this.$router.push({
        path: `/articledetail/${id}`,
        query: {
          title: '公告详情',
        },
      });
    },
    getMoreNotice() {
      console.log('获取更多');
      if (this.currentPage < this.totalPage) {
        this.getNoticeList();
      }
    },
    getNoticeList() {
      console.log('发送请求', this.cansend);
      const url = '/article/index';
      getCommonInfoHasData(url, {
        token: this.getToken,
        page: this.currentPage + 1,
      }).then((res) => {
        this.isLoading = false;
        this.adList = res.adsList;
        this.noticeList.push.apply(this.noticeList, res.news.notice.list);
        this.currentPage = res.news.notice.currentPage;
        this.totalPage = Math.ceil(res.news.notice.total / res.news.notice.pageSize);
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
    ...mapGetters(['statusbar', 'getToken']),
  },
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~common/stylus/variable';
@import '~common/stylus/mixin';

slider();

.notice {
  position: fixed;
  top: 0;
  bottom: 0;
  width: 100%;
  background: #ffffff;

  .notice-box {
    sub-position();

    .search-d-wrapper {
      overflow: hidden;
      height: 100%;

      .swiper-box {
        width: 100%;
        height: 0;
        padding-bottom: 50%;
        position: relative;
      }

      .new-box {
        padding: 0 15px;

        .news-item {
          height: 47px;
          line-height: 47px;
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
    loading();
  }
}
</style>
