<template>
  <div class="item">
    <div class="icon">
      <img
        alt=""
        v-lazy="buttonInfo.icon"
      >
    </div>
    <div class="item-content">
      <h3>
        {{buttonInfo.name}}
      </h3>
      <p class="size">
        <span class="score-icon"></span>
        <span>{{buttonInfo.star*2.0}}</span>
        <span class="line"></span>
        <span>{{buttonInfo.size}}</span> <span class="dot"></span>
        <span>{{buttonInfo.type_name}}</span>
      </p>
      <div class="type">
        <span
          class="game-desc"
          v-for="(item,index) in buttonInfo.cateNames"
          v-if="index < 3"
          :key='item'
        >{{item}}</span>
      </div>
    </div>
    <button class="downbtn ">详情</button>
  </div>
</template>

<script type="text/ecmascript-6">

export default {
  props: {
    buttonInfo: {
      type: Object,
    },
  },
  data() {
    return {
      testImg: 'http://img.sdk.yxorange.com//icon/2018/06/07/5b18d1c77e4fd.png',
    };
  },
};
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~common/stylus/variable';
@import '~common/stylus/mixin';

.item {
  display: flex;
  height: 54px;
  box-sizing: border-box;
  position: relative;
  justify-content: space-between;
  margin-top: 15px;
  align-items: center;

  .icon {
    height: 54px;

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
    }

    .size {
      font-size: 12px;
      color: #999999;
      display: flex;
      align-items: center;
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
          margin-left: 4px;
        }
      }
    }

    .type {
      height: 20px;

      .game-desc {
        box-sizing: border-box;
        width: 34px;
        height: 15px;
        border: 1px solid #fe5ba8;
        border-radius: 5px;
        font-size: $font-size-small;
        color: #fe5ba8;
        padding: 2px 4px;
        margin-right: 6px;
      }
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
