<template>
  <transition name="confirm-fade">
    <div
      class="mask"
      v-show="showTipMask"
    >
      <div
        class="mask-wrapper"
        @click="hideMask"
      >
      </div>
      <transition name="confirm-fade">
        <div class="box-wrapper">
          <div class="box">
            <div class="title">{{tipTitle}}</div>
            <div class="contentwrapper">
              <div
                class="content"
                v-html="tipContent"
              >
              </div>
            </div>
            <div
              class="btn"
              @click="hideMask"
            >
              我已知晓
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

export default {
  name: 'mask-tip',
  props: {
    showTipMask: {
      type: Boolean,
      default: false,
    },
    tipTitle: {
      type: String,
      default: '说明',
    },
    tipContent: {
      type: String,
      default: '说明',
    },
  },
  methods: {
    hideMask() {
      this.$emit('hideTip');
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
    height: 340px;

    .box {
      width: 100%;
      height: 100%;
      background: #ffffff;
      border-radius: 10px;
      box-sizing: border-box;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      align-items: center;

      .title {
        width: 100%;
        height: 50px;
        line-height: 50px;
        font-size: 16px;
        text-align: center;
        color: #ffffff;
        font-size: 18px;
        font-weight: bold;
        background: url('./titlebg.png') no-repeat;
        background-size: cover;
        // background: #fe5ba8;
      }

      .contentwrapper {
        flex: 1;
        width: 100%;
        overflow-x: hidden;
        overflow-y: scroll;

        .content {
          width: 100%;
          height: 100%;
          box-sizing: border-box;
          padding: 15px;
          font-size: 16px;
          color: #555555;
          line-height: 24px;
        }
      }

      .btn {
        width: 120px;
        height: 36px;
        margin: 16px 0;
        line-height: 36px;
        text-align: center;
        font-size: 16px;
        color: #ffffff;
        background: #1faed6;
        border-radius: 5px;
      }
    }
  }
}
</style>
