<template>
  <div
    class="search-icon"
    @click="doSearch"
  >
    <span class="down"></span>
  </div>
</template>

<script type="text/ecmascript-6">

export default {
  name: 'search-icon',
  methods: {
    doSearch() {
      this.$emit('search');
    },
  },
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
.search-icon {
  display: flex;
  align-items: center;
  box-sizing: border-box;
  padding: 14px 15px;

  .down {
    display: block;
    width: 16px;
    height: 16px;
    background: url('./search_icon.png') no-repeat;
    background-size: cover;
  }
}
</style>
