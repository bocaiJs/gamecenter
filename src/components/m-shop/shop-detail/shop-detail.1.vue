<template>
  <transition name="slider">
    <div class="shopdetail">
      <m-header>
        <template slot="header">
          <back-icon></back-icon>
          <p>{{titleText}}</p>
          <div class="right-button">
            <question-mark></question-mark>
          </div>
        </template>
      </m-header>
      <div
        class="detailbox"
        v-show="isloading"
        ref="detailbox"
      >
        <scroll class="wrapper">
          <div>
            <div class="item">
              <div class="box">
                <div class="img">
                  <img
                    :src="detailInfo.image"
                    alt=""
                  >
                </div>
                <div class="info">
                  <h3>{{detailInfo.title}}</h3>
                  <p>
                    <img
                      src="../shop-index/jinbi@3x.png"
                      alt=""
                      style="width:12px;height:12px;"
                    >
                    所需积分:
                    <span class="blue">{{detailInfo.score}}</span>
                  </p>
                  <p>剩余:
                    <span class="purple">{{detailInfo.goods_code_count - detailInfo.receive_num}}</span>
                  </p>
                  <div
                    class="btn"
                    @click="exchangeGoods(detailInfo.id)"
                  >兑换</div>
                </div>
              </div>
              <div class="bottom">
                <div class="title">商品说明:</div>
                <p>
                  {{detailInfo.description}}
                </p>
              </div>
            </div>
            <div class="tips">
              <img
                src="./zhu@3x.png"
                alt=""
              >
              <p>确认兑换后不予退还</p>
            </div>
          </div>
        </scroll>
      </div>
      <mask-common
        :showMask="showMask"
        :maskInfo="maskInfo"
        @mask="hideMask"
        :dhcode="dhcode"
        :title="titleText"
      ></mask-common>
      <div
        class="loading-container"
        v-show="!isloading"
      >
        <loading></loading>
      </div>
      <router-view></router-view>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
import MHeader from '@/components/m-header/m-header';
import Loading from '@/base/loading/loading';
import Scroll from '@/base/scroll/scroll';
import MaskCommon from '@/base/maskcommon/maskforgame';
import { getCommonInfoHasData, postInfo } from '@/base/api/indexpage/getindexinfo';
import { mapGetters } from 'vuex';
import BackIcon from '@/base/icon_widget/arrow_back';
import QuestionMark from '@/base/icon_widget/questionmark';

export default {
  data() {
    return {
      exchange: true,
      titleText: '兑换详情',

      detailInfo: {},
      isloading: false,
      showMask: false,
      dhcode: '',
      maskInfo: {
        content: '',
        btn: [],
      },
      id: 0,
    };
  },
  mounted() {
    this.$refs.detailbox.style.top = (44 + parseInt(this.statusbar)) + 'px';
  },
  created() {
    this.id = this.$route.params.id;
    this._getDetailInfo(this.id);
  },
  activated() {
    this._getDetailInfo(this.id);
  },
  methods: {
    aboutEx() {
      this.$router.push({
        path: `/shop/detail/${this.id}/about`,
        query: {
          type: 2,
        },
      });
    },
    _getDetailInfo(id) {
      const path = '/shop/goodInfo';
      getCommonInfoHasData(path, {
        id,
      }).then((res) => {
        this.isloading = true;
        this.detailInfo = res;
      });
    },
    exchangeGoods(id) {
      if (!this.getLoginState) {
        this.showMask = true;
        this.maskInfo.content = '请先登录';
        this.maskInfo.btn[0] = {
          btnTitle: '知道了',
          type: 'hide',
        };
        this.maskInfo.btn[1] = {
          btnTitle: '去登录',
          type: 'login',
        };
        return;
      }
      const path = '/shop/getShopGood';
      postInfo(path, {
        good_id: id,
        token: this.getToken,
      }).then((res) => {
        this.maskInfo.btn = [];
        if (res.status_code === 200) {
          this.showMask = true;
          this.maskInfo.extendtips = '兑换成功';
          this.maskInfo.content = '您的验证码为:';
          this.maskInfo.btn[0] = {
            btnTitle: '复制',
            type: 'copy',
            theme: 'light',
          };
          console.log(this.dhcode);
          this.dhcode = res.code;
        } else {
          this.showMask = true;
          this.maskInfo.content = res.message;
          this.maskInfo.extendtips = '兑换失败';
          this.maskInfo.btn[0] = {
            btnTitle: '知道了',
            type: 'hide',
          };
          this.dhcode = '';
        }
      });
    },
    hideMask() {
      this.showMask = false;
    },
  },
  computed: {
    ...mapGetters(['getToken', 'getLoginState', 'statusbar']),
  },
  components: {
    MHeader,
    Scroll,
    Loading,
    MaskCommon,
    BackIcon,
    QuestionMark,
  },
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~common/stylus/variable';
@import '~common/stylus/mixin';

slider();

.shopdetail {
  position: fixed;
  width: 100%;
  top: 0;
  bottom: 0;
  background: #f2f2f2;

  .detailbox {
    sub-position();
    background: #f2f2f2;

    .wrapper {
      height: 100%;
      overflow: hidden;

      .item {
        width: 100%;
        background: #ffffff;
        display: flex;
        flex-wrap: wrap;
        padding-bottom: 2px;

        &:first-child {
          margin-top: 0;
        }

        &:last-child {
        }

        .box {
          width: 100%;
          padding: 12px 0;
          padding: 12px 0 12px 10px;
          box-sizing: border-box;
          display: flex;
          align-items: center;

          .img {
            height: 100%;
            width: 50%;

            img {
              display: block;
              width: 100%;
            }
          }

          .info {
            width: 50%;
            height: 100%;
            padding-left: 10px;
            padding-top: 4px;

            // display: flex;
            // flex-direction: column;
            // justify-content: space-between;
            h3 {
              color: #333333;
              font-size: 16px;
              font-weight: bold;
            }

            p {
              font-size: 12px;
              color: #555555;
              margin-top: 8px;

              .blue {
                color: #1faed6;
              }

              .purple {
                color: #fe5ba8;
              }
            }

            .btn {
              margin-top: 10px;
              width: 80px;
              height: 36px;
              background: #1faed6;
              color: #ffffff;
              line-height: 36px;
              text-align: center;
              font-size: 16px;
              border-radius: 18px;
              font-weight: bold;
            }
          }
        }

        .bottom {
          padding: 4px 0;
          width: 100%;
          line-height: 16px;
          background: #ffffff;
          padding: 10px;
          box-sizing: border-box;
          border-top: 1px solid #eeeeee;

          .title {
            font-size: 14px;
            margin-bottom: 10px;
            color: #333333;
          }

          p {
            font-size: 14px;
            color: #333333;
            line-height: 22px;
          }
        }
      }

      .tips {
        display: flex;
        padding: 10px 0;
        padding-left: 15px;
        font-size: 12px;
        color: #555555;

        img {
          display: inline-block;
          width: 12px;
          height: 12px;
          margin-right: 6px;
        }
      }
    }
  }

  .loading-container {
    loading();
  }
}
</style>

