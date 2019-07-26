<template>
  <div class="tab">
    <router-link
      tag="div"
      class="tab-item"
      to="/index"
    >
      <span class="tab-icon index"></span>
      <p class="tab-link">首页</p>
    </router-link>
    <router-link
      tag="div"
      class="tab-item"
      to="/gamemod"
    >
      <span class="tab-icon tab-game"></span>
      <p class="tab-link">游戏</p>
    </router-link>
    <router-link
      tag="div"
      class="tab-item"
      to="/service"
    >
      <span class="tab-icon tab-entertainment"></span>
      <p class="tab-link">圈子</p>
    </router-link>
    <router-link
      tag="div"
      class="tab-item"
      to="/rank"
    >
      <span class="tab-icon tab-rank"></span>
      <p class="tab-link">排行</p>
    </router-link>
    <router-link
      tag="div"
      class="tab-item"
      to="/mine"
    >
      <span class="tab-icon tab-mine"></span>
      <span
        class="dot"
        v-if="msgInfo.new_msg"
      ></span>
      <p class="tab-link">我的</p>
    </router-link>
  </div>
</template>

<script type="text/ecmascript-6">
import { mapGetters } from 'vuex';

export default {
  mounted() {
    console.log('打印消息');
    console.log(this.msgInfo);
  },
  computed: {
    ...mapGetters(['msgInfo']),
  },
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~common/stylus/variable';
@import '~common/stylus/mixin';

.tab {
  position: fixed;
  display: flex;
  height: 50px;
  box-sizing: border-box;
  border-top: 1px solid #dddddd;
  line-height: 50px;
  font-size: $font-size-medium;
  background: #ffffff;
  width: 100%;
  bottom: 0;
  color: $color-text-white;
  z-index: 0;

  .tab-item {
    flex: 1;
    text-align: center;
    color: #8a8a8a;
    font-weight: bold;
    position: relative;

    .dot {
      position: absolute;
      height: 8px;
      width: 8px;
      border-radius: 50%;
      background: red;
      top: 10%;
      right: 25%;
    }

    .tab-link {
      line-height: 20px;
    }

    .tab-icon {
      display: block;
      width: 24px;
      height: 24px;
      background-size: 24px 24px;
      background-repeat: no-repeat;
      margin: 0 auto;
      margin-top: 6px;

      &.index {
        // bg-image('index');
        background-image: url('./shouye.png');
      }

      &.tab-game {
        background-image: url('./youxi.png');
      }

      &.tab-rank {
        background-image: url('./paihang.png');
      }

      &.tab-mine {
        background-image: url('./wode.png');
      }

      &.tab-entertainment {
        background-image: url('./quanzi.png');
      }
    }

    &.router-link-active {
      // background: $color-nav-bg-active;
      color: #1faed6;

      .index {
        background-image: url('./shouye1.png');
      }

      .tab-game {
        background-image: url('./youxi1.png');
      }

      .tab-rank {
        background-image: url('./paihang1.png');
      }

      .tab-mine {
        background-image: url('./wode1.png');
      }

      .tab-entertainment {
        background-image: url('./quanzi1.png');
      }
    }
  }
}
</style>
