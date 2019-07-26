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
      <div class="tab-shop">
        <div class="tab">
          <div
            class="tab-item"
            :class="{active:tabIndex == 0}"
            @click.stop="changeTabIndex(0)"
          >游戏礼包</div>
          <div
            class="tab-item"
            :class="{active:tabIndex == 1}"
            @click.stop="changeTabIndex(1)"
          >实物商品</div>
        </div>
        <div class="score-info">
          <div>我的积分:<span class="yellow">{{this.score}}</span></div>
          <div style="display:flex;margin-left:20px;">
            <span
              ref="order"
              @touchstart="ts"
              @touchend="te"
            >{{text}}</span>
            <div class="order-icon">
              <span
                class="down"
                :class="{active:order == 1}"
              ></span>
              <span
                class="up"
                :class="{active:order == 0}"
              ></span>
            </div>
          </div>
        </div>
      </div>
      <div
        class="shop-box"
        ref="shopbox"
      >
        <scroll
          class="wrapper"
          ref="shopscroll"
          pullUpLoad=true
          @pullingUp="getMoreGift"
        >
          <div>
            <div class="shop-info">
              <div v-if="tabIndex===0">
                <goods-list
                  :goodsInfo="virtualList"
                  @goGoodsDetail="goGoodsDetail"
                ></goods-list>
                <loading-more v-if="virtualPage < virtualTotalPage"></loading-more>
              </div>
              <div v-else>
                <goods-list
                  :goodsInfo="materialList"
                  @goGoodsDetail="goGoodsDetail"
                ></goods-list>
                <loading-more v-if="materialPage < materialTotalPage"></loading-more>
              </div>
            </div>
          </div>
        </scroll>

      </div>
      <router-view></router-view>
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

export default {
  data() {
    return {
      canSlider: true,
      gameType: {},
      isloading: true,
      titleText: '商城',
      virtual: [],
      score: 0,
      order: 0, //  0：asc升序从小到大 1：降序从大到小 desc
      page: 1,
      text: '降序排列',
      showMask: false,
      maskInfo: {
        content: '',
        btn: [],
      },
      deg: 0,
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
      goods_type: 0, // goods_type ： 1 实物 2 虚拟
      materialList: [],
      materialPage: 0,
      materialTotalPage: 0,
      virtualList: [],
      virtualPage: 0,
      virtualTotalPage: 0,
      sliderList: [],
      styleObject: {
        transform: 'translate3d(0px,0,0)',
      },
      moveInverval: null,
    };
  },
  mounted() {
    this._getShopIndexInfo(2, 1);
    this._getShopIndexInfo(1, 1);
    this.getPrizeInfo();
    this.$refs.shopbox.style.top = (140 + parseInt(this.statusbar)) + 'px';
  },
  activated() {
    this.initMove();
  },
  deactivated() {
    this.clearMove();
  },

  methods: {
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
    goGoodsDetail(id) {
      console.log(id);
      this.$router.push({
        path: `shop/detail/${id}`,
        params: {
          id,
        },
      });
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
    _getShopIndexInfo(type, page) {
      const path = '/shop/index';
      getCommonInfoHasData(path, {
        page,
        token: this.getToken,
        goods_type: type,
        order: this.order ? 'desc' : 'asc',

      }).then((res) => {
        console.log(res);
        this.score = res.score;
        if (type === 1) {
          this.materialList.push.apply(this.materialList, res.virtual.data);
          this.materialPage = res.virtual.current_page;
          this.materialTotalPage = res.virtual.last_page;
        } else {
          this.virtualList.push.apply(this.virtualList, res.virtual.data);
          this.virtualPage = res.virtual.current_page;
          this.virtualTotalPage = res.virtual.last_page;
        }
        if (res.virtual.data.length > 0) {
          console.log('刷新页面');
          this.refreshScroll();
        }
      });
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
    //  获取更多礼包
    getMoreGift() {
      if (this.tabIndex === 0 && this.virtualPage < this.virtualTotalPage) {
        this._getShopIndexInfo(this.goods_type, this.virtualPage + 1);
      }
      if (this.tabIndex === 1 && this.materialPage < this.materialTotalPage) {
        this._getShopIndexInfo(this.goods_type, this.materialPage + 1);
      }
      return false;
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
    ts() {
      this.$refs.order.style.color = 'red';
      this.materialPage = 0;
      this.materialTotalPage = 0;
      this.materialList = [];
      this.virtualPage = 0;
      this.virtualTotalPage = 0;
      this.virtualList = [];
      this.virtual = [];
      if (this.order) {
        this.order = 0;
        this.text = '降序排列';
      } else {
        this.order = 1;
        this.text = '升序排列';
      }
      this._getShopIndexInfo(2, 1);
      this._getShopIndexInfo(1, 1);
    },
    te() {
      this.$refs.order.style.color = '#333333';
    },
    changeTabIndex(index) {
      this.tabIndex = index;
      if (index === 0) {
        this.goods_type = 2;
      }
      this.goods_type = index;
      this.refreshScroll();
    },
  },
  destroyed() {
    console.log('页面销毁');
    this.clearMove();
  },
  computed: {
    ...mapGetters(['statusbar', 'getToken', 'getLoginState', 'loginback']),
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
      flex-wrap: nowrap;

      .move-box {
        height: 100%;
        width: auto;
        display: flex;
        align-items: center;
        float: left;

        p {
          margin-right: 10px;
          word-break: keep-all;
          white-space: nowrap;
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

  .tab-shop {
    box-sizing: border-box;
    padding: 0 15px;
    display: flex;
    height: 50px;
    align-items: center;
    justify-content: space-between;

    .tab {
      display: flex;
      justify-content: space-between;
      font-size: 16px;
      color: #555555;

      .tab-item {
        position: relative;
        line-height: 28px;

        &:first-child {
          margin-right: 20px;
        }

        &.active {
          color: #1faed6;
          font-weight: bold;
          transition: all 200ms;

          &::before {
            content: '';
            height: 2px;
            width: 30px;
            background: #1faed6;
            position: absolute;
            bottom: 0;
            left: 50%;
            transform: translate3d(-50%, 0, 0);
          }
        }
      }
    }

    .score-info {
      display: flex;
      font-size: 12px;
      line-height: 14px;
      align-items: center;

      .yellow {
        color: #ffc400;
      }

      .order-icon {
        width: 7px;
        line-height: 14px;
        display: flex;
        flex-wrap: wrap;
        height: 100%;
        // background: red;
        margin-left: 2px;

        .down {
          height: 7px;
          width: 7px;
          background: url('./d.png') no-repeat;
          background-size: 7px 7px;
          transform: rotate(180deg);

          &.active {
            transform: rotate(0);
            background: url('./c.png') no-repeat;
            background-size: 7px 7px;
          }
        }

        .up {
          height: 7px;
          width: 7px;
          background: url('./d.png') no-repeat;
          background-size: 7px 7px;

          &.active {
            transform: rotate(180deg);
            background: url('./c.png') no-repeat;
            background-size: 7px 7px;
          }
        }
      }
    }
  }

  .shop-box {
    position: fixed;
    top: 164px;
    bottom: 0;
    width: 100%;
    background: #ffffff;

    .wrapper {
      height: 100%;
      overflow: hidden;

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
