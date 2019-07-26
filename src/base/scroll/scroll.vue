<template>
  <div ref="wrapper">
    <slot></slot>
  </div>
</template>

<script type="text/ecmascript-6">
import BSscroll from 'better-scroll';

export default {
  name: 'scroll',
  props: {
    probeType: {
      type: Number,
      default: 1,
    },
    click: {
      type: Boolean,
      default: true,
    },
    data: {
      type: Number,
      default: null,
    },
    // 是否监听滚动事件
    listenScroll: {
      type: Boolean,
      default: false,
    },
    pullUpLoad: {
      type: null,
      default: false,
    },
  },
  data() {
    return {
      isPullUpLoad: false,
      pullUpDirty: true,
    };
  },
  mounted() {
    setTimeout(() => {
      this._initScroll();
    }, 20);
  },
  methods: {
    _initScroll() {
      if (!this.$refs.wrapper) {
        return;
      }
      console.log('滚动组件' + this.pullUpLoad);
      this.scroll = new BSscroll(this.$refs.wrapper, {
        probeType: this.probeType,
        click: this.click,
        momentum: true,
        bounce: true,
        pullUpLoad: this.pullUpLoad,
        pullUpLoadThreshold: 0,
        // eventPassthrough: 'vertical',
      });
      if (this.pullUpLoad) {
        this._initPullUpLoad();
      }
      if (this.listenScroll) {
        let me = this; // vue实例
        // 组件监听到滚动事件，获取滚动到的位置
        this.scroll.on('scroll', (pos) => {
          // 监听到滚动事件后，向父组件派发一个scroll事件
          me.$emit('scroll', pos);
        });
      }
    },
    enable() {
      this.scroll && this.scroll.enable();
    },
    disable() {
      this.scroll && this.scroll.disable();
    },
    refresh() {
      this.scroll && this.scroll.refresh();
    },
    scrollTo() {
      this.scroll && this.scroll.scrollTo(0, 0, 100);
      // 为什么要调用Apply  scrollTo()会接受一些参数，所以要把参数传递到this.scroll.scrollTo里面
      // this.scroll && this.scroll.scrollTo.apply(this.scroll, arguments);
      // this.scroll 是表示当前组件
    },
    scrollToElement() {
      // this.scroll 指向betterscroll的实例
      this.scroll && this.scroll.scrollToElement.apply(this.scroll, arguments);
    },
    _initPullUpLoad() {
      this.scroll.on('pullingUp', () => {
        console.log('监听到上拉');
        this.isPullUpLoad = true;
        this.$emit('pullingUp');
      });
    },
    updateScroll() {
      setTimeout(() => {
        this.refresh();
        this.scroll.finishPullUp();
      }, 20);
    },
    endPullUp() {
      this.scroll.finishPullUp();
    },
  },
  watch: {
    data() {
      setTimeout(() => {
        console.log('重新渲染');
        this.refresh();
        this.scroll.finishPullUp();
      }, 20);
    },
  },
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus"></style>
