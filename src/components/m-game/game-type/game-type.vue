<template>
  <transition name="slider">
    <div class="game-tag">
      <m-header
        :canreturn=true
        :type="1"
        :titleText="titleText"
        :down="down"
        @confirm="goDownPage"
      ></m-header>
      <div
        class="type-wrapper"
        ref="typewrapper"
      >
        <scroll
          class="wrapper"
          :pullUpLoad=pullUpLoad
          :data=data
          @pullingUp='getMoreGame'
        >
          <div>
            <div class="g-type">
              <div
                class="item"
                v-for="(item,index) in  gametags"
                :key=index
                v-if="type ===1"
                @click="changeType(item.id)"
              >
                <span :class="{active:item.id === id}">{{item.cateName}}</span>
              </div>
              <div
                class="item"
                v-for="(item,index) in  gametags"
                :key=index
                v-if="type ===2"
                @click="changeType(item.id)"
              >
                <span :class="{active:item.id === id}">{{item.tagName}}</span>
              </div>
            </div>
            <div class="g-detail">
              <div class="game-list">
                <div
                  class="item"
                  v-for="(list,index) in gameList"
                  :key=index
                  @click="goGameDetail(list.gameId)"
                >
                  <div>
                    <div class="icon">
                      <img
                        v-lazy="list.gameIcon"
                        alt=""
                      >
                    </div>
                    <div class="item-content">
                      <h3>{{list.gameName}}
                        <span class="discount">{{list.discount}}折</span>
                      </h3>
                      <div class="star">
                        <div class="star-wrapper">
                          <span
                            class="star-icon"
                            :style="{ width: list.star*20+'%' }"
                          ></span>
                        </div>
                        <p class="score">{{list.size}}</p>
                        <div class="type">
                          <span
                            class="game-desc"
                            v-for="(type,index) in list.tagsName"
                            :key=index
                          >{{type}}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <button class="downbtn">详情</button>
                </div>
              </div>
            </div>
            <div
              class="loading-container"
              v-show="isloading"
            >
              <loading></loading>
            </div>
          </div>
        </scroll>
      </div>
      <keep-alive include="MGameDown">
        <router-view></router-view>
      </keep-alive>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
import MHeader from 'components/m-header/m-header';
import Loading from '@/base/loading/loading';
import Scroll from '@/base/scroll/scroll';
import { getCommonInfoHasData } from '@/base/api/indexpage/getindexinfo';
import { mapGetters } from 'vuex';

export default {
  data() {
    return {
      titleText: '游戏类型',
      pullUpLoad: true,
      data: 0,
      id: 0,
      type: 0,
      page: 1,
      totalPage: 1,
      gameList: [],
      isloading: true,
      down: true,
    };
  },
  created() {
    this.id = this.$route.query.id;
    this.type = this.$route.query.type;
    this.titleText = this.type === 1 ? '游戏类型' : '游戏特色';
    this._getGame();
  },
  mounted() {
    this.$refs.typewrapper.style.top = (44 + parseInt(this.statusbar)) + 'px';
  },
  methods: {
    goGameDetail(id) {
      this.$router.push({
        path: `/gamemod/type/${this.id}/gamedetail/${id}`,
        query: {
          commentAddress: `/gamemod/type/${this.id}/gamedetail`,
        },
      });
    },
    changeType(id) {
      this.id = id;
      this.page = 1;
      this.totalPage = 1;
      this.gameList = [];
      this.isloading = true;
      this._getGame();
    },
    goDownPage() {
      this.$router.push(`/gamemod/type/${this.id}/down`);
    },
    downGame(icon, android) {
      console.log(android);
    },
    _getGame() {
      const address = this.type === 1 ? `/game/cate/${this.id}` : `/game/tag/${this.id}`;
      getCommonInfoHasData(address, {
        id: this.id,
        page: this.page,
      }).then((res) => {
        this.page = res.data.currentPage + 1;
        this.totalPage = Math.ceil(res.data.total / res.data.pageSize);
        setTimeout(() => {
          this.gameList.push.apply(this.gameList, res.data.list);
          this.data++;
          this.isloading = false;
        }, 200);
      });
    },
    getMoreGame() {
      if (this.page <= this.totalPage) {
        this._getGame();
      }
    },
  },
  computed: {
    ...mapGetters(['gametags', 'statusbar']),
  },
  components: {
    MHeader,
    Loading,
    Scroll,
  },
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~common/stylus/variable';
@import '~common/stylus/mixin';

slider();

.game-tag {
  position: fixed;
  top: 0;
  bottom: 0;
  width: 100%;
  background: #ffffff;
  z-index: 10;

  .type-wrapper {
    sub-position();
    background: #ffffff;
    z-index: 0;

    .wrapper {
      height: 100%;
      overflow: hidden;

      .g-type {
        border-bottom: 1px solid #cccccc;
        display: flex;
        flex-wrap: wrap;
        padding: 0 15px;
        padding-top: 15px;
        box-sizing: border-box;

        .item {
          // width: 25%;
          height: 30px;
          padding: 0 4px;
          margin-bottom: 15px;
          box-sizing: border-box;

          span {
            display: block;
            box-sizing: border-box;
            width: 100%;
            height: 100%;
            border-radius: 15px;
            border: 1px solid #ffc400;
            background: #ffffff;
            color: 555555;
            text-align: center;
            line-height: 30px;
            padding: 0 10px;

            &.active {
              background: #ffc400;
              color: #ffffff;
            }
          }
        }
      }

      .g-detail {
        .game-list {
          width: 100%;
          margin-top: 10px;
          // box-shadow: 0 -2px 5px #d1d0d0;
          background: #ffffff;
          padding: 0 10px;
          box-sizing: border-box;

          // &:first-child {
          // margin: 0;
          // }
          h3 {
            padding: 15px 0;
            color: #222222;
            font-weight: bold;
          }

          .item {
            display: flex;
            align-items: center;
            height: 110px;
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
                margin-right: 1px;
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

      .loading-container {
        margin-top: 20px;
      }
    }
  }
}
</style>
