<template>
  <div
    class="gameindex"
    ref="gameindex"
  >
    <scroll
      class="index-wrapper"
      :listenScroll=true
      :data=data
    >
      <div>
        <div
          style="position:relative;overflow:hidden;width:100%"
          v-if="adsList.length"
        >
          <slider
            :sliderData="sliderData"
            ref="sliderDom"
          >
            <div
              v-for="(item,index) in adsList"
              :key=index
            >
              <div
                class="item"
                @click.stop.prevent="goGame(item.url)"
              >
                <img
                  :src="item.image_url"
                  style="width:100%;"
                  @load="imgload"
                >
              </div>
            </div>
          </slider>
        </div>
        <div class="index-tab">
          <router-link
            tag="div"
            class="index-tab-item"
            to="/index/libao"
          >
            <span class="tab-icon libao"></span>
            <p class="tab-link">领取礼包</p>
          </router-link>
          <router-link
            tag="div"
            class="index-tab-item"
            to="/index/notice"
          >
            <span class="tab-icon gonggao"></span>
            <p class="tab-link">新闻资讯</p>
          </router-link>
          <router-link
            tag="div"
            class="index-tab-item"
            to="/index/paihang"
          >
            <span class="tab-icon paihang"></span>
            <p class="tab-link">游戏排行</p>
          </router-link>
          <router-link
            tag="div"
            class="index-tab-item"
            to="/index/kaifu"
          >
            <span class="tab-icon kaifu"></span>
            <p class="tab-link">近期开服</p>
          </router-link>
        </div>
        <game-list
          :apps=item
          v-for="item in apps"
          :key=item.id
        ></game-list>
      </div>
    </scroll>
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
import { mapMutations, mapGetters, mapActions } from 'vuex';
import { getIndexInfo, getCommonInfo, getCommonInfoHasData } from '@/base/api/indexpage/getindexinfo';

export default {
  data() {
    return {
      isPullUpLoad: false,
      adsList: [],
      apps: [],
      commentAddress: '/index/gamedetail',
      data: 0,
      imgdone: false,
      sliderData: 0,
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
    };
  },
  components: {
    Slider,
    GameList,
    Scroll,
    MaskCommon,
  },
  created() {
    this._getUserLoginInfo();
    this._getIndexInfo();
    this._checkUpdate();
  },
  mounted() {
    this.$refs.gameindex.style.top = (44 + parseInt(this.statusbar)) + 'px';
  },
  activated() {
    if (window.plus) {
      console.log('ee');
      this.getDownloadTasks();
    } else {
      document.addEventListener('plusready', () => {
        this.getDownloadTasks();
      }, false);
    }
    this.sliderData++;
  },
  methods: {
    imgload() {
      this.sliderData++;
      if (this.imgdone) {
        return;
      }
      this.data++;
      this.imgdone = true;
    },
    _getIndexInfo() {
      getIndexInfo().then((res) => {
        this.adsList = res.adsList;
        this.apps = res.apps;
        this.data++;
        plus.navigator.closeSplashscreen();
      });
    },
    goGame(url) {
      this.$router.push({
        path: `/index/gamedetail/${url}`,
        query: {
          commentAddress: this.commentAddress,
        },
      });
    },
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
    hideMask() {
      if (this.update === true) {
        return;
      }
      this.showMask = false;
    },
    getDownloadTasks() {
      plus.downloader.enumerate((tasks) => {
        this.setTasksCount(tasks.length);
      });
    },
    // 获取用户基本信息
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

.gameindex {
  position: fixed;
  width: 100%;
  top: 44px;
  bottom: 50px;

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

