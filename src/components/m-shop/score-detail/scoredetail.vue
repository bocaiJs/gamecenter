<template>
  <transition name="slider">
    <div class="score-detail">
      <m-header>
        <template slot="header">
          <back-icon></back-icon>
          <p style="padding-right:46px;">
            积分明细
          </p>
        </template>
      </m-header>
      <div
        class="message-box"
        ref="msgbox"
      >
        <scroll
          style="height:100%;overflow:hidden"
          :data=updateScroll
          @pullingUp='getMoreScoreInfo'
          :pullUpLoad=pullUpLoad
          v-if="!isLoading"
        >
          <div v-if="scoreList.length">
            <score-item
              v-for="(item,index) in scoreList"
              :key="index+'score'"
              :score=item
            ></score-item>
            <loading-more v-if="currentPage<totalPage"></loading-more>
          </div>
          <div
            v-else
            style="width:100%;height:100%;display:flex;align-items:center;justify-content: center;"
          >
            <error-tip
              :showButton="showButton"
              buttonText="去赚积分"
              tipText="没有积分记录"
              @refresh="earnScore"
            ></error-tip>
          </div>
        </scroll>
        <div
          class="loading-container"
          v-else
        >
          <loading></loading>
        </div>
      </div>
    </div>
  </transition>

</template>
<script type="text/ecmascript-6">
import MHeader from 'components/m-header/m-header';
import Scroll from '@/base/scroll/scroll';
import Loading from '@/base/loading/loading';
import BackIcon from '@/base/icon_widget/arrow_back';
import ScoreItem from '@/base/scoreItem/scoreitem';
import { mapGetters } from 'vuex';
import { getCommonInfoHasData } from '@/base/api/indexpage/getindexinfo';
import LoadingMore from '@/base/loadingmore/loading';

export default {
  components: {
    MHeader,
    Scroll,
    Loading,
    BackIcon,
    ScoreItem,
    LoadingMore,
  },
  data() {
    return {
      showButton: true,
      showItem: 0,
      updateScroll: 0,
      currentPage: 0,
      totalPage: 1,
      scoreList: [],
      isLoading: true,
      pullUpLoad: true, // 是否开启上拉加载
    };
  },
  mounted() {
    this.$refs.msgbox.style.top = (44 + parseInt(this.statusbar)) + 'px';
    this.getScoreInfo();
  },
  methods: {
    emptyInfo() {
      console.log('清空');
    },
    earnScore() {
      console.log('ddsdsd');
    },
    getScoreInfo() {
      const url = '/user/score/records';
      getCommonInfoHasData(url, {
        page: this.currentPage + 1,
        token: this.getToken,
      }).then((res) => {
        console.log(res);
        this.isLoading = false;
        this.currentPage = res.data.currentPage;
        this.totalPage = Math.ceil(res.data.total / res.data.pageSize);
        this.scoreList.push.apply(this.scoreList, res.data.list);
        this.updateScroll++;
        console.log(this.currentPage, this.totalPage);
      });
    },
    // 获取更多
    getMoreScoreInfo() {
      if (this.currentPage >= this.totalPage) return;
      console.log('加载更多');
      this.getScoreInfo();
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

.score-detail {
  position: fixed;
  width: 100%;
  top: 0;
  bottom: 0;
  background: #ffffff;

  .message-box {
    position: absolute;
    top: 68px;
    bottom: 0;
    width: 100%;

    .loading-container {
      loading();
    }
  }
}
</style>
