<template>
  <transition name="slider">
    <div
      class="about"
      ref="subtips"
    >
      <m-header>
        <template slot="header">
          <arrow-back></arrow-back>
          <p style="text-align:left">帮助</p>
        </template>
      </m-header>
      <div class="infobox">
        <div class="tips-title">答题规则</div>
        <div class="tip-box">
          <p>
            1.每天有3次答题机会;
          </p>
          <p>
            2.答对一道题奖励1平台积分，同时获得1点IQ点；答错无惩罚;
          </p>
          <p>
            3.每题答题时间为30秒;
          </p>
        </div>
      </div>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
import MHeader from '@/components/m-header/m-header';
import ArrowBack from '@/base/icon_widget/arrow_back';


export default {
  data() {
    return {
      titleText: '帮助',
    };
  },
  methods: {
    show() {
      this.$refs.subtips.style.transform = 'translate3d(0, 0, 0)';
    },
    hide() {
      this.$refs.subtips.style.transform = 'translate3d(100%, 0, 0)';
    },
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

.about {
  position: fixed;
  width: 100%;
  top: 0;
  bottom: 0;
  background: #ffffff;
  z-index: 5;
  transition: all 300ms;

  .infobox {
    .tips-title {
      color: red;
      width: 100%;
      height: 46px;
      line-height: 46px;
      padding: 0 15px;
      box-sizing: border-box;
      background: #f9f9f9;
      font-size: $font-size-large;
      color: #222222;
      font-weight: bold;
    }

    .tip-box {
      width: 100%;
      padding: 15px;
      box-sizing: border-box;

      p {
        font-size: $font-size-medium;
        color: #555555;
        margin-bottom: 10px;
      }
    }
  }
}
</style>

