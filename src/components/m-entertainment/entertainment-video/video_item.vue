<template>
  <div
    class="video-item"
    @click="goVideoDetail(videoInfo.id)"
  >
    <div class="img-box">
      <img
        :src="videoInfo.thumb"
        alt=""
      >
      <div class="play-icon">
        <img
          src="./triangle.png"
          alt=""
        >
      </div>
    </div>
    <h3>{{videoInfo.title}} </h3>
    <p>
      {{videoInfo.description}}
    </p>
  </div>
</template>
<script type="text/ecmascript-6">
export default {
  props: {
    videoInfo: {
      type: Object,
    },
  },
  methods: {
    goVideoDetail(id) {
      console.log(id);
      this.$router.push({
        path: '/service/video/detail',
        query: {
          id,
        },
      });
    },
  },
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~common/stylus/mixin';

.video-item {
  .img-box {
    width: 100%;
    padding-bottom: 50%;
    background: #e5e5e5;
    height: 0;
    position: relative;

    .play-icon {
      width: 40px;
      height: 40px;
      box-sizing: border-box;
      border-radius: 20px;
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate3d(-50%, -50%, 0);
      border: 1px solid #ffffff;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(0, 0, 0, 0.2);

      img {
        width: 14px;
        height: 16px;
      }
    }

    img {
      width: 100%;
    }
  }

  h3 {
    padding-top: 15px;
    text-indent: 15px;
    font-size: 16px;
    color: #333333;
    font-weight: bold;
  }

  p {
    padding-top: 8px;
    padding-bottom: 20px;
    text-indent: 15px;
    font-size: 14px;
    color: #999999;
    no-wrap();
  }
}
</style>
