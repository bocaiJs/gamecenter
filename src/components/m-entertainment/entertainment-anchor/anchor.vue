<template>
  <transition name="slider">
    <div class="ahchor">
      <m-header>
        <template slot="header">
          <arrow-back></arrow-back>
          <p style="padding-right:46px">主播</p>
        </template>
      </m-header>
      <div
        class="anchor-box"
        ref="anchor"
        v-show="!isLoading "
      >
        <scroll
          style="height:100%;overflow:hidden"
          :data=data
          :pullUpLoad=pullUpLoad
          @pullingUp='getMoreVideo'
        >
          <div class="ahchor-wrapper">
            <div
              class="ahchor-item"
              v-for="item in anchorList"
              :key="item.id"
              @click="goTV(item.url,item.title)"
            >
              <img :src="item.thumb">
              <p class="name">{{item.title}}</p>
            </div>
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
import ArrowBack from '@/base/icon_widget/arrow_back';
import Loading from '@/base/loading/loading';
import LoadingMore from '@/base/loadingmore/loading';
import { Base64 } from 'js-base64';

export default {
  data() {
    return {
      pullUpLoad: true,
      data: 0,
      isLoading: true,
      currentPage: 0,
      totalPage: 1,
      anchorList: [],
    };
  },
  mounted() {
    this.$refs.anchor.style.top = (44 + parseInt(this.statusbar)) + 'px';
    this.getAnchorList();
  },
  methods: {
    getMoreVideo() {
      if (this.currentPage < this.totalPage) {
        this.getAnchorList();
      }
      return false;
    },
    getAnchorList() {
      const url = '/amuse/tv';
      getCommonInfoHasData(url, {
        page: this.currentPage + 1,
      }).then((res) => {
        this.anchorList.push.apply(this.anchorList, res.tvList.list);
        this.currentPage = res.tvList.currentPage;
        this.totalPage = Math.ceil(res.tvList.total / res.tvList.pageSize);
        this.$nextTick(() => {
          this.data++;
          this.isLoading = false;
        });
      });
    },
    goTV(tvurl, title) {
      this.$router.push({
        path: '/service/anchor/tv',
        query: {
          tvurl,
          title: Base64.encode(`${title}的直播间`),
        },
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
    LoadingMore,
  },
};
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~common/stylus/variable';
@import '~common/stylus/mixin';

slider();

.ahchor {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: #ffffff;
  z-index: 9;

  .anchor-box {
    sub-position();
    box-sizing: border-box;

    .ahchor-wrapper {
      display: flex;
      flex-wrap: wrap;

      .ahchor-item {
        width: calc(50% - 5px);
        height: 0;
        padding-bottom: 54%;
        background: #e5e5e5;
        margin-bottom: 10px;
        position: relative;
        position: relative;

        .name {
          position: absolute;
          bottom: 15px;
          left: 15px;
          overflow: hidden;
          font-size: 16px;
          fobt-weight: bold;
          color: #ffffff;
        }

        img {
          position: absolute;
          left: 0;
          top: 0;
          height: 100%;
          width: 100%;
        }

        &:nth-child(2n) {
          margin-left: 10px;
        }
      }
    }
  }

  .loading-container {
    loading();
  }
}
</style>
