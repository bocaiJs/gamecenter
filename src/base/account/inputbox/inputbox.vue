<template>
  <div class="box">
    <div class="f-p-wrapper">
      <div
        class="f-p-box"
        v-if="mobile"
      >
        <input
          type="text"
          readonly
          placeholder="请输入注册的账号/手机号"
          maxlength='30'
          v-model="mobile"
        >
      </div>
      <div
        class="f-p-box"
        v-else
      >
        <input
          type="text"
          placeholder="请输入注册的账号/手机号"
          maxlength='30'
          @blur="checkVal"
          @keyup="checkVal"
        >
        <span class="tips"></span>
      </div>
      <div class="f-p-box">
        <input
          type="password"
          placeholder="请输入密码"
          maxlength='30'
          @blur="checkPassword"
          @keyup="checkPassword"
          v-if="!forget"
        >
        <input
          type="password"
          placeholder="请输入新密码"
          maxlength='30'
          @blur="checkPassword"
          @keyup="checkPassword"
          v-if="forget"
        >
        <span class="tips"></span>
        <span
          class="default"
          @touchstart="showPassword"
        ></span>

      </div>
      <div class="f-p-box">
        <input
          type="password"
          placeholder="请重复确认密码"
          maxlength='30'
          @blur="confirmPassword"
          @keyup="confirmPassword"
          v-if="!forget"
        >
        <input
          type="password"
          placeholder="请重复确认新密码"
          maxlength='30'
          @blur="confirmPassword"
          @keyup="confirmPassword"
          v-if="forget"
        >
        <span class="tips"></span>
        <span
          class="default"
          @touchstart="showPassword"
        ></span>
      </div>
      <div class="f-p-box">
        <input
          type="text"
          placeholder="请输入验证码"
          maxlength='6'
          @blur="checkCode"
          @keyup="checkCode"
        >
        <span class="tips"></span>
        <span
          class="code"
          @touchstart="getCode"
        >发送验证码</span>
      </div>
      <div
        class="f-p-box"
        v-if="isInvite"
      >
        <input
          type="text"
          placeholder="邀请码"
          maxlength='10'
          v-model="invite_code"
        >
      </div>
      <div
        class="agreeon"
        v-if="showAgreeon"
      >
        <span
          class="agreeicon"
          :class="{'active':isAgree}"
          @click="changeAgreeon"
        ></span>已阅并遵守<span
          class="agreement"
          @click="goAgreement"
        >《天橙游玩手游用户协议》</span>
      </div>
      <div class="f-p-box martop30">
        <div
          class="btn active"
          ref='btn'
          @click='getUserInfo'
        >
          {{btnText}}
          <span
            class="login-loading"
            v-show="isLoadingInfo"
          ></span>
        </div>
      </div>
    </div>
    <router-view></router-view>
  </div>
</template>

<script type="text/ecmascript-6">
import { Base64 } from 'js-base64';

