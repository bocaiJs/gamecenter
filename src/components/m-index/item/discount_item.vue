<template>
  <div
    class="item"
    @click="goGameDetail(gameinfo.id)"
  >
    <div class="icon">
      <span
        class="icon-mark "
        v-if="showGameTag"
        :class="{hot:gameinfo.left_top===1,jp:gameinfo.left_top===2,new:gameinfo.left_top===3}"
      ></span>
      <img
        alt=""
        v-lazy="gameinfo.icon"
      >
    </div>
    <div class="item-content">
      <h3>
        {{gameinfo.name}}
        <span class="discount">{{gameinfo.discount}}折</span>
      </h3>
      <p class="size">
        <span class="score-icon"></span>
        <span>{{gameinfo.star*2}}</span>
        <span class="line"></span>
        <span>{{gameinfo.size}}</span>
        <span class="dot"></span>
        <span
          class="tags"
          v-if="fixedType"
        >{{type}}</span>
        <span>{{gameinfo.type_name}}</span>
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
    showGameTag: {
      type: Boolean,
      default: true,
    },
    fixedType: {
      type: Boolean,
      default: false,
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

      &.hot {
        background: url('./hot.png') no-repeat;
        background-size: 20px 20px;
      }

      &.new {
        background: url('./new.png') no-repeat;
        background-size: 20px 20px;
      }

      &.jp {
        background: url('./jp.png') no-repeat;
        background-size: 20px 20px;
      }
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
    overflow: hidden;

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
      width: 100%;
      font-size: 12px;
      color: #999999;
      no-wrap();
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
