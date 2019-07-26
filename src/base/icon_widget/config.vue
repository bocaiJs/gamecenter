<template>
  <div
    class="config-icon"
    @click="goBack"
  >
    <span class="config active"></span>
  </div>
</template>

<script type="text/ecmascript-6">

export default {
  methods: {
    goBack() {
      this.$emit('goConfig');
    },
  },
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
.config-icon {
  display: flex;
  align-items: center;
  box-sizing: border-box;
  padding: 14px 15px;

  .config {
    display: block;
    width: 24px;
    height: 24px;
    background: url('./config.png') no-repeat;
    background-size: cover;
  }
}
</style>
