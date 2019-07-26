<template>
  <transition name="slider">
    <div class="choujiang">
      <m-header>
        <template slot="header">
          <arrow-back></arrow-back>
          <p style="padding-right:46px">{{titleText}}</p>
        </template>
      </m-header>
      <div
        class="choujiang-box"
        ref="abox"
      >
        <div class="inner-box">
          <img
            src="./tu@.png"
            alt=""
            style="width:100%"
          >
          <a
            href="mqqapi://card/show_pslcard?src_type=internal&version=1&uin=836930891&card_type=group&source=qrcode"
            style="width:50%;display:block;margin:0 auto"
          >
            <img
              src="./anniu@3x.png"
              alt=""
              style="width:100%"
            >
          </a>

          <img
            src="./jiangp@3x.png"
            alt=""
            class="imgdesc"
          >
          <img
            src="./tiaoj@3x.png"
            alt=""
            class="imgdesc"
          >
          <img
            src="./fangs@3x.png"
            alt=""
            class="imgdesc"
          >
          <img
            src="./baom@3x.png"
            alt=""
            class="imgdesc"
          >
          <img
            src="./shij@3x.png"
            alt=""
            class="imgdesc"
          >
          <img
            src="./jl@3x.png"
            alt=""
            class="imgdesc"
          >
          <a
            class="item"
            href="mqqwpa://im/chat?chat_type=wpa&uin=358226609&version=1&src_type=web&web_src=oicqzone.com"
            style="width:40%;display:block;margin:0 auto;margin-top:30px;"
          >
            <img
              src="./kf@3x.png"
              alt=""
              width="100%"
            >
          </a>
          <p style="margin-top:20px;">赶快联系客服报名参与吧！</p>
        </div>
      </div>
    </div>
  </transition>
</template>
<script type="text/ecmascript-6">
import MHeader from 'components/m-header/m-header';
import ArrowBack from '@/base/icon_widget/arrow_back';
import { mapGetters } from 'vuex';

export default {
  data() {
    return {
      titleText: '抽奖详情',
    };
  },
  mounted() {
    this.$refs.abox.style.top = (44 + parseInt(this.statusbar)) + 'px';
  },
  computed: {
    ...mapGetters(['statusbar']),
  },
  components: {
    MHeader,
    ArrowBack,
  },
};
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~common/stylus/variable';
@import '~common/stylus/mixin';

slider();

.choujiang {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 9;

  .choujiang-box {
    sub-position();
    top: 68px;
    box-sizing: border-box;
    overflow-y: scroll;

    .inner-box {
      box-sizing: border-box;
      min-height: 1500px;
      background: linear-gradient(#88c4ee, #ffee55); /* 标准的语法 */
      background-size: cover;
      display: flex;
      flex-direction: column;

      p {
        font-size: 16px;
        color: #ff8e29;
        font-weight: bold;
        text-align: center;
        padding: 10px 0;
      }

      .imgdesc {
        width: 80%;
        margin: 0 auto;
        margin-top: 30px;
      }
    }
  }
}
</style>
