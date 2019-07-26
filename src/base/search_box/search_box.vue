
<template>
  <div
    class="search-box"
    @click="gosearch"
  >
    <div class="input-box">
      <input
        type="text"
        placeholder="搜索游戏"
        disabled
      >
      <div class="input-icon"></div>
    </div>
  </div>
</template>

<script  type="text/ecmascript-6">
import DownIcon from '@/base/icon_widget/down';

export default {
  components: {
    DownIcon,
  },
  methods: {
    gosearch() {
      this.$emit('seaerch');
    },
  },
};
</script>


<style scoped lang="stylus" rel="stylesheet/stylus">

.search-box {
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  box-sizing: border-box;
  padding-left: 15px;
  flex: 1;

  .input-box {
    width: 100%;
    position: relative;
    display: flex;
    align-items: center;

    .input-icon {
      position: absolute;
      top: 50%;
      left: 10px;
      transform: translate3d(0, -50%, 0);
      height: 16px;
      width: 16px;
      background: url('./search_in.png') no-repeat;
      background-size: cover;
    }

    input {
      width: 100%;
      height: 28px;
      line-height: 28px;
      border-radius: 5px;
      font-size: 14px;
      font-family: 'PingFang SC', 'STHeitiSC-Light', 'Helvetica-Light', arial, sans-serif, 'Droid Sans Fallback';
      outline: none;
      border: 1px solid #cccccc;
      text-indent: 32px;
      color: #fff;
      background: transparent;
      color: red;

      &::-webkit-input-placeholder {
        color: #cccccc;
      }
    }
  }
}
</style>

