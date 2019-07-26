<template>
  <div class="err-tips">
    <img
      src="./nodownload.png"
      alt=""
      v-if="type==1"
    >
    <img
      src="./nogame.png"
      alt=""
      v-if="type==2"
    >
    <img
      src="./nonet.png"
      alt=""
      v-if="type==3"
    >
    <img
      src="./common.png"
      alt=""
      v-if="type==4"
    >
    <p>
      {{tipText}}
    </p>
    <button
      v-if="showButton"
      @click="refresh"
    >
      {{buttonText}}
    </button>
  </div>
</template>
<script type="text/ecmascript-6">

/**
 * *改组件接受三个参数。
 * *@param showButton:是否展示按钮
 * *@param  buttonText 按钮文字
 * *@param tipText:图片下方提示信息
 * *@param  type：展示图片类型 1:没有推荐游戏；2：没有已经下载的游戏:3:没有网
 * */


export default {
  name: 'error-tip',
  methods: {
    refresh() {
      this.$emit('refresh');
    },
  },
  props: {
    showButton: {
      type: Boolean,
      default: false,
    },
    tipText: {
      type: String,
    },
    type: {
      type: Number,
      default: 1,
    },
    buttonText: {
      type: String,
      default: '刷新',
    },
  },
};
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
.err-tips {
  display: flex;
  flex-wrap: wrap;
  flex-direction: column;
  align-items: center;

  img {
    width: 70px;
  }

  p {
    margin-top: 15px;
    margin-bottom: 10px;
    font-size: 16px;
    color: #999999;
  }

  button {
    font-size: 16px;
    color: #1faed6;
    border: 1px solid #1faed6;
    border-radius: 20px;
    box-sizing: border-box;
    padding: 10px 30px;
    background: #ffffff;
    font-weight: bold;
    outline: none;
  }
}
</style>
