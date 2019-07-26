<template>
  <div
    class="material-gift"
    :class="{active:active}"
  >
    <div class="goods-img">
      <img
        :src="material.icon"
        alt=""
      >
    </div>
    <div class="desc">
      <span
        class="delete"
        @click="deleteGift"
      ></span>
      <h5> {{material.title}}</h5>
      <p class="code">兑换码: {{material.gift_code}}</p>
      <div
        class="copy"
        @click="copy(material.gift_code)"
      >
        复制
      </div>
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
import Clipboard from 'clipboard';

export default {
  props: {
    material: {
      type: Object,
    },
    active: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    deleteGift() {
      if (this.active) {
        console.log('dd');
        this.$emit('deleteGift');
      }
    },
    copy(text) {
      let clipboard = new Clipboard('.copy', {
        text: () => (text.trim()),
      });
      clipboard.on('success', () => {
        clipboard.destroy();
        plus.nativeUI.toast('复制成功');
      });
      clipboard.on('error', () => {
        plus.nativeUI.toast('复制失败');
      });
    },
  },
};
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~common/stylus/mixin';

.material-gift {
  display: flex;
  box-sizing: border-box;
  padding: 20px 15px;
  border-bottom: 8px solid #f5f5f5;

  &:last-child {
    border: none;
  }

  &.active {
    .desc {
      .delete {
        display: block;
      }
    }
  }

  .goods-img {
    flex: 1;
    height: 0;
    padding-bottom: 34%;
    background: #eeeeee;
    border-radius: 5px;
    position: relative;
    overflow: hidden;

    img {
      left: 0;
      top: 0;
      position: absolute;
      width: 100%;
      height: 100%;
    }
  }

  .desc {
    flex: 1;
    min-width: 50%;
    padding-top: 15px;
    padding-left: 10px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    position: relative;

    .delete {
      width: 14px;
      height: 14px;
      position: absolute;
      left: -7px;
      top: -7px;
      background: url('./delete.png') no-repeat;
      background-size: 14px 14px;
      display: none;
      z-index: 10;
    }

    h5 {
      color: #333333;
      font-size: 15px;
      font-weight: bold;
      no-wrap();
    }

    .code {
      color: #333333;
      font-size: 14px;
    }

    .copy {
      margin-top: 10px;
      width: 80px;
      height: 36px;
      border-radius: 18px;
      text-align: center;
      line-height: 36px;
      color: #ffffff;
      font-size: 16px;
      font-weight: bold;
      background: #1faed6;
    }
  }
}
</style>
