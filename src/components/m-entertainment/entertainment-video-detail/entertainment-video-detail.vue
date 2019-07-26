
<template>
  <transition name="slider">
    <div class="video-detail">
      <m-header>
        <template slot="header">
          <arrow-back></arrow-back>
          <p style="padding-right:46px">{{titleText}}</p>
        </template>
      </m-header>
      <div
        class="v-d-box"
        v-show="!showLoading"
        ref="vdbox"
      >
        <scroll
          style="height:100%;overflow:hidden"
          :data=data
          :pullUpLoad=pullUpLoad
          @pullingUp='getMoreComment'
          ref="vscroll"
        >
          <div>
            <div class="v-part">
              <h3 class="v-d-title">
                {{videoInfo.title}}
              </h3>
              <div class="v-d-userinfo">
                <img
                  src="./icon@3x.png"
                  alt=""
                >
                <div class="title">
                  <span>天橙游玩</span>
                  <span>{{videoInfo.created_at}}</span>
                </div>
              </div>
              <d-player
                class="v-d-video"
                ref="videobox"
                :options='playOption'
              ></d-player>
              <div
                class="v-like"
                :class="{'active':isLike===true}"
                @click='likeVideo'
              >
                <i class="like-icon"></i>{{videoInfo.like_times}}</div>
            </div>
            <div class="comment-part">
              <div class="comment">
                <div class="total">
                  评论
                </div>
                <div
                  class="c-item"
                  v-for="(comment,index) in comments"
                  :key=index
                >
                  <div class="userinfo">
                    <div class="avatar">
                      <img
                        v-lazy="comment.avatar"
                        alt=""
                      >
                    </div>
                    <div class="nameinfo">
                      <p class="name">{{comment.nickname}}</p>
                    </div>
                  </div>
                  <div class="c-content">
                    {{comment.content}}
                  </div>
                  <div class="c-bottom">
                    <div class="c-date">{{comment.created_at}}</div>
                    <div class="c-praise">
                      <span
                        class="praise"
                        @click="commentUp(comment.id,index)"
                        :class="{active:comment.is_like}"
                      >{{comment.like_times}}</span>
                      <span
                        class="subcomment"
                        @click="showCommentDetail(comment.id)"
                      >{{comment.reply_count}}</span>
                    </div>
                  </div>
                  <div
                    class="firstsub"
                    v-if="comment.reply.nickname"
                  >
                    <span>{{comment.reply.nickname}}:</span>
                    <span class="subcontent">{{comment.reply.conetent}}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </scroll>
      </div>
      <comment-box
        @videocomment="videoComment"
        ref="cbox"
        v-show="!showLoading"
      ></comment-box>
      <video-comment
        :commentId=subCommentId
        ref="vc"
        videoId=id
      ></video-comment>
      <div
        class="loading-container "
        v-if="showLoading"
      >
        <loading></loading>
      </div>
    </div>
  </transition>
</template>
<script>
import MHeader from 'components/m-header/m-header';
import Scroll from '@/base/scroll/scroll';
import VueDPlayer from 'vue-dplayer';
import CommentBox from '@/base/comment/comment';
import Loading from '@/base/loading/loading';
import ArrowBack from '@/base/icon_widget/arrow_back';
import 'vue-dplayer/dist/vue-dplayer.css';
import { mapGetters } from 'vuex';
import { getCommonInfoHasData, postInfo } from '@/base/api/indexpage/getindexinfo';
import VideoComment from '../entertainment-video-comment/entertainment-video-comment';


