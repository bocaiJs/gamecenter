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
// import { Base64 } from 'js-base64';
import { mapGetters } from 'vuex';
import ArrowBack from '@/base/icon_widget/arrow_back';


export default {

  data() {
    return {
      titleText: '充值',
    };
  },
  mounted() {
    this.tvurl = this.$route.query.tvurl;
    this.tvWindow = plus.webview.open(this.tvurl);
    this.tvWindow.setStyle({ top: (44 + parseInt(this.statusbar)), bottom: '0px', position: 'absolute' });
    this.tvWindow.show();
    // this.tvWindow.addEventListener('loaded', () => {
    //   console.log('获取到加载的地址');
    //   console.log(this.tvWindow.getURL());
    // }, false);
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

opacity();

.tv {
  position: fixed;
  width: 100%;
  top: 0;
  bottom: 0;
  background: #ffffff;
  z-index: 99999;
}
</style>

