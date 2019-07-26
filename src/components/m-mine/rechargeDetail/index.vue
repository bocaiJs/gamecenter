<template>
  <transition name="slider">
    <div class="score-detail">
      <m-header>
        <template slot="header">
          <back-icon></back-icon>
          <p style="padding-right:46px;">
            零钱明细
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
          <div v-show="scoreList.length">
            <div
              class="rechange-item"
              v-for="(item,index) in scoreList"
              :key="index+'score'"
              :score=item
            >
              <div class="left">
                <h5>{{item.title}}</h5>
                <span>{{item.time}}</span>
              </div>
              <div
                class="right"
                :class="{active:item.type ===1}"
              >
                {{item.type?"-":"+"}}{{item.amount}}
              </div>
            </div>
            <loading-more v-if="currentPage<totalPage"></loading-more>
          </div>
          <error-tip
            :showButton=showButton
            style="margin-top:30%;"
            v-if="!scoreList.length"
            :tipText=tipText
            :type=2
            buttonText="去充值"
            @refresh="goRecharge"
          ></error-tip>
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
import { mapGetters } from 'vuex';
import { getCommonInfoHasData } from '@/base/api/indexpage/getindexinfo';
import LoadingMore from '@/base/loadingmore/loading';
// import ErrTip from '@/base/errortipwidget/errortipwidget';

export default {
  components: {
    MHeader,
    Scroll,
    Loading,
    BackIcon,
    LoadingMore,
    // ErrTip,
  },
  data() {
    return {
      showButton: true,
      tipText: '你没有交易记录哦~',
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
    goRecharge() {
      this.$router.push({
        path: '/mine/Recharge',
      });
    },
    getScoreInfo() {
      const url = '/user/balance';
      getCommonInfoHasData(url, {
        page: this.currentPage + 1,
        token: this.getToken,
      }).then((res) => {
        this.isLoading = false;
        this.currentPage = res.data.currentPage;
        this.totalPage = Math.ceil(res.data.total / res.data.pageSize);
        this.scoreList.push.apply(this.scoreList, res.data.list);
        this.updateScroll++;
      });
    },
    // 获取更多
    getMoreScoreInfo() {
      if (this.currentPage >= this.totalPage) return;
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
    padding: 0 15px;
    box-sizing: border-box;

    .rechange-item {
      box-sizing: border-box;
      height: 60px;
      padding: 0 20px;
      margin-top: 16px;
      background: #f9f9f9;
      display: flex;
      align-items: center;

      .left {
        flex: 1;
        width: 0;
        overflow: hidden;

        h5 {
          width: 90%;
          color: #333333;
          font-size: 18px;
          margin-bottom: 10px;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }

        span {
          font-size: 14px;
          color: #999999;
        }
      }

      .right {
        width: 68px;
        font-size: 18px;
        color: #1faed6;
        font-wieght: bold;

        &.active {
          color: #fe5ba8;
        }
      }
    }

    .loading-container {
      loading();
    }
  }
}
</style>
