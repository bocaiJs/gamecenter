<template>
  <div
    class="gameindex"
    ref="gameindex"
  >
    <m-header>
      <template slot="header">
        <search-box @seaerch=goSearchPage></search-box>
        <down-icon></down-icon>
      </template>
    </m-header>
    <div class="tab-box">
      <span
        @click="changeTab(0)"
        :class="{active:tabIndex ==0}"
      >精品</span>
      <span
        @click="changeTab(1)"
        :class="{active:tabIndex ==1}"
      >折扣</span>
      <span
        @click="changeTab(2)"
        :class="{active:tabIndex ==2}"
      >BT</span>
      <span
        @click="changeTab(3)"
        :class="{active:tabIndex ==3}"
      >单机</span>
      <span
        @click="changeTab(4)"
        :class="{active:tabIndex ==4}"
      >H5</span>
    </div>
    <div
      class="tab-view"
      v-show="!isLoading"
      ref="tabView"
    >
      <scroll
        class="index-wrapper"
        ref="scroll"
        :listenScroll=true
        :data=data
        v-if="!netErrorInfo.netError"
      >
        <div>
          <div style="position:relative;overflow:hidden;width:100%">
            <transition
              name="fade"
              mode="out-in"
            >
              <div
                v-if="tabIndex ==0"
                class="view  red"
                key="tab1"
              >
                <!-- 精品模块 -->
                <jp-item
                  v-if=" jp.length"
                  v-for="item in jp"
                  :jgItem=item
                  :key=item.id
                ></jp-item>
                <p class="no-more">已经到底啦~~</p>
              </div>
              <div
                v-if="tabIndex ==1"
                class="view "
                key="tab2"
              >
                <!-- 折扣模块 -->
                <discount-game
                  v-if="zk.length"
                  :games=zk[0]
                  :ads=zk[1]
                ></discount-game>
                <p class="no-more">没有更多了</p>
              </div>
              <div
                v-if="tabIndex ==2"
                class="view "
                key="tab3"
              >
                <!-- BT模块 -->
                <discount-game
                  v-if="bt.length"
                  :games=bt[0]
                  :ads=bt[1]
                ></discount-game>
                <p class="no-more">没有更多了</p>
              </div>
              <!-- 单机模块 -->
              <div
                v-if="tabIndex ==3"
                class="view "
                key="tab4"
              >
                <jp-item
                  v-if=" dj.length"
                  v-for="item in dj"
                  :jgItem=item
                  :key=item.id
                ></jp-item>
                <p class="no-more">没有更多了</p>
              </div>
              <div
                v-if="tabIndex ==4"
                class="view "
                key="tab5"
              >
                <h5-game
                  v-if="h5.length"
                  v-for="item in h5"
                  :h5game=item
                  :key=item.id
                ></h5-game>
                <p class="no-more">没有更多了</p>
              </div>
            </transition>
          </div>
        </div>
      </scroll>
      <div
        v-if="netErrorInfo.netError"
        style="width:100%;height:100%;display:flex;align-items:center;justify-content: center;"
      >
        <error-tips
          :showButton="true"
          :type="netErrorInfo.type"
          :tipText="netErrorInfo.errorTipText"
          @refresh="_getIndexInfo"
        >
        </error-tips>
      </div>

    </div>
    <div
      class="loading-container"
      v-if="isLoading"
    >
      <loading></loading>
    </div>
    <mask-common
      :showMask="showMask"
      :maskInfo="maskInfo"
      @mask="hideMask"
      :update='update'
    ></mask-common>
    <router-view></router-view>
  </div>
</template>

<script>
import Slider from '@/base/slider/slider';
import GameList from '@/base/gamelist/gamelist';
import Scroll from '@/base/scroll/scroll';
import MaskCommon from '@/base/maskcommon/maskcommon';
import SearchBox from '@/base/search_box/search_box';
import DownIcon from '@/base/icon_widget/down';
import MHeader from 'components/m-header/m-header';
import ErrorTips from '@/base/errortipwidget/errortipwidget';
import Loading from '@/base/loading/loading';
import { mapMutations, mapGetters, mapActions } from 'vuex';
import { getIndexInfo, getCommonInfo, getCommonInfoHasData } from '@/base/api/indexpage/getindexinfo';
import { setLocalStorage } from 'common/js/storage';
import JpItem from './item/jp';
import H5Game from './item/h5game';
import DiscountGame from './item/discount';

