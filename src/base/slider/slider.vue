<template>
  <div
    class="slider"
    ref="slider"
  >
    <div
      class="slider-group"
      ref="sliderGroup"
    >
      <slot>
      </slot>
    </div>
    <div class="dots">
      <span
        class="dot"
        v-for="(item,index) in dots"
        :class="{active:currentPageIndex === index}"
        :key='index'
      >{{index}}</span>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import BScroll from 'better-scroll';
import { addClass } from '@/common/js/dom';

export default {
  props: {
    loop: {
      type: Boolean,
      default: true,
    },
    autoPlay: {
      type: Boolean,
      default: false,
    },
    interval: {
      type: Number,
      default: 4000,
    },
    sliderData: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      dots: [],
      currentPageIndex: 0,
      firstInit: 1,
    };
  },
  mounted() {
    // 浏览器刷新的时间是17毫秒
    setTimeout(() => {
      this._setSliderWidth();
      this._initSlider();
      if (this.autoPlay) {
        this._play();
      }
    }, 20);
    window.addEventListener('resize', () => {
      if (!this.slider) return;
      this._setSliderWidth(true);
      this.slider.refresh();
    });
  },
  destroyed() {
    clearTimeout(this.timer);
  },
  methods: {
    // 横向滚动之前需要设置Slider的宽度
    _setSliderWidth(isResize) {
      //  获取子元素的数量
      this.children = this.$refs.sliderGroup.children;
      let width = 0;
      //  获取父元素宽度
      let sliderWidth = this.$refs.slider.clientWidth;
      for (let i = 0; i < this.children.length; i++) {
        let child = this.children[i];
        addClass(child, 'slider-item');
        child.style.width = sliderWidth + 'px';
        width = width + sliderWidth;
      }
      // 循环播放的话， 会克隆两个dom 左右个一个，保证循环切换
      if (this.loop && !isResize) {
        width = width + sliderWidth * 2;
      }
      this.$refs.sliderGroup.style.width = width + 'px';
      this.$refs.sliderGroup.style.height = parseInt(sliderWidth / 2) + 'px';
      if (this.firstInit) {
        this.firstInit = 0;
        this._initDots();
      }
    },
    _initDots() {
      this.dots = new Array(this.children.length);
    },
    _initSlider() {
      this.slider = new BScroll(this.$refs.slider, {
        scrollX: true,
        scrollY: false,
        momentum: false,
        snap: {
          loop: true,
          threshold: 0.3,
          speed: 400,
        },
        click: true,
      });
      this.slider.on('scrollEnd', () => {
        let pageIndex = this.slider.getCurrentPage().pageX;
        this.currentPageIndex = pageIndex;
        if (this.autoPlay) {
          clearTimeout(this.timer);
          this._play();
        }
      });
    },
    _play() {
      this.timer = setTimeout(() => {
        this.slider.next();
      }, this.interval);
    },
  },
  watch: {
    sliderData() {
      setTimeout(() => {
        if (!this.slider) return;
        this._setSliderWidth(true);
        this.slider.refresh();
      }, 20);
    },
  },
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~common/stylus/variable';

.slider {
  min-height: 1px;
  position: relative;
  overflow: hidden;

  .slider-group {
    position: relative;
    overflow: hidden;
    white-space: nowrap;
    display: flex;

    .slider-item {
      float: left;
      box-sizing: border-box;
      overflow: hidden;
      text-align: center;

      .item {
        display: block;
        width: 100%;
        height: 100%;
        overflow: hidden;
        text-decoration: none;
        position: relative;

        img {
          display: block;
          width: 100%;
        }

        h3 {
          position: absolute;
          top: 15px;
          left: 15px;
          font-size: 16px;
          color: #ffffff;
          z-index: 1;
        }

        .mask {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          zindex: 0;
        }

        .play-icon {
          display: block;
          position: absolute;
          left: 50%;
          top: 50%;
          width: 40px;
          height: 40px;
          transform: translate3d(-50%, -50%, 0);
          background: url('./bf@3x.png') no-repeat;
          background-size: 40px 40px;
        }

        .icon {
          display: inline-block;
          width: 100%;
        }

        img {
          display: block;
          width: 100%;
        }
      }

      img {
        display: block;
        width: 100%;
      }
    }
  }

  .dots {
    position: absolute;
    right: 0;
    left: 0;
    bottom: 12px;
    text-align: center;
    font-size: 0;

    .dot {
      display: inline-block;
      margin: 0 4px;
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #eeeeee;

      &.active {
        background: #fe5ba8;
      }
    }
  }
}
</style>
