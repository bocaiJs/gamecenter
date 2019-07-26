<template>
  <transition name="slider">
    <div class="change-phone">
      <m-header>
        <template slot="header">
          <back-icon></back-icon>
          <p style="padding-right:46px">{{titleText}}</p>
        </template>
      </m-header>
      <div class="infobox">
        <input
          type="text"
          placeholder="请输入手机号码"
          maxlength='11'
          @blur="checkVal"
          @focus="hideTips"
          :value="userMobile"
          ref="mobile"
        >
        <span class="tips"></span>
      </div>
      <div class="infobox">
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
          @click="getCode"
        >发送验证码</span>
      </div>
      <div
        class="submitbox disable"
        ref="btn"
        @click="changeMobile"
      >
        确认
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
import { postInfo } from '@/base/api/indexpage/getindexinfo';
import MaskCommon from '@/base/maskcommon/maskcommon';
import { mapMutations, mapGetters } from 'vuex';
import BackIcon from '@/base/icon_widget/arrow_back';

export default {
  data() {
    return {
      titleText: '绑定手机',
      userMobile: '',
      isPhone: false,
      cansend: false,
      cansendCode: true, // 是否可以发送验证码
      showMask: false,
      code: '',
      tipsContent: '',
      tipsMessage: false,
      maskInfo: {
        content: '',
        btn: [],
      },
      type: 0, // 0:绑定手机 1：解绑手机
    };
  },
  created() {
    this.userMobile = this.$route.query.mobile;
    if (this.$route.query.mobile.length !== 11) {
      this.titleText = '绑定手机';
      this.type = 0;
    } else {
      this.titleText = '解绑手机';
      this.type = 1;
    }
  },
  mounted() {
    this.$refs.mobile.focus();
  },
  methods: {
    getCode(e) {
      if (!this.cansendCode) return;
      this.cansendCode = false;
      this.userMobile = this.$refs.mobile.value;
      this.isPhone = this._isPhoneNo(this.userMobile);
      if (this.isPhone) {
        //  验证码获取地址
        const smsAddress = '/sms/code';
        //  点击后开始倒计时
        let time = 60;
        e.target.innerHTML = `重新发送(${time})`;
        e.target.className = 'code disable';
        let t = setInterval(() => {
          time = time - 1;
          e.target.innerHTML = `重新发送(${time})`;
          if (time === 0) {
            clearInterval(t);
            this.cansendCode = true;
            e.target.className = 'code';
            e.target.innerHTML = '重新发送';
          }
        }, 1000);
        //  发送获取验证码请求
        postInfo(smsAddress, { mobile: this.userMobile }).then((res) => {
          if (res.status_code === 200) {
            this.showMask = true;
            this.maskInfo.content = '短信发送成功';
            this.maskInfo.btn[0] = {
              btnTitle: '知道了',
              type: 'hide',
            };
          }
        });
      } else {
        this.showTips('手机号码格式有误！');
      }
    },
    checkCode(e) {
      let code = e.target;
      this.code = code.value;
      this.isNull(code, '验证码不能为空!');
      this.canSendMessage();
    },
    checkVal(e) {
      let usernameBox = e.target;
      this.userMobile = usernameBox.value;
      this.isNull(usernameBox, '手机号不能为空!');
      this.isPhone = this._isPhoneNo(this.userMobile);
      if (!this.isPhone) {
        usernameBox.parentNode.children[1].className = 'tips active';
        usernameBox.parentNode.children[1].innerHTML = '请输入正确的手机号码';
      } else {
        usernameBox.parentNode.children[1].className = 'tips';
      }
      this.canSendMessage();
    },
    isNull(dom, val) {
      if (dom.value === '' || dom === null) {
        dom.parentNode.children[1].className = 'tips active';
        dom.parentNode.children[1].innerHTML = val;
      } else {
        dom.parentNode.children[1].className = 'tips';
      }
    },
    hideTips(e) {
      e.target.parentNode.children[1].className = 'tips';
    },
    hideMask() {
      this.showMask = false;
    },
    canSendMessage() {
      if (this.userMobile.length > 0 && this.isPhone && this.code.length > 0) {
        this.$refs.btn.className = 'submitbox';
        this.cansend = true;
      } else {
        this.$refs.btn.className = 'submitbox disable';
        this.cansend = false;
      }
    },
    //  手机号码绑定解绑
    changeMobile() {
      let _this = this;
      if (this.cansend) {
        //  type=0:绑定手机 1：解绑手机
        let address = '';
        if (this.type) {
          address = '/user/mobile/unbind';
        } else {
          address = '/user/mobile/bind';
        }
        //  发送获取验证码请求
        postInfo(address, {
          mobile: this.userMobile,
          token: this.getToken,
          code: this.code,
        }).then((res) => {
          if (res.status_code === 200) {
            this.showTips(res.message);
            if (_this.type) {
              _this.setmobile('');
            } else {
              _this.setmobile(this.userMobile);
            }
            this.$router.back(-1);
          } else {
            this.showTips(res.message);
          }
        });
      }
    },
    showTips(content) {
      plus.nativeUI.toast(content);
    },
    _isPhoneNo(poneInput) {
      let myreg = /^[1][3,4,5,6,7,8,9][0-9]{9}$/;
      if (!myreg.test(poneInput)) {
        return false;
      } else {
        return true;
      }
    },
    ...mapMutations([
      'setmobile',
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

.change-phone {
  position: fixed;
  width: 100%;
  top: 0;
  bottom: 0;
  background: #ffffff;

  .infobox {
    height: 56px;
    width: 100%;
    box-sizing: border-box;
    padding: 0 15px;
    border-bottom: 1px solid #eeeeee;
    position: relative;

    input {
      outline: none;
      width: 50%;
      height: 100%;
      color: #777777;
      text-indent: 20px;
      font-size: $font-size-medium-x;
      font-family: 'PingFang SC', 'STHeitiSC-Light', 'Helvetica-Light', arial, sans-serif, 'Droid Sans Fallback';

      &::placeholder {
        color: #cccccc;
      }
    }

    .code {
      width: 90px;
      height: 100%;
      position: absolute;
      right: 15px;
      top: 0;
      text-align: center;
      line-height: 56px;
      font-size: $font-size-small;
      color: #5bc4e1;

      &.disable {
      }
    }

    .tips {
      position: absolute;
      bottom: 0;
      left: 15px;
      font-size: 12px;
      color: red;
      display: none;
      margin-top: 4px;
      padding-left: 15px;

      &.active {
        display: block;
      }
    }
  }

  .submitbox {
    height: 40px;
    width: 280px;
    background: #1faed6;
    margin: 0 auto;
    margin-top: 20px;
    border-radius: 20px;
    text-align: center;
    line-height: 40px;
    color: #ffffff;

    &.disable {
      background: #cccccc;
    }
  }
}
</style>
