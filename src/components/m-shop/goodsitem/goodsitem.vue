<template>
  <div class="sub-goods">
    <div
      class="item"
      v-for="item in goodsInfo"
      :key="item.gift_id"
    >
      <div class="imgbox">
        <img
          :src="item.image"
          alt=""
        >
      </div>
      <div class="infobox">
        <p><span class="gold"></span>所需积分: <span class="yellow">{{item.score}}</span></p>
        <p><span class="tips"></span><span class="blue">{{item.title}}</span></p>
        <button @click="choiceGoods(item)">立即兑换</button>
      </div>
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
export default {
  //   mixins: [mask],
  props: {
    goodsInfo: {
      type: Array,
    },
  },
  mounted() {
    console.log('------------------------');
    console.log(this.goodsInfo);
  },
  methods: {
    choiceGoods(item) {
      let id = item.gift_id ? item.gift_id : item.id;
      console.log('选择的id', id);
      this.$emit('selectGoods', id);
    },
  },
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~common/stylus/variable';

.sub-goods {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  box-sizing: border-box;
  padding: 0 15px;

  .item {
    height: 146px;
    width: 100%;
    padding: 15px 0;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid #f5f5f5;

    .imgbox {
      width: 50%;
      height: 100%;
      border-radius: 5px;
      overflow: hidden;
      background: #f5f5f5;

      img {
        width: 100%;
        height: 100%;
      }
    }

    .infobox {
      flex: 1;
      max-width: 50%;
      box-sizing: border-box;
      padding-left: 15px;
      font-size: 16px;
      color: #333333;

      .gold {
        display: inline-block;
        width: 15px;
        height: 15px;
        margin-right: 8px;
        border-radius: 50%;
        background: url('./gold.png') no-repeat;
        background-size: cover;
      }

      .tips {
        display: inline-block;
        width: 15px;
        height: 15px;
        margin-right: 8px;
        border-radius: 50%;
        background: url('./info.png') no-repeat;
        background-size: cover;
      }

      p {
        display: flex;
        align-items: center;
        margin-bottom: 12px;
        text-over();

        .yellow {
          color: #ffba00;
        }

        .blue {
          flex: 1;
          color: #619ded;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
      }

      button {
        width: 90px;
        height: 32px;
        margin-top: 8px;
        border-radius: 16px;
        background: #619ded;
        border: none;
        outline: none;
        color: #ffffff;
        font-size: 16px;
      }
    }
  }
}
</style>
