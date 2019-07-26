<template>
  <div class="slider-item">
    <div
      class="content"
      @touchstart='touchStart'
      @touchmove='touchMove'
      @touchend='touchEnd'
      :style="deleteSlider"
    >
      <div
        class="content-avatar"
        :class="{active:info.new_status}"
      >
        <img
          v-lazy="info.avatar"
          alt=""
        >
      </div>
      <p class="content-comment">
        "{{info.name}}"
        <span v-if="newtype">回复了你的游戏评论</span>
        <span v-else>赞了你</span>
      </p>
      <div class="content-date">
        {{time}}
      </div>
      <div class="remove">删除</div>
    </div>
  </div>
</template>
<script>
// 获取删除按钮的宽度，此宽度为滑块左滑的最大距离
const DELBTNWIDTH = 60;
export default {
  props: {
    info: {
      type: Object,
    },
    newtype: {
      type: [String, Number],
      default: '1',
    },
    index: {
      type: Number,
    },
  },
  data() {
    return {
      startX: 0, // 触摸位置
      startY: 0,
      endX: 0, // 结束位置
      moveX: 0, // 滑动时的位置
      moveY: 0,
      disX: 0, // 移动距离
      disY: 0, // 纵向移动距离
      deleteSlider: 'transform:translateX(0px)',
      time: '',
      screenWidth: 0,
    };
  },
  mounted() {
    this.formatTime();
    this.screenWidth = document.body.clientWidth;
  },
  methods: {
    formatTime() {
      const time = new Date(this.info.time * 1000);
      this.time = `${time.getFullYear()}/${time.getMonth() + 1}/${time.getDate()}`;
    },
    touchStart(timestamp, ev) {
      ev = ev || event;
      this.startX = 0;
      // tounches类数组，等于1时表示此时有只有一只手指在触摸屏幕
      if (ev.touches.length === 1) {
        // 记录开始位置
        this.startX = ev.touches[0].clientX;
        this.startY = ev.touches[0].clientY;
      }
    },
    touchMove(timestamp, ev) {
      ev = ev || event;
      //   todo: 如果滑动纵向距离大于横向距离 则不管
      if (ev.touches.length === 1) {
        // 滑动时距离浏览器左侧实时距离
        this.moveX = ev.touches[0].clientX;
        this.moveY = ev.touches[0].clientY;
        // 起始位置减去 实时的滑动的距离，得到手指实时偏移距离
        this.disX = this.startX - this.moveX + this.disX;
        if (Math.abs(this.startY - this.moveY) > Math.abs(this.startX - this.moveX)) return;
        // 如果是向右滑动或者不滑动，不改变滑块的位置
        if (this.disX > 0) {
          if (this.disX < 100) {
            this.deleteSlider = 'transform:translateX(-' + this.disX + 'px)';
          } else {
            this.deleteSlider = 'transform:translateX(-100px)';
          }
        } else {
          if (this.disX < -60) {
            this.deleteSlider = 'transform:translateX(60px)';
          } else {
            this.deleteSlider = 'transform:translateX(' + Math.abs(this.disX) + 'px)';
          }
        }
      }
    },
    touchEnd(e) {
      // 如果滑动距离小于10 这判断为点击，后续可加时间判断
      // 从左往右滑动
      if (this.disX <= 0) {
        if (Math.abs(this.disX) < 10) {
          this.$emit('game', this.info.id, this.info.game_id, this.index);
          return false;
        }
        if ((Math.abs(this.disX) < 65 || Math.abs(this.disX) > 55) && e.target.className === 'remove') {
          this.$emit('delete', this.info.id, this.index);
          return false;
        }
        this.deleteSlider = 'transform:translateX(0px)';
        this.disX = 0;
      } else {
        if (Math.abs(this.disX) < 10) {
          this.$emit('game', this.info.id, this.info.game_id, this.index);
          return false;
        }
        if ((Math.abs(this.disX) < 65 || Math.abs(this.disX) > 55) && e.target.className === 'remove') {
          this.$emit('delete', this.info.id, this.index);
          return false;
        }
        this.deleteSlider = 'transform:translateX(-' + DELBTNWIDTH + 'px)';
        this.disX = 60;
      }
      return false;
    },
  },
};
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
.slider-item {
  width: 100%;
  height: 60px;
  border-bottom: 1px solid #eeeeee;
  overflow: hidden;
  display: flex;
  position: relative;

  .content {
    min-width: 100%;
    height: 100%;
    box-sizing: normal-box;
    padding-right: 60px;
    position: relative;
    transition-property: all;
    transition-duration: 0.4s;
    transition-timing-function: cubic-bezier(0, 0.85, 0.72, 0.86);
    transition-delay: 0s;
    display: flex;
    align-items: center;

    .content-avatar {
      width: 30px;
      height: 30px;
      border-radius: 50%;
      margin-left: 15px;

      img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
      }

      &.active {
        position: relative;

        &:before {
          content: '';
          position: absolute;
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background: red;
          top: 0;
          left: 0;
        }
      }

      img {
        width: 100%;
      }
    }

    .content-comment {
      padding-left: 6px;
      flex: 1;
      font-size: 14px;
      color: #333333;
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
      padding-right: 15px;
    }

    .content-date {
      font-size: 12px;
      color: #999999;
      padding-right: 15px;
    }

    .remove {
      position: absolute;
      top: 0;
      right: 0;
      width: 60px;
      height: 60px;
      background: #fe5ba8;
      text-align: center;
      line-height: 60px;
      font-size: 15px;
      color: #ffffff;
    }
  }
}
</style>
