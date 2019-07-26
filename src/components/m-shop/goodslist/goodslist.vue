<template>
  <div class="goods">

    <div
      class="item"
      v-for="(item,index) in goodsInfo"
      @click="choiceGoods(item.gift_id)"
      :key=index
    >
      <div class="imgbox">
        <img
          :src="item.image"
          alt=""
          class="good-desc"
        >
      </div>
      <p class="name">{{item.title}}</p>
      <div class="info">
        <span>所需积分 : </span>
        <span>{{item.score}}</span>
      </div>
      <button class="btn">
        立即兑换
      </button>
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
export default {
  props: {
    goodsInfo: {
      type: Array,
    },
  },
  methods: {
    choiceGoods(id) {
      console.log(id);
      this.$emit('goGoodsDetail', id);
    },
  },
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~common/stylus/variable';

.goods {
  width: 100%;
  display: flex;
  flex-wrap: wrap;

  .title {
    width: 100%;
    line-height: 50px;
    font-size: 16px;
    font-weight: bold;
  }

  .item {
    width: 48%;
    margin-left: 4%;
    margin-bottom: 4%;
    padding-bottom: 15px;
    box-sizing: border-box;
    border: 1px solid #f5f5f5;
    box-shadow: 0 2px 4px #d1d0d0;

    &:nth-child(2n+1) {
      margin-left: 0;
    }

    .imgbox {
      width: 100%;
      padding-bottom: 68%;
      height: 0;
      overflow: hidden;
      background: #eeeeee;

      .good-desc {
        width: 100%;
      }
    }

    .name {
      margin-top: 5px;
      font-size: 14px;
      line-height: 21px;
      color: #333333;
      // background: lightgreen;
      padding: 0 6px;
      box-sizing: border-box;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }

    .info {
      padding: 0 6px;
      box-sizing: border-box;
      padding-bottom: 12px;
      padding-top: 6px;
      color: #555555;

      span {
        font-size: 12px;

        &:last-child {
          color: #ff4646;
        }
      }
    }

    .btn {
      display: block;
      margin: 0 auto;
      width: 120px;
      height: 36px;
      box-sizing: border-box;
      border-radius: 18px;
      border: 1px solid #4c85d2;
      line-height: 36px;
      text-align: center;
      background: #ffffff;
      font-size: 16px;
      color: #4c85d2;
      outline: none;
    }
  }
}
</style>
