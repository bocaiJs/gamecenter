<template>
  <transition name="opacity">
    <div class="subtype">
      <m-header>
        <template slot="header">
          <back-icon></back-icon>
          <p>{{title}}</p>
          <div class="right-button">
            <search-icon @search="goSearch"></search-icon>
          </div>
        </template>
      </m-header>
      <div
        class="subtype-box"
        ref="subTypebox"
        v-show="!isLoading"
      >
        <scroll
          class="wrapper"
          ref="subtypescroll"
          pullUpLoad=true
          @pullingUp="getMoreGoods"
        >
          <div>
            <sub-item
              v-show="goodsList.length"
              @selectGoods="selectGoods"
              :goodsInfo="goodsList"
            ></sub-item>
            <loading-more v-if="currentPage < totalPage"></loading-more>
          </div>
        </scroll>
      </div>
      <div
        class="loading-container"
        v-show="isLoading"
      >
        <loading></loading>
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
import { mapGetters } from 'vuex';
import { getCommonInfoHasData } from '@/base/api/indexpage/getindexinfo';
import SubItem from '../goodsitem/goodsitem';
import mask from '../mask';

const TITLE = [
  '话费充值卡',
  '京东购物卡',
  '新款手机',
  '数码产品',
  '游戏周边',
  '其他',
];
export default {
  mixins: [mask],
  data() {
    return {
      showMask: false,
      type: 1,
      title: TITLE[0],
      currentPage: 0,
      totalPage: 1,
      goodsList: [],
      isLoading: true,
    };
  },
  mounted() {
    this.type = this.$route.params.id;
    this.title = TITLE[this.type - 1];
    this.getGoods();
    this.$refs.subTypebox.style.top = (44 + parseInt(this.statusbar)) + 'px';
  },
  methods: {
    goSearch() {
      this.$router.push('/shop/search');
    },
    getMoreGoods() {
      if (this.currentPage < this.totalPage) {
        this.getGoods();
        return false;
      }
      this.refreshScroll();
      return false;
    },
    refreshScroll() {
      setTimeout(() => {
        this.$refs.subtypescroll && this.$refs.subtypescroll.endPullUp();
      }, 20);
    },
    selectGoods(id) {
      this.selectedId = id;
      this.showMask = true;
    },
    getGoods() {
      const url = '/shop/index';
      getCommonInfoHasData(url, {
        token: this.getToken,
        page: this.currentPage + 1,
        type: 1,
        goods_type: this.type,
      }).then((res) => {
        this.isLoading = false;
        this.goodsList.push.apply(this.goodsList, res.virtual.list);
        console.log(this.goodsList.length);
        this.currentPage = res.virtual.currentPage;
        this.totalPage = Math.ceil(res.virtual.total / res.virtual.pageSize);
        this.$nextTick(() => {
          this.$refs.subtypescroll && this.$refs.subtypescroll.refresh();
          this.$refs.subtypescroll && this.$refs.subtypescroll.endPullUp();
        });
      });
    },
  },
  computed: {
    ...mapGetters(['getToken']),
  },
  components: {
    SubItem,
  },
};
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~common/stylus/variable';
@import '~common/stylus/mixin';

opacity();

.subtype {
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  background: #ffffff;

  .subtype-box {
    position: fixed;
    top: 68px;
    bottom: 0;
    width: 100%;
    background: #ffffff;

    .wrapper {
      height: 100%;
      overflow: hidden;
    }
  }

  .loading-container {
    loading();
  }
}
</style>
