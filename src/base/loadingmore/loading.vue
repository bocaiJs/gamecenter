<template>
  <div class="loading">
    <p class="desc">{{title}}</p>
    <img
      width="14"
      height="14"
      src="./loading.gif"
    >
  </div>
</template>
<script type="text/ecmascript-6">
export default {
  name: 'loading-more',
  props: {
    title: {
      type: String,
      default: '正在加载...',
    },
  },
};
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~common/stylus/variable';

.loading {
  width: 100%;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;

  .desc {
    line-height: 20px;
    font-size: 12px;
    color: #999999;
    padding-left: 5px;
  }
}
</style>
