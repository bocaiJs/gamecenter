<template>
  <div
    class="m-header"
    ref="indexheader"
    style="padding-top:24px;"
  >
    <!-- :style="{ 'padding-top': statusbar+'px'}" -->
    <slot name="header"></slot>
  </div>
</template>

<script type="text/ecmascript-6">
import { mapGetters } from 'vuex';


export default {
  name: 'm-header',
  computed: {
    ...mapGetters(['statusbar']),
  },
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~common/stylus/variable';
@import '~common/stylus/mixin';

.m-header {
  position: relative;
  height: 44px;
  width: 100%;
  text-align: center;
  color: $color-theme;
  font-size: 0;
  display: flex;
  align-items: center;
  background: #ffffff;

  &.linear {
    background: linear-gradient(to right, #29323c, #37424f, #485563);
  }

  &.green {
    background: linear-gradient(#7aeed2, #5ed9f5, #5ed9f5);
    background: -webkit-linear-gradient(left, #7aeed2, #5ed9f5, #5ed9f5);
  }

  &.border {
    border-bottom: 1px solid #b2b2b2;
  }

  .tab-item {
    alignitems: center;
    height: 34px;
    flex: 1;
    box-sizing: border-box;
    font-size: 15px;
    color: #333333;
    display: flex;
    justify-content: center;

    .tab-box {
      width: 190px;
      line-height: 32px;
      border-radius: 16px;
      overflow: hidden;
      border: 1px solid #1faed6;
      display: flex;

      span {
        display: inline-block;
        width: 50%;
        text-align: center;
        font-weight: bold;
        transition: all 0.25s linear;

        &.active {
          background: #1faed6;
          color: #ffffff;
        }
      }
    }
  }

  p {
    flex: 1;
    height: 44px;
    line-height: 44px;
    text-align: center;
    font-size: 16px;
    color: #333333;
    font-weight: bold;
    box-sizing: border-box;

    &.padding-right {
      padding-right: 46px;
    }
  }

  .right-button {
    width: 46px;
    height: 100%;
    font-size: 16px;
    color: #333333;
    line-height: 46px;
  }

  .search-input {
    flex: 1;
    height: 100%;
    display: flex;
    align-items: center;

    input {
      width: 100%;
      height: 28px;
      line-height: 28px;
      border-radius: 5px;
      font-size: 14px;
      font-family: 'PingFang SC', 'STHeitiSC-Light', 'Helvetica-Light', arial, sans-serif, 'Droid Sans Fallback';
      outline: none;
      border: 1px solid #cccccc;
      text-indent: 6px;
      color: #333333;
      background: transparent;

      &::-webkit-input-placeholder {
        color: #cccccc;
      }
    }
  }
}
</style>
