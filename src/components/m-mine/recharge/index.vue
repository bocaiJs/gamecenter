<template>
  <transition name="slider">
    <div class="recharge">
      <m-header>
        <template slot="header">
          <back-icon></back-icon>
          <p>充值</p>
          <div class="right-button"></div>
        </template>
      </m-header>
      <div class="recharge-box">
        <p class="title">选择充值金额</p>
        <div class="item">
          <span
            :class="{active:amount === 10}"
            @click="seleteAmount(10)"
          >10元</span>
          <span
            @click="seleteAmount(20)"
            :class="{active:amount === 20}"
          >20元</span>
          <span
            @click="seleteAmount(50)"
            :class="{active:amount === 50}"
          >50元</span>
        </div>
        <div class="item">
          <span
            @click="seleteAmount(100)"
            :class="{active:amount === 100}"
          >100元</span>
          <span
            @click="seleteAmount(500)"
            :class="{active:amount === 500}"
          >500元</span>
          <span
            @click="seleteAmount(1000)"
            :class="{active:amount === 1000}"
          >1000元</span>
        </div>
        <input
          type="number"
          placeholder="请输入自定义金额"
          v-model="amount"
        >
        <p class="blue">1元人民币=1平台币</p>
        <p class="gray">平台币仅限于本平台使用</p>
        <p
          class="title"
          style="margin-top:40px"
        >请选择充值方式</p>
        <div class="paywaybox">
          <div
            class="payway"
            @click="changePayWay(1)"
          >
            <img
              src="./wx.png"
              alt=""
            >
            <p>微信支付</p>
          </div>
          <div
            class="payway"
            @click="changePayWay(2)"
          >
            <img
              src="./zfb.png"
              alt=""
            >
            <p>支付宝支付</p>
          </div>
        </div>
        <p class="tips"> <span></span>充值后不提供退款服务</p>
      </div>
      <router-view></router-view>
    </div>
  </transition>
</template>

<script>
import MHeader from 'components/m-header/m-header';
import BackIcon from '@/base/icon_widget/arrow_back';
import { mapGetters } from 'vuex';
import Toast from '@/base/Toast';
import { host } from '@/base/api/config';

export default {
  components: {
    MHeader,
    BackIcon,
    Toast,
  },
  data() {
    return {
      amount: 10,
      pay_type: 1, // 1：微信，2：支付宝
    };
  },
  methods: {
    changePayWay(i) {
      this.pay_type = i;
      this.pay();
    },
    seleteAmount(amount) {
      this.amount = parseInt(amount);
    },
    pay() {
      const url = `${host}/user/pay?token=${this.getToken}&amount=${this.amount}&pay_type=${this.pay_type}`;
      this.$router.push({
        path: '/mine/recharge/pay',
        query: {
          tvurl: url,
        },
      });
    },
  },
  computed: {
    ...mapGetters(['getToken']),
  },
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~common/stylus/variable';
@import '~common/stylus/mixin';

opacity();

.recharge {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background: #ffffff;

  .recharge-box {
    position: relative;
    // top: 68px;
    // bottom: 0;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;

    .title {
      font-size: 16px;
      font-weight: bold;
      color: #1faed6;
      margin-bottom: 24px;
    }

    .item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 300px;
      margin-bottom: 20px;

      span {
        display: inline-block;
        height: 70px;
        width: 70px;
        border-radius: 50%;
        background: #f5f5f5;
        line-height: 70px;
        text-align: center;
        font-size: 16px;
        color: #333333;
        font-weight: bold;

        &.active {
          background: #1faed6;
          color: #ffffff;
        }
      }
    }

    .paywaybox {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 240px;

      .payway {
        display: flex;
        flex-direction: column;
        align-items: center;

        img {
          width: 44px;
          height: 44px;
        }
      }
    }

    input {
      width: 200px;
      height: 44px;
      border-radius: 22px;
      background: #f5f5f5;
      text-align: center;
      font-size: 18px;
      color: #333333;
      outline: none;

      &::placeholder {
        font-size: 18px;
        color: #999999;
      }
    }

    p {
      margin-top: 10px;

      &.blue {
        color: #1faed6;
      }

      &.gray {
        color: #999999;
      }

      &.tips {
        display: flex;
        align-items: center;
        font-size: 14px;
        margin-top: 80px;
        color: #999999;

        span {
          margin-right: 6px;
          display: inline-block;
          width: 14px;
          height: 14px;
          background: url('./tips.png') no-repeat;
          background-size: cover;
        }
      }
    }
  }
}
</style>
