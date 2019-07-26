<template>
  <div id="app">
    <tab></tab>
    <keep-alive :exclude="['gamedetail','articledetail']">
      <router-view></router-view>
    </keep-alive>
  </div>
</template>

<script>
import Tab from 'components/tab/tab';
import { getCommonInfoHasData, postInfo } from '@/base/api/indexpage/getindexinfo';
import { mapMutations, mapGetters, mapActions } from 'vuex';

export default {
  data() {
    return {
      backTimes: 0,
      taskCount: 0,
      isTopPage: true,
    };
  },
  created() {
    if (window.plus) {
      plus.navigator.setStatusBarStyle('dark');
      plus.screen.lockOrientation('portrait-primary');
      setTimeout(this.init(), 0);
    } else {
      document.addEventListener('plusready', () => {
        plus.navigator.setStatusBarStyle('dark');
        plus.screen.lockOrientation('portrait-primary');
        this.init();
        this._listenBack();
      }, false);
    }
  },
  methods: {
    init() {
      //  如果能获取到的推广码，发送请求，然后创建文件夹，储存推广码
      //  如果没有推广码。直接从文件里读取推广码。然后发送请求
      console.log('设备信息');
      console.log(plus.device);
      let _this = this;
      //  获取androidid
      let mainActivity = plus.android.runtimeMainActivity();
      let Settings = plus.android.importClass('android.provider.Settings');
      let andId = Settings.System.getString(mainActivity.getContentResolver(), Settings.Secure.ANDROID_ID) || '';
      console.log(andId);
      this.setAndroidId(andId);
      if (window.config && window.config !== '') {
        postInfo('/api/init', {
          imei: plus.device.imei.split(',')[0],
          unionId: window.config,
          token: this.getToken,
          androidId: andId,
        }).then(() => {
          console.log(`初始化成功:unionid=${window.config}`);
          _this.setUnionId(window.config);
        });
        plus.io.requestFileSystem(plus.io.PRIVATE_DOC, (fs) => {
          //  操作文件系统
          fs.root.getFile('channel.txt', { create: true }, (fileEntry) => {
            console.log(fileEntry);
            fileEntry.createWriter((writer) => {
              console.log('推广码:' + window.config);
              writer.write(window.config);
            }, (e) => {
              plus.nativeUI.toast(e.message);
            });
          }, (e) => { console.log(e); });
        }, (e) => {
          console.log('Request file system failed:' + e.message);
          plus.nativeUI.toast('请求文件系统失败:' + e.message);
        });
      } else {
        plus.io.requestFileSystem(plus.io.PRIVATE_DOC, (fs) => {
          //  操作文件系统
          fs.root.getFile('channel.txt', { create: true }, (fileEntry) => {
            fileEntry.file((file) => {
              console.log(fileEntry);
              let fileReader = new plus.io.FileReader();
              fileReader.readAsText(file, 'utf-8');
              fileReader.onloadend = (evt) => {
                console.log(evt);
                console.log('evt.target' + evt.target);
                console.log('文件系统读取:' + evt.target.result);
                postInfo('/api/init', {
                  imei: plus.device.imei.split(',')[0],
                  unionId: evt.target.result,
                  token: this.getToken,
                }).then(() => {
                  console.log(`初始化成功:unionid=:${window.config}`);
                  _this.setUnionId(window.config);
                });
              };
            });
          }, (e) => { console.log(e); });
        }, (e) => {
          console.log('Request file system failed:' + e.message);
          plus.nativeUI.toast('请求文件系统失败:' + e.message);
        });
      }
    },
    _getUserLoginInfo() {
      const userLoginAddress = '/user/info';
      console.log(this.getToken);
      if (this.getToken === '' || this.getToken === null) {
        this.userLogout();
      } else {
        getCommonInfoHasData(userLoginAddress, { token: this.getToken }).then((res) => {
          console.log(res);
          if (!res.status_code) {
            this.actived = true;
            this.userInfo = res.data;
            this.setUserInfo(res.data);
          } else {
            this.userLogout();
          }
        });
      }
    },
    //  监听返回键
    _listenBack() {
      plus.key.addEventListener('backbutton', () => {
        this.backTimes++;
        if (this.backTimes !== 2) {
          console.log(this.isTopPage);
          if (this.isTopPage) {
            plus.nativeUI.toast('再按一次退出天橙游玩');
            setTimeout(() => {
              this.backTimes = 0;
            }, 1000);
          } else {
            this.$router.back(-1);
            this.backTimes = 0;
          }
          return;
        } else {
          plus.runtime.quit();
        }
      }, false);
    },
    ...mapActions([
      'setUserInfo',
    ]),
    ...mapMutations([
      'userLoginState',
      'userLogout',
      'setusername',
      'setnickname',
      'setage',
      'setmobile',
      'setavatar',
      'setsex',
      'setAndroidId',
      'setUnionId',
    ]),
  },
  watch: {
    $route(to) {
      if (to.name === 'MIndex' || to.name === 'MGame' || to.name === 'Mservice' || to.name === 'Rank' || to.name === 'MineIndex') {
        this.isTopPage = true;
        if (to.name === 'MineIndex') {
          plus.navigator.setStatusBarStyle('light');
          return;
        }
        plus.navigator.setStatusBarStyle('dark');
      } else {
        this.isTopPage = false;
        plus.navigator.setStatusBarStyle('dark');
      }
    },
  },
  computed: {
    ...mapGetters(['getToken']),
  },
  components: {
    Tab,
  },
};
</script>


<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~common/stylus/slider';
</style>
