<template>
  <transition name="opacity">
    <div class="all-goods">
      <m-header>
        <template slot="header">
          <back-icon></back-icon>
          <p>全部商品</p>
          <div class="right-button">
            <search-icon @search="goSearch"></search-icon>
          </div>
        </template>
      </m-header>
      <div class="goods-box">
        <scroll
          class="wrapper"
          ref="allgoodsscroll"
          pullUpLoad=true
          @pullingUp="getMoreGoods"
        >
          <div>
            <div class="title">
              <span class="sw"></span>实物商品
            </div>
            <div class="goods-container">
              <router-link
                class="item"
                tag="div"
                to="subtype/1"
              >
                <div class="imgbox">
                  <img
                    src="./czk.png"
                    alt=""
                    style="width:100px;"
                  >
                </div>
                <p>话费充值卡</p>
              </router-link>
              <router-link
                class="item"
                tag="div"
                to="subtype/3"
              >
                <div class="imgbox">
                  <img
                    src="./iphone.png"
                    alt=""
                    style="width:60px;"
                  >
                </div>
                <p>新款手机</p>
              </router-link>
              <router-link
                class="item"
                tag="div"
                to="subtype/5"
              >
                <div class="imgbox">
                  <img
                    src="./mouse.png"
                    alt=""
                    style="width:38px;"
                  >
                </div>
                <p>游戏周边</p>
              </router-link>
              <router-link
                class="item"
                tag="div"
                to="subtype/2"
              >
                <div class="imgbox">
                  <img
                    src="./jd.png"
                    alt=""
                    style="width:100px;"
                  >
                </div>
                <p>京东购物卡</p>
              </router-link>

              <router-link
                class="item"
                tag="div"
                to="subtype/4"
              >
                <div class="imgbox">
                  <img
                    src="./camera.png"
                    alt=""
                    style="width:78px;"
                  >
                </div>
                <p>数码产品</p>
              </router-link>
              <router-link
                class="item"
                tag="div"
                to="subtype/6"
              >
                <div class="imgbox">
                  <img
                    src="./coffee.png"
                    alt=""
                    style="width:78px;"
                  >
                </div>
                <p>其他</p>
              </router-link>
            </div>
            <div class="title">
              <span class="xn"></span>游戏商品
            </div>
            <div class="goods">
              <goods-list
                :goodsInfo="goodsList"
                @goGoodsDetail="goGoodsDetail"
              ></goods-list>
              <loading-more v-if="currentPage < totalPage"></loading-more>
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
        @sure="exchangeGoods"
      ></mask-game>
    </div>
  </transition>

</template>
<script>
//   0 => '无',
//   1 => '话费充值卡',
//   2 => '京东购物卡',
//   3 => '新款手机',
//   4 => '数码产品',
//   5 => '游戏周边',
//   6 => '其他'
import { getCommonInfoHasData } from '@/base/api/indexpage/getindexinfo';
import { mapGetters } from 'vuex';
import GoodsList from '../goodslist/goodslist';
import maskInfo from '../mask';

export default {
  mixins: [maskInfo],
  data() {
    return {
      goodsList: [],
      showMask: false,
      currentPage: 0,
      totalPage: 1,
      canPullUp: false,
    };
  },
  mounted() {
    this.getGoods();
  },
  methods: {
    goSearch() {
      this.$router.push('/shop/search');
    },
    getMoreGoods() {
      if (this.currentPage < this.totalPage && this.canPullUp) {
        this.getGoods();
        return false;
      }
      this.$refs.allgoodsscroll.endPullUp();
      return false;
    },
    getGoods() {
      const url = '/shop/index';
      getCommonInfoHasData(url, {
        token: this.getToken,
        page: this.currentPage + 1,
      }).then((res) => {
        this.canPullUp = true;
        this.goodsList = [...this.goodsList, ...res.virtual.list];
        this.currentPage = res.virtual.currentPage;
        this.totalPage = Math.ceil(res.virtual.total / res.virtual.pageSize);
        this.$nextTick(() => {
          this.$refs.allgoodsscroll && this.$refs.allgoodsscroll.refresh();
          this.$refs.allgoodsscroll && this.$refs.allgoodsscroll.endPullUp();
        });
      });
    },
    goGoodsDetail(id) {
      this.selectedId = id;
      this.showMask = true;
    },
  },
  computed: {
    ...mapGetters(['getToken']),
  },
  components: {
    GoodsList,
  },
};
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~common/stylus/variable';
@import '~common/stylus/mixin';

opacity();

.all-goods {
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  background: #ffffff;

  .goods-box {
    position: fixed;
    top: 68px;
    bottom: 0;
    width: 100%;
    background: #ffffff;
    overflow-y: scroll;

    .wrapper {
      height: 100%;
      overflow: hidden;
    }

    .title {
      display: flex;
      width: 100%;
      height: 50px;
      padding: 0 15px;
      margin-bottom: 15px;
      align-items: center;
      background: linear-gradient(left, #dbeaff, #f1f7ff);
      box-sizing: border-box;
      font-size: 18px;
      font-weight: bold;
      color: #333333;

      span {
        display: inline-block;
        width: 24px;
        height: 24px;
        margin-right: 6px;

        &.sw {
          background: url('./sw.png') no-repeat;
          background-size: cover;
        }

        &.xn {
          width: 24px;
          height: 20px;
          background: url('./xn.png') no-repeat;
          background-size: cover;
        }
      }
    }

    .goods {
      width: 100%;
      box-sizing: border-box;
      padding: 0 15px;
    }

    .goods-container {
      width: 100%;
      column-count: 2;
      column-gap: 20px;
      box-sizing: border-box;
      padding: 0 15px;

      .item {
        height: 140px;
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-bottom: 20px;
        box-shadow: 0px 2px 8px #dddddd;

        .imgbox {
          width: 100%;
          height: 100px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        p {
          line-height: 40px;
          width: 100%;
          border-top: 1px solid #f5f5f5;
          text-align: center;
        }
      }
    }
  }
}
</style>
