<template>
  <div class="comment-box">
    <div class="input-box">
      <input
        type="text"
        placeholder="想说点什么"
        v-model="commentValue"
      >
    </div>
    <div
      class="commit-box"
      @click="emitComment"
    >
      发布
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      commentValue: '',
    };
  },
  methods: {
    emitComment() {
      this.$emit('videocomment', this.commentValue);
    },
  },
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~common/stylus/variable';
@import '~common/stylus/mixin';

.comment-box {
  position: fixed;
  bottom: 0;
  width: 100%;
  height: 44px;
  box-sizing: border-box;
  padding: 0 15px;
  display: flex;
  align-items: center;

  .input-box {
    flex: 1;
    height: 100%;
    display: flex;
    align-items: center;

    input {
      width: 100%;
      height: 30px;
      box-sizing: border-box;
      border-radius: 15px;
      outline: none;
      text-indent: 30px;
      position: relative;
      display: block;
      border: 1px solid #ffffff;
      font-size: $font-size-small;
      font-family: 'PingFang SC', 'STHeitiSC-Light', 'Helvetica-Light', arial, sans-serif, 'Droid Sans Fallback';

      &:focus {
        border: 1px solid #ffae00;
      }
    }

    &:before {
      position: absolute;
      content: '';
      width: 12px;
      height: 12px;
      background: url('./xpl@3x.png') no-repeat;
      background-size: cover;
      z-index: 1;
      left: 26px;
    }
  }

  .commit-box {
    width: 56px;
    height: 30px;
    border-radius: 15px;
    background: #ffae00;
    font-size: $font-size-small;
    color: #ffffff;
    text-align: center;
    line-height: 30px;
    margin-left: 10px;
  }
}
</style>

