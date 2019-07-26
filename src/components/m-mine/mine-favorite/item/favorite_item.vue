<template>
  <div
    class="item"
    @click="goGameDetail(gameinfo.gameId)"
  >
    <div class="icon">
      <span class="icon-mark "></span>
      <img
        alt=""
        v-lazy="gameinfo.gameIcon"
      >
    </div>
    <div class="item-content">
      <h3>
        {{gameinfo.gameName}}
        <span class="discount">{{gameinfo.discount}}折</span>
      </h3>
      <p class="size">
        <span class="score-icon"></span>
        <span>{{gameinfo.star*2}}</span>
        <span class="line"></span>
        <span>{{gameinfo.size}}</span>
        <span class="dot"></span>
        <span class="tags">{{gameinfo.type_name}}</span>
      </p>
      <div class="type">
        {{gameinfo.description}}
      </div>
    </div>
    <button class="downbtn ">详情</button>
  </div>
</template>

<script type="text/ecmascript-6">

export default {
  props: {
    gameinfo: {
      type: Object,
    },
    type: {
      type: String,
      default: '',
    },
  },
  methods: {
    goGameDetail(id) {
      this.$router.push({
        path: `/gamedetail/${id}`,
      });
    },
  },
};
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~common/stylus/variable';
@import '~common/stylus/mixin';

.item {
  display: flex;
  height: 54px;
  position: relative;
  justify-content: space-between;
  padding: 15px;
  align-items: center;
  border-bottom: 1px solid #eeeeee;

  .icon {
    height: 54px;
    width: 54px;
    overflow: hidden;
    position: relative;

    .icon-mark {
      display: inline-block;
      position: absolute;
      width: 20px;
      height: 20px;
      top: 0;
      left: 0;
    }

    img {
      height: 100%;
    }
  }

  .item-content {
    margin-left: 10px;
    height: 54px;
    display: flex;
    flex: 1;
    flex-direction: column;
    justify-content: space-between;

    h3 {
      font-size: 14px;
      font-weight: bold;
      margin: 0;
      color: #333333;
      display: flex;
      align-items: center;

      .discount {
        display: inline-block;
        width: 44px;
        height: 18px;
        margin-left: 10px;
        background: url('./discount.png') no-repeat;
        background-size: 44px 18px;
        font-size: 12px;
        color: #ffffff;
        line-height: 18px;
        text-align: center;
        text-indent: 6px;
      }
    }

    .size {
      font-size: 12px;
      color: #999999;
      display: flex;
      align-items: center;
      padding-right: 10px;
      overflow: hidden;

      span {
        display: inline-block;

        &.score-icon {
          width: 12px;
          height: 12px;
          margin-right: 5px;
          background: url('./i.png') no-repeat;
          background-size: 12px 12px;
        }

        &.line {
          width: 1px;
          height: 12px;
          background: #999999;
          margin: 0 5px;
        }

        &.dot {
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background: #999999;
          margin: 0 5px;
        }

        &.tags {
          margin-right: 4px;
        }
      }
    }

    .type {
      font-size: 12px;
      color: #999999;
    }
  }

  .downbtn {
    height: 28px;
    width: 54px;
    border: 1px solid #1faed6;
    border-radius: 5px;
    background: #ffffff;
    font-size: 14px;
    font-weight: bold;
    color: #1faed6;

    &.opengame {
      background: #ffc400;
    }
  }
}
</style>
