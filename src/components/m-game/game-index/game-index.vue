<template>

  <div class="game">
    <m-header>
      <template slot="header">
        <search-box @seaerch=goSearchPage></search-box>
        <down-icon></down-icon>
      </template>
    </m-header>
    <div
      class="gamebox"
      ref="gamebox"
    >
      <div class="tab-box">
        <span
          :class="{active:typeId ===1}"
          @click="changeType(1)"
        >热门</span>
        <span
          :class="{active:typeId ===2}"
          @click="changeType(2)"
        >题材</span>
        <span
          :class="{active:typeId ===3}"
          @click="changeType(3)"
        >画风</span>
        <span
          :class="{active:typeId ===4}"
          @click="changeType(4)"
        >风格</span>
        <span
          :class="{active:typeId ===5}"
          @click="changeType(5)"
        >玩法</span>
        <span
          :class="{active:typeId ===6}"
          @click="changeType(6)"
        >类型</span>
      </div>
      <div
        class="tab-type"
        v-show="showtabType"
      >
        <!-- <span class="active">卡牌</span> -->
        <span
          v-for="(category,index) in categoryList"
          :key="index"
          :class="{active: category.id===categoryId}"
          @click="changeCategory(category.id,category.name)"
        >{{category.name}}</span>
      </div>
      <div
        class="tab-view"
        v-if="!isloading"
      >
        <scroll
          ref="gamescroll"
          style="height:100%;overflow:hidden"
          :data=data
          :pullUpLoad=pullUpLoad
          @pullingUp='_getMoreGame'
        >
          <div>
            <!-- :key="game.id+'game'" -->
            <div v-if="gameList.length">
              <discount-item
                :showGameTag=showGameTag
                v-for="(game,index) in gameList"
                :gameinfo=game
                :fixedType=fixedType
                :type=fixedTypeString
                :key="index"
              ></discount-item>
              <loading-more v-if="currentPage <lastPage"></loading-more>
            </div>
            <div
              v-else
              style="margin-top:40px"
            >
              <err-tip :tipText="noGameTipText"></err-tip>
            </div>
          </div>
        </scroll>
      </div>
      <div
        class="loading-container"
        v-if="isloading"
      >
        <loading></loading>
      </div>
    </div>
    <router-view></router-view>
  </div>

</template>

<script type="text/ecmascript-6">
import MHeader from 'components/m-header/m-header';
import Loading from '@/base/loading/loading';
import Scroll from '@/base/scroll/scroll';
import SearchBox from '@/base/search_box/search_box';
import DownIcon from '@/base/icon_widget/down';
import ErrTip from '@/base/errortipwidget/errortipwidget';
import LoadingMore from '@/base/loadingmore/loading';
import { getCommonInfoHasData } from '@/base/api/indexpage/getindexinfo';
import { mapMutations, mapGetters } from 'vuex';
import DiscountItem from '../../m-index/item/discount_item';

