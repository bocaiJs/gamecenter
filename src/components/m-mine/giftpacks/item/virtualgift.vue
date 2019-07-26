<template>
  <div
    class="virtual-gift"
    :class="{active:active}"
  >
    <div class="info">
      <div
        class="avatar"
        @click="deleteGift"
      >
        <img v-lazy="gift.icon">
        <span class="delete"></span>
      </div>
      <div class="title">
        <h5>{{gift.title}}</h5>
        <p class="code">兑换码: {{gift.gift_code}}</p>
        <p class="date">兑换时间: {{gift.created_at}}</p>
      </div>
      <div
        class="copy"
        @click="copy(gift.gift_code)"
      >
        复制
      </div>
    </div>
    <div class="desc">
      内容：{{gift.description}}
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
import Clipboard from 'clipboard';

export default {
  props: {
    gift: {
      type: Object,
    },
    active: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      url: 'http://img.sdk.yxorange.com//icon/2018/04/25/5ae0456694c94.png',
    };
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

.virtual-gift {
  padding: 0 15px;
  box-sizing: border-box;
  border-bottom: 8px solid #f5f5f5;

  &:last-child {
    border: none;
  }

  &.active {
    .info {
      .avatar {
        .delete {
          display: block;
        }
      }
    }
  }

  .info {
    display: flex;
    padding: 20px 0 14px 0;
    box-sizing: border-box;
    align-items: center;
    border-bottom: 1px solid #eeeeee;

    .avatar {
      width: 64px;
      height: 64px;
      position: relative;

      img {
        width: 100%;
        height: 100%;
      }

      .delete {
        width: 14px;
        height: 14px;
        position: absolute;
        right: -7px;
        top: -7px;
        background: url('./delete.png') no-repeat;
        background-size: 14px 14px;
        display: none;
      }
    }

    .title {
      flex: 1;
      height: 64px;
      padding-right: 20px;
      box-sizing: border-box;
      no-wrap();
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding: 4px 20px 4px 10px;

      h5 {
        color: #333333;
        font-size: 15px;
        font-weight: bold;
      }

      .code {
        color: #333333;
        font-size: 14px;
      }

      .date {
        font-size: 12px;
        color: #999;
      }
    }

    .copy {
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

  .desc {
    padding: 6px 0;
    width: 100%;
    color: #333333;
    font-size: 14px;
    line-height: 28px;
  }
}
</style>