export default {
  data() {
    return {
      isLoading: true,
      // 网络错误
      netErrorInfo: {
        netError: false,
        type: 3,
        errorTipText: '我找不到网络',
      },
      //  更新相关数据
      tabIndex: 0,
      //  更新相关数据
      apps: [],
      commentAddress: '/index/gamedetail',
      data: 0,
      //  更新相关数据
      showMask: false,
      maskInfo: {
        content: '',
        btn: [],
      },
      update: {
        checkUpdate: false,
        update: false,
        info: {
          download_url: '',
          version: '',
          created_at: '',
          version_size: '',
          content: '',
        },
      },
      jp: [],
      zk: [],
      bt: [],
      //   dj: [],
      //   h5: [],
    };
  },
  components: {
    Slider,
    GameList,
    Scroll,
    MaskCommon,
    JpItem,
    DiscountGame,
    H5Game,
    MHeader,
    SearchBox,
    DownIcon,
    ErrorTips,
    Loading,
  },
  created() {
    this._getUserLoginInfo();
    this._getIndexInfo();
    this._checkUpdate();
    // this.$router.push('/index/search');
  },
  activated() {
    console.log('dd');
    this.data++;
  },
  mounted() {
    let immersed = 0;
    let ms = (/Html5Plus\/.+\s\(.*(Immersed\/(\d+\.?\d*).*)\)/gi).exec(navigator.userAgent);
    if (ms && ms.length >= 3) {
      immersed = parseFloat(ms[2]);
      this.setStatusBar(immersed);
      this.$refs.tabView.style.top = (104 + parseInt(this.statusbar)) + 'px';
    }
  },
  methods: {
    /**
     ** 跳转搜索页
     */
    goSearchPage() {
      console.log('去下载管理页面');
      this.$router.push('/search');
    },
    /**
     ** tab切换
    */
    changeTab(index) {
      this.tabIndex = index;
      this.$refs.scroll.scrollTo();
    },
    /**
     ** 获取信息
    */
    _getIndexInfo() {
      this.isLoading = true;
      getIndexInfo().then((res) => {
        this.netErrorInfo.netError = false;
        this.isLoading = false;
        this.jp = res.data.apps['7'].data;
        this.zk.push(res.data.apps['8'].data);
        this.zk.push(res.data.apps['8'].adsList);
        this.bt.push(res.data.apps['9'].data);
        this.bt.push(res.data.apps['9'].adsList);
        this.dj = res.data.apps['10'].data;
        this.h5 = res.data.apps['11'].data;
        plus.navigator.closeSplashscreen();
      }, () => {
        this.isLoading = false;
        this.netErrorInfo.netError = true;
      });
    },

    /**
    ** 跳转游戏管理
     */
    goGame(url) {
      this.$router.push({
        path: `/index/gamedetail/${url}`,
        query: {
          commentAddress: this.commentAddress,
        },
      });
    },
    /**
     ** 检查更新
    *
    * */
    _checkUpdate() {
      let _this = this;
      this.update = {
        checkUpdate: true,
        update: false,
        info: {
          download_url: '',
          version: '',
          created_at: '',
          version_size: '',
          content: '',
        },
      };
      const address = '/api/version';
      getCommonInfo(address).then((res) => {
        plus.runtime.getProperty(plus.runtime.appid, (inf) => {
          let wgtVer = inf.version;
          console.log('当前应用版本：' + wgtVer);
          console.log('后台应用版本：' + res.version.version);
          setLocalStorage('version', res.version.version);
          if (res.version.version === wgtVer) {
            _this.showMask = false;
            return;
          }
          this.showMask = true;
          _this.update.update = true;
          _this.update.info = res.version;
          console.log(res);
        });
      });
    },
    /**
     ** 隐藏遮罩层
    * */
    hideMask() {
      if (this.update === true) {
        return;
      }
      this.showMask = false;
    },
    /**
    ** 获取用户基本信息
     */
    _getUserLoginInfo() {
      const userLoginAddress = '/user/info';
      console.log(this.getToken);
      if (this.getToken === '' || this.getToken === null) {
        console.log('token == dd');
        this.userLogout();
      } else {
        getCommonInfoHasData(userLoginAddress, { token: this.getToken }).then((res) => {
          console.log(res);
          if (!res.status_code) {
            this.actived = true;
            this.userInfo = res.data;
            this.issigin = res.data.taskSignIn;
            this.setUserInfo(res.data);
          } else {
            this.userLogout();
          }
        });
      }
    },
    ...mapMutations([
      'setTasksCount',
      'userLoginState',
      'userLogout',
      'setusername',
      'setnickname',
      'setage',
      'setmobile',
      'setavatar',
      'setsex',
      'setStatusBar',
    ]),
    ...mapActions([
      'setUserInfo',
    ]),
  },
  computed: {
    ...mapGetters(['statusbar', 'getToken']),
  },
};
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~common/stylus/variable';
@import '~common/stylus/mixin';

