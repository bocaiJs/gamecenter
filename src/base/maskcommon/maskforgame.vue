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
            <div class="title">{{maskInfo.extendtips}}</div>
            <div class="content">
              <div> {{maskInfo.content}}
                <span
                  ref="code"
                  class="code"
                >{{dhcode}}
                </span>
              </div>
              <p
                style="font-size:12px"
                v-if="showMoreTip"
              >可到[<span
                  class="gift"
                  @click="goGiftPage"
                >我的礼包</span>]中查看</p>
            </div>
            <div class="btn">
              <div
                class="btn-item"
                ref="copybtn"
                v-show="!copyResult"
                v-for="(item,index) in maskInfo.btn"
                @click="onPress(index)"
                :key="index"
                :class="item.theme"
              >{{item.btnTitle}}</div>
              <div
                class="btn-item"
                @click="hideMask"
                v-show="copyResult"
              >已复制</div>
            </div>
            <div
              style="width:0;height:4px;background:#ffc400;margin-top:10px;"
              ref="progress"
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
  name: 'mask-game',
  props: {
    showMask: {
      type: Boolean,
      default: false,
    },
    showMoreTip: {
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
  },
  data() {
    return {
      copyResult: false,
      maskShow: false,
    };
  },
  methods: {
    goGiftPage() {
      this.$router.push({
        path: '/mine/giftpack',
      });
    },
    onPress(index) {
      let btnIndex = this.maskInfo.btn[index].type;
      if (btnIndex === 'hide') {
        this.hideMask();
      }
      if (btnIndex === 'copy') {
        let redeemCode = this.$refs.code.textContent;
        let clipboard = new Clipboard('.btn-item', {
          text: () => {
            console.log(redeemCode.trim());
            return redeemCode.trim();
          },
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
      //   if (btnIndex === 'logout') {
      //     this.userLogout();
      //     this.$router.back(-1);
      //   }
      if (btnIndex === 'logout') {
        this.$emit('logout');
      }
      if (btnIndex === 'login') {
        this.hideMask();
        this.$router.push('/login');
      }
      if (btnIndex === 'delete') {
        this.$emit('delete');
      }
      if (btnIndex === 'sure') {
        this.$emit('sure');
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
  z-index: 9999;

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
    min-width: 90%;
    max-width: 80%;
    min-height: 100px;

    .box {
      width: 100%;
      height: 100%;
      background: #ffffff;
      border-radius: 5px;
      box-sizing: border-box;
      overflow: hidden;

      .title {
        height: 30px;
        margin-top: 10px;
        line-height: 30px;
        font-size: 16px;
        text-align: center;
        color: #555555;
        font-size: 14px;
        text-align: left;
        text-indent: 30px;
        font-weight: bold;
        // background: #fe5ba8;
      }

      .content {
        padding-top: 15px;
        padding-bottom: 20px;
        padding-right: 15px;
        text-align: center;
        line-height: 20px;
        text-indent: 30px;
        font-size: 14px;
        color: #555555;
        font-weight: bold;

        .code {
          font-size: 15px;
          color: #fe5ba8;
        }

        .gift {
          color: #44b4f2;
        }
      }

      .btn {
        display: flex;
        justify-content: center;

        .btn-item {
          height: 32px;
          width: 84px;
          margin: 0 8px;
          background: #f9f9f9;
          text-align: center;
          line-height: 32px;
          border-radius: 5px;
          border: 1px solid #cccccc;
          color: #333333;

          &.dark {
            background: #536a7a;
          }

          &.blue {
            background: #1faed6;
            border: 1px solid #1faed6;
            color: #ffffff;
          }
        }
      }
    }
  }
}
</style>
