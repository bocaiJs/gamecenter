<template>
  <div class="game-detailitem">
    <div class="icon">
      <span class="icon-mark jp"></span>
      <img
        alt=""
        v-lazy="gameInfo.icon"
      >
    </div>
    <div class="item-content">
      <h3>
        {{gameInfo.name}}
        <span class="discount">{{gameInfo.discount}}折</span>
      </h3>
      <p class="size">
        <span class="score-icon"></span>
        <span>{{gameInfo.star *2}}</span>
        <span class="line"></span>
        <span>{{gameInfo.size}}</span>
        <span class="dot"></span>
        <!-- v-for="type in gameInfo.tagNames"
          v-if="gameInfo.tagNames"
          :key="type" -->
        <span class="type">{{gameInfo.type_name}}</span>
      </p>
      <div class="type">
        {{gameInfo.introduce}}
      </div>
    </div>
    <button
      class="favorite"
      :class="{no:!gameInfo.followStatus}"
      @click="favorite"
    ></button>
  </div>
</template>

<script type="text/ecmascript-6">

export default {
  props: {
    gameInfo: {
      type: Object,
    },
  },
  methods: {
    favorite() {
      this.$emit('favorite');
    },
  },
};
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~common/stylus/variable';
@import '~common/stylus/mixin';

.game-detailitem {
  display: flex;
  height: 65px;
  position: relative;
  justify-content: space-between;
  padding: 15px;
  align-items: center;
  border-bottom: 1px solid #eeeeee;
  background: #ffffff;

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

        &.type {
          margin-right: 5px;
        }
      }
    }

    .type {
      font-size: 12px;
      color: #999999;
      text-over();
      max-width: 240px;
    }
  }

  .favorite {
    width: 18px;
    height: 18px;
    background: url('./redheart.png') no-repeat;
    background-size: 18px 18px;
    out-line: none;
    border: none;
    padding: 15px;
    padding-right: 0;
    outline: none;
    outline-color: rgba(255, 255, 255, 0);

    &.no {
      background: url('./grayheart.png') no-repeat;
      background-size: 18px 18px;
    }
  }
}
</style>
