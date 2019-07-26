<template>
  <transition name="slider">
    <div class="score-detail">
      <m-header>
        <template slot="header">
          <back-icon></back-icon>
          <p style="padding-right:46px;">
            兑换记录
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
          <div
            v-if="exchangeList.length"
            style="padding:0 15px"
          >
            <div
              class="item"
              v-for="item in exchangeList"
              :key="item.id"
            >
              <div class="imgbox">
                <img
                  :src="item.image"
                  alt=""
                >
              </div>
              <div class="infobox">
                <p><span class="gold"></span>所需积分: <span class="yellow">{{item.score}}</span></p>
                <p><span class="tips"></span><span class="blue">兑换码:{{item.gift_code}}</span></p>
                <button
                  @click="copy(item.gift_code)"
                  class="js_copy"
                >复制</button>
              </div>
            </div>
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
import Clipboard from 'clipboard';

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
      exchangeList: [],
      isLoading: true,
      pullUpLoad: true, // 是否开启上拉加载
    };
  },
  mounted() {
    this.$refs.msgbox.style.top = (44 + parseInt(this.statusbar)) + 'px';
    this.getScoreInfo();
  },
  methods: {
    copy(code) {
      let clipboard = new Clipboard('.js_copy', {
        text: () => {
          console.log('复制');
          return code;
        },
        //   text: () => (redeemCode),
      });
      clipboard.on('success', () => {
        clipboard.destroy();
        plus.nativeUI.toast('已复制');
      });
      clipboard.on('error', () => {
        console.log('复制失败');
      });
    },
    emptyInfo() {
      console.log('清空');
    },
    earnScore() {
      this.$router.push({
        path: '/shop/mission',
      });
    },
    getScoreInfo() {
      const url = '/user/myGoodList';
      getCommonInfoHasData(url, {
        page: this.currentPage + 1,
        token: this.getToken,
      }).then((res) => {
        this.isLoading = false;
        this.currentPage = res.currentPage;
        this.totalPage = Math.ceil(res.total / res.pageSize);
        this.exchangeList.push.apply(this.exchangeList, res.list);
        this.updateScroll++;
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

    .item {
      height: 146px;
      width: 100%;
      padding: 15px 0;
      box-sizing: border-box;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid #f5f5f5;

      .imgbox {
        width: 50%;
        height: 100%;
        border-radius: 5px;
        overflow: hidden;
        background: #f5f5f5;

        img {
          width: 100%;
          height: 100%;
        }
      }

      .infobox {
        flex: 1;
        max-width: 50%;
        box-sizing: border-box;
        padding-left: 15px;
        font-size: 16px;
        color: #333333;

        .gold {
          display: inline-block;
          width: 15px;
          height: 15px;
          margin-right: 8px;
          border-radius: 50%;
          background: url('./gold.png') no-repeat;
          background-size: cover;
        }

        .tips {
          display: inline-block;
          width: 15px;
          height: 15px;
          margin-right: 8px;
          border-radius: 50%;
          background: url('./info.png') no-repeat;
          background-size: cover;
        }

        p {
          display: flex;
          align-items: center;
          margin-bottom: 12px;
          text-over();

          .yellow {
            color: #ffba00;
          }

          .blue {
            flex: 1;
            color: #619ded;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
          }
        }

        button {
          width: 90px;
          height: 32px;
          margin-top: 8px;
          border-radius: 16px;
          background: #619ded;
          border: none;
          outline: none;
          color: #ffffff;
          font-size: 16px;
        }
      }
    }

    .loading-container {
      loading();
    }
  }
}
</style>
