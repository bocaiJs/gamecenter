<template>
  <transition name="slider">
    <div class="mine-config">
      <m-header>
        <template slot="header">
          <back-icon></back-icon>
          <p style="padding-right:46px">设置</p>
        </template>
      </m-header>
      <div class="config-box">
        <div
          class="config-item"
          @click="personInfo"
        >
          <span class="icon person"></span>
          <p>个人资料</p>
          <span class="right arrow"></span>
        </div>
        <div class="config-item">
          <span class="icon autodown"></span>
          <p>下载后自动安装</p>
          <span class="right">
            <radio-box
              :selected="autoInstall"
              @radioselect="setAutoInstall"
            ></radio-box>
          </span>
        </div>
        <div class="config-item">
          <span class="icon autodelete"></span>
          <p>安装后自动删除安装包</p>
          <span class="right">
            <radio-box
              :selected="autoDelete"
              @radioselect="setAutoDelete"
            ></radio-box>
          </span>
        </div>
        <div
          class="config-item"
          @click="checkUpdate"
        >
          <span class="icon updata"></span>
          <p>检查更新 <span
              class="new"
              v-if="hasNewVersion"
            >NEW</span></p>
          <span class="right">{{currentVersion}}</span>
        </div>
      </div>
      <div
        class="logout"
        ref="logout"
        @click="logout"
        v-show="getLoginState"
      >
        退出登录
      </div>
      <mask-common
        :showMask="showUpdateMask"
        @mask="hideUpdateMask"
        :maskInfo="maskInfo"
        :update='update'
      ></mask-common>
      <mask-logout
        :showMask="showMask"
        @mask="hideMask"
        @logout='logoutAction'
        :maskInfo="maskInfo"
      ></mask-logout>
      <transition name="slider">
        <router-view></router-view>
      </transition>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
import MHeader from '@/components/m-header/m-header';
import MaskCommon from '@/base/maskcommon/maskcommon';
import MaskLogout from '@/base/maskcommon/maskforgame';
import RadioBox from '@/base/radiobox/radiobox';
import { getLocalStorage, setLocalStorage } from '@/common/js/storage';
import { mapGetters, mapMutations, mapActions } from 'vuex';
import BackIcon from '@/base/icon_widget/arrow_back';
import { getCommonInfoHasData, getCommonInfo } from '@/base/api/indexpage/getindexinfo';

export default {
  data() {
    return {
      titleText: '设置',
      showMask: false,
      showUpdateMask: false,
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
      autoInstall: false,
      autoDelete: false,
      currentVersion: '',
      hasNewVersion: false,
    };
  },
  mounted() {
    let val1 = getLocalStorage('autoInstall') ? getLocalStorage('autoInstall') : this.autoInstall;
    let val2 = getLocalStorage('autoDelete') ? getLocalStorage('autoDelete') : this.autoDelete;
    this.autoInstall = val1 === 'true' ? true : false;
    this.autoDelete = val2 === 'true' ? true : false;
    plus.runtime.getProperty(plus.runtime.appid, (inf) => {
      let newVersion = getLocalStorage('version');
      this.currentVersion = inf.version;
      this.hasNewVersion = newVersion === this.currentVersion ? false : true;
      console.log(this.currentVersion, newVersion, this.hasNewVersion);
    });
  },
  methods: {
    personInfo() {
      if (this.getLoginState) {
        this.$router.push('/mine/config/person');
      } else {
        this.$router.push('/login');
      }
    },
    checkUpdate() {
      let _this = this;
      this.showUpdateMask = true;
      this.maskInfo.content = '';
      this.maskInfo.btn = [];
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
            _this.showUpdateMask = false;
            plus.nativeUI.alert('已经是最新版本', () => { }, '温馨提示');
            return;
          }
          _this.update.update = true;
          _this.update.info = res.version;
          console.log(res);
        });
      });
    },
    logoutAction() {
      this.hideMask();
      this.clearUserInfo();
      this.userLogout();
      this.settoken('');
      setLocalStorage('token', '');
      const add = '/user/logout';
      getCommonInfoHasData(add, {
        token: this.getToken,
      }).then(() => {
      });
    },
    // 弹出确认框
    logout() {
      this.showMask = true;
      this.maskInfo.content = '退出后将无法收到新消息，确定退出吗？';
      this.maskInfo.extendtips = '温馨提示';
      this.maskInfo.btn[0] = {
        btnTitle: '取消',
        type: 'hide',
        theme: 'dark',
      };
      this.maskInfo.btn[1] = {
        btnTitle: '确定',
        type: 'logout',
      };
    },
    hideMask() {
      this.showMask = false;
    },
    hideUpdateMask() {
      this.showUpdateMask = false;
    },
    //  储存是否自动安装配置
    setAutoInstall(val) {
      setLocalStorage('autoInstall', val);
    },
    //  储存是否自动删除安装包
    setAutoDelete(val) {
      setLocalStorage('autoDelete', val);
    },
    ...mapMutations([
      'userLogout',
      'settoken',
    ]),
    ...mapActions([
      'clearUserInfo',
    ]),
  },
  computed: {
    ...mapGetters(['getLoginState', 'getToken']),
  },
  components: {
    MHeader,
    MaskCommon,
    RadioBox,
    BackIcon,
    MaskLogout,
  },
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~common/stylus/variable';
@import '~common/stylus/mixin';

slider();

.mine-config {
  position: fixed;
  width: 100%;
  top: 0;
  bottom: 0;
  background: #ffffff;

  .config-box {
    .config-item {
      height: 60px;
      border-bottom: 1px solid #eeeeee;
      display: flex;
      align-items: center;
      padding: 0 15px;
      position: relative;

      .new {
        display: inline-block;
        width: 36px;
        height: 16px;
        font-size: 12px;
        background: red;
        color: #ffffff;
        text-align: center;
        line-height: 16px;
        border-radius: 8px;
      }

      .icon {
        display: block;
        width: 20px;
        height: 20px;
        background-size: 20px 20px;
        margin-right: 10px;

        &.person {
          width: 20px;
          height: 20px;
          background-size: 20px 20px;
          bg-image('person');
        }

        &.autodown {
          bg-image('autodown');
        }

        &.autodelete {
          bg-image('autodelete');
        }

        &.updata {
          bg-image('updata');
        }
      }

      .right {
        position: absolute;
        right: 15px;
        font-size: 15px;
        color: #999999;

        &.arrow {
          top: 50%;
          transform: translate3d(0, -50%, 0);
          width: 9px;
          height: 16px;
          bg-image('rightArrow');
          background-size: 9px 16px;
        }
      }
    }
  }

  .logout {
    position: absolute;
    bottom: 0;
    width: 100%;
    height: 44px;
    background: #1faed6;
    line-height: 44px;
    text-align: center;
    color: #ffffff;
    font-size: 18px;
  }
}
</style>
