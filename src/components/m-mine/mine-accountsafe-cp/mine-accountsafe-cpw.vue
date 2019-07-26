<template>
  <transition name="slider">
    <div class="modify-password">
      <m-header>
        <template slot="header">
          <back-icon></back-icon>
          <p style="padding-right:46px">修改支付密码</p>
        </template>
      </m-header>
      <div class="content">
        <div class="mine-box">
          <div class="item">
            <input
              type="password"
              placeholder="请输入原支付密码"
              class="inputbox"
              ref="ori"
              @keyup="check1"
            >
            <p
              class="error ori"
              style="display:none"
              ref="oritips"
            ></p>
          </div>
          <div class="item">
            <input
              type="password"
              placeholder="请输入新支付密码"
              class="inputbox"
              ref="newpossword"
              @keyup="check2"
            >
            <span
              class="default"
              @click="showPassword"
            ></span>
            <p
              class="error new"
              style="display:none"
              ref="newtips"
            ></p>
          </div>
          <div class="item">
            <input
              type="password"
              placeholder="请确认新支付密码"
              class="inputbox"
              @keyup="checkPassword"
              ref="confirmpassword"
            >
            <span
              class="default"
              @click="showPassword"
            ></span>
            <p
              class="error confirm"
              style="display:none"
              ref="confirm"
            ></p>
          </div>
          <button
            class="btn"
            @click="changePassword"
          >修改</button>
        </div>
      </div>
      <mask-common
        :showMask="showMask"
        :maskInfo="maskInfo"
        @mask="hideMask"
      ></mask-common>
      <div
        class="tips"
        v-show="tipsMessage"
      >
        {{tipsContent}}
      </div>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
import MHeader from '@/components/m-header/m-header';
import MaskCommon from '@/base/maskcommon/maskcommon';
import { postInfo } from '@/base/api/indexpage/getindexinfo';
import { mapGetters, mapMutations } from 'vuex';
import { setLocalStorage } from 'common/js/storage';
import BackIcon from '@/base/icon_widget/arrow_back';

export default {
  data() {
    return {
      titleText: '修改登录密111码',
      showMask: false,
      tipsMessage: false,
      tipsContent: '',
      maskInfo: {
        content: '',
        btn: [],
      },
    };
  },
  methods: {
    //  改变密码显示方式
    showPassword(e) {
      let passwordInput = e.target.parentNode.children[0];
      let textType = passwordInput.type;
      if (textType === 'text') {
        passwordInput.type = 'password';
        e.target.className = 'default';
      }
      if (textType === 'password') {
        passwordInput.type = 'text';
        e.target.className = 'default active';
      }
    },
    check1() {
      this.$refs.oritips.style.display = 'none';
      this.$refs.oritips.innerHTML = '';
    },
    check2() {
      this.$refs.newtips.style.display = 'none';
      this.$refs.newtips.innerHTML = '';
    },
    checkPassword() {
      let val1 = this.$refs.newpossword.value;
      let val2 = this.$refs.confirmpassword.value;
      if (val2 === '') {
        this.$refs.confirm.style.display = 'block';
        this.$refs.confirm.innerHTML = '密码不能为空';
        return;
      }
      if (val1 === val2) {
        this.$refs.confirm.style.display = 'none';
      } else {
        this.$refs.confirm.style.display = 'block';
        this.$refs.confirm.innerHTML = '两次输入密码不一致';
      }
    },
    changePassword() {
      const address = '/user/edit-password';
      let val1 = this.$refs.newpossword.value;
      let val2 = this.$refs.confirmpassword.value;
      let val3 = this.$refs.ori.value;
      if (val3 === '') {
        this.$refs.oritips.style.display = 'block';
        this.$refs.oritips.innerHTML = '原始密码不能为空';
        return;
      }
      if (val1 === '') {
        this.$refs.newtips.style.display = 'block';
        this.$refs.newtips.innerHTML = '新密码不能为空';
        return;
      }
      if (val1 === val2) {
        console.log(this.getToken);
        postInfo(address, {
          token: this.getToken,
          old_password: val3,
          password: val1,
          password1: val2,
        }).then((res) => {
          console.log(res);
          if (res.status_code === 200) {
            this.showMask = true;
            this.maskInfo.content = res.message;
            this.settoken('');
            this.userLogout();
            setLocalStorage('token', '');
            setTimeout(() => {
              this.$router.push('/mine');
              this.showMask = false;
            }, 1000);
          } else {
            this.showTips(res.message);
          }
        });
      }
    },
    showTips(content) {
      plus.nativeUI.toast(content);
    },
    hideMask() {
      this.showMask = true;
    },
    ...mapMutations([
      'userLogout',
      'settoken',
    ]),
  },
  computed: {
    ...mapGetters(['getToken']),
  },
  components: {
    MHeader,
    MaskCommon,
    BackIcon,
  },
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~common/stylus/variable';
@import '~common/stylus/mixin';

slider();

.modify-password {
  position: fixed;
  width: 100%;
  top: 0;
  bottom: 0;
  background: #ffffff;

  .content {
    margin-top: 5px;

    .mine-box {
      padding: 0 30px;
      width: 100%;
      box-sizing: border-box;
      position: relative;

      .item {
        position: relative;
        height: 60px;
        border-bottom: 1px solid #cccccc;

        input {
          display: block;
          height: 60px;
          width: 100%;
          line-height: 60px;
          text-indent: 10px;
          outline: none;
          font-size: 16px;
          font-family: 'PingFang SC', 'STHeitiSC-Light', 'Helvetica-Light', arial, sans-serif, 'Droid Sans Fallback';

          &::placeholder {
            font-size: 16px;
            color: #ccc;
          }
        }

        .default {
          position: absolute;
          right: 10px;
          top: 50%;
          transform: translate3d(0, -50%, 0);
          width: 16px;
          height: 16px;
          background: url('../../../common/image/eye-close.png') no-repeat;
          background-size: 100% 100%;

          &.active {
            background: url('../../../common/image/eye-open.png') no-repeat;
            background-size: 100% 100%;
          }
        }

        .error {
          position: absolute;
          left: 10px;
          bottom: 0;
          color: red;
          font-size: 12px;
          line-height: 12px;
          margin-top: 2px;
        }
      }

      .btn {
        width: 100%;
        height: 50px;
        background: #1faed6;
        outline: none;
        border: none;
        border-radius: 25px;
        margin-top: 30px;
        text-align: center;
        line-height: 50px;
        font-size: 16px;
        color: #ffffff;
        position: relative;
        font-family: 'PingFang SC', 'STHeitiSC-Light', 'Helvetica-Light', arial, sans-serif, 'Droid Sans Fallback';
      }
    }
  }
}
</style>

