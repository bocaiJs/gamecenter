<template>
  <div class="serch-recomment-item">
    <div
      class="item"
      @click="selectGameName(name)"
      v-for="name in fuzzy"
      :key="name"
    >
      <i></i>
      <p>{{name}}</p>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
export default {
  props: {
    fuzzy: {
      type: Array,
    },
  },
  methods: {
    selectGameName(val) {
      this.$emit('selectGameName', val);
    },
  },
};
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
.serch-recomment-item {
  box-sizing: border-box;
  padding: 15px 15px;

  .item {
    display: flex;
    align-items: center;
    border-bottom: 1px solid #eeeeee;
    box-sizing: border-box;
    padding: 8px 0;

    i {
      width: 14px;
      height: 14px;
      background: url('./plane.png') no-repeat;
      background-size: cover;
    }

    p {
      text-indent: 10px;
      font-size: 14px;
      color: #333333;
    }
  }
}
</style>
