<template>
  <div
    class="strategy-item"
    @click="goArticle(strategy.id)"
  >
    <!-- <div class="title-box">
      <p>{{strategy.title}}</p>
      <span>{{strategy.created_at | fliterDate}}</span>
    </div> -->
    <div class="left">
      <p class="title"><span></span>{{strategy.title}}</p>
      <p class="time">{{strategy.created_at | fliterDate}}</p>
    </div>
    <div class="right"></div>
  </div>
</template>

<script type="text/ecmascript-6">
export default {
  props: {
    strategy: {
      type: Object,
    },
  },
  filters: {
    fliterDate(val) {
      return val.substring(0, val.length - 3);
    },
  },
  methods: {
    goArticle(id) {
      console.log(id);
      this.$router.push({
        path: `/articledetail/${id}`,
        query: {
          title: '攻略详情',
        },
      });
    },
  },
};
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~common/stylus/mixin';

.strategy-item {
  width: 100%;
  height: 70px;
  background: #f5f5f5;
  border-radius: 5px;
  padding: 15px;
  margin-top: 10px;
  box-sizing: border-box;
  display: flex;
  align-items: center;

  .left {
    flex: 1;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding-right: 20px;
    height: 100%;
    box-sizing: border-box;

    .title {
      display: flex;
      align-items: center;
      font-size: 18px;
      color: #333333;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;

      span {
        display: inline-block;
        width: 13px;
        height: 17px;
        margin-right: 8px;
        background: url('./light.png') no-repeat;
        background-size: cover;
      }
    }

    .time {
      font-size: 14px;
      color: #777777;
    }
  }

  .right {
    height: 16px;
    width: 16px;
    background: url('./arrow-right.png') no-repeat;
    background-size: cover;
  }
}
</style>
