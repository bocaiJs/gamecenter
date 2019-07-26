<template>
  <transition name="slider">
    <div class="giftpacks">
      <m-header>
        <template slot="header">
          <back-icon></back-icon>
          <p>我的礼包</p>
          <div class="right-button">
            <span
              class="info-tip"
              @click="showTips"
            ></span>
          </div>
        </template>
      </m-header>
      <div
        class="tab-bar"
        v-show="!isLoading"
      >
        <div
          class="tab-item"
          :class="{active:tabIndex ===1}"
          @click="changeIndex(1)"
        >游戏礼包</div>
        <div
          class="tab-item"
          :class="{active:tabIndex ===2}"
          @click="changeIndex(2)"
        >代金券</div>
      </div>
      <div
        class="tab-view"
        ref="tabView"
        v-show="!isLoading"
      >
        <scroll
          style="height:100%;overflow:hidden"
          :data=updateScroll
          :pullUpLoad=pullUpLoad
          @pullingUp='getMoreGift'
          ref="giftscroll"
        >
          <div>
            <div v-if="tabIndex===1">
              <div v-if="freeList.length">
                <virtual-gift
                  v-for="(item,index) in freeList"
                  :key="index+'free'"
                  :gift=item
                  :active=deleteActive
                  @deleteGift=deleteItem(item.id,index)
                ></virtual-gift>
                <loading-more v-show="freePage < freeTotalPage"></loading-more>
              </div>
              <err-tip
                v-else
                :type=4
                :tipText=tipText
                :showButton=true
                :buttonText=buttonText
                @refresh='goExchange'
                style="margin-top:80px;"
              ></err-tip>
            </div>
            <div v-if="tabIndex ===2">
              <div
                v-if="materialList.length"
                style="box-sizing:border-box;padding:0 15px;padding-top:15px;"
              >
                <vouchers-gift
                  v-for="(item,index) in materialList"
                  :key="index"
                  :gift="item"
                ></vouchers-gift>
                <loading-more v-show="materialPage < materialTotalPage"></loading-more>
              </div>
              <err-tip
                v-else
                :type=4
                :tipText=tipText
                :showButton=true
                :buttonText=buttonText
                @refresh='goExchange'
                style="margin-top:80px;"
              ></err-tip>
            </div>
          </div>
        </scroll>
      </div>
      <mask-tip
        tipTitle="代金券说明"
        :tipContent="tipContent"
        :showTipMask="showTipMask"
        @hideTip="hideTipMask"
      ></mask-tip>
      <div
        class="loading-container "
        v-show="isLoading"
      >
        <loading></loading>
      </div>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
import MHeader from '@/components/m-header/m-header';
import Scroll from '@/base/scroll/scroll';
import MaskCommon from '@/base/maskcommon/maskcommon';
import { mapGetters } from 'vuex';
import LoadingMore from '@/base/loadingmore/loading';
import { getCommonInfoHasData } from '@/base/api/indexpage/getindexinfo';
import BackIcon from '@/base/icon_widget/arrow_back';
import Loading from '@/base/loading/loading';
import ErrTip from '@/base/errortipwidget/errortipwidget';
import VirtualGift from './item/virtualgift';
import MaterialGift from './item/materialgift';
import VouchersGift from './item/vouchers';

