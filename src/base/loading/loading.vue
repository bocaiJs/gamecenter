<template>
  <div class="loading">
    <img
      src="./loading.gif"
      :style="{width:size+'px'}"
    >
    <p class="desc">{{title}}</p>
  </div>
</template>
<script type="text/ecmascript-6">
export default {
  name: 'loading',
  props: {
    title: {
      type: String,
      default: '正在加载...',
    },
    size: {
      type: Number,
      default: 80,
    },
  },
};
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~common/stylus/variable';

.loading {
  width: 100%;
  text-align: center;

  .desc {
    line-height: 20px;
    font-size: $font-size-small;
    color: $color-text-l;
  }
}
</style>
