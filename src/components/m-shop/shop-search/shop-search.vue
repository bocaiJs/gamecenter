<template>
  <transition name="opacity">
    <div class="shopsearch">
      <m-header>
        <template slot="header">
          <back-icon></back-icon>
          <div class="search-input">
            <input
              type="text"
              v-model="searchVal"
              :placeholder="keyword"
              @keypress="doSearch"
            >
          </div>
          <search-icon @search="searchGoods"></search-icon>
        </template>
      </m-header>
      <div
        class="rankbox"
        ref="searchbox"
      >
        <search-history
          ref="searchHistory"
          v-show="!lists.length"
          @searchGoods="searchHistory"
          :historytype=historytype
        ></search-history>
        <scroll
          class="wrapper"
          ref="shopscroll"
          :pullUpLoad=pullUpLoad
          @pullingUp='getMoreGoods'
        >
          <div style="padding-top:20px;">
            <goods-list
              :goodsInfo="lists"
              @selectGoods="selectGoods"
            > </goods-list>
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

<script type="text/ecmascript-6">
import MHeader from '@/components/m-header/m-header';
import Loading from '@/base/loading/loading';
import Scroll from '@/base/scroll/scroll';
import SearchHistory from '@/base/searchhistory/searchhistory';
// import MaskCommon from '@/base/maskcommon/maskcommon';
import { getCommonInfoHasData } from '@/base/api/indexpage/getindexinfo';
import { mapGetters } from 'vuex';
import BackIcon from '@/base/icon_widget/arrow_back';
import SearchIcon from '@/base/icon_widget/search_info';
import GoodsList from '../goodsitem/goodsitem';
import mask from '../mask';

const SEARCHHISTORY = 'GOODSSEARCHHISTORY';
export default {
  mixins: [mask],
  data() {
    return {
      keyword: '输入游戏名称搜索',
      historytype: SEARCHHISTORY,
      lists: [],
      page: 1,
      pullUpLoad: true,
      data: 0,
      totalPage: 1,
      searchVal: '',
      showMask: false,
    };
  },
  mounted() {
    this.$refs.searchbox.style.top = (44 + parseInt(this.statusbar)) + 'px';
    console.log(this.$refs.searchHistory);
  },
  methods: {
    doSearch(e) {
      if (e.keyCode === 13) {
        this.getGoods();
      }
    },
    searchHistory(val) {
      this.searchVal = val;
      this.getGoods();
    },
    goGoodsDetail(id) {
      console.log(id);
      this.$router.push({
        path: `/shop/detail/${id}`,
        params: {
          id,
        },
      });
    },
    selectGoods(id) {
      this.selectedId = id;
      this.showMask = true;
    },
    searchGoods() {
      this.page = 1;
      this.lists = [];
      this.getGoods();
      console.log('设置搜索结果');
      this.$refs.searchHistory.setSearchHistory(this.searchVal);
    },
    getGoods() {
      console.log(this.searchVal);
      if (!this.searchVal.length === 0) return;
      const path = '/shop/searchGoods';
      getCommonInfoHasData(path, {
        title: this.searchVal,
        page: this.page,
      }).then((res) => {
        console.log(res);
        this.page = res.current_page;
        this.totalPage = Math.ceil(res.total / res.per_page);
        console.log(this.totalPage);
        this.lists.push.apply(this.lists, res.data);
      });
    },
    getMoreGoods() {
      if (this.page < this.totalPage) {
        console.log('获取更多');
        this.getGoods();
      }
    },
    // exchangeGoods(id) {
    //   if (!this.getLoginState) {
    //     this.showMask = true;
    //     this.maskInfo.content = '请先登录';
    //     this.maskInfo.btn[0] = {
    //       btnTitle: '知道了',
    //       type: 'hide',
    //     };
    //     this.maskInfo.btn[1] = {
    //       btnTitle: '去登录',
    //       type: 'login',
    //     };
    //     return;
    //   }
    //   const path = '/shop/getShopGood';
    //   postInfo(path, {
    //     good_id: id,
    //     token: this.getToken,
    //   }).then((res) => {
    //     if (res.status_code === 200) {
    //       this.showMask = true;
    //       this.maskInfo.extendtips = '(请将兑换码发给客服)';
    //       this.maskInfo.content = '您的验证码为:';
    //       this.maskInfo.btn[0] = {
    //         btnTitle: '复制',
    //         type: 'copy',
    //       };
    //       console.log(this.dhcode);
    //       this.dhcode = res.code;
    //     } else {
    //       this.showMask = true;
    //       this.maskInfo.content = res.message;
    //       this.maskInfo.extendtips = '';
    //       this.maskInfo.btn = [];
    //       this.maskInfo.btn[0] = {
    //         btnTitle: '知道了',
    //         type: 'hide',
    //       };
    //       this.dhcode = '';
    //     }
    //   });
    // },
    hideMask() {
      this.showMask = false;
    },
    refreshScroll() {
      setTimeout(() => {
        this.$refs.shopscroll.updateScroll();
      }, 20);
    },
  },
  computed: {
    ...mapGetters(['getToken', 'getLoginState', 'statusbar']),
  },
  components: {
    MHeader,
    Scroll,
    Loading,
    // MaskCommon,
    GoodsList,
    SearchHistory,
    BackIcon,
    SearchIcon,
  },
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~common/stylus/variable';
@import '~common/stylus/mixin';

opacity();

.shopsearch {
  position: fixed;
  width: 100%;
  top: 0;
  bottom: 0;
  background: #ffffff;

  .rankbox {
    sub-position();
    background: #ffffff;
    top: 68px;

    .wrapper {
      height: 100%;
      overflow: hidden;

      .item {
        width: 100%;
        background: #ffffff;
        display: flex;
        flex-wrap: wrap;
        margin-top: 15px;
        position: relative;

        &:first-child {
          margin-top: 0;
        }

        &:last-child {
        }

        .box {
          width: 100%;
          padding: 12px 0;
          padding: 12px 0 12px 10px;
          height: 110px;
          box-sizing: border-box;
          display: flex;
          align-items: center;

          .img {
            height: 100%;
            min-width: 40%;
            background: #cccccc;

            img {
              display: block;
              height: 100%;
            }
          }

          .info {
            height: 100%;
            padding-left: 10px;
            display: flex;
            flex-direction: column;
            justify-content: space-between;

            h3 {
              color: #222222;
              font-size: $font-size-small;
            }

            p {
              font-size: $font-size-small-s;

              &.blue {
                color: #58d2ec;
              }
            }

            .btn {
              width: 60px;
              height: 24px;
              background: #ffc400;
              color: #ffffff;
              line-height: 24px;
              text-align: center;
              font-size: $font-size-small-s;
              border-radius: 5px;
            }
          }
        }

        .bottom {
          padding: 4px 0;
          width: 100%;
          line-height: 16px;
          font-size: $font-size-medium;
          background: #ffffff;
          color: #555555;
          padding-left: 10%;
          box-sizing: border-box;
          border-top: 1px solid #eeeeee;
        }
      }
    }
  }
}
</style>

