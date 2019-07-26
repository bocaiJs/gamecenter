<template>
  <transition name="slider">
    <div class="entertainment-article">
      <m-header>
        <template slot="header">
          <arrow-back></arrow-back>
          <p style="padding-right:46px">视频</p>
        </template>
      </m-header>
      <div
        class="article-box"
        ref="abox"
        v-show="!isLoading "
      >
        <scroll
          style="height:100%;overflow:hidden"
          :data=data
          :pullUpLoad=pullUpLoad
          @pullingUp='getMoreVideo'
        >
          <div>

            <video-item
              v-for="videoitem in videoList"
              :videoInfo=videoitem
              :key="videoitem.id"
            ></video-item>
            <loading-more v-if="currentPage < totalPage"></loading-more>
          </div>
        </scroll>
      </div>
      <div
        class="loading-container "
        v-if="isLoading "
      >
        <loading></loading>
      </div>
      <router-view></router-view>
    </div>
  </transition>
</template>
<script type="text/ecmascript-6">
import MHeader from 'components/m-header/m-header';
import Scroll from '@/base/scroll/scroll';
import { getCommonInfoHasData } from '@/base/api/indexpage/getindexinfo';
import { mapGetters } from 'vuex';
import Loading from '@/base/loading/loading';
import ArrowBack from '@/base/icon_widget/arrow_back';
import LoadingMore from '@/base/loadingmore/loading';
import VideoItem from './video_item';


export default {
  data() {
    return {
      pullUpLoad: true,
      data: 0,
      isLoading: true,
      currentPage: 0,
      totalPage: 1,
      videoList: [],
    };
  },
  mounted() {
    this.$refs.abox.style.top = (44 + parseInt(this.statusbar)) + 'px';
    this.getVideoList();
  },
  methods: {
    getMoreVideo() {
      if (this.currentPage < this.totalPage) {
        this.getVideoList();
      }
      return false;
    },
    getVideoList() {
      const url = '/amuse/video';
      getCommonInfoHasData(url, {
        page: this.currentPage + 1,
      }).then((res) => {
        console.log(res);
        this.currentPage = res.currentPage;
        this.totalPage = Math.ceil(res.total / res.pageSize);
        this.videoList.push.apply(this.videoList, res.list);
        this.$nextTick(() => {
          this.data++;
          this.isLoading = false;
        });
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
    LoadingMore,
  },
};
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~common/stylus/variable';
@import '~common/stylus/mixin';

slider();

.entertainment-article {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: #ffffff;
  z-index: 9;

  .article-box {
    sub-position();
    top: 68px;
    padding: 0 15px;
    box-sizing: border-box;

    .a-b-item {
      box-sizing: border-box;
      position: relative;
      background: #f6f6f6;
      margin-top: 20px;
      border-top-left-radius: 4px;
      border-top-right-radius: 4px;
      overflow: hidden;
      padding-bottom: 10px;

      .top-img {
        position: relative;
        overflow: hidden;
        height: 0;
        width: 100%;
        padding-bottom: 50%;
        background: #eeeeee;

        img {
          width: 100%;
        }
      }

      .a-info {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 10px 15px;

        h3 {
          font-size: $font-size-large;
          color: #222222;
          line-height: 20px;
          width: 55%;
          text-over();
        }

        .time {
          width: 40%;
          font-size: $font-size-small;
          color: #999999;
        }
      }

      .a-desc {
        padding: 0 10px;
        font-size: $font-size-medium-x;
        color: #777777;
        line-height: 18px;
        text-over();
      }
    }
  }

  .loading-container {
    loading();
  }
}
</style>
