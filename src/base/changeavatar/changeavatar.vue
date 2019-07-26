<template>
  <div
    class="changeavatar"
    @click="hideAvatar"
  >
    <div
      class="box"
      ref="box"
    >
      <div class="title">请选择默认头像</div>
      <div class="avatarpic">
        <div
          class="avataritem"
          v-for="item in 14"
          :key=item
          @click="selectAvatar(item)"
          ref="avatarpic"
        >
          <img
            :src="'./static/avatar/'+item+'.png'"
            alt=""
          >
          <span class="selected"></span>
        </div>
      </div>
      <div class="submitbox">
        <button @click="upDateAvatar">确认头像</button>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import { getLocalStorage } from 'common/js/storage';
import { putInfo } from '@/base/api/indexpage/getindexinfo';

export default {
  data() {
    return {
      avatarIndex: -100,
    };
  },
  mounted() {
    // setTimeout(() => {
    //   this.$refs.box.style.transform = `translate3d(0,${this.$refs.box.clientHeight - 44}px,0)`;
    //   this.$refs.box.style.opacity = '1';
    // }, 200);
  },
  methods: {
    // sex:1 男 ;0:女
    selectAvatar(index) {
      console.log(index);
      const list = this.$refs.avatarpic;
      if (this.avatarIndex >= 0) {
        list[this.avatarIndex].lastChild.style.display = 'none';
      }
      this.avatarIndex = index - 1;
      list[this.avatarIndex].lastChild.style.display = 'block';
    },
    upDateAvatar() {
      const avatarAddress = '/user/avatar';
      putInfo(avatarAddress, {
        avatar: `${this.avatarIndex + 1}.png`,
        token: getLocalStorage('token'),
      }).then((res) => {
        if (res.status_code === 200) {
          this.emitHide(res.avatar);
          plus.nativeUI.toast('头像修改成功');
        }
      });
    },
    hideAvatar(e) {
      if (e.target.className === 'changeavatar avatar-wrapper active') {
        this.emitHide();
      }
    },
    emitHide(avatar) {
      this.$emit('newAvatar', avatar);
    },
  },
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~common/stylus/variable';
@import '~common/stylus/mixin';

.changeavatar {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  top: 0;
  background: rgba(0, 0, 0, 0.5);

  .box {
    width: 100%;
    min-height: 44px;
    background: #ffffff;
    position: absolute;
    bottom: 0;
    border-bottom: 1px #eeeeee solid;
    box-sizing: border-box;
    opacity: 0;

    .title {
      font-size: $font-size-medium-x;
      color: #222222;
      text-align: center;
      line-height: 44px;
    }

    .avatarpic {
      padding: 15px;
      display: flex;
      flex-wrap: wrap;
      box-sizing: border-box;

      .avataritem {
        width: 20%;
        overflow: hidden;
        box-sizing: border-box;
        justify-content: space-between;
        padding: 5px;
        position: relative;

        img {
          display: block;
          width: 100%;
        }

        .selected {
          position: absolute;
          display: block;
          right: 8px;
          bottom: 8px;
          width: 14px;
          height: 14px;
          bg-image('select');
          display: none;
          background-size: 100% 100%;
        }
      }
    }

    .submitbox {
      margin-top: 20px;
      display: flex;
      justify-content: center;
      margin-bottom: 50px;

      button {
        height: 30px;
        width: 70px;
        outline: none;
        margin: 0;
        padding: 0;
        border: none;
        border-top: 1px solid #fffb32;
        border-radius: 15px;
        background: linear-gradient(#fffb7b, #f7e62e, #fed333, #f7ef37);
        box-shadow: 0 2px 5px #474143;
        color: #222222;
        line-height: 30px;
        text-align: center;
        font-size: $font-size-small;
        font-family: 'PingFang SC', 'STHeitiSC-Light', 'Helvetica-Light', arial, sans-serif, 'Droid Sans Fallback';
      }
    }
  }
}
</style>
