<template>
  <div class="forgetpassword">
    <m-header>
      <template slot="header">
        <back-icon></back-icon>
        <p style="padding-right:46px">{{titleText}}</p>
      </template>
    </m-header>
    <input-box
      @getCode="getCode"
      @getUserInfo="findPassWord"
      :mobile="mobile"
      :btnText="btnText"
      :forget="forget"
      :isLoadingInfo="isLoadingInfo"
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
import MaskCommon from '@/base/maskcommon/maskcommon';
import BackIcon from '@/base/icon_widget/arrow_back';
import { mapGetters } from 'vuex';
import InputBox from './../inputbox/inputbox';


export default {
  data() {
    return {
      titleText: '设置支付密码',
      btnText: '提交',
      showMask: false,
      maskInfo: {
        content: '',
        btn: [],
      },
      forget: true,
      isLoadingInfo: false,
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
    findPassWord(userInfo) {
      if (this.isLoadingInfo) return;
      this.isLoadingInfo = true;
      const getpasswordAddress = '/user/editPayPassword';
      postInfo(getpasswordAddress, {
        token: this.getToken,
        password: userInfo.password,
        code: userInfo.code,
      }).then((res) => {
        this.isLoadingInfo = false;
        if (res.status_code === 200) {
          this.showMask = true;
          this.maskInfo.content = res.message;
          this.maskInfo.btn[0] = {
            btnTitle: '知道了',
            type: 'hide',
          };
        } else {
          this.showTips(res.message);
        }
      });
    },
    showTips(content) {
      plus.nativeUI.toast(content);
    },
    hideMask() {
      this.showMask = false;
    },
  },
  computed: {
    ...mapGetters(['getToken', 'mobile']),
  },
  components: {
    MHeader,
    InputBox,
    MaskCommon,
    BackIcon,
  },
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~common/stylus/variable';
@import '~common/stylus/mixin';

slider();

.forgetpassword {
  position: fixed;
  top: 0;
  bottom: 0;
  width: 100%;
  background: #ffffff;
}
</style>
