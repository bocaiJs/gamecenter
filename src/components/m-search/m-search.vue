<template>
  <transition name="opacity">
    <div class="search-detail">
      <m-header>
        <template slot="header">
          <back-icon></back-icon>
          <div class="search-input">
            <input
              type="text"
              v-model="searchVal"
              placeholder="搜索游戏"
              @keypress="doSearch"
            >
          </div>
          <search-icon @search="onSearchGame"></search-icon>
        </template>
      </m-header>
      <div v-show="fuzzyQuery.length">
        <search-recommenditem
          :fuzzy=fuzzyQuery
          @selectGameName="onSearchGame"
        ></search-recommenditem>
      </div>
      <!-- 判断是否在输入 -->
      <div v-show="!fuzzyQuery.length">
        <div v-show="!hasResult">
          <!-- @selectGameName= -->
          <!-- 热门游戏推荐 -->
          <search-recommend :gameList=hotSearch></search-recommend>
          <div style="border-top:8px solid #f5f5f5">
            <search-history
              ref="gamehistory"
              @searchGoods="onSearchGame"
              :historytype="type"
            ></search-history>
          </div>
        </div>
        <!-- 如果有搜索结果显示  默认点击搜索后就会有搜索结果 -->
        <div v-show="hasResult">
          <div v-show="!loading">
            <div v-if="!searchApps.length">
              <div style="padding:15px">
                <err-tip :tipText="noGameTipText"></err-tip>
              </div>
              <div style="border-top:8px solid #f5f5f5">
                <search-recommend
                  :title="noResultRecommendTitle"
                  :gameList=recommendForGuest
                  v-if="recommendForGuest.length"
                ></search-recommend>
              </div>
            </div>
            <scroll
              class="s-d-wrapper"
              :listenScroll=true
              :data=refreshScroll
            >
              <div>
                <game-item
                  :gameinfo=item
                  v-for="item in searchApps"
                  :key=item.id
                ></game-item>
              </div>
            </scroll>
          </div>
        </div>
      </div>
      <router-view></router-view>
      <div
        class="loading-container"
        v-show="loading"
      >
        <loading></loading>
      </div>
    </div>
  </transition>

</template>

<script type="text/ecmascript-6">
import MHeader from 'components/m-header/m-header';
import Loading from '@/base/loading/loading';
import Scroll from '@/base/scroll/scroll';
// import GameList from '@/base/gamelist2/gamelist2';
import BackIcon from '@/base/icon_widget/arrow_back';
import SearchIcon from '@/base/icon_widget/search_info';
// 搜索推荐模块
import SearchRecommend from '@/base/search_recommend/search_recommend';
import SearchHistory from '@/base/searchhistory/searchhistory';
// 游戏名称模糊查询
import SearchRecommenditem from '@/base/search_recommend/search_recomment_item';
import ErrTip from '@/base/errortipwidget/errortipwidget';
// getCommonInfo
import { getCommonInfo, getCommonInfoHasData } from '@/base/api/indexpage/getindexinfo';
import GameItem from '../m-index/item/discount_item';


const SEARCHHISTORY = 'SEARCHHISTORY';
export default {
  name: 'GameSearch',
  data() {
    return {
      noGameTipText: '没有你要找的游戏',
      noResultRecommendTitle: '为您推荐',
      type: SEARCHHISTORY,
      searchVal: '',
      searchApps: [],
      history: [],
      loading: false,
      refreshScroll: 0,
      isSearch: false,
      hasResult: false,
      fuzzyQuery: [],
      hotSearch: [], // 热门搜索
      recommendForGuest: [],
      casnPush: true, // 模糊匹配结果是否展示（如果模糊查询后没有收到结果，用户点击查询，则查询结果不在push到fuzzyQuery里）
    };
  },
  created() {
    this._getHotGameInfo();
  },
  deactivated() {
    this.restore();
  },
  watch: {
    searchVal() {
      this.searchTextChange();
      this.fuzzyQuery = [];
      this.casnPush = true;
    },
  },
  methods: {
    doSearch(e) {
      console.log(e.keyCode);
      if (e.keyCode === 13) {
        this.onSearchGame();
      }
    },
    restore() {
      this.searchVal = '';
      this.searchVal = '';
      this.searchApps = [];
      this.history = [];
      this.loading = false;
      this.refreshScroll = 0;
      this.isSearch = false;
      this.hasResult = false;
    },
    // 搜索内容改变
    searchTextChange() {
      if (this.searchVal.length > 0) {
        this._getKeyWord(this.searchVal);
        return;
      }
    },
    // 获取热门游戏信息逻辑
    _getHotGameInfo() {
      const url = '/search/game';
      getCommonInfo(url).then((res) => {
        this.hotSearch = res && res.searchDefaultApps;
      });
    },
    _getKeyWord(name) {
      if (name === '' || name.length < 1) return;
      const address = '/game/getAppName';
      getCommonInfoHasData(address, {
        name,
      }).then((res) => {
        if (this.casnPush) {
          this.fuzzyQuery = res.data;
        }
      });
    },
    // 搜索按钮触发 获取游戏信息
    onSearchGame(text) {
      let val = text ? text : this.searchVal;
      if (!val.length) return;
      this.fuzzyQuery = [];
      this.casnPush = false;
      this.hasResult = true;
      if (val.length <= 0) return;
      this.loading = true;
      const address = '/search/game';
      let data = {
        keyword: val,
      };
      getCommonInfoHasData(address, data).then((res) => {
        console.log(res);
        this.loading = false;
        this.searchApps = res.searchApps;
        this.recommendForGuest = res.searchDefaultApps;
        this.refreshScroll++;
      });
      //  添加搜索内容到搜索历史
      this.setSearchHistory(this.searchVal);
    },
    setSearchHistory(val) {
      this.$refs.gamehistory && this.$refs.gamehistory.setSearchHistory(val);
    },
  },
  components: {
    MHeader,
    Loading,
    Scroll,
    // GameList,
    SearchIcon,
    BackIcon,
    SearchRecommend,
    SearchHistory,
    SearchRecommenditem,
    ErrTip,
    GameItem,
  },
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~common/stylus/variable';
@import '~common/stylus/mixin';

slider();
opacity();

.search-detail {
  position: fixed;
  top: 0;
  bottom: 0;
  width: 100%;
  background: $color-background;
  background: #ffffff;
  z-index: 10;

  .s-d-wrapper {
    height: calc(100% - 44px);
    overflow: hidden;
  }

  .loading-container {
    loading();
  }
}
</style>
