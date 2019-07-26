<template>
  <transition name="slider">
    <div
      class="libao-detail"
      style="height:100%"
    >
      <m-header
        :canreturn=true
        :type="2"
        @search="searchGift"
      ></m-header>
      <div
        class="libao-list"
        v-show="giftData"
        ref="libao"
      >
        <scroll
          class="libao-warpper"
          :data="giftData"
          pullUpLoad=true
          @pullingUp="getMoreGift"
          ref="giftScroll"
        >
          <div style="min-height:100%">
            <div v-show="searchGiftArray.list.length">
              <libao-list
                :giftList="searchGiftArray"
                @getGift='getGift'
              ></libao-list>
            </div>
            <div v-show="!searchGiftArray.list.length">
              <!-- <libao-list :giftList="hotGift" @getGift='getGift' v-show="hotGift.list.length"></libao-list> -->
              <libao-list
                :giftList="newGift"
                @getGift='getGift'
                v-show="newGift.list.length"
              ></libao-list>
            </div>
          </div>
        </scroll>
      </div>
      <mask-common
        :showMask="showMask"
        @mask="hideMask"
        :maskInfo="maskInfo"
        :dhcode="dhcode"
        :showMoreTip=showMoreTip
      ></mask-common>
      <div
        class="loading-container"
        v-show="!giftData"
      >
        <loading></loading>
      </div>

    </div>
  </transition>

</template>

<script type="text/ecmascript-6">
import Scroll from '@/base/scroll/scroll';
import MHeader from '@/components/m-header/m-header';
import LibaoList from '@/base/libaolist/libaolist';
import MaskCommon from '@/base/maskcommon/maskforgame';
import Loading from '@/base/loading/loading';
import { mapGetters } from 'vuex';
import { postInfo, getCommonInfoHasData } from '@/base/api/indexpage/getindexinfo';// getCommonInfoHasData

export default {
  data() {
    return {
      titleText: '游戏排行',
      showMoreTip: false,
      giftData: 0,
      // hotGift: {
      //     title: '热门礼包',
      //     list: [],
      // },
      newGift: {
        title: '近期礼包',
        list: [],
      },
      searchGiftArray: {
        title: '',
        list: [],
      },
      showMask: false,
      page: 1,
      maskInfo: {
        content: '',
        btn: [],
      },
      dhcode: '',
    };
  },
  created() {
    this._getGiftList();
    this.oriNewGift = [];
  },
  mounted() {
    this.$refs.libao.style.top = (44 + parseInt(this.statusbar)) + 'px';
  },
  methods: {
    _getGiftList() {
      const giftAddress = '/gift/code';
      getCommonInfoHasData(giftAddress, {
        page: this.page,
      }).then((res) => {
        console.log(res);
        //  保存原始数据
        this.oriNewGift = res.newGift;

        // this.newGift.list = res.newGift;
        this.newGift.list.push.apply(this.newGift.list, res.newGift);
        if (res.newGift.length > 0) {
          this.page++;
          this.giftData++;
        }
      });
    },
    getMoreGift() {
      console.log('get More Gift');
      this._getGiftList();
    },
    getGift(id) {
      console.log(`父元素收到${id}`);
      console.log(this.getLoginState);
      if (this.getLoginState) {
        const getGiftAddress = '/gift/code/receive';
        postInfo(getGiftAddress, {
          token: this.getToken,
          gid: id,
        }).then((res) => {
          console.log(res);
          if (res.status_code === 200) {
            this.showMask = true;
            this.showMoreTip = true;
            this.maskInfo.content = '您的验证码为:';
            this.maskInfo.extendtips = '领取成功';
            this.maskInfo.btn[0] = {
              btnTitle: '复制',
              type: 'copy',
              theme: 'light',
            };
            this.maskInfo.btn.splice(1, 1);
            this.dhcode = res.code;
          } else {
            this.showMask = true;
            this.showMoreTip = false;
            this.maskInfo.content = res.message;
            this.maskInfo.btn[0] = {
              btnTitle: '知道了',
              type: 'hide',
            };
            this.maskInfo.btn[1] = {
              btnTitle: '去登录',
              type: 'login',
            };
            this.dhcode = '';
          }
        });
      } else {
        this.showMoreTip = false;
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
          theme: 'light',
        };
        this.dhcode = '';
      }
    },
    hideMask() {
      this.showMask = false;
    },
    searchGift(val) {
      const searchGiftAddress = '/search/gift';
      getCommonInfoHasData(searchGiftAddress, { keyword: val }).then((res) => {
        console.log(res);
        this.searchGiftArray.list = res.data;
        console.log(this.searchGiftArray.list.length);
      });
    },
    // 刷新scroll 组件
    refreshScroll() {
      this.$refs.giftScroll.updateScroll();
    },
  },
  computed: {
    ...mapGetters(['getToken', 'getLoginState', 'statusbar']),
  },
  components: {
    Scroll,
    MHeader,
    LibaoList,
    MaskCommon,
    Loading,
  },
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~common/stylus/variable';
@import '~common/stylus/mixin';

slider();

.libao-detail {
  position: fixed;
  top: 0;
  bottom: 0;
  width: 100%;
  background: $color-background;

  .libao-list {
    sub-position();

    .libao-warpper {
      height: 100%;
      overflow: hidden;

      h3 {
        padding: 15px 0;
        color: #222222;
        font-weight: bold;
      }

      .item {
        display: block;
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

          h3 {
            font-size: $font-size-large;
            margin: 0;
            margin-top: 9px;
            color: #333333;
          }

          .star-wrapper {
            width: 50px;
            display: inline-block;
            height: 10px;
            position: relative;

            .star-icon {
              display: inline-block;
              height: 10px;
              background: url('./star.png');
              background-size: 10px 10px;
              position: relative;
            }
          }

          .star {
            .score {
              position: absolute;
              right: -30px;
              top: -3px;
              display: inline-block;
              vertical-align: top;
              color: #555555;
              font-size: 12px;
              transform: translate(0, -1px, 0);
            }
          }
        }

        .type {
          margin-top: 6px;

          .game-desc {
            width: 30px;
            height: 15px;
            border: 1px solid #febf01;
            border-radius: 5px;
            font-size: 12px;
            color: #febf01;
            padding: 2px 4px;
          }
        }

        .downbtn {
          position: absolute;
          right: 20px;
          top: 35px;
          width: 50px;
          height: 30px;
          border-radius: 5px;
          background: #44c7f3;
          text-align: center;
          line-height: 30px;
          color: #ffffff;
          z-index: 10;
          outline: none;
          border: none;
          text-decoration: none;
        }
      }
    }
  }

  .loading-container {
    loading();
    z-index: 99999;
  }
}
</style>
