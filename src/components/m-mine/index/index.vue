<template>
  <div class="mine-index">
    <m-header class="linear">
      <template slot="header">
        <p></p>
        <message-icon
          :active=true
          @goMessage="goSubPage('interactioncenter')"
        ></message-icon>
        <config-icon @goConfig="goConfigPage"></config-icon>
      </template>
    </m-header>
    <div class="user-info">
      <div
        class="avatar"
        @click="showAvatarWrapper"
      >
        <img
          v-lazy="avatar"
          alt=""
          v-if="getLoginState"
        >
        <img
          v-else
          src="./default.png"
          alt=""
        >
        <span
          class="vipavatar"
          :class="vipClass"
        ></span>
      </div>
      <div class="info-box">
        <span v-if="getLoginState">{{nickname}}</span>
        <span
          v-else
          style="font-size:14px;color:#999999;text-decoration:underline"
          @click="goLogin"
        >点击登录</span>
        <span class="dj-icon"></span>
        <span class="dj-vip">VIP{{getLoginState?userInfo.vip:0}}</span>
      </div>
      <div
        class="sign-btn"
        :class="{active:!issigin&&getLoginState}"
        @click="sigin"
      >{{isSign}}</div>
    </div>
    <div class="score-box">
      <div class="srore-item">
        <p class="bold red">{{getLoginState?userInfo.score:0}}</p>
        <p>我的积分</p>
      </div>
      <div class="srore-item">
        <p class="bold blue">{{getLoginState?userInfo.vipNextScore:0}}</p>
        <p>升级还需</p>
      </div>
    </div>
    <div class="wallet">
      <div class="w-box">
        <p>钱包余额 <span @click="showTipMaskFun"></span></p>
        <h5>{{userInfo.amountMoney}}</h5>
        <div class="funbtn">
          <button
            class=""
            @click="goSubPage('recharge')"
          >充值</button>
          <button
            class=""
            @click="goSubPage('rechargeDetail')"
          >明细</button>
        </div>
      </div>
    </div>
    <div class="invite-box">
      <div class="desc">
        <h5>邀请好友</h5>
        <p>向好友分享天橙游玩APP可获得500积分</p>
      </div>
      <div
        class="share"
        @click="goSubPage('invite')"
      >去分享</div>
    </div>
    <div class="function-box">
      <div class="function-item">
        <div
          class="item"
          @click="goShop"
        >
          <span class="icon shop"> <span></span></span>
          <span>积分商城</span>
        </div>
        <div
          class="item"
          @click="goSubPage('favorite')"
        >
          <span class="icon collect"></span>
          <span>游戏收藏</span>
        </div>
        <div
          class="item"
          @click="goSubPage('accountsafe')"
        >
          <span class="icon lock"> <span></span></span>
          <span>账号安全</span>
        </div>
      </div>
      <div class="function-item">
        <div
          class="item"
          @click="goSubPage('giftpack')"
        >
          <span class="icon gift"> </span>
          <span>我的礼券</span>
        </div>
        <div
          class="item"
          @click="goSubPage('service')"
        >
          <span class="icon service"></span>
          <span>客服中心</span>
        </div>
        <div
          class="item"
          @click="goSubPage('privilege')"
        >
          <span class="icon menber"></span>
          <span>会员特权</span>
        </div>
      </div>
    </div>
    <change-avatar
      class="avatar-wrapper"
      :class="{active:showAvatar === true}"
      @newAvatar='hideAvatar'
    ></change-avatar>
    <router-view></router-view>
    <mask-common
      :showMask="showMask"
      :maskInfo="maskInfo"
      @mask="hideMask"
    ></mask-common>
    <mask-tip
      tipTitle="平台币说明"
      :tipContent="tipContent"
      :showTipMask="showTipMask"
      @hideTip="hideTipMask"
    ></mask-tip>
  </div>
</template>

