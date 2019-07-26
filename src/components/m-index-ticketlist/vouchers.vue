<template>
  <div class="v-gift">
    <div class="v-info">
      <div class="left">
        <span class="small">￥</span>
        <span class="big">{{gift.amount}}</span>
      </div>
      <div class="middle">
        <p class="full">{{gift.title}}</p>
        <p class="normal">有效期：{{gift.valid_time}}天</p>
        <p class="normal">过期时间：{{gift.end_time}}</p>
      </div>
      <div
        class="canuse"
        :class="{active:gift.status_type===1}"
        @click="receiveTicket(gift)"
      >
        {{gift.status_type===0?"领取":"已领取"}}
      </div>
    </div>
    <div class="v-desc">
      {{gift.description}}
    </div>
  </div>
</template>
<script type="text/ecmascript-6">

export default {
  props: {
    gift: {
      type: Object,
    },
  },
  methods: {
    receiveTicket(item) {
      if (item.status_type === 1) return;
      this.$emit('getTicket', item.id);
    },
  },
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~common/stylus/mixin';

.v-gift {
  margin: 15px;
  height: 126px;
  background: url('../../../static/vouchers.png') no-repeat;
  background-size: cover;

  .v-info {
    height: 80px;
    display: flex;
    align-items: center;
    flex-direction: row;

    .left {
      box-sizing: border-box;
      padding-left: 15px;
      padding-right: 30px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      color: #ffffff;
      font-weight: bold;

      .small {
        font-size: 16px;
      }

      .big {
        font-size: 36px;
      }
    }

    .middle {
      height: 100%;
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding: 8px 0;
      box-sizing: border-box;
      color: #ffffff;

      .full {
        font-size: 15px;
        font-weight: bold;
      }

      .normal {
        font-size: 13px;
      }
    }

    .canuse {
      width: 64px;
      height: 32px;
      background: url('./bg.png') no-repeat;
      background-size: cover;
      margin-right: 10px;
      font-size: 14px;
      color: #ffffff;
      line-height: 32px;
      text-align: center;

      &.active {
        opacity: 0.5;
      }
    }
  }

  .v-desc {
    height: 46px;
    display: flex;
    align-items: center;
    font-size: 12px;
    color: #ffffff;
    box-sizing: border-box;
    padding: 0 15px;
    line-height: 18px;
  }
}
</style>
