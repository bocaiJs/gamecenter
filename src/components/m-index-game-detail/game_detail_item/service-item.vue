<template>
  <div
    class="service-item"
    :class="{active:isToday}"
  >
    <div class="time"><i></i><span>{{serverInfo.openTime}}</span></div>
    <!-- <span>11-07</span><span>10:00</span> -->
    <div class="line">- - -</div>
    <div class="service-num">{{serverInfo.serverName}}</div>
  </div>
</template>
<script type="text/ecmascript-6">
export default {
  props: {
    serverInfo: {
      type: Object,
    },
  },
  data() {
    return {
      today: 0,
      isToday: false,
    };
  },
  mounted() {
    let mounth = (new Date().getMonth() + 1).toString();
    mounth = mounth.length === 1 ? `0${mounth}` : mounth;
    this.today = `${mounth}-${new Date().getDate()}`;
    if (this.today === this.serverInfo.openTime.substr(0, 5)) {
      this.isToday = true;
    }
  },
};
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
.service-item {
  height: 56px;
  box-sizing: border-box;
  padding: 0 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;

  .service-num {
    width: 76px;
    height: 28px;
    border-radius: 14px;
    box-sizing: border-box;
    border: 1px solid #999999;
    text-align: center;
    line-height: 26px;
    color: #555555;
    font-size: 14px;
  }

  .line {
    color: #999999;
  }

  .time {
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-sizing: border-box;
    width: 142px;
    height: 28px;
    padding: 0 15px;
    border-radius: 14px;
    border: 1px solid #999999;
    color: #555555;

    i {
      width: 16px;
      height: 16px;
      background: url('./clock.png') no-repeat;
      background-size: 16px 16px;
    }
  }

  &.active {
    .service-num {
      border: 1px solid #fe5ba8;
      background: #fe5ba8;
      color: #ffffff;
    }

    .time {
      border: 1px solid #fe5ba8;
      color: #fe5ba8;

      i {
        width: 16px;
        height: 16px;
        background: url('./pinkclock.png') no-repeat;
        background-size: 16px 16px;
      }
    }
  }
}
</style>
