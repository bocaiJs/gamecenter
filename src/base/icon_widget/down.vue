<template>
  <div
    class="down-icon"
    @click="goDown"
  >
    <span class="down"></span>
  </div>
</template>

<script type="text/ecmascript-6">

export default {
  methods: {
    goDown() {
      this.$router.push({
        path: '/down',
      });
    },
  },
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
.down-icon {
  display: flex;
  align-items: center;
  box-sizing: border-box;
  padding: 14px 15px;

  .down {
    display: block;
    width: 16px;
    height: 16px;
    background: url('./down.png') no-repeat;
    background-size: cover;
  }
}
</style>
