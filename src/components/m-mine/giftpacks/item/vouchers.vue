<template>
  <div class="ticketbox">
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
          :class="{active:gift.status_type}"
        ></div>
      </div>
      <div class="v-desc">
        {{gift.description}}
      </div>
    </div>
  </div>
</template>
<script type="text/ecmascript-6">

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
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~common/stylus/mixin';

.ticketbox {
  .v-gift {
    width: 100%;
    height: 0;
    padding-bottom: 37%;
    margin-bottom: 15px;
    background: red;
    background: url('../../../../../static/vouchers.png') no-repeat;
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
        width: 62px;
        height: 50px;
        background: url('../../../../../static/v-active.png') no-repeat;
        background-size: cover;
        margin-right: 10px;

        &.active {
          background: url('../../../../../static/v-disactive.png') no-repeat;
          background-size: cover;
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
}
</style>
