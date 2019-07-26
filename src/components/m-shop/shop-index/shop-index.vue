<template>
  <transition name="opacity">
    <div class="shop">
      <m-header>
        <template slot="header">
          <back-icon></back-icon>
          <p>{{titleText}}</p>
          <div class="right-button">
            <search-icon @search="goSearch"></search-icon>
          </div>
        </template>
      </m-header>
      <div class="exchange-info">
        <i class="horn"></i>
        <div class="show-exchangeb">
          <div
            class="move-box"
            ref="moveBox"
            v-bind:style="styleObject"
          >
            <p
              v-for='(item,index) in sliderList'
              :key="index+'move'"
            >{{item.title}}</p>
          </div>
          <div
            class="move-box"
            v-bind:style="styleObject"
          >
            <p
              v-for='(item,index) in sliderList'
              :key="index+'copy'"
            >{{item.title}}</p>
          </div>
        </div>
      </div>
      <div class="navbox">
        <router-link
          class="item"
          tag="div"
          to="/shop/allgoods"
        >
          <img src="./all.png">
          <span>全部商品</span>
        </router-link>
        <router-link
          class="item"
          tag="div"
          to="/shop/score"
        >
          <img src="./score.png">
          <span>积分明细</span>
        </router-link>
        <router-link
          class="item"
          tag="div"
          to="/shop/exchangerecord"
        >
          <img src="./exchange.png">
          <span>兑换记录</span>
        </router-link>
        <router-link
          class="item"
          tag="div"
          to="/shop/mission"
        >
          <img src="./mission.png">
          <span>积分任务</span>
        </router-link>
      </div>
      <div
        class="shop-box"
        ref="shopbox"
      >
        <scroll
          class="wrapper"
          ref="shopscroll"
        >
          <div>
            <div class="tab-shop">
              <div class="left">
                <i class="gold"></i>
                我的积分:
                <span class="score">{{score}}</span>
                <i class="rotate"></i>
              </div>
              <div
                class="right"
                @click="changeOrder"
              >
                {{order === 1?"降序":"升序"}}<span class="order"></span>
              </div>
            </div>
            <div class="hot-exchange">热门兑换</div>
            <div class="shop-info">
              <goods-list
                :goodsInfo="hotGoodsList"
                @goGoodsDetail="goGoodsDetail"
              ></goods-list>
            </div>
          </div>
        </scroll>
      </div>
      <router-view></router-view>
      <mask-game
        :showMask="showMask"
        :maskInfo="maskInfo"
        :dhcode="dhcode"
        :showMoreTip="showMoreTip"
        @mask="hideMask"
        @sure="exchangeGoods"
      ></mask-game>
    </div>
  </transition>

</template>

<script type="text/ecmascript-6">
import MHeader from 'components/m-header/m-header';
import Loading from '@/base/loading/loading';
import Scroll from '@/base/scroll/scroll';
import { swiper, swiperSlide } from 'vue-awesome-swiper';
import { getCommonInfoHasData, getCommonInfo } from '@/base/api/indexpage/getindexinfo';
import { mapGetters } from 'vuex';
import BackIcon from '@/base/icon_widget/arrow_back';
import SearchIcon from '@/base/icon_widget/search_info';
import LoadingMore from '@/base/loadingmore/loading';
import 'swiper/dist/css/swiper.css';
import GoodsList from '../goodslist/goodslist';
import maskInfo from '../mask';

