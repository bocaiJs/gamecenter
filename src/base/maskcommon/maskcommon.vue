<template>
  <transition name="confirm-fade">
    <div
      class="mask"
      v-show="showMask"
    >
      <div
        class="mask-wrapper"
        @click="hideMask"
      >
      </div>
      <transition name="confirm-fade">
        <div class="box-wrapper">
          <div class="box">
            <div
              class="title"
              v-show="!update.checkUpdate"
            >温馨提示</div>
            <!-- {{maskInfo.extendtips}} -->
            <div
              class="title"
              v-show="update.update"
            >发现新版本</div>
            <div
              class="content"
              :style="{'padding':'15px'}"
            >
              <div v-show="!update.checkUpdate">
                {{maskInfo.content}}
                <span ref="code">{{dhcode}}</span>
                <!-- <p style="margin-top:10px;text-align:center" v-show="copyResult">已复制</p> -->
              </div>
              <div v-if="update.checkUpdate">
                <div v-show="!update.update">
                  <img
                    src="./loading2.gif"
                    style="width:36px"
                  >
                  <p>正在检查更新，请稍候...</p>
                </div>
                <div
                  v-show="update.update"
                  style="text-align:left"
                >
                  <p>版本{{update.info.version}} | 大小:{{update.info.version_size}}M</p>
                  <p>发布时间: {{update.info.created_at}}</p>
                  <p style="color:#ffc400;font-size:16px;border-bottom:1px solid #cccccc">新版本特性</p>
                  <p
                    v-html="update.info.content"
                    style="max-height:100px;overflow-y:scroll"
                  ></p>
                </div>
              </div>
            </div>
            <div
              class="btn"
              v-show="!update.update"
            >
              <div
                class="btn-item"
                ref="copybtn"
                v-for="(item,index) in maskInfo.btn"
                :key="index"
                :class="item.theme"
                @click="copy(index)"
                v-show="!copyResult || update.update"
              >{{item.btnTitle}}</div>
              <div
                class="btn-item"
                @click="hideMask"
                v-show="copyResult"
              >已复制</div>
            </div>
            <div
              class="btn"
              v-show="update.update"
            >
              <div
                class="btn-item"
                @click="hideMask"
                style="background:#f9f9f9;color:#333333;border:1px solid #cccccc"
              >关闭</div>
              <div
                class="btn-item"
                @click="updateRightNow"
              >立即更新</div>
            </div>
            <div
              style="width:0;height:4px;background:#ffc400;margin-top:10px;"
              ref="progress"
              :style="{width:progressBarWidth+'%'}"
            ></div>
          </div>
        </div>
      </transition>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
import Clipboard from 'clipboard';
import { mapMutations } from 'vuex';