export default {
  data() {
    return {
      showTipMask: false,
      tipContent: '<p>1、平台各游戏会逐步开放代金券，请关注游戏上线及游戏更新。;</p><p>2、代金券在原价的基础上抵扣（非折扣后抵消），如道具原价为500元,折扣为五折,使用100元代金券后您只需支付:(500-100)*0.5=200</p>',
      buttonText: '去兑换',
      tipText: '没有兑换的礼包',
      pullUpLoad: true,
      isLoading: true,
      tabIndex: 1,
      updateScroll: 0,
      freeList: [], // 免费虚拟礼包
      freePage: 0,
      freeTotalPage: 0,
      materialList: [], // 积分兑换实物礼包
      materialPage: 0,
      materialTotalPage: 0,
      deleteActive: false,
    };
  },
  mounted() {
    this.getFreeList();
    this.getMaterialList();
    this.$refs.tabView.style.top = (97 + parseInt(this.statusbar)) + 'px';
  },
  methods: {
    showTips() {
      this.showTipMask = true;
    },
    hideTipMask() {
      this.showTipMask = false;
    },
    goExchange() {
      console.log('dd');
      this.$router.push({
        path: '/shop',
      });
    },
    getMoreGift() {
      console.log('getMore');
      if (this.tabIndex === 1 && this.freePage < this.freeTotalPage) {
        this.getFreeList();
      }
      if (this.tabIndex === 2 && this.materialPage < this.materialTotalPage) {
        this.getMaterialList();
      }
      this.updateScroll++;
    },
    changeIndex(index) {
      this.tabIndex = index;
      this.$refs.giftscroll.refresh();
    },
    deleteItemBackend(id) {
      console.log(id);
      const url = '/user/delGift';
      getCommonInfoHasData(url, {
        token: this.getToken,
        id,
      }).then((res) => {
        console.log(res);
      });
    },
    deleteItem(id, index) {
      console.log(id, index);
      if (this.tabIndex === 1) {
        this.freeList.splice(index, 1);
        if (this.freeList.length < 10) {
          this.getMoreGift();
        }
        this.getFreeList();
      } else if (this.tabIndex === 2) {
        this.scoreList.splice(index, 1);
        if (this.scoreList.length < 10) {
          this.getMoreGift();
        }
      } else {
        this.materialList.splice(index, 1);
        if (this.materialList.length < 10) {
          this.getMoreGift();
        }
      }
      this.deleteItemBackend(id);
    },
    // 获取实物礼包
    getMaterialList() {
      const url = '/shop/myCouponList';
      getCommonInfoHasData(url, {
        page: this.materialPage + 1,
        token: this.getToken,
      }).then((res) => {
        console.log(res);
        this.materialPage = res.currentPage;
        this.materialTotalPage = Math.ceil(res.total / res.pageSize);
        this.materialList.push.apply(this.materialList, res.list);
        console.log(this.materialList);
        this.updateScroll++;
        console.log('material', this.materialPage, this.materialTotalPage);
      });
    },
    // 获取免费礼包
    getFreeList() {
      const url = '/user/myGift';
      getCommonInfoHasData(url, {
        page: this.freePage + 1,
        token: this.getToken,
      }).then((res) => {
        this.isLoading = false;
        this.freePage = res.currentPage;
        this.freeTotalPage = Math.ceil(res.total / res.pageSize);
        this.freeList.push.apply(this.freeList, res.list);
        this.updateScroll++;
        console.log('free', this.freePage, this.freeTotalPage);
      });
    },
  },
  computed: {
    ...mapGetters(['getToken', 'statusbar']),
  },
  components: {
    MHeader,
    Scroll,
    MaskCommon,
    BackIcon,
    VirtualGift,
    MaterialGift,
    LoadingMore,
    Loading,
    ErrTip,
    VouchersGift,
  },
};
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~common/stylus/variable';
@import '~common/stylus/mixin';

slider();

.giftpacks {
  position: fixed;
  width: 100%;
  top: 0;
  bottom: 0;
  background: #ffffff;

  .info-tip {
    display: inline-block;
    width: 16px;
    height: 16px;
    background: url('./infoTip.png') no-repeat;
    background-size: cover;
  }

  .loading-container {
    loading();
  }

  .tab-bar {
    height: 44px;
    border-top: 8px solid #f5f5f5;
    border-bottom: 1px solid #f5f5f5;
    width: 100%;
    display: flex;

    .tab-item {
      flex: 1;
      line-height: 44px;
      text-align: center;
      font-size: 16px;
      font-weight: bold;
      color: #555555;
      position: relative;
      transition: all 0.3s ease;

      &::after {
        content: '';
        width: 20px;
        height: 2px;
        background: #ffffff;
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
        bottom: 0;
      }

      &.active {
        color: #1faed6;

        &::after {
          content: '';
          width: 20px;
          height: 2px;
          background: #1faed6;
          position: absolute;
          left: 50%;
          transform: translateX(-50%);
          bottom: 0;
        }
      }
    }
  }

  .tab-view {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    top: 121px;
  }
}
</style>
