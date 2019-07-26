<template>
  <div
    class="config-icon"
    @click="goMessage"
  >
    <span
      class="config"
      :class="{active:msgInfo.new_msg}"
    ></span>
  </div>
</template>

<script type="text/ecmascript-6">
import { mapGetters } from 'vuex';

export default {
  methods: {
    goMessage() {
      this.$emit('goMessage');
    },
  },
  computed: {
    ...mapGetters(['msgInfo']),
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
    position: relative;
    background: url('./message.png') no-repeat;
    background-size: cover;

    &.active {
      &:after {
        content: '';
        position: absolute;
        width: 8px;
        height: 8px;
        border-radius: 4px;
        background: red;
        right: 0;
        top: 0;
      }
    }
  }
}
</style>
