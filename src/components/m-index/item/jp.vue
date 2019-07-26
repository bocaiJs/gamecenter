<template>
  <div
    class="jp-item"
    @click="goGameDetail(jgItem.id)"
  >
    <div class="title">{{jgItem.description}}</div>
    <div class="image-box">
      <img
        :src="jgItem.banner"
        alt=""
      >
    </div>
    <bottom-item :buttonInfo=jgItem></bottom-item>
  </div>
</template>
<script type="text/ecmascript-6">
import BottomItem from './jp_bottom_item';

export default {
  props: {
    jgItem: {
      type: Object,
    },
  },
  components: {
    BottomItem,
  },
  methods: {
    goGameDetail(id) {
      this.$router.push({
        path: `/gamedetail/${id}`,
      });
    },
  },
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~common/stylus/variable';
@import '~common/stylus/mixin';

.jp-item {
  padding: 20px 15px;
  padding-top: 15px;
  border-bottom: 1px solid #eeeeee;
  background: #ffffff;

  &:first-child {
    padding-top: 0;
  }

  .title {
    padding-top: 5px;
    color: #555555;
    font-size: 16px;
    margin-bottom: 15px;
    no-wrap();
  }

  .image-box {
    position: relative;
    width: 100%;
    padding-bottom: 50%;
    background: #e7e9ff;
    border-radius: 5px;
    overflow: hidden;

    img {
      position: absolute;
      top: 0;
      left: 0;
      display: block;
      width: 100%;
      height: 100%;
    }
  }
}
</style>
