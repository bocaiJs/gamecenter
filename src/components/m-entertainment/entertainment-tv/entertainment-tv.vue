<template>
  <div
    class="tv"
    ref="tv"
  >
    <m-header>
      <template slot="header">
        <arrow-back></arrow-back>
        <p style="padding-right:46px">{{titleText}}</p>
      </template>
    </m-header>
  </div>
</template>

<script type="text/ecmascript-6">
import MHeader from '@/components/m-header/m-header';
import { Base64 } from 'js-base64';
import { mapGetters } from 'vuex';
import ArrowBack from '@/base/icon_widget/arrow_back';

export default {

  data() {
    return {
      titleText: '平台活动',
    };
  },
  mounted() {
    if (this.$route.query.title !== '') {
      this.titleText = `${Base64.decode(this.$route.query.title)}`;
    }
    this.tvurl = this.$route.query.tvurl;
    plus.webview.prefetchURL(this.tvurl);
    this.tvWindow = plus.webview.create(this.tvurl);
    this.tvWindow.setStyle({ top: (44 + parseInt(this.statusbar)), bottom: '0px', position: 'absolute' });
    this.tvWindow.show();
  },
  methods: {
    hide() {
      this.$router.back(-1);
    },
  },
  destroyed() {
    console.log('页面销毁');
    this.tvWindow.close();
  },
  components: {
    MHeader,
    ArrowBack,
  },
  computed: {
    ...mapGetters(['statusbar']),
  },
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~common/stylus/variable';
@import '~common/stylus/mixin';

.slider-enter-active {
  transition: all 300ms;
}

.slider-enter {
  transform: translate3d(100%, 0, 0);
}

.tv {
  position: fixed;
  width: 100%;
  top: 0;
  bottom: 0;
  background: #ffffff;
  z-index: 5;
}
</style>

