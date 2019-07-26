<template>
  <div
    class="back-icon"
    @click="goBack"
  >
    <span class="down"></span>
  </div>
</template>

<script type="text/ecmascript-6">

export default {
  name: 'back-icon',
  props: {
    step: {
      type: String,
      default: '1',
    },
  },
  methods: {
    goBack() {
      if (this.step === '1') {
        this.$router.back(-1);
      }
      if (this.step === '2') {
        this.$router.go(-2);
      }
      if (this.step === '3') {
        this.$emit('back');
      }
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
    background: url('./arrow_back.png') no-repeat;
    background-size: cover;
  }
}
</style>
