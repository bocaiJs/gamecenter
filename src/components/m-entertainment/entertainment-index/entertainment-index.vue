<template>
  <div class="entertainmentindex">
    <m-header>
      <template slot="header">
        <p>
          圈子
        </p>
      </template>
    </m-header>
    <div class="wrapper">
      <scroll style="overflow:hidden;position: absolute; left: 0; right: 0;top: 0;bottom: 0;">
        <div>
          <div v-show="!showLoading">
            <div
              class="swiper-wrapper"
              style="padding-top:50%;background:#eeeeee;position:relative"
              v-if="sliderData.length>=1"
            >
              <swiper
                :options="swiperOption"
                ref="swiper"
                v-if="sliderData.length>=1"
                style="top: 0px; bottom: 0;left: 0; right: 0;position: absolute;"
              >
                <swiperSlide
                  v-for="slider in sliderData"
                  class="item"
                  @click="goVideoDetail(slider.id)"
                  :key="slider.id"
                >
                  <router-link
                    :to="'/service/video/detail?id='+slider.id"
                    tag="a"
                  >
                    <h3>{{slider.title}}</h3>

                    <img
                      :src="slider.thumb"
                      alt=""
                    >
                    <i class="mask"></i>
                    <i class="play-icon"></i>
                  </router-link>
                </swiperSlide>
                <div
                  class="swiper-pagination"
                  slot="pagination"
                ></div>
              </swiper>
            </div>
            <!-- 四个分类 -->
            <div class="sort">
              <router-link to="/service/article/2">
                <span class="imgdesc zhoubao"></span>
                <span>天橙周报</span>
              </router-link>
              <router-link to="/service/article/0">
                <span class="imgdesc shiping"></span>
                <span>精选视频</span>
              </router-link>
              <router-link to="/service/article/1">
                <span class="imgdesc quwen"></span>
                <span>休闲趣文</span>
              </router-link>
              <div @click="goSubPage('school')">
                <span class="imgdesc xuetang"></span>
                <span style="color: #7e8c8d;">小天学堂</span>
              </div>
            </div>
            <!-- 四个分类 -->
            <!-- 第二个swiper -->
            <div class="swiper-row">
              <div class="innerBox">
                <swiper
                  :options="swiperOption2"
                  ref="swiper"
                  v-if="adSliderData.length>=1"
                  style="top: 0px; bottom: 0;left: 0; right: 0;position: absolute;"
                >
                  <swiperSlide
                    v-for="(slider,index) in adSliderData"
                    class="item"
                    @click="goVideoDetail(slider.id)"
                    :key="index"
                    :style="{'border-radius':'10px'}"
                  >
                    <!-- @click="goTV(item.url,'平台活动')" -->
                    <!-- :to="'/service/tv?tvurl='+slider.url" -->
                    <router-link
                      :to="`/service/tv?tvurl=${slider.url}&title=`"
                      tag="a"
                    >
                      <h3>{{slider.title}}</h3>

                      <img
                        :src="slider.image_url"
                        alt=""
                      >
                    </router-link>
                  </swiperSlide>
                  <div
                    ref="bluepagination"
                    class="swiper-pagination swiper-two-pagination"
                    slot="pagination"
                    :style="{'bottom':'-20px'}"
                  ></div>
                </swiper>
              </div>
              <!-- 第二个swiper -->

            </div>
            <!-- 轮轮转 -->
            <router-link
              class="game"
              to="/service/luck"
            >
              <img
                :src="activity_image"
                alt=""
              >
            </router-link>
            <!-- 轮轮转 -->
            <!-- 新闻公告 -->
            <div class="news">
              <div class="news-tab">
                <span
                  :class="{active:activity_index === 0}"
                  @click="changeIndex(0)"
                >平台活动</span>
                <span
                  :class="{active:activity_index === 1}"
                  @click="changeIndex(1)"
                >游戏活动</span>
              </div>
              <div
                class="new-view"
                v-if="activity_index === 0"
              >
                <div
                  class="item"
                  v-for="(item,index) in activity_platform"
                  @click="goTV(item.url,'平台活动')"
                  :key=index
                >
                  <div class="left">
                    <p class="title">{{item.title}}</p>
                    <p class="content">{{item.description}} </p>
                    <p class="date">2019/04/16</p>
                  </div>
                  <div class="right">
                    <img
                      :src="item.thumb"
                      alt=""
                      class="right"
                    >
                  </div>
                </div>
              </div>
              <div
                class="new-view"
                v-else
              >
                <div
                  class="item"
                  v-for="(item,index) in activity_game"
                  @click="goArticle(item.id,'游戏活动')"
                  :key=index
                >
                  <div class="left">
                    <p class="title">{{item.title}}</p>
                    <p class="content">{{item.description}} </p>
                    <p class="date">2019/04/16</p>
                  </div>
                  <div class="right">
                    <img
                      :src="item.thumb"
                      alt=""
                      class="right"
                    >
                  </div>
                </div>
              </div>
            </div>
            <!-- 新闻公告 -->
          </div>
        </div>
      </scroll>
      <div
        class="loading-container "
        v-if="showLoading"
      >
        <loading></loading>
      </div>
    </div>
    <router-view></router-view>
    <mask-common
      :showMask="showMask"
      @mask="hideMask"
      :maskInfo="maskInfo"
    ></mask-common>

  </div>