export default {
  mixins: [maskInfo],
  data() {
    return {
      hotGoodsList: [],
      canSlider: true,
      gameType: {},
      isloading: true,
      titleText: '商城',
      virtual: [],
      order: 0, //  0：asc升序从小到大 1：降序从大到小 desc
      deg: 0,
      showMask: false,
      swiperOption: {
        notNextTick: true,
        direction: 'vertical',
        autoplay: true,
        loop: true,
        height: 50,
        observer: true,
        observeParents: true,
      },
      tabIndex: 0, // 是否获
      goods_type: 2, // goods_type ： 1 实物 2 虚拟
      sliderList: [],
      styleObject: {
        transform: 'translate3d(0px,0,0)',
      },
      moveInverval: null,
    };
  },
  mounted() {
    this.getHotGoods();
    this.getPrizeInfo();
    this.$refs.shopbox.style.top = (202 + parseInt(this.statusbar)) + 'px';
  },
  activated() {
    this.initMove();
  },
  deactivated() {
    this.clearMove();
  },
  methods: {
    getHotGoods() {
      const url = '/shop/hotGoodList';
      getCommonInfoHasData(url, { token: this.getToken }).then((res) => {
        console.log(res);
        this.hotGoodsList = res.goodsList;
        console.log(this.hotGoodsList);
      });
    },
    changeOrder() {
      this.order = this.order === 0 ? 1 : 0;
      if (this.order) {
        this.hotGoodsList.sort((a, b) => (a.count - b.count));
      } else {
        this.hotGoodsList.sort((a, b) => (b.count - a.count));
      }
    },
    initMove() {
      window.clearInterval(this.moveInverval);
      const speed = 30; // 数字越大速度越慢
      const boxWidth = this.$refs.moveBox.clientWidth;
      let moveDistance = 0;
      this.moveInverval = setInterval(() => {
        this.styleObject.transform = `translate3d(${moveDistance}px,0,0)`;
        if (Math.abs(moveDistance) >= boxWidth) {
          moveDistance = 0;
        }
        moveDistance--;
      }, speed);
    },
    clearMove() {
      window.clearInterval(this.moveInverval);
      this.moveInverval = null;
    },
    goLogin() {
      this.$router.push({
        path: '/login',
        query: {
          backtime: 2,
        },
      });
    },
    goScoreDetail() {
      if (this.getLoginState) {
        this.$router.push({
          path: '/shop/score',
        });
      }
    },
    refreshScroll() {
      setTimeout(() => {
        this.$refs.shopscroll.updateScroll();
      }, 20);
    },
    // 获取中奖信息
    getPrizeInfo() {
      const url = '/shop/goodsPrize';
      getCommonInfo(url).then((res) => {
        console.log(res);
        this.sliderList = res.data;
        this.$nextTick(() => {
          this.initMove();
        });
      });
    },
    onSearchPackage(val) {
      console.log(val);
    },
    goSearch() {
      this.$router.push('/shop/search');
    },
    goDetail(id) {
      this.$router.push({
        path: `shop/detail/${id}`,
        params: {
          id,
        },
      });
    },
    changeTabIndex(index) {
      this.tabIndex = index;
      if (index === 0) {
        this.goods_type = 2;
      } else {
        this.goods_type = index;
      }
      this.refreshScroll();
    },
  },
  destroyed() {
    console.log('页面销毁');
    this.clearMove();
  },
  computed: {
    ...mapGetters(['statusbar', 'getToken', 'getLoginState', 'loginback', 'score']),
  },
  components: {
    MHeader,
    Loading,
    Scroll,
    swiper,
    swiperSlide,
    GoodsList,
    BackIcon,
    SearchIcon,
    LoadingMore,
    // MaskGame,
  },
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~common/stylus/variable';
@import '~common/stylus/mixin';

opacity();

.shop {
  position: fixed;
  top: 0;
  bottom: 0;
  width: 100%;
  background: #ffffff;

  .exchange-info {
    width: 100%;
    height: 50px;
    box-sizing: border-box;
    padding: 0 15px;
    background: #f6f6f6;
    display: flex;
    align-items: center;

    .swiper-container {
      z-index: 0;
    }

    .horn {
      width: 22px;
      height: 22px;
      background: url('./b.png') no-repeat;
      background-size: 22px 22px;
      padding-right: 10px;
    }

    .show-exchangeb {
      flex: 1;
      height: 100%;
      box-sizing: border-box;
      padding-left: 15px;
      overflow: hidden;
      display: flex;
      display: -webkit-box;
      flex-wrap: nowrap;

      .move-box {
        height: 100%;
        width: auto;
        display: flex;
        display: -webkit-box;
        align-items: center;

        p {
          word-break: keep-all;
          white-space: nowrap;
          line-height: 50px;
          padding-right: 10px;
        }
      }

      .swiper-slide {
        display: flex;
        align-items: center;
        justify-content: space-between;

        .info {
          font-size: 14px;
          color: #333333;
          flex: 1;
          box-sizing: border-box;
          padding-right: 15px;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }

        .phone {
          font-size: 12px;
          color: #777777;
          max-width: 75px;
        }
      }
    }
  }

  .navbox {
    height: 100px;
    border-bottom: 8px solid #f5f5f5;
    display: flex;
    align-items: center;
    justify-content: space-between;
    box-sizing: border-box;
    padding: 0 20px;

    .item {
      display: flex;
      flex-direction: column;
      align-items: center;
      font-family: 16px;
      color: #333333;

      img {
        width: 35px;
        height: 35px;
        margin-bottom: 8px;
      }
    }
  }

  .shop-box {
    position: fixed;
    top: 226px;
    bottom: 0;
    width: 100%;
    background: #ffffff;

    .wrapper {
      height: 100%;
      overflow: hidden;

      .tab-shop {
        height: 56px;
        box-sizing: border-box;
        padding: 0 15px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        border-bottom: 1px solid #f5f5f5;

        .left {
          display: flex;
          font-display: 18px;
          color: #333333;

          .gold {
            display: inline-block;
            width: 16px;
            height: 16px;
            margin-right: 5px;
            border-radius: 50%;
            background: url('./gold.png') no-repeat;
            background-size: cover;
          }

          .score {
            color: #ff4646;
          }

          .rotate {
            display: inline-block;
            width: 16px;
            height: 16px;
            margin-left: 5px;
            border-radius: 50%;
            background: url('./rotate.png') no-repeat;
            background-size: cover;
          }
        }

        .right {
          display: flex;
          align-items: center;
          font-size: 14px;
          color: #3d7bce;

          .order {
            display: inline-block;
            width: 16px;
            height: 16px;
            margin-left: 4px;
            background: url('./order.png') no-repeat;
            background-size: cover;
          }
        }
      }

      .s-b-t {
        display: flex;
        height: 100px;
        box-shadow: 0px 2px 2px #cccccc;
        border-top: 1px solid #eeeeee;

        .item {
          flex: 1;
          height: 100%;
          border-right: 1px solid #eeeeee;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;

          &:last-child {
            border: none;
          }

          .icon {
            width: 36px;
            height: 36px;
            background-size: 36px 36px;

            &.score {
              bg-image('jifen');
            }

            &.rank {
              bg-image('guanyuduihuan');
            }

            &.about {
              bg-image('duihuanpaihang');
            }
          }

          p {
            color: #222222;
            font-size: $font-size-small;
            margin-top: 15px;
          }
        }
      }

      .hot-exchange {
        width: 100%;
        height: 56px;
        font-size: 18px;
        font-weight: bold;
        color: #333333;
        line-height: 56px;
        text-align: center;
        background: url('./bg.png') no-repeat;
        background-size: contain;
      }

      .shop-info {
        padding: 15px;
        padding-top: 5px;
        box-sizing: border-box;

        .score {
          width: 100%;
          height: 30px;
          display: flex;

          .left {
            display: flex;
            align-items: center;
            width: 50%;
            height: 30px;
            box-sizing: border-box;
            border: 1px solid #ffae00;
            background: #fff7e5;
            border-radius: 15px;
            padding-left: 10px;
            position: relative;

            img {
              width: 16px;
              height: 16px;
            }

            p {
              margin-left: 5px;
              color: #201e1e;
              font-size: 14px;

              span {
                color: #ff610d;
              }
            }

            .refresh {
              width: 28px;
              height: 28px;
              position: absolute;
              right: 0px;
              top: 0px;
              border-radius: 50%;
              bg-image('refresh');
              background-size: 28px 28px;
              transition: all 0.3s;

              &::active {
                transform: rotate(90deg);
              }

              &:focus {
                transform: rotate(90deg);
              }
            }
          }

          .right {
            width: 50%;
            height: 30px;
            line-height: 30px;
            text-align: right;

            span {
              display: inline-block;
              font-size: 12px;
              height: 100%;

              &:first-child {
                color: #ff610d;
                position: relative;
                padding-right: 4px;

                &:before {
                  content: '';
                  position: absolute;
                  height: 14px;
                  width: 1px;
                  right: 0;
                  top: 8px;
                  background: #ffae00;
                }
              }
            }
          }
        }

        .goods {
          width: 100%;
          display: flex;
          flex-wrap: wrap;

          .title {
            width: 100%;
            line-height: 50px;
            font-size: 16px;
            font-weight: bold;
          }

          .item {
            width: 48%;
            margin-left: 4%;
            margin-bottom: 4%;
            box-sizing: border-box;
            border: 1px solid #f5f5f5;

            &:nth-child(2n+1) {
              margin-left: 0;
            }

            .imgbox {
              width: 100%;
              padding-bottom: 68%;
              height: 0;
              overflow: hidden;
              background: #eeeeee;

              .good-desc {
                width: 100%;
              }
            }

            .name {
              margin-top: 5px;
              font-size: 14px;
              line-height: 21px;
              color: #333333;
              // background: lightgreen;
              padding: 0 6px;
              box-sizing: border-box;
              overflow: hidden;
              white-space: nowrap;
              text-overflow: ellipsis;
            }

            .info {
              padding: 0 6px;
              box-sizing: border-box;
              padding-bottom: 10px;

              img {
                display: inline-block;
                height: 12px;
                width: 12px;
              }

              span {
                font-size: 12px;

                &:last-child {
                  color: #1faed6;
                }
              }
            }
          }
        }
      }
    }
  }
}
</style>
