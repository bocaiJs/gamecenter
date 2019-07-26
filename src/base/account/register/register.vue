<template>
  <div class="register">
    <m-header class="border">
      <template slot="header">
        <back-icon></back-icon>
        <p style="padding-right:46px">{{titleText}}</p>
      </template>
    </m-header>
    <input-box
      @getCode="getCode"
      @getUserInfo="registerAccount"
      :btnText="btnText"
      :phoneNo="phoneNo"
      :isLoadingInfo="isLoadingInfo"
      :isInvite="isInvite"
      :showAgreeon="showAgreeon"
    ></input-box>
    <mask-common
      :showMask="showMask"
      :maskInfo="maskInfo"
      @mask="hideMask"
    ></mask-common>
  </div>
</template>

<script type="text/ecmascript-6">
import MHeader from 'components/m-header/m-header';
import { postInfo } from '@/base/api/indexpage/getindexinfo';
import { mapGetters } from 'vuex';
import MaskCommon from '@/base/maskcommon/maskcommon';
import BackIcon from '@/base/icon_widget/arrow_back';
import InputBox from './../inputbox/inputbox';

export default {
  data() {
    return {
      showAgreeon: true,
      titleText: '注册',
      btnText: '确认注册',
      phoneNo: true,
      showMask: false,
      maskInfo: {
        content: '',
        btn: [],
      },
      isLoadingInfo: false,
      isInvite: true,
    };
  },
  methods: {
    getCode(mobile) {
      const smsAddress = '/sms/code';
      postInfo(smsAddress, mobile).then((res) => {
        if (res.status_code === 200) {
          this.showMask = true;
          this.maskInfo.content = '短信发送成功';
          this.maskInfo.btn[0] = {
            btnTitle: '知道了',
            type: 'hide',
          };
        }
      });
    },
    registerAccount(userInfo) {
      if (this.isLoadingInfo) return;
      this.isLoadingInfo = true;
      const registerAddress = '/user/register';
      userInfo.imei = plus.device.imei.split(',')[0];
      userInfo.androidId = this.androidId;
      userInfo.unionId = this.unionId;
      console.log(userInfo);
      postInfo(registerAddress, userInfo).then((res) => {
        this.isLoadingInfo = false;
        console.log(res);
        if (res.status_code === 200) {
          this.showMask = true;
          this.maskInfo.content = '恭喜注册成功';
          this.maskInfo.btn[0] = {
            btnTitle: '知道了',
            type: 'hide',
          };
          this.maskInfo.btn[1] = {
            btnTitle: '前往登录',
            type: 'back',
          };
        } else {
          this.showMask = true;
          this.maskInfo.content = res.message;
          this.maskInfo.btn[0] = {
            btnTitle: '知道了',
            type: 'hide',
          };
        }
      });
    },
    hideMask() {
      this.showMask = false;
    },
  },
  computed: {
    ...mapGetters(['androidId', 'unionId']),
  },
  components: {
    InputBox,
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

.register {
  position: fixed;
  top: 0;
  bottom: 0;
  width: 100%;
  background: #ffffff;
}
</style>
