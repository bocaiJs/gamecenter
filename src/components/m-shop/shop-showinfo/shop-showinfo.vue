<template>
  <transition name="slider">
    <div class="about">
      <m-header>
        <template slot="header">
          <back-icon></back-icon>
          <p>{{titleText}}</p>
          <div class="right-button">
            <!-- <question-mark @goTip="aboutEx"></question-mark> -->
          </div>
        </template>
      </m-header>
      <div class="infobox">
        <div class="title">关于兑换</div>
        <div
          class="info"
          v-html="content"
        >
        </div>
      </div>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
import MHeader from '@/components/m-header/m-header';
import BackIcon from '@/base/icon_widget/arrow_back';
import { getCommonInfoHasData } from '@/base/api/indexpage/getindexinfo';

export default {
  data() {
    return {
      titleText: '关于兑换',
      content: '',
      type: 2,
    };
  },
  created() {
    this._getAboutInfo();
  },
  methods: {
    _getAboutInfo() {
      const path = '/shop/getPage';
      getCommonInfoHasData(path, {
        type: this.type,
      }).then((res) => {
        console.log(res);
        this.content = res.content;
      });
    },
  },
  components: {
    MHeader,
    BackIcon,
  },
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~common/stylus/variable';
@import '~common/stylus/mixin';

slider();

.about {
  position: fixed;
  width: 100%;
  top: 0;
  bottom: 0;
  background: #ffffff;

  .infobox {
    padding: 0 15px;

    .title {
      font-size: $font-size-large;
      color: #222222;
      line-height: 50px;
      border-bottom: 1px solid #cccccc;
    }

    .info {
      font-size: $font-size-small;
      line-height: 24px;
      margin-top: 12px;
    }
  }
}
</style>

