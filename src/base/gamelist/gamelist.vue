<template>
  <div>
    <div class="game-list">
      <h3
        v-if="apps.moduleName"
        class="itemtitle"
      >
        {{apps.moduleName}}
      </h3>
      <div
        class="item"
        v-for="(game,index) in apps.data"
        :key=index
        v-show="index <4 || active ===true"
      >
        <div @click="goGameDetail(game.id)">
          <div class="icon">
            <img
              v-lazy="game.icon"
              alt=""
            >
          </div>
          <div class="item-content">
            <h3>{{game.name}}
              <span class="discount">{{game.discount}}折</span>
            </h3>
            <div class="star">
              <div class="star-wrapper">
                <span
                  class="star-icon"
                  :style="{ width: game.star*20+'%' }"
                ></span>
              </div>
              <p class="score">{{game.size}}</p>
              <div class="type">
                <span
                  class="game-desc"
                  v-for="(type,index) in game.tagNames"
                  :key=index
                >{{type}}</span>
              </div>
            </div>
          </div>
        </div>
        <button
          class="downbtn "
          @click="goGameDetail(game.id)"
        >详情</button>
      </div>
      <div
        class="more"
        ref="more"
        @click="toggleGame()"
      >
        <span
          class="arrow"
          :class="{active:active ===true}"
        ></span>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
export default {
  props: {
    apps: {
      type: Object,
    },
  },
  data() {
    return {
      commentAddress: '/index/gamedetail',
      active: false,
    };
  },
  computed: {
    normalizedApps() {
      let newApps = this.apps;
      console.log(newApps);
      return newApps;
    },
  },
  methods: {
    goGameDetail(id) {
      this.$router.push({
        path: `/index/gamedetail/${id}`,
        query: {
          commentAddress: this.commentAddress,
        },
      });
    },
    toggleGame() {
      this.active = !this.active;
    },
  },
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~common/stylus/variable';
@import '~common/stylus/mixin';

.game-list {
  width: 100%;
  margin-top: 16px;
  box-shadow: 0 2px 2px #d1d0d0;
  background: #ffffff;
  padding: 0 10px;
  box-sizing: border-box;

  h3 {
    padding: 15px 0;
    color: #222222;
    font-weight: bold;

    &.itemtitle {
      border-bottom: 1px solid #eeeeee;
    }
  }

  .item {
    display: block;
    height: 100px;
    padding-top: 1px;
    box-sizing: border-box;
    position: relative;
    text-decoration: none;
    border-bottom: 1px solid #eeeeee;

    .icon {
      height: 80px;
      position: absolute;
      left: 0;
      top: 9px;

      img {
        height: 100%;
      }
    }

    .item-content {
      margin-left: 100px;

      h3 {
        font-size: $font-size-large;
        margin: 0;
        color: #333333;
        padding: 10px 0 0 0;
        display: flex;
        align-items: center;

        .discount {
          box-sizing: border-box;
          padding-left: 7px;
          font-size: 12px;
          display: inline-block;
          width: 43px;
          height: 18px;
          background: url('../../../static/zhe.png') no-repeat;
          background-size: 43px 18px;
          margin-left: 12px;
          line-height: 18px;
          color: #ffffff;
          text-align: center;
        }
      }

      .star {
        .star-wrapper {
          width: 50px;
          display: inline-block;
          height: 10px;
          position: relative;
          overflow: hidden;

          .star-icon {
            position: absolute;
            left: 0;
            top: 0;
            display: inline-block;
            height: 10px;
            background: url('./star.png');
            background-size: 10px 10px;
          }
        }

        .score {
          font-size: $font-size-small;
          padding: 3px 0;
          color: $color-font;
        }
      }
    }

    .type {
      margin-top: 4px;

      .game-desc {
        box-sizing: border-box;
        width: 34px;
        height: 15px;
        border: 1px solid #febf01;
        border-radius: 5px;
        font-size: $font-size-small;
        color: #febf01;
        padding: 2px 4px;
        margin-right: 6px;
      }
    }

    .downbtn {
      position: absolute;
      right: 0;
      top: 30px;
      downloadbtn();

      &.opengame {
        background: #ffc400;
      }
    }
  }

  .more {
    width: 100%;
    height: 26px;
    display: flex;
    align-items: center;
    justify-content: center;

    .arrow {
      display: block;
      width: 11px;
      height: 6px;
      background: url('./zk@3x.png') no-repeat;
      background-size: 11px 6px;

      &.active {
        transform: rotate(180deg);
      }
    }
  }
}
</style>
