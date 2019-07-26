<template>
  <transition name="slider">
    <div
      class="libao-detail"
      style="height:100%"
    >
      <m-header>
        <template slot="header">
          <arrow-back></arrow-back>
          <p>代金券领取</p>
          <div class="right-button">
            <span
              class="info-tip"
              @click="showTips"
            ></span>
          </div>
        </template>
      </m-header>
      <div
        class="libao-list"
        v-show="!isLoading"
        ref="libao"
      >
        <scroll
          class="libao-warpper"
          ref="giftScroll"
        >
          <div style="min-height:100%">
            <vouchers-gift
              v-for="(item,index) in ticketList"
              :key="index"
              :gift=item
              @getTicket="getTicket"
            ></vouchers-gift>
          </div>
        </scroll>
      </div>
      <div
        class="loading-container"
        v-show="isLoading"
      >
        <loading></loading>
      </div>
      <mask-tip
        tipTitle="代金券说明"
        :tipContent="tipContent"
        :showTipMask="showTipMask"
        @hideTip="hideTipMask"
      ></mask-tip>

    </div>
  </transition>

</template>

<script type="text/ecmascript-6">
import Scroll from '@/base/scroll/scroll';
import Loading from '@/base/loading/loading';
import { mapGetters } from 'vuex';
import ArrowBack from '@/base/icon_widget/arrow_back';
import { getCommonInfoHasData } from '@/base/api/indexpage/getindexinfo';
import VouchersGift from './vouchers';


export default {
  data() {
    return {
      id: 0,
      isLoading: true,
      ticketList: [],
      showTipMask: false,
      tipContent: '<p>1、礼券分为：活动礼券为全平台使用（优惠力度大）、基础礼券为指定游戏使用（优惠一般）;</p><p>2、礼券使用规则为，仅可用于游戏内，在充值条件满足时可使用,不满足条件无法使用;</p><p>每张礼券仅可使用一次</p>',
      buttonText: '去兑换',
      tipText: '没有兑换的礼包',
      cansend: true,
    };
  },
  created() {
    this.id = this.$route.query.id;
  },
  mounted() {
    this._getTicletList();
    this.$refs.libao.style.top = (44 + parseInt(this.statusbar)) + 'px';
  },
  methods: {
    getTicket(id) {
      if (!this.cansend) return;
      this.cansend = false;
      const giftAddress = '/shop/coupon';
      getCommonInfoHasData(giftAddress, {
        token: this.getToken,
        id,
      }).then((res) => {
        this.cansend = true;
        this.ticketList.forEach((item) => {
          if (item.id === id) {
            console.log(item);
            item.status_type = 1;
          }
        });
        plus.nativeUI.toast(res.message);
      });
    },
    showTips() {
      this.showTipMask = true;
    },
    hideTipMask() {
      this.showTipMask = false;
    },
    _getTicletList() {
      const giftAddress = '/shop/couponList';
      getCommonInfoHasData(giftAddress, {
        game_id: this.id,
        token: this.getToken,
      }).then((res) => {
        console.log(res);
        console.log(res.data);
        this.ticketList = res.data;
        this.isLoading = false;
      });
    },
    // 刷新scroll 组件
    refreshScroll() {
      this.$refs.giftScroll.updateScroll();
    },
  },
  computed: {
    ...mapGetters(['getToken', 'statusbar']),
  },
  components: {
    Scroll,
    Loading,
    ArrowBack,
    VouchersGift,
  },
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~common/stylus/variable';
@import '~common/stylus/mixin';

slider();

.libao-detail {
  position: fixed;
  top: 0;
  bottom: 0;
  width: 100%;
  background: #ffffff;

  .info-tip {
    display: inline-block;
    width: 16px;
    height: 16px;
    background: url('./infoTip.png') no-repeat;
    background-size: cover;
  }

  .libao-list {
    sub-position();
    top: 68px;

    .libao-warpper {
      height: 100%;
      overflow: hidden;

      .title {
        width: 130px;
        height: 40px;
        margin: 16px 0;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 18px;
        font-wight: bold;
        color: #ffffff;
        background: #1faed6;
        border-top-right-radius: 20px;
        border-bottom-right-radius: 20px;
      }

      .giftbox {
        margin: 0 15px;
        background: #ffffff;
        min-height: 200px;
        border-radius: 10px;

        .gift-item {
          display: flex;
          align-items: center;
          box-sizing: border-box;
          padding: 15px;
          position: relative;

          &::after {
            position: absolute;
            content: '';
            bottom: 0;
            left: 15px;
            right: 15px;
            height: 1px;
            background: #eeeeee;
          }

          .left {
            flex: 1;
            overflow: hidden;

            h5 {
              font-size: 16px;
              color: #333333;
              font-weight: bold;
            }

            .residue {
              margin: 10px 0;
              font-size: 14px;
              color: #1faed6;
            }

            .desc {
              font-size: 14px;
              color: #333333;
            }
          }

          .right {
            width: 80px;
            height: 36px;
            font-size: 16px;
            font-weight: bold;
            border-radius: 18px;
            background: #1faed6;
            line-height: 36px;
            text-align: center;
            color: #ffffff;

            &.disable {
              background: #dddddd;
            }
          }
        }
      }
    }
  }

  .loading-container {
    loading();
    z-index: 99999;
  }
}
</style>
