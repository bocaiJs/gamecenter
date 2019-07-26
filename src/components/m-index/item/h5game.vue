<template>
  <div
    class="h5-game"
    @click="goGameDetail(h5game.id)"
  >
    <div class="image-box">
      <img
        :src="h5game.banner"
        alt=""
      >
    </div>
    <div class="game-desc">
      <div class="desc-left">
        <h4>{{h5game.name}}</h4>
        <p>{{h5game.description}}</p>
      </div>
      <button class="downbtn ">详情</button>
    </div>
  </div>
</template>
<script type="text/ecmascript-6">

export default {
  props: {
    h5game: {
      default: Object,
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
.h5-game {
  padding: 20px 15px;
  padding-bottom: 0;
  margin-bottom: 8px;
  background: #ffffff;

  &:first-child {
    padding-top: 0;
  }

  .image-box {
    position: relative;
    width: 100%;
    padding-bottom: 50%;
    background: #e7e9ff;
    border-radius: 5px;
    overflow: hidden;

    img {
      position: absolute;
      top: 0;
      left: 0;
      display: block;
      width: 100%;
      height: 100%;
    }
  }

  .game-desc {
    height: 60px;
    display: flex;
    align-items: center;

    .desc-left {
      padding-right: 20px;
      overflow: hidden;

      h4 {
        font-size: 16px;
        color: #333333;
        font-weight: bold;
      }

      p {
        font-size: 12px;
        color: #999999;
        margin-top: 10px;
        font-weight: bold;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
    }

    .desc-left {
      flex: 1;
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
}
</style>
