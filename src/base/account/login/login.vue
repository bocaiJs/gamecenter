<template>
  <div class="login">
    <m-header class="border">
      <template slot="header">
        <back-icon :step=step></back-icon>
        <p style="padding-right:46px">{{titleText}}</p>
      </template>
    </m-header>
    <div class="loginbox">
      <div class="icon"><img
          src="./icon.png"
          alt=""
        ></div>
      <div class="inputbox">
        <input
          type="text"
          maxlength='20'
          placeholder="请输入账号"
          ref="username"
          @keyup="changgeBtnStatus"
        >
      </div>
      <div class="inputbox">
        <input
          type="password"
          maxlength='32'
          placeholder="请输入密码"
          ref="password"
          @keyup="changgeBtnStatus"
        >
        <span
          class="s-pw"
          @click="showPassWord"
          :class="{active:textType === 'password'}"
        ></span>
      </div>
      <div
        class="inputbox martop30"
        style="border:none"
      >
        <div
          class="btn"
          @click="userLogin"
        >
          <div
            class="bgbox default"
            :class="{ active:nameLength>0 && passwordLength>5}"
          > 登录 <span
              class="login-loading"
              v-show="isLogin"
            ></span></div>
        </div>
      </div>
      <div class="forget-register">
        <div @click="goNextPage('forgetpassword')">忘记密码?</div>
        <div @click="goNextPage('register')">注册账号</div>
      </div>
    </div>
    <transition name="slider">
      <router-view></router-view>
    </transition>
  </div>
</template>

<script type="text/ecmascript-6">
import MHeader from 'components/m-header/m-header';
import { postInfo } from '@/base/api/indexpage/getindexinfo';
import { setLocalStorage } from 'common/js/storage';
import { mapGetters, mapMutations } from 'vuex';
import BackIcon from '@/base/icon_widget/arrow_back';

export default {
  data() {
    return {
      titleText: '登录',
      username: '',
      password: '',
      nameLength: 0,
      passwordLength: 0,
      textType: '',
      step: '1',
      isLogin: false,

    };
  },
  methods: {
    backToMine() {
      this.$router.back(-1);
    },
    userLogin() {
      if (this.isLogin) return;
      this.isLogin = true;
      let username = this.$refs.username.value;
      let password = this.$refs.password.value;
      let goback = this.loginback + 1;
      if (username.length < 4 || password.length < 6) {
        return;
      }
      const loginAddress = '/user/login';
      postInfo(loginAddress, {
        username,
        password,
        imei: plus.device.imei.split(',')[0],
        unionId: window.config,
      }).then((res) => {
        this.isLogin = false;
        if (res.status_code === 200) {
          let backinfo = this.back + 1;
          this.$refs.username.value = '';
          this.$refs.password.value = '';
          this.userLoginState();
          setLocalStorage('token', res.token);
          this.settoken(res.token);
          this.setBack(backinfo);
          this.setLoginback(goback);
          this.$router.back(-1);
          this.$refs.username.value = '';
          this.$refs.password.value = '';
        } else {
          plus.nativeUI.toast(res.message);
        }
      });
    },
    changgeBtnStatus() {
      this.nameLength = this.$refs.username.value.length;
      this.passwordLength = this.$refs.password.value.length;
    },
    goNextPage(val) {
      this.$router.push({
        path: '/login/' + val,
      });
    },
    showTips(content) {
      plus.nativeUI.toast(content);
    },
    showPassWord() {
      let passwordInput = this.$refs.password;
      this.textType = passwordInput.type;
      if (this.textType === 'text') {
        passwordInput.type = 'password';
      }
      if (this.textType === 'password') {
        passwordInput.type = 'text';
      }
    },
    ...mapMutations([
      'setBack',
      'settoken',
      'userLoginState',
      'setLoginback',
    ]),
  },
  watch: {
    $route(to, from) {
      if (from.name === 'Rank') {
        this.step = '2';
      }
    },
  },
  computed: {
    ...mapGetters(['back', 'loginback']),
  },
  components: {
    MHeader,
    BackIcon,
  },
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~common/stylus/variable';
@import '~common/stylus/mixin';

.login {
  position: fixed;
  top: 0;
  bottom: 0;
  width: 100%;
  background: #ffffff;

  .loginbox {
    width: 100%;
    height: 100%;
    padding: 0 15px;
    box-sizing: border-box;

    .icon {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 44px 0;

      img {
        width: 60px;
      }
    }

    .inputbox {
      width: 100%;
      height: 60px;
      background: #ffffff;
      position: relative;
      border-bottom: 1px solid #dddddd;

      &:last-child {
        border: none;
      }

      &.martop30 {
        margin-top: 30px;
      }

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

      .pretext {
        text-align: center;
        position: absolute;
        left: 25px;
        top: 50%;
        color: #ffffff;
        transform: translate3d(0, -50%, 0);
      }

      .s-pw {
        position: absolute;
        right: 25px;
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

      .btn {
        width: 100%;
        height: 50px;
        line-height: 50px;
        border-radius: 25px;
        text-align: center;
        font-size: $font-size-large;
        color: #ffffff;
        position: relative;

        .bgbox {
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
          height: 100%;
          line-height: 50px;
          border-radius: 25px;
          font-size: 17px;
          text-align: center;
          font-weight: normal;
          color: #fefefe;

          .login-loading {
            display: inline-block;
            width: 15px;
            height: 15px;
            background: url('./loading@3x.gif') no-repeat;
            background-size: 100% 100%;
          }

          &.default {
            background: #cccccc;
          }

          &.active {
            background: #1faed6;
          }
        }
      }
    }

    .forget-register {
      width: 100%;
      margin: 0 auto;
      margin-top: 20px;
      font-size: 14px;
      font-weight: bold;
      display: flex;
      justify-content: space-between;
      // padding: 0 20px;
      box-sizing: border-box;
      color: #1faed6;

      div {
        font-weight: bold;
      }
    }
  }

  .backicon {
    position: absolute;
    top: 20px;
    left: 20px;
    padding: 10px;

    .icon {
      display: block;
      height: 16px;
      width: 9px;
      bg-image('../../../common/image/back/back');
      background-size: 9px 16px;
      translate: sacle(1.5);
    }
  }

  .tciocon {
    margin-top: 20px;
    width: 60%;

    img {
      width: 100%;
      display: block;
    }
  }
}
</style>
