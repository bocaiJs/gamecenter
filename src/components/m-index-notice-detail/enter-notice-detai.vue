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
        v-if="!showLoading"
      >
        <div class="notice-wrapper">
          <h3>{{articleInfo.title}}</h3>
          <p class="newsdate">作者名称:<span>天橙游玩官方</span>发布时间:{{articleInfo.created_at}}</p>
          <div
            class="newbody"
            v-html="articleInfo.content"
            id="newbody"
          >
          </div>
        </div>
        <div class="prisenum">
          <div style="display:flex;align-items: center;margin-right:20px"><span class="icon comment"></span>{{articleInfo.comments_count}}</div>
          <div style="display:flex;align-items: center;">
            <span
              class="icon parise "
              @click="likeArticle(articleInfo.id)"
              :class="{active:articleInfo.is_like ===1}"
            ></span>{{articleInfo.like_times}}</div>
        </div>
        <div
          class="user-comment"
          ref="userComment"
        >
          <div class="title">
            <span>热门评论</span>
            <div style="display:flex;align-items:center">
              <span class="icon"></span>
              <span
                class="pingl"
                @click="showCommentBox()"
              >评论一下</span>
            </div>
          </div>
          <div
            class="comment-item"
            v-for="(item,index) in articleInfo.comments"
            :key='item.id'
          >
            <div class="avatar">
              <img
                v-lazy="item.avatar"
                alt=""
              >
              <p class="nickname">{{item.nickname}}</p>
            </div>
            <div class="content">
              <div class="left">
                <p>{{item.content}}</p>
              </div>
              <div class="right">
                <span
                  class="prise"
                  :class="{active:item.is_like ===1}"
                  @click="likeComment(item.id,index)"
                ></span>
                <span class="prise_no">{{item.like_times}}</span>
              </div>
            </div>
            <div class="comment-date">
              {{item.created_at}}
            </div>
          </div>

        </div>
        <!-- <scroll
          style="height:100%;overflow:hidden"
          :data=data
          v-if="!showLoading"
        >
          <div ref="scrollbox">
          </div>
        </scroll> -->
      </div>
      <div
        class="subpublish"
        :class="{show:showBox}"
        v-if="!showLoading"
      >
        <div class="text"><textarea
            placeholder="请输入回复内容..."
            v-model="commentcontent"
          ></textarea></div>
        <div
          class="commbtn"
          @click="commentArticle"
        >
          <div class="btn">发布</div>
        </div>
      </div>
      <mask-common
        :showMask="showMask"
        @mask="hideMask"
        :maskInfo="maskInfo"
      ></mask-common>
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
import { getCommonInfoHasData, postInfo } from '@/base/api/indexpage/getindexinfo';
import { mapGetters } from 'vuex';
import MaskCommon from '@/base/maskcommon/maskforgame';

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
      commentcontent: '',
      showMask: false,
      maskInfo: {
        content: '',
        btn: [],
      },
      showBox: false,
      canPrise: true,
    };
  },
  created() {
    console.log(this.$route);
    this.id = this.$route.params.newsId;
    this.type = this.$route.params.type;
    this.titleText = this.$route.query.title;
    this._getCommonInfo();
  },
  mounted() {
    // this.$refs.newsbox.style.top = (44 + parseInt(this.statusbar)) + 'px';
  },
  activated() {
    console.log('页面被激活');
  },
  methods: {
    hideMask() {
      this.showMask = false;
    },
    showCommentBox() {
      this.showBox = !this.showBox;
      if (this.showBox) {
        this.$refs.newsbox.style.paddingBottom = '60px';
        this.data++;
      } else {
        this.$refs.newsbox.style.paddingBottom = '10px';
        this.data++;
      }
    },
    // 展示登录框
    showLogin() {
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
    // 文章点赞
    likeArticle(id) {
      if (!this.canPrise) return;
      this.canPrise = false;
      const url = '/amuse/video/like';
      postInfo(url, {
        id,
        token: this.getToken,
        type_id: this.type,
      }).then((res) => {
        this.canPrise = true;
        if (res.status_code === 200) {
          console.log(this.articleInfo);
          this.articleInfo.is_like = res.is_like;
          this.articleInfo.like_times = res.like_times;
        }
        plus.nativeUI.toast(res.message);
      });
    },
    // 评论点赞
    likeComment(id, index) {
      if (!this.canPrise) return;
      this.canPrise = false;
      const url = '/amuse/video/comments/like';
      postInfo(url, {
        comments_id: id,
        token: this.getToken,
        type_id: this.type,
      }).then((res) => {
        this.canPrise = true;
        if (res.status_code === 200) {
          console.log(this.articleInfo);
          this.articleInfo.comments[index].is_like = res.is_like;
          this.articleInfo.comments[index].like_times = res.like_times;
        }
        plus.nativeUI.toast(res.message);
      });
    },
    // 评论文章
    commentArticle() {
      if (!this.getLoginState) {
        this.showLogin();
      }
      const url = '/amuse/video/comments/add';
      postInfo(url, {
        id: this.id,
        token: this.getToken,
        type_id: this.type,
        content: this.commentcontent,
      }).then((res) => {
        this.commentcontent = '';
        if (res.status_code === 200) {
          this.articleInfo.comments.push(res.data);
        }
        plus.nativeUI.toast(res.message);
      });
    },
    // 获取文章信息
    _getCommonInfo() {
      let address = this.type === '2' ? '/amuse/weekly/detail' : '/amuse/article/detail';
      getCommonInfoHasData(address, {
        id: this.id,
        token: this.getToken,
      }).then((res) => {
        if (res.data === null) {
          this.showLoading = false;
          return;
        }
        this.articleInfo = res;
        this.articleInfo.created_at = this.articleInfo.created_at.substr(0, 10);
        this.$nextTick(() => {
          this.showLoading = false;
        });
      });
    },
  },
  computed: {
    ...mapGetters(['getToken', 'statusbar', 'getLoginState', 'avatar', 'nickname']),
  },

  components: {
    MHeader,
    Scroll,
    Loading,
    ArrowBack,
    MaskCommon,
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
  background: #f5f5f5;

  .newsbox {
    sub-position();
    top: 68px;
    overflow: scroll;
    padding-bottom: 0px;

    .notice-wrapper {
      color: #222222;
      overflow: scroll;
      background: #ffffff;
      -webkit-overflow-scrolling: touch;
      padding: 15px;

      &::-webkit-scrollbar {
        display: none;
      }

      &::-webkit-scrollbar {
        width: 0px;
      }

      h3 {
        font-size: $font-size-medium-x;
        text-align: left;
        line-height: 24px;
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
        text-indent: 28px;
        line-height: 20px;
        // padding-bottom: 60px;
        overflow: hidden;

        pre {
          white-space: pre-wrap; /* css3.0 */
          white-space: -moz-pre-wrap; /* Firefox */
          white-space: -pre-wrap; /* Opera 4-6 */
          white-space: -o-pre-wrap; /* Opera 7 */
          word-wrap: break-word; /* Internet Explorer 5.5+ */
        }

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
          }
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
      padding-right: 20px;
      background: #ffffff;

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

    .user-comment {
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
            margin: 0;
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
            width: 90%;
            box-sizing: border-box;
            padding-right: 30px;
            font-size: 12px;
            line-height: 18px;
            color: #333333;
            word-wrap: break-word;
          }

          .right {
            width: 10%;
            font-size: 12px;
            color: #bbbbbb;
            display: flex;

            .prise {
              display: inline-block;
              width: 14px;
              height: 14px;
              bg-image('parise');
              background-size: cover;

              &.active {
                bg-image('hdz');
                background-size: cover;
              }
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

  .subpublish {
    position: fixed;
    display: flex;
    width: 100%;
    bottom: -58px;
    min-height: 30px;
    padding: 10px 0;
    box-sizing: border-box;
    background: #ffffff;
    transition: all 500ms;
    opacity: 0;
    transform: translate3d(0, 100%, 0);

    &.show {
      opacity: 1;
      transform: translate3d(0, -100%, 0);
    }

    .text {
      flex: 1;
      height: 100%;
      box-sizing: border-box;
      position: relative;
      display: flex;
      justify-content: center;
      font-size: 12px;
      color: #999;
      padding: 2px 0;

      textarea {
        display: block;
        width: 94%;
        font-size: 12px;
        line-height: 16px;
        min-height: 30px;
        overflow: hidden;
        padding: 2px;
        padding: 0;
        outline: none;
        border: none;
        resize: none;
        font-family: 'PingFang SC', 'STHeitiSC-Light', 'Helvetica-Light', arial, sans-serif, 'Droid Sans Fallback';
        color: #a0a0a0;
        border: 1px solid #f5f5f5;
        overflow: visible;
      }
    }

    .commbtn {
      width: 15%;
      display: flex;
      align-items: center;
      justify-content: center;

      .btn {
        height: 30px;
        width: 60px;
        line-height: 30px;
        text-align: center;
        color: #08a7d5;
        font-weight: bold;
      }
    }
  }

  .loading-container {
    loading();
  }
}
</style>