export default {
  data() {
    return {
      pullUpLoad: true, // 是否开启上拉加载
      titleText: '游戏视频',
      playOption: {
        video: {
          url: '',
        },
      },
      data: 0,
      videoInfo: {
        title: '',
        comments_count: 0,
      },
      id: null,
      isLike: false,
      comments: [],
      subCommentId: 0,
      showLoading: true,
      page: 1,
      isDestroyed: false,
      canPraise: true,
      videoBox: null,
      videoController: null,
    };
  },
  created() {
    this.id = this.$route.query.id;
    this._getVideoDetail();
  },
  mounted() {
    this.$refs.vdbox.style.top = (44 + parseInt(this.statusbar)) + 'px';
  },
  methods: {
    _getVideoDetail() {
      const vdadd = `/amuse/video/details/${this.id}`;
      getCommonInfoHasData(vdadd, { token: this.getToken }).then((res) => {
        this.videoInfo = res.data;
        this.isLike = res.data.is_like === 1 ? true : false;
        this.comments = res.data.comments;
        this.$nextTick(() => {
          this.initVideo(res.data.url, res.data.thumb);
          this.showLoading = false;
        });
      });
    },
    initVideo(url, pic) {
      if (this.isDestroyed) return;
      const player = this.$refs.videobox.dp;
      player.switchVideo({
        url,
        pic,
        thumbnails: pic,
      });
      let icons = document.getElementsByClassName('dplayer-icon-content');
      let iconsBox = document.getElementsByClassName('dplayer-icons-right')[0];
      iconsBox.style.display = 'none';
      for (let i = 0; i < icons.length; i++) {
        icons[i].style.display = 'none';
      }
      //   player.on('fullscreen', () => {
      //     plus.screen.lockOrientation('landscape');
      //   });
      //   player.on('fullscreen_cancel', () => {
      //     plus.screen.lockOrientation('portrait-primary');
      //   });
    },

    //  视频点赞
    likeVideo() {
      if (!this.canPraise) return;
      this.canPraise = false;
      const _this = this;
      const address = '/amuse/video/like';
      postInfo(address, { id: this.id, token: this.getToken, type_id: 0 }).then((res) => {
        this.canPraise = true;
        if (res.status_code === 200) {
          _this.isLike = !_this.isLike;
          this.videoInfo.like_times = res.like_times;
        }
        plus.nativeUI.toast(res.message);
      });
    },
    //  视频评论 cv:commentValue 评论内容
    videoComment(cv) {
      const address = '/amuse/video/comments/add';
      postInfo(address, {
        id: this.id,
        token: this.getToken,
        content: cv,
        type_id: 0,
      }).then((res) => {
        if (res.status_code === 200) {
          const selfComment = {
            avatar: this.avatar,
            content: cv,
            created_at: this.getCurrentTime(),
            is_like: 0,
            likeVideo: 0,
            nickname: this.nickname,
            reply: [],
            reply_count: 0,
            id: res.comment_id,
          };
          this.comments.push(selfComment);
          this.data++;
          this.$refs.cbox._data.commentValue = '';
        }
        plus.nativeUI.toast(res.message);
      });
    },
    //  评论点赞
    commentUp(commentsId, index) {
      console.log('评论点赞');
      if (!this.canPraise) return;
      this.canPraise = false;
      const address = '/amuse/video/comments/like';
      postInfo(address, {
        id: this.id,
        token: this.getToken,
        comments_id: commentsId,
        type_id: 0,
      }).then((res) => {
        this.canPraise = true;
        if (res.status_code === 200) {
          //   if (this.comments[index].is_like) {
          //     this.comments[index].is_like = 0;
          //     this.comments[index].like_times--;
          //   } else {
          //     this.comments[index].is_like = 1;
          //     this.comments[index].like_times++;
          //   }
          this.comments[index].is_like = res.is_like;
          this.comments[index].like_times = res.like_times;
          plus.nativeUI.toast(res.message);
        } else {
          plus.nativeUI.toast(res.message);
        }
      });
    },
    //  获取时间
    getCurrentTime() {
      let date = new Date();
      let seperator1 = '/';
      let seperator2 = ':';
      let month = date.getMonth() + 1;
      let strDate = date.getDate();
      if (month >= 1 && month <= 9) {
        month = '0' + month;
      }
      if (strDate >= 0 && strDate <= 9) {
        strDate = '0' + strDate;
      }
      let currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
        + ' ' + date.getHours() + seperator2 + date.getMinutes()
        + seperator2 + date.getSeconds();
      return currentdate;
    },
    // cId:commentid 展示评论详情页
    showCommentDetail(cId) {
      this.subCommentId = cId;
      this.$refs.vc.show();
    },
    //  获取更多视频评论
    getMoreComment() {
      const address = '/amuse/video/comments/more';
      getCommonInfoHasData(address, {
        id: this.id,
        token: this.getToken,
        page: this.page + 1,
      }).then((res) => {
        if (res.comments.length > 0) {
          this.comments.push.apply(this.comments, res.comments);
          this.page++;
          this.data++;
        } else {
          this.$refs.vscroll.endPullUp();
        }
      });
    },
  },
  destroyed() {
    this.isDestroyed = true;
  },
  computed: {
    ...mapGetters(['getToken', 'statusbar', 'avatar', 'nickname']),
  },
  components: {
    MHeader,
    Scroll,
    CommentBox,
    VideoComment,
    Loading,
    ArrowBack,
    'd-player': VueDPlayer,
  },
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">

@import '~common/stylus/variable';
@import '~common/stylus/mixin';

slider();

.video-detail {
  position: fixed;
  width: 100%;
  top: 0;
  bottom: 0;
  background: #f2f2f2;

  .v-d-box {
    sub-position();
    top: 68px;
    bottom: 44px;

    .v-part {
      width: 100%;
      background: #ffffff;
      padding: 0 15px;
      padding-bottom: 15px;
      box-sizing: border-box;

      .v-d-title {
        font-size: $font-size-medium-x;
        color: #333333;
        line-height: 40px;
      }

      .v-d-userinfo {
        height: 35px;
        display: flex;
        margin-bottom: 20px;

        img {
          height: 100%;
        }

        .title {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          box-sizing: border-box;
          padding: 2px 10px;

          span {
            &:first-child {
              color: #333333;
              font-size: $font-size-small;
            }

            &:last-child {
              font-size: $font-size-small-s;
              color: #999999;
            }
          }
        }
      }

      .v-d-video {
        position: relative;
        overflow: hidden;
        height: 50vw;
        border-radius: 3px;

        // overflow: hidden;
        .dplayer-video-wrap {
          position: relative;
          background: #000;
          font-size: 0;
          transform: rotate(90deg) translateY(-100vw);
          transform-origin: 0 0;
        }

        .video {
          width: 100%;
          height: 100%;

          .video-js {
            width: 100%;
            height: 100%;
          }
        }
      }

      .v-like {
        margin: 15px auto 0 auto;
        width: 80px;
        height: 28px;
        border-radius: 14px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #999999;
        border: 1px solid #bbbbbb;
        font-size: $font-size-small-s;

        .like-icon {
          width: 14px;
          height: 14px;
          display: inline-block;
          background: url('./dz@3x.png') no-repeat;
          background-size: cover;
          margin-right: 5px;
        }

        &.active {
          border: 1px solid #ffae00;
          color: #ffae00;

          .like-icon {
            background: url('./hdz@3x.png') no-repeat;
            background-size: cover;
          }
        }
      }
    }

    .comment-part {
      background: #ffffff;
      min-height: 200px;
      margin-top: 15px;

      .comment {
        margin-top: 15px;
        width: 100%;

        .total {
          height: 40px;
          width: 100%;
          line-height: 40px;
          color: #222222;
          background: #ffffff;
          border-bottom: 1px solid #cccccc;
          padding-left: 15px;
          font-size: $font-size-medium-x;

          span {
            font-size: $font-size-small;
            color: #58d2ec;
          }
        }

        .c-item {
          padding: 0 15px 10px 15px;
          margin-bottom: 10px;
          box-shadow: 0 2px 5px #d1d0d0;
          min-height: 100px;
          background: #ffffff;

          .userinfo {
            display: flex;
            align-items: center;
            height: 56px;

            .avatar {
              width: 36px;
              height: 36px;
              border-radius: 50%;
              overflow: hidden;

              img {
                width: 100%;
              }
            }

            .nameinfo {
              margin-left: 6px;
              font-size: $font-size-small;
              color: #222222;
            }
          }

          .c-content {
            text-indent: 24px;
            line-height: 18px;
            font-size: $font-size-small;
            max-height: 72px;
            overflow: hidden;
          }

          .c-bottom {
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: $font-size-small;
            padding: 10px 0;
            color: #777777;

            .c-praise {
              display: flex;
              justify-content: space-between;
              align-items: center;
              width: 25%;
              padding-right: 12px;

              .praise {
                width: 18px;
                height: 14px;
                display: block;
                bg-image('parise');
                background-size: 14px 14px;
                background-repeat: no-repeat;
                padding-left: 16px;
                line-height: 14px;

                &.active {
                  bg-image('parise-active');
                }
              }

              .subcomment {
                display: block;
                width: 14px;
                height: 14px;
                bg-image('comment');
                background-size: 14px 14px;
                background-repeat: no-repeat;
                padding-left: 16px;
                line-height: 14px;
              }
            }
          }

          .firstsub {
            padding: 10px 0;
            background: #f5fdfa;
            font-size: $font-size-small;
            line-height: 18px;

            span {
              &:first-child {
                color: #000000;
              }
            }
          }
        }
      }
    }
  }

  .loading-container {
    loading();
  }
}
</style>