export default {
  data() {
    return {
      pullUpLoad: true, // 是否监听上拉
      data: 0,
      noGameTipText: '这个类型暂时没有游戏',
      titleText: '游戏',
      canSlider: true,
      isloading: true,
      categoryList: [],
      gameList: [],
      currentPage: 1,
      lastPage: 1,
      categoryId: 0, // 分类id 例如修仙，传奇 等
      typeId: 1, //  热门,画风，题材,风格 等6个固定大分类
      showGameTag: false, // 游戏左上角Icon 是否显示
      fixedType: true, // 传给游戏item 表示展示固定type
      fixedTypeString: '', // 传给游戏item 表示展示固定type的文本值
      showtabType: true,
    };
  },
  created() {
    if (this.$route.query.typeId === undefined && this.$route.query.categoryId === undefined) {
      this._getGameInfo();
    }
  },
  activated() {
    this.data++;
    if (this.$route.query.typeId !== undefined && this.$route.query.categoryId !== undefined) {
      this.typeId = this.$route.query.typeId;
      let name = '';
      let id = this.$route.query.categoryId;
      switch (id) {
        case 14:
          name = '卡牌';
          break;
        case 19:
          name = '挂机';
          break;
        case 44:
          name = '仙侠';
          break;
        case 55:
          name = 'MMO';
          break;
      }
      console.log(id, this.categoryId);
      this.changeCategory(id, name);
    } else {
      console.log('dd');
    }
  },
  mounted() {
    this.$refs.gamebox.style.top = (44 + parseInt(this.statusbar)) + 'px';
  },
  methods: {
    changeType(type) {
      this.typeId = type;
      this._getGameInfo();
    },
    goSearchPage() {
      this.$router.push('/search');
    },
    // 获取分类标签。 以及第一个标签下的游戏
    _getGameInfo() {
      this.isloading = true;
      this.currentPage = 1;
      const address = '/game/appIndex';
      this.showtabType = false;
      getCommonInfoHasData(address, {
        type_id: this.typeId,
      }).then((res) => {
        this.showtabType = true;
        this.isloading = false;
        this.categoryList = res.data.category;
        this.gameList = res.data.apps.data;
        this.categoryId = res.data.category && res.data.category[0].id;
        this.fixedTypeString = res.data.category && res.data.category[0].name;
        this.current_page = res.data.apps.current_page;
        this.lastPage = res.data.apps.last_page;
      });
    },
    _getCategoryGame() {
      this.currentPage = 1;
      this.isloading = true;
      const address = '/game/appIndex';
      getCommonInfoHasData(address, {
        type_id: this.typeId,
        category_id: this.categoryId,
        currentPage: this.currentPage,
      }).then((res) => {
        this.isloading = false;
        this.gameList = res.data.apps.data;
        this.categoryList = res.data.category;
      });
    },
    // 获取更多
    _getMoreGame() {
      this.currentPage++;
      if (this.currentPage > this.lastPage) return;
      const address = '/game/appIndex';
      getCommonInfoHasData(address, {
        type_id: this.typeId,
        category_id: this.categoryId,
        currentPage: this.currentPage,
      }).then((res) => {
        console.log(res.data.apps.data.length);
        if (res.data.apps.data.length === 0) {
          this.$refs.gamescroll.endPullUp();
        } else {
          this.gameList.push.apply(this.gameList, res.data.apps.data);
          this.data++;
        }
      });
    },
    // 获取小标签下的游戏
    changeCategory(id, name) {
      if (id === this.categoryId) return;
      this.fixedTypeString = name;
      this.categoryId = id;
      this.currentPage = 1;
      this._getCategoryGame();
    },
    ...mapMutations([
      'setgametags',
    ]),
  },
  computed: {
    ...mapGetters(['statusbar']),
  },
  components: {
    MHeader,
    Loading,
    Scroll,
    SearchBox,
    DownIcon,
    DiscountItem,
    ErrTip,
    LoadingMore,
  },
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~common/stylus/variable';
@import '~common/stylus/mixin';

.game {
  position: fixed;
  top: 0;
  bottom: 50px;
  width: 100%;
  background: #ffffff;

  .gamebox {
    sub-position();
    top: 68px;

    .tab-box {
      width: 100%;
      height: 40px;
      display: flex;
      align-items: center;
      box-sizing: border-box;
      padding: 0 15px;
      justify-content: space-between;
      border-bottom: 1px solid #eeeeee;

      span {
        line-height: 39px;
        font-size: 16px;
        color: #333333;
        transition: all 0.25s ease;

        &.active {
          position: relative;
          font-weight: bold;
          color: #fe5ba8;

          &::after {
            position: absolute;
            content: '';
            width: 100%;
            height: 2px;
            background: #fe5ba8;
            left: 0;
            bottom: 0;
          }
        }
      }
    }

    .tab-type {
      height: 50px;
      width: 100%;
      padding: 10px 15px;
      box-sizing: border-box;
      overflow: scroll;
      display: flex;
      display: -webkit-box;
      -webkit-overflow-scrolling: touch;

      &::-webkit-scrollbar {
        display: none;
      }

      &::-webkit-scrollbar {
        width: 0px;
      }

      span {
        display: flex;
        display: -webkit-box;
        font-size: 14px;
        color: #999999;
        padding: 8px 14px;
        border-radius: 15px;
        white-space: nowrap;

        &.active {
          background: #f4fbfd;
          color: #58c3e0;
        }
      }
    }

    .tab-view {
      position: absolute;
      top: 90px;
      bottom: 0;
      width: 100%;
      height: auto;
      box-sizing: border-box;
    }
  }

  .loading-container {
    loading();
  }
}
</style>