export default {
  props: {
    btnText: {
      type: String,
      default: '确认',
    },
    forget: {
      type: Boolean,
      default: false,
    },
    isLoadingInfo: {
      type: Boolean,
      default: false,
    },
    isInvite: {
      type: Boolean,
      default: false,
    },
    mobile: {
      type: String,
      default: '',
    },
    showAgreeon: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      titleText: '找回密码',
      userName: '',
      userpassWord: '',
      confirmpassWord: '',
      code: '',
      cansend: false,
      isPhone: false,
      invite_code: '',
      isAgree: false,
    };
  },
  mounted() {
    if (this.mobile) {
      this.userName = this.mobile;
      this.isPhone = true;
    }
  },
  methods: {
    changeAgreeon() {
      this.isAgree = !this.isAgree;
      this.canSendMessage();
    },
    goAgreement() {
      const url = 'http://tg.yxorange.com/tc/agreeon.html';
      this.$router.push({
        path: '/login/register/agreement',
        query: {
          title: Base64.encode('用户协议'),
          tvurl: url,
        },
      });
    },
    //  检查
    checkVal(e) {
      let usernameBox = e.target;
      this.userName = usernameBox.value;
      this.isNull(usernameBox, '用户名不能为空!');
      this.isPhone = this._isPhoneNo(this.userName);
      if (!this.isPhone) {
        usernameBox.parentNode.children[1].className = 'tips active';
        usernameBox.parentNode.children[1].innerHTML = '用户名必须为手机号';
      } else {
        usernameBox.parentNode.children[1].className = 'tips';
      }
      this.canSendMessage();
    },
    checkPassword(e) {
      let userPassWord = e.target;
      this.userpassWord = userPassWord.value;
      this.isNull(userPassWord, '密码不能为空!');
      this.canSendMessage();
    },
    checkCode(e) {
      let code = e.target;
      this.code = code.value;
      this.isNull(code, '验证码不能为空!');
      this.canSendMessage();
    },
    getUserInfo() {
      if (this.cansend) {
        let userInfo = {
          username: this.userName,
          password: this.userpassWord,
          password1: this.confirmpassWord,
          code: this.code,
        };
        if (this.isInvite) {
          userInfo.invite_code = this.invite_code;
        }
        this.$emit('getUserInfo', userInfo);
      }
    },
    confirmPassword(e) {
      let confirmPassWord = e.target;
      this.confirmpassWord = confirmPassWord.value;
      this.isNull(confirmPassWord, '密码不能为空!');
      if (this.userpassWord !== '' && this.userpassWord !== null && this.confirmpassWord !== '' && this.confirmpassWord !== null) {
        if (this.userpassWord !== this.confirmpassWord) {
          confirmPassWord.parentNode.children[1].className = 'tips active';
          confirmPassWord.parentNode.children[1].innerHTML = '两次输入密码不一致';
        } else {
          confirmPassWord.parentNode.children[1].className = 'tips';
        }
      }
      this.canSendMessage();
    },
    canSendMessage() {
      if (this.userName.length > 0 && this.userpassWord.length > 0 && this.code.length > 0 && this.userpassWord === this.confirmpassWord && this.isPhone) {
        if (this.showAgreeon && this.isAgree === false) {
          this.$refs.btn.className = 'btn active';
          this.cansend = false;
          return;
        }
        this.$refs.btn.className = 'btn';
        this.cansend = true;
      } else {
        this.$refs.btn.className = 'btn active';
        this.cansend = false;
      }
    },
    isNull(dom, val) {
      if (dom.value === '' || dom === null) {
        dom.parentNode.children[1].className = 'tips active';
        dom.parentNode.children[1].innerHTML = val;
      } else {
        dom.parentNode.children[1].className = 'tips';
      }
    },
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
    getCode(e) {
      if (this.isPhone || this.mobile) {
        this.$emit('getCode', { mobile: this.userName });
        let time = 60;
        e.target.innerHTML = `已发送(${time}秒)`;
        e.target.className = 'code active';
        let t = setInterval(() => {
          time = time - 1;
          e.target.innerHTML = `已发送(${time}秒)`;
          if (time === 0) {
            clearInterval(t);
            e.target.className = 'code';
            e.target.innerHTML = '重新发送';
          }
        }, 1000);
      }
    },
    _isPhoneNo(poneInput) {
      let myreg = /^[1][3,4,5,6,7,8,9][0-9]{9}$/;
      if (!myreg.test(poneInput)) {
        return false;
      } else {
        return true;
      }
    },
  },
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~common/stylus/variable';
@import '~common/stylus/mixin';

slider();

.box {
  width: 100%;
  height: 100%;
  padding-top: 40px;

  .f-p-wrapper {
    width: 100%;
    height: 100%;
    padding: 0 15px;
    box-sizing: border-box;

    .agreeon {
      display: flex;
      align-items: center;
      margin-top: 16px;
      margin-left: 10px;
      font-size: 12px;
      color: #999999;

      .agreeicon {
        display: flex;
        height: 16px;
        width: 16px;
        margin-right: 6px;
        background: url('./agree.png') no-repeat;
        background-size: cover;

        &.active {
          background: url('./agreeactive.png') no-repeat;
          background-size: cover;
        }
      }

      .agreement {
        color: #1faed6;
      }
    }

    .f-p-box {
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

      .default {
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

      .code {
        position: absolute;
        right: 0;
        top: 0;
        height: 100%;
        width: 130px;
        border-radius: 5px;
        line-height: 60px;
        text-align: center;
        font-size: 14px;
        color: #1faed6;
      }

      .btn {
        width: 100%;
        height: 50px;
        line-height: 50px;
        border-radius: 25px;
        line-height: 50px;
        font-size: 17px;
        text-align: center;
        background: #ffc400;
        font-size: $font-size-large;
        color: #fefefe;
        background: #1faed6;

        .login-loading {
          display: inline-block;
          width: 15px;
          height: 15px;
          background: url('../login/loading@3x.gif') no-repeat;
          background-size: 100% 100%;
        }

        &.active {
          background: #cccccc;
        }
      }

      .tips {
        font-size: 12px;
        color: red;
        position: absolute;
        left: 12px;
        bottom: 0;
        display: none;

        &.active {
          display: block;
        }
      }
    }
  }
}
</style>