<script type="text/ecmascript-6">
import Scroll from '@/base/scroll/scroll';
import { avatarMixin } from 'common/js/mixin';
import { getCommonInfoHasData } from '@/base/api/indexpage/getindexinfo';
import { mapMutations, mapGetters, mapActions } from 'vuex';
import MHeader from 'components/m-header/m-header';
// import MaskCommon from '@/base/maskcommon/maskcommon';
import MaskCommon from '@/base/maskcommon/maskforgame';
import ConfigIcon from '@/base/icon_widget/config';
import MessageIcon from '@/base/icon_widget/message';
import ChangeAvatar from '@/base/changeavatar/changeavatar';

const SIGNIN = '签到';
const UNSIGNIN = '已签到';
export default {
  mixins: [avatarMixin],
  data() {
    return {
      showTipMask: false,
      tipContent: '<p>1、平台币分为：充值平台币（充值）、赠送平台币（平台活动、游戏任务、游戏评论）;</p><p> 2、平台币使用规则：仅可用于充值平台游戏，在平台币充足时代替支付,不足时可以抵消部分充值</p><p>3、注:禁止恶意通过其他路径刷平台币</p>',
      userInfo: {},
      actived: false,
      issigin: false,
      showMask: false,
      maskInfo: {
        content: '',
        btn: [],
      },
      showAvatar: false,
    };
  },
  mounted() {
    if (this.getLoginState) {
      console.log('初始化', this.amountMoney);
      this.$set(this.userInfo, 'vip', this.vip);
      this.$set(this.userInfo, 'nickname', this.nickname);
      this.$set(this.userInfo, 'vipNextScore', this.vipNextScore);
      this.$set(this.userInfo, 'score', this.score);
      this.$set(this.userInfo, 'taskSignIn', this.taskSignIn);
      this.$set(this.userInfo, 'amountMoney', this.amountMoney);
      this.issigin = this.taskSignIn;
    }
  },
  activated() {
    if (!this.getLoginState) {
      this._getUserLoginInfo();
    }
  },
  methods: {
    showTipMaskFun() {
      this.showTipMask = true;
    },
    hideTipMask() {
      this.showTipMask = false;
    },
    // changeMsgInfo(msg) {
    //   this.msgInfo[msg] = 0;
    //   this.setMsgInfo(this.msgInfo);
    // },
    // 获取用户基本信息
    _getUserLoginInfo() {
      const userLoginAddress = '/user/info';
      console.log(this.getToken);
      if (this.getToken === '' || this.getToken === null) {
        console.log('token == dd');
        this.userLogout();
      } else {
        getCommonInfoHasData(userLoginAddress, { token: this.getToken }).then((res) => {
          console.log(res);
          if (!res.status_code) {
            this.actived = true;
            this.userInfo = res.data;
            this.issigin = res.data.taskSignIn;
            this.setUserInfo(res.data);
            this.$set(this.userInfo, 'amountMoney', res.data.amount_money);
          } else {
            this.userLogout();
          }
        });
      }
    },
    changeNickname() {
      if (this.getLoginState) {
        this.$router.push({
          path: '/mine/config/person',
        });
      } else {
        this.goLogin();
      }
    },
    changeAvatar() {
      if (this.getLoginState) {
        this.showAvatarWrapper();
      } else {
        this.goLogin();
      }
    },
    goShop() {
      if (this.getLoginState) {
        this.$router.push({
          path: '/shop',
        });
      } else {
        this.showMask = true;
        this.maskInfo.extendtips = '温馨提示';
        this.maskInfo.content = '用户未登录';
        this.maskInfo.btn[0] = {
          btnTitle: '知道了',
          type: 'hide',
          theme: 'dark',
        };
        this.maskInfo.btn[1] = {
          btnTitle: '去登录',
          type: 'login',
        };
      }
    },
    goLogin() {
      this.$router.push({
        path: '/login',
      });
      this.scroll && this.scroll.destroy();
      console.log(this.scroll);
    },
    goSubPage(url) {
      if (this.getLoginState) {
        this.$router.push({
          path: `/mine/${url}`,
        });
      } else {
        this.showMask = true;
        this.maskInfo.extendtips = '温馨提示';
        this.maskInfo.content = '用户未登录';
        this.maskInfo.btn[0] = {
          btnTitle: '知道了',
          type: 'hide',
          theme: 'dark',
        };
        this.maskInfo.btn[1] = {
          btnTitle: '去登录',
          type: 'login',
        };
      }
    },
    goConfigPage() {
      console.log('配置页面');
      this.$router.push({
        path: '/mine/config',
      });
    },
    canScroll(pos) {
      if (pos.y > 0) {
        this.$refs.scroll.scrollTo(0, 0);
      }
    },
    //  签到
    sigin() {
      if (this.issigin) {
        this.showTips('今日签到任务已完成!');
        return;
      }
      const siginAdd = '/task/signin';
      getCommonInfoHasData(siginAdd, {
        token: this.getToken,
      }).then((res) => {
        if (res.status_code === 200) {
          this.userInfo.vipNextScore = res.vipNextScore;
          this.userInfo.score = res.score;
          this.issigin = true;
          this.showTips('签到成功!');
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
    showAvatarWrapper() {
      if (this.getLoginState) {
        this.showAvatar = true;
      } else {
        this.goLogin();
      }
    },
    ...mapMutations([
      'userLoginState',
      'userLogout',
      'setusername',
      'setnickname',
      'setage',
      'setmobile',
      'setavatar',
      'setsex',
      'setMsgInfo',
    ]),
    ...mapActions([
      'setUserInfo',
    ]),
  },
  watch: {
    back() {
      // console.log('监听到back了，做操作吧小伙子');
      this._getUserLoginInfo();
    },
    $route(to, from) {
      if (from.name === 'Recharge') {
        console.log('我从充值页面回来啦');
        this._getUserLoginInfo();
      }
    },
  },
  computed: {
    vipClass() {
      const vc = `vip${this.userInfo.vip}-img`;
      return vc;
    },
    isSign() {
      let text = '';
      if (this.issigin) {
        text = UNSIGNIN;
      } else {
        text = SIGNIN;
      }
      return text;
    },
    ...mapGetters(['getLoginState', 'getToken', 'avatar', 'statusbar', 'back', 'nickname', 'score', 'vip', 'vipNextScore', 'taskSignIn', 'msgInfo', 'amountMoney']),
  },
  components: {
    Scroll,
    MaskCommon,
    MHeader,
    ConfigIcon,
    ChangeAvatar,
    MessageIcon,
  },
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~common/stylus/variable';
@import '~common/stylus/mixin';

.mine-index {
  position: fixed;
  width: 100%;
  top: 0;
  bottom: 50px;
  background: #ffffff;
  overflow: scroll;

  .user-info {
    height: 50px;
    position: relative;
    display: flex;
    align-items: center;
    box-sizing: border-box;
    padding-left: 100px;

    .sign-btn {
      height: 30px;
      width: 60px;
      border-radius: 15px;
      background: #bbbbbb;
      font-size: 14px;
      color: #ffffff;
      font-weight: bold;
      text-align: center;
      line-height: 30px;
      margin-right: 15px;
      margin-left: 10px;
      display: flex;
      align-items: center;
      justify-content: center;

      &.active {
        background: #fe5ba8;
        color: #ffffff;
      }
    }

    .avatar {
      position: absolute;
      width: 60px;
      height: 60px;
      left: 25px;
      top: -15px;

      img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
      }

      .vipavatar {
        left: 50%;
        transform: translate(-50%, 0);

        &.vip0-img {
          position: absolute;
          width: 60px;
          height: 60px;
          border: 2px solid #ffffff;
          border-radius: 50%;
          top: 0;
        }

        &.vip1-img {
          position: absolute;
          width: 83px;
          height: 70px;
          background: url('./va/1@3x.png') no-repeat;
          background-size: 83px 70px;
          top: -5px;
        }

        &.vip2-img {
          position: absolute;
          width: 66px;
          height: 66px;
          top: -5px;
          background: url('./va/2@3x.png') no-repeat;
          background-size: 66px 66px;
        }

        &.vip3-img {
          position: absolute;
          width: 82px;
          height: 82px;
          top: -10px;
          background: url('./va/3@3x.png') no-repeat;
          background-size: 82px 82px;
        }

        &.vip4-img {
          position: absolute;
          width: 68px;
          height: 69px;
          top: -5px;
          background: url('./va/4@3x.png') no-repeat;
          background-size: 68px 69px;
        }

        &.vip5-img {
          position: absolute;
          width: 82px;
          height: 82px;
          top: -9px;
          background: url('./va/5@3x.png') no-repeat;
          background-size: 82px 82px;
        }

        &.vip6-img {
          position: absolute;
          width: 68px;
          height: 72px;
          top: -9px;
          background: url('./va/6@3x.png') no-repeat;
          background-size: 68px 72px;
        }

        &.vip7-img {
          position: absolute;
          width: 82px;
          height: 80px;
          top: -9px;
          background: url('./va/7@3x.png') no-repeat;
          background-size: 82px 80px;
        }

        &.vip8-img {
          position: absolute;
          width: 73px;
          height: 78px;
          top: -9px;
          background: url('./va/8@3x.png') no-repeat;
          background-size: 73px 78px;
        }

        &.vip9-img {
          position: absolute;
          width: 81px;
          height: 79px;
          top: -9px;
          background: url('./va/9@3x.png') no-repeat;
          background-size: 81px 79px;
        }

        &.vip10-img {
          position: absolute;
          width: 71px;
          height: 77px;
          top: -9px;
          background: url('./va/10@3x.png') no-repeat;
          background-size: 71px 77px;
        }
      }
    }

    .info-box {
      height: 100%;
      flex: 1;
      display: flex;
      flex-wrap: no-wrap;
      align-items: center;

      span {
        &:first-child {
          no-wrap();
          max-width: 140px;
        }
      }

      .dj-icon {
        display: block;
        height: 18px;
        width: 18px;
        background: url('./dj.png') no-repeat;
        background-size: 18px 18px;
        margin: 0 10px;
      }

      .dj-vip {
        font-size: 14px;
        color: #ff8b0f;
        font-weight: bold;
      }
    }
  }

  .score-box {
    display: flex;
    padding: 15px 0;

    .srore-item {
      flex: 1;
      text-align: center;
      height: 34px;
      width: 50px;
      border-right: 1px solid #dddddd;
      padding: 0 0 0 85px;
      box-sizing: border-box;
      font-size: 14px;
      color: #333333;
      display: flex;
      flex-direction: column;
      justify-content: space-between;

      .bold {
        font-weight: bold;
      }

      .red {
        color: #ff3838;
      }

      .blue {
        color: #3d7bce;
      }

      &:last-child {
        padding-left: 0px;
        padding-right: 85px;
        border: 0;
      }
    }
  }

  .wallet {
    border-top: 8px solid #f5f5f5;
    padding: 15px;

    .w-box {
      width: 100%;
      height: 100%;
      background: #1faed6;
      display: flex;
      flex-direction: column;
      align-items: center;
      border-radius: 5px;
      padding-top: 24px;

      p {
        display: flex;
        align-items: center;
        font-size: 16px;
        color: #ffffff;

        span {
          margin-left: 8px;
          display: inline-block;
          width: 16px;
          height: 16px;
          background: url('./tips.png') no-repeat;
          background-size: cover;
        }
      }

      h5 {
        font-size: 24px;
        color: #faf630;
        margin-top: 6px;
      }

      .funbtn {
        width: 200px;
        margin-top: 15px;
        margin-bottom: 24px;
        display: flex;
        justify-content: space-between;
        align-items: center;

        button {
          height: 32px;
          width: 80px;
          border-radius: 16px;
          outline: none;
          border: none;
          background: #63c6e2;
          color: #ffffff;
          font-size: 16px;
        }
      }
    }
  }

  .account-box {
    height: 110px;
    border-top: 8px solid #f5f5f5;
    box-sizing: border-box;
    padding: 0 15px;
    padding-bottom: 10px;
    display: flex;
    justify-content: space-between;

    .item {
      display: flex;
      flex-direction: column;
      align-items: center;
      font-size: 15px;
      color: #333333;

      .icon {
        display: inline-block;
        width: 35px;
        height: 35px;
        margin: 15px 0;
        position: relative;

        .dot {
          position: absolute;
          height: 8px;
          width: 8px;
          border-radius: 50%;
          background: red;
          top: 0;
          right: 0;
        }

        &.message {
          background: url('./a-message.png') no-repeat;
          background-size: 35px 35px;
        }

        &.score {
          background: url('./a-score.png') no-repeat;
          background-size: 35px 35px;
        }

        &.account {
          background: url('./a-account.png') no-repeat;
          background-size: 35px 35px;
        }

        &.favorite {
          background: url('./a-favorite.png') no-repeat;
          background-size: 35px 35px;
        }
      }
    }
  }

  .invite-box {
    border-top: 8px solid #f5f5f5;
    display: flex;
    align-items: center;
    padding: 10px 15px;
    box-sizing: border-box;

    .desc {
      flex: 1;

      h5 {
        font-size: 16px;
        font-weight: bold;
        color: #333333;
      }

      p {
        margin-top: 10px;
        font-size: 14px;
        color: #777777;
      }
    }

    .share {
      width: 60px;
      height: 28px;
      line-height: 28px;
      text-align: center;
      font-size: 14px;
      font-weight: bold;
      color: #ffffff;
      background: #31bec6;
      border-radius: 14px;
    }
  }

  .function-box {
    border-top: 1px solid #f5f5f5;

    .function-item {
      box-sizing: border-box;
      padding: 0 32px;
      margin-top: 10px;
      display: flex;
      justify-content: space-between;

      .item {
        display: flex;
        flex-direction: column;
        align-items: center;
        font-size: 15px;
        color: #333333;
        padding-top: 15px;

        .icon {
          display: inline-block;
          width: 36px;
          height: 31px;
          position: relative;
          margin-bottom: 10px;

          .dot {
            position: absolute;
            height: 8px;
            width: 8px;
            border-radius: 50%;
            background: red;
            top: 3px;
            right: 10px;
          }

          &.shop {
            background: url('./f-shop.png') no-repeat;
            background-size: 36px 31px;
          }

          &.mission {
            background: url('./f-mission.png') no-repeat;
            background-size: 36px 31px;
          }

          &.notice {
            background: url('./f-notice.png') no-repeat;
            background-size: 36px 31px;
          }

          &.collect {
            background: url('./collect.png') no-repeat;
            background-size: 36px 31px;
          }

          &.lock {
            background: url('./f-lock.png') no-repeat;
            background-size: 29px 31px;
          }

          &.gift {
            background: url('./f-gift.png') no-repeat;
            background-size: 32px 32px;
          }

          &.service {
            background: url('./f-service.png') no-repeat;
            background-size: 36px 31px;
          }

          &.menber {
            background: url('./f-menber.png') no-repeat;
            background-size: 36px 31px;
          }
        }
      }
    }
  }

  .avatar-wrapper {
    opacity: 0;
    display: none;
    z-index: -1;
    transition: all 0.3s;

    &.active {
      display: block;
      opacity: 1;
      z-index: 10;
    }
  }
}
</style>
