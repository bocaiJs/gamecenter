<template>
  <div class="score-item">
    <div class="score-info">
      <p>{{score.source}}</p>
      <p>{{score.created_at}}</p>
    </div>
    <div
      class="detail"
      :class="{reduce:isReduce}"
    >
      {{score.score}}
    </div>
  </div>
</template>
<script>

export default {
  props: {
    score: {
      type: Object,
    },
  },
  data() {
    return {
      isReduce: false,
    };
  },
  mounted() {
    this.checkReduce();
  },
  methods: {
    checkReduce() {
      if (parseInt(this.score.score) < 0) {
        this.isReduce = true;
      }
    },
  },
};
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
.score-item {
  width: 100%;
  height: 60px;
  box-sizing: border-box;
  padding: 0 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #eeeeee;

  .detail {
    font-size: 18px;
    color: #fe5ba8;

    &.reduce {
      color: #4a84d1;
    }
  }

  .score-info {
    font-size: 18px;
    color: 333333;

    p {
      &:last-child {
        margin-top: 6px;
        font-size: 13px;
        color: #999999;
      }
    }
  }
}
</style>
