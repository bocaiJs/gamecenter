<template>
  <transition name="slider">
    <div class="invite">
      <m-header>
        <template slot="header">
          <back-icon></back-icon>
          <p style="padding-right:46px">{{titleText}}</p>
        </template>
      </m-header>
      <div class="i-box">
        <div class="title">
          下载链接
        </div>
        <div class="i-info">
          <p class="i-text">
            {{url}}
          </p>
          <div
            class="copy"
            @click="copy(url)"
          >
            复制
          </div>
        </div>
        <div class="title">
          我的邀请码
        </div>
        <div class="i-info">
          {{code}}
          <div
            class="copy"
            @click="copy(code)"
          >
            复制
          </div>
        </div>
        <div class="tips">
          注：复制以上链接分享给好友下载APP,好友在注册时输入您的邀请码，即可获得500积分奖励
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import MHeader from '@/components/m-header/m-header';
import BackIcon from '@/base/icon_widget/arrow_back';
import Clipboard from 'clipboard';
import { getCommonInfoHasData } from '@/base/api/indexpage/getindexinfo';
import { mapGetters } from 'vuex';
import { setLocalStorage, getLocalStorage } from 'common/js/storage';

export default {
  data() {
    return {
      titleText: '邀请好友',
      url: '',
      code: '',
    };
  },
  mounted() {
    this.url = getLocalStorage('invitedUrl');
    this.code = getLocalStorage('invitedCode');
    if (!this.url || this.code) {
      this.getInvitedCode();
    }
  },
  methods: {
    copy(text) {
      let clipboard = new Clipboard('.copy', {
        text: () => (text.trim()),
      });
      clipboard.on('success', () => {
        clipboard.destroy();
        plus.nativeUI.toast('复制成功');
      });
      clipboard.on('error', () => {
        plus.nativeUI.toast('复制失败');
      });
    },
    getInvitedCode() {
      const url = '/user/invite_code';
      getCommonInfoHasData(url, {
        token: this.getToken,
      }).then((res) => {
        console.log(res);
        if (!res.http_str || !res.invite_code) {
          this.getInvitedCode();
        } else {
          setLocalStorage('invitedUrl', res.http_str);
          setLocalStorage('invitedCode', res.invite_code);
          this.url = res.http_str;
          this.code = res.invite_code;
        }
      });
    },
  },
  computed: {
    ...mapGetters(['statusbar', 'getToken']),
  },
  components: {
    MHeader,
    BackIcon,
    getCommonInfoHasData,
  },
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~common/stylus/variable';
@import '~common/stylus/mixin';

slider();

.invite {
  position: fixed;
  width: 100%;
  top: 0;
  bottom: 0;
  background: #ffffff;

  .i-box {
    width: 100%;
    box-sizing: border-box;
    padding: 0 15px;

    .title {
      line-height: 40px;
      font-size: 15px;
      color: #222222;
    }

    .i-info {
      min-height: 40px;
      width: 100%;
      box-sizing: border-box;
      padding: 10px 80px 10px 10px;
      background: #eeeeee;
      position: relative;
      line-height: 20px;
      display: flex;
      align-items: center;

      .i-text {
        width: 100%;
        word-break: break-all;
        line-height: 18px;
      }

      .copy {
        position: absolute;
        right: 10px;
        top: 50%;
        transform: translate3d(0, -50%, 0);
        width: 60px;
        height: 28px;
        border-radius: 14px;
        background: #fe5ba8;
        text-align: center;
        line-height: 28px;
        color: #ffffff;
      }
    }

    .tips {
      font-size: 12px;
      color: #999999;
      line-height: 18px;
      margin-top: 8px;
    }
  }
}
</style>