</template>

<script>
import Slider from '@/base/slider/slider';
import MHeader from 'components/m-header/m-header';
import Loading from '@/base/loading/loading';
import { getCommonInfo } from '@/base/api/indexpage/getindexinfo';
import { mapGetters } from 'vuex';
// import MaskCommon from '@/base/maskcommon/maskcommon';
import MaskCommon from '@/base/maskcommon/maskforgame';
import 'swiper/dist/css/swiper.css';
import { swiper, swiperSlide } from 'vue-awesome-swiper';
import Scroll from '@/base/scroll/scroll';

export default {
  data() {
    return {
      titleText: '娱乐',
      activity_image: '',
      sliderData: [],
      adSliderData: [],
      activity_platform: [],
      activity_game: [],
      activity_index: 0,
      sliderNum: 0,
      showLoading: true,
      showMask: false,
      maskInfo: {
        content: '',
        btn: [],
      },
      swiperOption: {
        threshold: 30,
        loop: true,
        observer: true,
        observeParents: true,
        pagination: {
          el: '.swiper-pagination',
        },
      },
      swiperOption2: {
        threshold: 30,
        loop: true,
        autoplay: true,
        effect: 'coverflow',
        spaceBetween: 40,
        grabCursor: true,
        centeredSlides: true,
        slidesPerView: 'auto',
        pagination: {
          el: '.swiper-two-pagination',
          bulletClass: 'my-bullet',
          bulletActiveClass: 'my-bullet-active',
        },
        coverflowEffect: {
          rotate: 0,
          stretch: 0,
          depth: 100,
          modifier: 2,
          slideShadows: false,
        },
      },
    };
  },
  mounted() {
    this._getIndexData();
  },
  methods: {
    changeIndex(index) {
      this.activity_index = index;
    },
    test(e) {
      console.log(e);
    },
    _getIndexData() {
      getCommonInfo('/amuse/index').then((res) => {
        this.sliderData = res.videoList;
        this.adSliderData = res.adsList;
        this.activity_game = res.activity_game;
        this.activity_platform = res.activity_platform;
        this.activity_image = res.image_url;
        this.sliderNum = this.sliderData.length;

        console.log(res);
        this.$nextTick(() => {
          this.showLoading = false;
        });
      });
    },
    goArticle(id, title) {
      console.log(id);
      this.$router.push({
        path: `/articledetail/${id}`,
        query: {
          title,
        },
      });
    },
    goVideoDetail(id) {
      console.log(id);
      if (this.getLoginState) {
        this.$router.push({
          path: '/service/video/detail',
          query: {
            id,
          },
        });
      } else {
        this.showLoginBox();
      }
    },
    goSubPage(address) {
      if (this.getLoginState) {
        const path = `/service/${address}`;
        this.$router.push({
          path,
        });
      } else {
        this.showLoginBox();
      }
    },
    showLoginBox() {
      this.showMask = true;
      this.maskInfo.content = '用户未登录';
      this.maskInfo.btn[0] = {
        btnTitle: '知道了',
        type: 'hide',
        theme: 'dark',
      };
      this.maskInfo.btn[1] = {
        btnTitle: '去登录',
        type: 'login',
      };
    },
    hideMask() {
      this.showMask = false;
    },
    goTV(tvurl, title) {
      this.$router.push({
        path: '/service/tv',
        query: {
          tvurl,
          title: Base64.encode(title),
        },
      });
    },
  },
  computed: {
    ...mapGetters(['getLoginState']),
  },
  components: {
    Slider,
    MHeader,
    Loading,
    MaskCommon,
    swiper,
    swiperSlide,
    Scroll,
  },
};
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~common/stylus/variable';
@import '~common/stylus/mixin';

.my-bullet {
  width: 8px;
  height: 8px;
  display: inline-block;
  border-radius: 100%;
  background: #eeeeee;
}

