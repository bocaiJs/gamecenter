<template>
  <transition name="slider">
    <div class="notice-detail">
      <m-header>
        <template slot="header">
          <arrow-back></arrow-back>
          <p style="text-align:left">
            {{titleText}}
          </p>
        </template>
      </m-header>
      <div
        class="newsbox"
        ref="newsbox"
      >
        <div
          class="notice-wrapper"
          v-if="!showLoading"
        >
          <h3>{{articleInfo.title}}</h3>
          <p class="newsdate">作者名称:<span>天橙游玩官方</span>发布时间:{{articleInfo.created_at}}</p>
          <div
            class="newbody"
            v-html="articleInfo.content"
            id="newbody"
          >
          </div>
        </div>

      </div>
      <div
        class="loading-container"
        v-if="showLoading"
      >
        <loading></loading>
      </div>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
import Scroll from '@/base/scroll/scroll';
import MHeader from 'components/m-header/m-header';
import Loading from '@/base/loading/loading';
import ArrowBack from '@/base/icon_widget/arrow_back';
import { getCommonInfo } from '@/base/api/indexpage/getindexinfo';
import { mapGetters } from 'vuex';

// const ISNOTICE = '公告详情';
// const ISGONGLUE = '攻略详情';
export default {
  name: 'articledetail',
  data() {
    return {
      titleText: '',
      articleInfo: {},
      showLoading: true,
      data: 0,
      isNotice: false,
    };
  },
  created() {
    this.id = this.$route.params.newsId;
    this.titleText = this.$route.query.title;
    // if (this.titleText === ISNOTICE || this.titleText === ISGONGLUE) {
    //   this.isNotice = true;
    // }
    this._getCommonInfo();
  },
  mounted() {
    this.$refs.newsbox.style.top = (44 + parseInt(this.statusbar)) + 'px';
  },
  activated() {
    console.log('页面被激活');
  },
  methods: {
    _getCommonInfo() {
      let address = `/article/detail/${this.id}`;
      getCommonInfo(address).then((res) => {
        console.log(res);
        this.showLoading = false;
        if (res.data === null) {
          return;
        }
        this.articleInfo = res.articleInfo;
        this.articleInfo.created_at = this.articleInfo.created_at.substr(0, 10);
        this.$nextTick(() => {
          this.showLoading = false;
          this.data++;
        });
      });
    },
  },
  computed: {
    ...mapGetters(['statusbar']),
  },

  components: {
    MHeader,
    Scroll,
    Loading,
    ArrowBack,
  },
};
</script>

<style lang="stylus" rel="stylesheet/stylus">
@import '~common/stylus/variable';
@import '~common/stylus/mixin';

slider();

.notice-detail {
  position: fixed;
  top: 0;
  bottom: 0;
  width: 100%;
  background: $color-background;
  background: #ffffff;

  .newsbox {
    sub-position();
    top: 68px;
    overflow: scroll;

    .notice-wrapper {
      padding: 15px;
      color: #222222;
      overflow: scroll;
      -webkit-overflow-scrolling: touch;

      &::-webkit-scrollbar {
        display: none;
      }

      &::-webkit-scrollbar {
        width: 0px;
      }

      h3 {
        font-size: $font-size-medium-x;
        text-align: center;
        font-weight: bold;
      }

      .newsdate {
        text-align: left;
        font-size: $font-size-medium;
        padding: 10px 0 20px 0;

        span {
          display: inline-block;
          margin-right: 10px;
          color: #4abee0;
        }
      }

      img {
        display: block;
        max-width: 80%;
        margin: 0 auto;
      }

      .newbody {
        font-size: $font-size-medium;
        // text-indent: 14px;
        line-height: 28px;
        // padding-bottom: 60px;
        overflow: hidden;

        img {
          display: block !important;
          max-width: 100% !important;
          padding: 14px 0 !important;
          margin: 0 auto !important;
        }

        p {
          img {
            display: block;
            max-width: 80%;
            margin: 0 auto;
            // text-indent: 28px;
          }
        }
      }

      .prisenum {
        height: 50px;
        display: flex;
        justify-content: flex-end;
        align-items: center;
        font-size: 12px;
        color: #999999;

        .icon {
          display: inline-block;
          width: 14px;
          height: 14px;
          margin-right: 4px;

          &.comment {
            bg-image('pingl');
            background-size: cover;
          }

          &.parise {
            bg-image('parise');
            background-size: cover;

            &.active {
              bg-image('hdz');
              background-size: cover;
            }
          }
        }
      }
    }

    .user-comment {
      height: 300px;
      width: 100%;
      background: #f5f5f5;

      .title {
        display: flex;
        justify-content: space-between;
        padding: 20px 15px;
        font-size: 14px;
        color: #333333;

        .icon {
          display: inline-block;
          width: 14px;
          height: 14px;
          bg-image('pingl_active');
          background-size: cover;
        }

        .pingl {
          color: #08a7d5;
          text-indent: 6px;
        }
      }

      .comment-item {
        display: flex;
        flex-direction: column;
        padding: 0 15px;

        .avatar {
          display: flex;
          height: 36px;
          align-items: center;
          padding: 10px 0;

          img {
            height: 36px;
          }

          .nickname {
            font-weight: bold;
            color: #222222;
            font-size: 12px;
            text-indent: 6px;
          }
        }

        .content {
          display: flex;
          flex-direction: row;

          .left {
            flex: 1;
            box-sizing: border-box;
            padding-right: 30px;
            font-size: 12px;
            line-height: 18px;
            color: #333333;
          }

          .right {
            font-size: 12px;
            color: #bbbbbb;
            display: flex;

            .prise {
              display: inline-block;
              width: 14px;
              height: 14px;
              bg-image('parise');
              background-size: cover;
            }

            .prise_no {
              display: inline-block;
              margin-top: 3px;
              margin-left: 6px;
            }
          }
        }

        .comment-date {
          margin-top: 8px;
          font-size: 12px;
          color: #999999;
        }
      }
    }
  }

  .loading-container {
    loading();
  }
}
</style>
