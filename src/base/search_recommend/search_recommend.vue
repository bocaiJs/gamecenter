<template>
  <div class="search-recommend">
    <div class="search-title">
      <h3>{{title}}</h3>
    </div>
    <div class="hot-game">
      <div
        class="item"
        v-for="game in gameList"
        :key="game.id"
        @click="goGameDetail(game.id)"
      >
        <img
          v-lazy="game.icon"
          alt=""
        >
        <p>{{game.name}}</p>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
export default {
  props: {
    title: {
      type: String,
      default: '热门搜索',
    },
    gameList: {
      type: Array,
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

.search-recommend {
  padding: 15px;
  font-size: $font-size-medium-x;
  color: $color-font;

  .search-title {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;

    h3 {
      font-size: 16px;
      font-weight: bold;
      color: #555555;
    }

    p {
      width: 20%;
      font-size: $font-size-small;
      text-align: right;
      padding-right: 2px;

      .icon {
        img {
          width: 12px;
          transform: translate3d(2px, 2px, 0);
        }
      }
    }
  }

  .hot-game {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px 0;

    .item {
      width: 75px;
      border-radius: 12px;

      img {
        display: block;
        width: 100%;
        height: 100%;
      }

      p {
        padding-top: 10px;
        font-size: 14px;
        text-align: center;
        color: #555555;
      }
    }
  }
}
</style>