export default {
  name: 'mask-common',
  props: {
    showMask: {
      type: Boolean,
      default: false,
    },
    maskInfo: {
      type: Object,
    },
    dhcode: {
      type: String,
      default: '',
    },
    update: {
      type: Object,
      default: () => {
        let defaultval = {
          checkUpdate: false,
          update: false,
          info: {
            download_url: '',
            version: '',
            created_at: '',
            version_size: '',
            content: '',
          },
        };
        return defaultval;
      },
    },
  },
  data() {
    return {
      copyResult: false,
      maskShow: false,
      isupdate: false,
      progressBarWidth: 0,
    };
  },
  methods: {
    copy(index) {
      let btnIndex = this.maskInfo.btn[index].type;
      if (btnIndex === 'hide') {
        this.hideMask();
      }
      if (btnIndex === 'copy') {
        let redeemCode = this.$refs.code.textContent;
        let clipboard = new Clipboard('.btn-item', {
          text: () => {
            console.log('复制');
            return redeemCode;
          },
          //   text: () => (redeemCode),
        });
        clipboard.on('success', () => {
          this.copyResult = true;

          clipboard.destroy();
        });
        clipboard.on('error', () => {
          console.log('复制失败');
        });
      }
      if (btnIndex === 'back') {
        this.$router.back(-1);
        this.userLogout();
      }
      if (btnIndex === 'logout') {
        this.$emit('logout');
      }
      if (btnIndex === 'login') {
        this.hideMask();
        this.$router.push('/login');
      }
      if (btnIndex === 'delete') {
        thi.$$emit('delete');
      }
    },
    hideMask() {
      this.$emit('mask');
      this.copyResult = false;
    },
    getFileName(url) {
      let address = url.split('/');
      let filename = address[address.length - 1];
      return filename;
    },
    updateRightNow() {
      let _this = this;
      if (this.isupdate) {
        plus.nativeUI.toast('正在更新...');
        return;
      }
      console.log(this.update.info.download_url);
      let filename = this.getFileName(this.update.info.download_url);
      plus.io.resolveLocalFileSystemURL(
        `_downloads/${filename}`,
        (entry) => {
          if (entry.isFile) {
            entry.remove();
            _this.updateRightNow();
          }
        },
        () => {
          _this.isupdate = true;
          let downTask = plus.downloader.createDownload(
            _this.update.info.download_url,
            { method: 'GET' },
            //  下载完成执行的回调函数
            (d) => {
              _this.isupdate = false;
              console.log(d.filename);
              console.log(d.totalSize);
              //  未安装=>安装应用
              plus.runtime.install(d.filename, {}, () => {
                _this.hideMask();
                plus.nativeUI.toast('更新成功', { duration: 'long' });
              }, (error) => {
                console.log(error);
                _this.hideMask();
                plus.nativeUI.toast('更新失败:' + error.message);
              });
            },
          );
          downTask.addEventListener('statechanged', (task) => {
            if (!downTask) { return; }
            switch (task.state) {
              case 1:
                console.log('开始更新任务');
                plus.nativeUI.toast('开始更新任务');
                break;
              case 2:
                console.log('开始准备任务');
                break;
              case 3:
                if (Math.floor(task.downloadedSize / task.totalSize * 100) !== this.progressBarWidth) {
                  this.progressBarWidth = Math.floor(task.downloadedSize / task.totalSize * 100);
                  console.log(this.progressBarWidth);
                }
                break;
              case 4:
                console.log('下载完成');
                break;
            }
          });
          console.log(downTask);
          downTask.start();
        },
      );
    },
    ...mapMutations([
      'userLogout',
    ]),
  },
  watch: {
    showMask(val) {
      this.maskShow = val;
    },
  },
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~common/stylus/variable';

@keyframes confirm-fadein {
  0% {
    opacity: 0;
  }

  100% {
    opacity: 1;
  }
}

@keyframes confirm-zoom {
  0% {
    transform: scale(0);
  }

  50% {
    transform: scale(1.1);
  }

  100% {
    transform: scale(1);
  }
}

.mask {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;

  &.confirm-fade-enter-active {
    animation: confirm-fadein 0.3s;

    .box {
      animation: confirm-zoom 0.3s;
    }
  }

  .mask-wrapper {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    background: #000000;
    opacity: 0.5;
    z-index: 99990;
  }

  .box-wrapper {
    z-index: 99991;
    width: 80%;
    min-height: 100px;

    .box {
      width: 100%;
      height: 100%;
      background: #ffffff;
      border-radius: 5px;
      overflow: hidden;
      box-sizing: border-box;

      .title {
        height: 30px;
        line-height: 30px;
        text-align: center;
        color: #fff;
        font-size: 14px;
        background: #fe5ba8;
      }

      .content {
        padding-bottom: 20px;
        text-align: center;
        line-height: 24px;
        font-size: 14px;
        color: #777777;
      }

      .btn {
        display: flex;
        justify-content: center;

        .btn-item {
          width: 84px;
          margin: 0 4px;
          background: #fe5ba8;
          text-align: center;
          line-height: 32px;
          border-radius: 5px;
          color: #fff;

          &.dark {
            background: #536a7a;
          }
        }
      }
    }
  }
}
</style>
