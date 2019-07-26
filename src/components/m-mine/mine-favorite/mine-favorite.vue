<template>
  <transition name="slider">
    <div class="favorite">
      <m-header>
        <template slot="header">
          <back-icon></back-icon>
          <p style="padding-right:46px">{{titleText}}</p>
        </template>
      </m-header>
      <div
        class="favoritbox"
        ref="favoritbox"
      >
        <scroll
          class="favoritwrapper"
          :pullUpLoad=pullUpLoad
          :data=data
          @pullingUp='getFavorit'
          ref="favoritwrapper"
          v-if="!isLoading"
        >
          <div
            class="wrapper"
            v-if="apps.length"
          >
            <discount-item
              v-for="(game,index) in apps"
              :gameinfo=game
              :key="index"
            ></discount-item>
            <loading-more v-if="page <totalPage"></loading-more>
          </div>
          <div
            v-else
            class="tipwrapper"
          >
            <err-tip
              :tipText=errTipText
              :showButton=showButton
              :buttonText=buttonText
              :type=2
              @refresh='goGmaPage'
            ></err-tip>
          </div>
        </scroll>
      </div>
      <router-view></router-view>
      <div
        class="loading-container"
        v-if="isLoading"
      >
        <loading></loading>
      </div>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
import MHeader from '@/components/m-header/m-header';
import Scroll from '@/base/scroll/scroll';
import Loading from '@/base/loading/loading';
import { getCommonInfoHasData } from '@/base/api/indexpage/getindexinfo';
import { mapGetters } from 'vuex';
import BackIcon from '@/base/icon_widget/arrow_back';
import LoadingMore from '@/base/loadingmore/loading';
import ErrTip from '@/base/errortipwidget/errortipwidget';
import DiscountItem from './item/favorite_item';

export default {
  data() {
    return {
      titleText: '我的收藏',
      errTipText: '连一款游戏都没有',
      apps: [],
      page: 1,
      pullUpLoad: true,
      data: 0, // 通知scroll组件 更新上拉状态
      totalPage: 1,
      isLoading: true,
      showButton: true, // 提示页是否展示按钮
      buttonText: '去看看', // 提示按钮文案
    };
  },
  created() {
    this._getInfo();
  },
  mounted() {
    this.$refs.favoritbox.style.top = 44 + parseInt(this.statusbar) + 'px';
  },
  methods: {
    _getInfo() {
      const address = '/user/follow';
      getCommonInfoHasData(address, {
        page: this.page,
        token: this.getToken,
      }).then((res) => {
        this.isLoading = false;
        // this.apps = res.data.list;
        this.apps.push.apply(this.apps, res.data.list);
        this.page = res.data.currentPage + 1;
        this.totalPage = Math.ceil(res.data.total / res.data.pageSize);
        this.data++;
      });
    },
    getFavorit() {
      if (this.page <= this.totalPage) {
        this._getInfo();
      }
    },
    goGmaPage() {
      this.$router.push({
        path: '/gamemod',
      });
    },
  },
  computed: {
    ...mapGetters(['getToken', 'statusbar']),
  },
  components: {
    MHeader,
    Scroll,
    Loading,
    BackIcon,
    DiscountItem,
    LoadingMore,
    ErrTip,
  },
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~common/stylus/variable';
@import '~common/stylus/mixin';

slider();

.favorite {
  position: fixed;
  width: 100%;
  top: 0;
  bottom: 0;
  background: #ffffff;

  .favoritbox {
    sub-position();
    background: #ffffff;
    top: 68px;

    .favoritwrapper {
      overflow: hidden;
      height: 100%;

      .wrapper {
        .game-list {
          width: 100%;
          margin-top: 10px;
          box-shadow: 0 -2px 5px #d1d0d0;
          background: #ffffff;
          padding: 0 10px;
          box-sizing: border-box;

          &:first-child {
            margin: 0;
          }

          h3 {
            padding: 15px 0;
            color: #222222;
            font-weight: bold;
          }

          .item {
            display: flex;
            align-items: center;
            height: 100px;
            padding-top: 1px;
            box-sizing: border-box;
            position: relative;
            text-decoration: none;
            border-bottom: 1px solid #eeeeee;

            .icon {
              height: 80px;
              position: absolute;
              left: 0;
              top: 9px;

              img {
                height: 100%;
              }
            }

            .item-content {
              margin-left: 100px;
              display: flex;
              flex-direction: column;
              align-items: flex-start;

              h3 {
                font-size: $font-size-large;
                margin: 0;
                color: #333333;
                padding: 0;
                display: flex;
                align-items: center;

                .discount {
                  box-sizing: border-box;
                  padding-left: 7px;
                  font-size: 12px;
                  display: inline-block;
                  width: 43px;
                  height: 18px;
                  background: url('../../../../static/zhe.png') no-repeat;
                  background-size: 43px 18px;
                  margin-left: 4px;
                  line-height: 18px;
                  color: #ffffff;
                  text-align: center;
                }
              }

              .star {
                .star-wrapper {
                  width: 50px;
                  display: inline-block;
                  height: 10px;
                  position: relative;
                  overflow: hidden;

                  .star-icon {
                    position: absolute;
                    left: 0;
                    top: 0;
                    display: inline-block;
                    height: 10px;
                    background: url('./star.png');
                    background-size: 10px 10px;
                  }
                }

                .score {
                  font-size: $font-size-small;
                  padding: 3px 0;
                  color: $color-font;
                }
              }
            }

            .type {
              margin-top: 4px;

              .game-desc {
                box-sizing: border-box;
                width: 34px;
                height: 15px;
                border: 1px solid #febf01;
                border-radius: 5px;
                font-size: $font-size-small;
                color: #febf01;
                padding: 2px 4px;
                margin-right: 6px;
              }
            }

            .downbtn {
              position: absolute;
              right: 0;
              top: 30px;
              downloadbtn();
            }
          }
        }
      }

      .tipwrapper {
        display: flex;
        align-items: center;
        justify-content: center;
        margin-top: 100px;
      }
    }
  }

  .loading-container {
    loading();
    z-index: 99999;
  }
}
</style>