opacity();

@keyframes fadeIn {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

@keyframes fadeOut {
  from {
    opacity: 1;
  }

  to {
    opacity: 0;
  }
}

.gameindex {
  position: fixed;
  width: 100%;
  top: 0px;
  bottom: 50px;
  background: #ffffff;

  .tab-box {
    width: 100%;
    height: 60px;
    display: flex;
    align-items: center;
    box-sizing: border-box;
    padding: 0 15px;
    background: #ffffff;

    span {
      display: block;
      padding-bottom: 5px;
      font-size: 16px;
      margin-right: 35px;
      color: #999999;
      border-bottom: 2px solid #ffffff;

      &:last-child {
        margin-right: 0;
      }

      &.active {
        color: #1faed6;
        font-weight: bold;
        border-bottom: 2px solid #1faed6;
      }
    }
  }

  .tab-view {
    position: absolute;
    top: 128px;
    bottom: 0;
    width: 100%;
    height: auto;
    box-sizing: border-box;
    background: #f5f5f5;

    .view {
      .no-more {
        line-height: 40px;
        font-size: 12px;
        color: #999999;
        text-align: center;
      }

      &.fade-enter-active {
        animation-duration: 100ms;
        animation-name: fadeIn;
      }

      &.fade-leave-active {
        animation-duration: 100ms;
        animation-name: fadeOut;
      }
    }
  }

  .loading-container {
    loading();
  }

  .index-wrapper {
    height: 100%;
    overflow: hidden;

    .index-tab {
      position: relative;
      display: flex;
      height: 60px;
      line-height: 50px;
      font-size: $font-size-medium;
      background: $color-theme;
      width: 100%;
      bottom: 0;
      color: $color-text-yellow;
      box-shadow: 0 2px 5px #d1d0d0;

      .index-tab-item {
        flex: 1;
        display: flex;
        text-align: center;
        // border-right: 1px solid #eeeeee;
        align-items: center;
        flex-direction: column;
        justify-content: center;
        position: relative;

        &:after {
          content: '';
          position: absolute;
          height: 80%;
          width: 0;
          border-left: 1px solid #eeeeee;
          right: 0;
          top: 10%;
        }

        &:last-child {
          &:after {
            border: none;
          }
        }

        .tab-link {
          line-height: 12px;
          font-size: 12px;
          color: #777777;
          margin-top: 8px;
        }

        .tab-icon {
          display: block;
          width: 18px;
          height: 18px;

          // margin: 0 auto;
          // margin-top: 11px;
          &.libao {
            // bg-image('libao');
            background: url('./libao@3x.png') no-repeat;
            background-size: 18px 18px;
          }

          &.gonggao {
            // bg-image('gonggao');
            background: url('./gonggao@3x.png') no-repeat;
            background-size: 18px 18px;
          }

          &.paihang {
            // bg-image('paihang');
            background: url('./paihang@3x.png') no-repeat;
            background-size: 18px 18px;
          }

          &.kaifu {
            // bg-image('kaifu');
            background: url('./kaifu@3x.png') no-repeat;
            background-size: 18px 18px;
          }
        }

        &.router-link-active {
          background: #f6f6f6;
        }
      }
    }
  }
}
</style>

