<template>
  <transition name="slider">
    <div
      class="libao-detail"
      style="height:100%"
    >
      <m-header>
        <template slot="header">
          <arrow-back></arrow-back>
          <p style="padding-right:46px">礼包领取</p>
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
            <div class="title">
              <span class="clock"></span> 限时礼包
            </div>
            <div class="giftbox">
              <div
                class="gift-item"
                v-for="(item,index) in limitList"
                :key="item.id"
              >
                <div class="left">
                  <h5>{{item.title}}</h5>
                  <p class="residue">剩余: {{item.ratio}}</p>
                  <p class="desc">{{item.description}}</p>
                </div>
                <div
                  class="right"
                  :class="{'disable':item.have}"
                  @click="receiveCode(item.id,index,1)"
                >
                  {{item.have===0?"领取":"已领取"}}
                </div>
              </div>
            </div>
            <div class="title">
              <span class="gift"></span> 普通礼包
            </div>
            <div class="giftbox">
              <div
                class="gift-item"
                v-for="(item,index) in generalList"
                :key="item.id"
              >
                <div class="left">
                  <h5>{{item.title}}</h5>
                  <p class="residue">剩余: {{item.ratio}}</p>
                  <p class="desc">{{item.description}}</p>
                </div>
                <div
                  class="right"
                  :class="{'disable':item.have}"
                  @click="receiveCode(item.id,index,2)"
                >
                  {{item.have===0?"领取":"已领取"}}
                </div>
              </div>
            </div>
          </div>
        </scroll>
      </div>
      <mask-game
        :showMask="showMask"
        :maskInfo="maskInfo"
        :dhcode="dhcode"
        :showMoreTip="showMoreTip"
        @mask="hideMask"
        @sure="exchangeGift"
      ></mask-game>
      <div
        class="loading-container"
        v-show="isLoading"
      >
        <loading></loading>
      </div>

    </div>
  </transition>

</template>

<script type="text/ecmascript-6">
import Scroll from '@/base/scroll/scroll';
import Loading from '@/base/loading/loading';
import { mapGetters } from 'vuex';
import ArrowBack from '@/base/icon_widget/arrow_back';
import { postInfo, getCommonInfoHasData } from '@/base/api/indexpage/getindexinfo';// getCommonInfoHasData
import maskInfo from '@/components/m-shop/mask';

export default {
  mixins: [maskInfo],
  data() {
    return {
      id: 0,
      gift_id: 0,
      isLoading: true,
      generalList: [],
      limitList: [],
      canGetGiftCode: true,
      showMask: false,
      type: 1, // 1:限时礼包 2:普通礼包
      index: 0,
    };
  },
  created() {
    this.id = this.$route.query.id;
  },
  mounted() {
    this._getGiftList();
    this.$refs.libao.style.top = (44 + parseInt(this.statusbar)) + 'px';
  },
  methods: {
    _getGiftList() {
      const giftAddress = '/gift/list';
      getCommonInfoHasData(giftAddress, {
        token: this.getToken,
        game_id: this.id,
      }).then((res) => {
        this.isLoading = false;
        this.generalList = res.data.general;
        this.limitList = res.data.limit;
      });
    },
    exchangeGift() {
      const path = '/gift/code/receive';
      postInfo(path, {
        gid: this.gift_id,
        token: this.getToken,
      }).then((res) => {
        console.log(res);
        this.maskInfo.btn = [];
        if (res.status_code === 200) {
          this.showMask = true;
          this.maskInfo.extendtips = '兑换成功';
          this.maskInfo.content = '您的验证码为:';
          this.showMoreTip = true;
          this.maskInfo.btn[0] = {
            btnTitle: '复制',
            type: 'copy',
            theme: 'blue',
          };
          this.dhcode = res.code;
          if (this.type === 1) {
            this.limitList[this.index].have = 1;
          }
          if (this.type === 2) {
            this.generalList[this.index].have = 1;
          }
        } else {
          this.showMask = true;
          this.maskInfo.content = res.message;
          this.maskInfo.extendtips = '兑换失败';
          this.maskInfo.btn[0] = {
            btnTitle: '知道了',
            type: 'hide',
          };
          this.dhcode = '';
        }
      });
    },
    receiveCode(id, index, type) {
      this.gift_id = id;
      this.index = index;
      this.type = type;
      this.exchangeGift();
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
  background: $color-background;

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

        span {
          display: inline-block;
          margin-right: 8px;

          &.clock {
            width: 15px;
            height: 17px;
            background: url('./clock.png') no-repeat;
            background-size: cover;
          }

          &.gift {
            width: 17px;
            height: 17px;
            background: url('./gift.png') no-repeat;
            background-size: cover;
          }
        }
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
              line-height: 21px;
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
