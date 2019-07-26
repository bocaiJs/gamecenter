<template>
  <div
    class="back-icon"
    @click="goTip"
  >
    <span class="down"></span>
  </div>
</template>

<script type="text/ecmascript-6">

export default {
  methods: {
    goTip() {
      this.$emit('gotips');
    },
  },
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
.back-icon {
  display: flex;
  align-items: center;
  box-sizing: border-box;
  padding: 14px 15px;

  .down {
    display: block;
    width: 16px;
    height: 16px;
    background: url('./questionmark.png') no-repeat;
    background-size: cover;
  }
}
</style>