.entertainmentindex {
  position: fixed;
  width: 100%;
  top: 0;
  bottom: 50px;
  overflow: scroll;
  background: #ffffff;
  overflow-x: hidden;
  display: flex;
  flex-direction: column;

  .wrapper {
    position: relative;
    flex: 1;

    .loading-container {
      loading();
    }

    .sort {
      width: 100%;
      height: 126px;
      box-sizing: border-box;
      padding-left: 15px;
      padding-right: 15px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 16px;
      color: #333333;
      border-bottom: 10px solid #f5f5f5;

      .imgdesc {
        display: block;
        width: 60px;
        height: 60px;
        border-radius: 30px;
        margin-bottom: 10px;

        &.zhoubao {
          bg-image('zhoubao');
          background-size: cover;
        }

        &.shiping {
          bg-image('shiping');
          background-size: cover;
        }

        &.quwen {
          bg-image('quwen');
          background-size: cover;
        }

        &.xuetang {
          bg-image('xuetang');
          background-size: cover;
        }
      }
    }

    .swiper-row {
      height: 150px;
      width: 100%;

      .innerBox {
        width: 80%;
        height: 110px;
        margin: 20px auto;
        position: relative;
        box-sizing: border-box;

        .swiper-two-pagination {
          .swiper-pagination-bullet {
            background: '#d1d1d1';
          }
        }
      }
    }

    .game {
      width: 100%;
      height: 140px;
      background: #f5f5f5;
      display: flex;
      align-items: center;
      justify-content: center;

      img {
        width: 90%;
      }
    }

    .news {
      padding-left: 12px;
      padding-right: 12px;
      background: #ffffff;
      box-sizing: border-box;

      .news-tab {
        height: 50px;
        display: flex;
        align-items: center;

        span {
          font-size: 18px;
          color: #333333;
          display: inline-block;
          padding: 0 12px;

          &.active {
            font-weight: bold;
          }

          &:first-child {
            padding-left: 0;
            border-right: 1px solid #bfbfbf;
          }
        }
      }

      .new-view {
        .item {
          padding: 12px;
          width: 100%;
          height: 120px;
          margin-bottom: 15px;
          border-radius: 10px;
          box-shadow: 0 0 20px #dddddd;
          box-sizing: border-box;
          display: flex;
          align-items: flex-start;
          justify-content: space-between;

          .left {
            height: 100%;
            width: calc(100% - 140px);
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            font-size: 14px;
            color: #333333;

            .title {
              font-weight: bold;
              padding-right: 6px;
              text-over();
            }

            .content {
              line-height: 21px;
              text-overflow: -o-ellipsis-lastline;
              overflow: hidden;
              text-overflow: ellipsis;
              display: -webkit-box;
              -webkit-line-clamp: 2;
              line-clamp: 2;
              -webkit-box-orient: vertical;
              padding-right: 6px;
            }

            .date {
              color: #999999;
            }
          }

          .right {
            display: block;
            width: 140px;
            height: 84px;
            overflow: hidden;

            img {
              width: 100%;
              height: 100%;
            }
          }
        }
      }
    }

    .swiper-container {
      z-index: 0;

      .swiper-slide {
        position: relative;
        width: 100%;
        height: 100%;
        overflow: hidden;

        h3 {
          position: absolute;
          top: 15px;
          left: 15px;
          font-size: 16px;
          color: #ffffff;
          z-index: 1;
        }

        .mask {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          zindex: 0;
        }

        .play-icon {
          position: absolute;
          height: 40px;
          width: 40px;
          top: 50%;
          left: 50%;
          transform: translate3d(-50%, -50%, 0);
          z-index: 1;
          background: url('./bf@2x.png') no-repeat;
          background-size: cover;
        }
      }

      img {
        display: block;
        width: 100%;
        heihgt: 100%;
      }
    }

    .yule-item {
      position: relative;
      background: red;

      h3 {
        position: absolute;
        top: 15px;
        left: 15px;
        font-size: 16px;
        color: #ffffff;
        z-index: 1;
      }

      .mask {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.5);
        zindex: 0;
      }

      .play-icon {
      }
    }

    .entertainmentbox {
      width: 100%;
      box-sizing: border-box;
      padding: 0 15px;
      display: flex;
      flex-wrap: wrap;

      // position: fixed;
      // bottom: 51px;
      .item {
        width: 48%;
        box-sizing: border-box;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-right: 4%;
        margin-top: 15px;

        img {
          width: 100%;
        }

        &:nth-child(2n) {
          margin-right: 0;
        }
      }
    }
  }
}
</style>

