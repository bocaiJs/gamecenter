<template>
  <div
    class="gift-item"
    :class="{active:!gift.have}"
  >
    <div class="gift-left">
      <div class="gift-title">{{gift.title}}</div>
      <div class="progess">
        <div class="progess-box">
          <span :style="{width:progress}"></span>
        </div>
        <span>剩余{{gift.ratio}}</span>
      </div>
      <p>{{gift.description}}</p>
    </div>
    <div
      class="gift-right"
      v-if="gift.have"
    >
      已领取
    </div>
    <div
      class="gift-right"
      v-else
      @click="getGift"
    >
      领取
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
export default {
  props: {
    gift: {
      type: Object,
    },
    index: {
      type: Number,
    },
  },
  data() {
    return {
      progress: 0,
    };
  },
  mounted() {
    this.progress = 100 - parseInt(this.gift.ratio.substring(0, this.gift.ratio.length - 1)) + '%';
    console.log(this.index);
  },
  methods: {
    getGift() {
      this.$emit('getGift', this.gift.id, this.index);
    },
  },
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
.gift-item {
  min-height: 86px;
  width: 100%;
  padding: 0 15px;
  box-sizing: border-box;
  border-bottom: 1px solid #eeeeee;
  display: flex;
  align-items: center;

  .gift-left {
    flex: 1;
    display: flex;
    flex-wrap: wrap;
    min-height: 84px;
    box-sizing: border-box;
    padding: 15px 25px 15px 0;

    p {
      color: #777777;
      font-size: 12px;
      margin-top: 10px;
    }

    .gift-title {
      width: 100%;
      font-size: 13px;
      color: #333333;
    }

    .progess {
      width: 100%;
      display: flex;
      margin-top: 10px;
      align-items: center;

      .progess-box {
        height: 6px;
        border-radius: 3px;
        box-sizing: border-box;
        margin-right: 5px;
        flex: 1;
        border: 1px solid #1faed6;

        span {
          display: block;
          height: 100%;
          background: #1faed6;
        }
      }

      span {
        display: block;
        width: 50px;
        text-align: left;
        font-size: 12px;
        color: #fe5ba8;
      }
    }
  }

  .gift-right {
    width: 76px;
    height: 28px;
    box-sizing: border-box;
    border: 1px solid #999999;
    font-size: 14px;
    text-align: center;
    line-height: 26px;
    color: #999999;
    border-radius: 14px;
  }

  &.active {
    .gift-right {
      border: 1px solid #fe5ba8;
      color: #fe5ba8;
    }
  }
}
</style>
