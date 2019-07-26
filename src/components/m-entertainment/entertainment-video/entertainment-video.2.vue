<template>
  <transition name="slider">
    <div class="entertainmentvideo">
      <m-header>
        <template slot="header">
          <arrow-back></arrow-back>
          <p>视频</p>
        </template>
      </m-header>
      <div
        class="wrapper"
        ref="entertainmentvideo"
        v-show="!showLoading"
      >
        <scroll
          style="height:100%;overflow:hidden"
          :data=data
          :pullUpLoad=pullUpLoad
          @pullingUp='getMoreTV'
        >
          <div class="test">
            <video-item></video-item>
            <video-item></video-item>
            <video-item></video-item>
            <video-item></video-item>
            <video-item></video-item>
            <video-item></video-item>
            <video-item></video-item>
            <video-item></video-item>
          </div>
        </scroll>
      </div>
      <div
        class="loading-container "
        v-show="showLoading"
      >
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
import ArrowBack from '@/base/icon_widget/arrow_back';
import { mapGetters } from 'vuex';
import Swiper from 'swiper/dist/js/swiper';
import 'swiper/dist/css/swiper.min.css';
import { getCommonInfo, getCommonInfoHasData } from '@/base/api/indexpage/getindexinfo';
import { Base64 } from 'js-base64';
import VideoItem from './video_item';

export default {
  data() {
    return {
      pullUpLoad: true, // 开启上拉加载
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
    ArrowBack,
    VideoItem,
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
  }

  .loading-container {
    loading();
  }
}
</style>

