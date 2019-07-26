<template>
  <transition name="slider">
    <div class="account-safe">
      <m-header>
        <template slot="header">
          <back-icon></back-icon>
          <p>账号安全</p>
          <div class="right-button"></div>
        </template>
      </m-header>
      <div class="account-box">
        <router-link
          class="account-item"
          to="/mine/accountsafe/password"
          tag="div"
        >
          <p>登陆密码</p>
          <div class="right">
            修改<div class="arrow"></div>
          </div>
        </router-link>
      </div>
      <div class="account-box">
        <router-link
          class="account-item"
          to="/mine/accountsafe/paypassword"
          tag="div"
        >
          <p>支付密码</p>
          <div class="right">
            修改<div class="arrow"></div>
          </div>
        </router-link>
      </div>
      <router-view></router-view>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
import MHeader from 'components/m-header/m-header';
import BackIcon from '@/base/icon_widget/arrow_back';

export default {
  data() {
    return {
      titleText: '账号安全',
    };
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

slider();

.account-safe {
  position: fixed;
  width: 100%;
  top: 0;
  bottom: 0;
  background: #ffffff;

  .account-box {
    .account-item {
      height: 60px;
      border-bottom: 1px solid #eeeeee;
      display: flex;
      align-items: center;
      padding: 0 15px;
      position: relative;

      .right {
        position: absolute;
        right: 15px;
        display: flex;
        height: 100%;
        align-items: center;
        color: #9b9b9b;

        .arrow {
          width: 9px;
          height: 16px;
          bg-image('rightArrow');
          background-size: 9px 16px;
          margin-left: 10px;
        }
      }
    }
  }
}
</style>

