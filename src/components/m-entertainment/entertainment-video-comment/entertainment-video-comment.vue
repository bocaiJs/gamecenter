<template>
  <transition name="slider">
    <div
      class="comment-detail"
      ref="subcomment"
    >
      <m-header>
        <template slot="header">
          <arrow-back
            :step="back"
            @back=hide
          ></arrow-back>
          <p class="padding-right">
            评论详情
          </p>
        </template>
      </m-header>
      <div
        class="g-d-box"
        ref="detailbox"
        v-show="!showLoading"
      >
        <scroll
          class="g-d-wrapper"
          :listenScroll=true
          :pullUpLoad=pullUpLoad
          :data=data
          @pullingUp='getMoreComment'
          ref="cscroll"
        >
          <div>
            <div class="comment">
              <div class="total">
                评论
              </div>
              <div class="c-item">
                <div class="userinfo">
                  <div
                    class="avatar"
                    v-if="subComments.avatar"
                  >
                    <img
                      v-lazy="subComments.avatar"
                      alt=""
                    >
                  </div>
                  <div class="nameinfo">
                    <p class="name"> {{subComments.nickname}}</p>
                  </div>
                </div>
                <div class="c-content">
                  {{subComments.content}}
                </div>
                <div class="c-bottom">
                  <div class="c-date">{{subComments.created_at}}</div>
                  <div class="c-praise">
                    <span
                      class="praise"
                      @click="userup"
                      :class="{active:subComments.is_like}"
                    >{{subComments.like_times}}</span>
                    <span class="subcomment">{{subComments.reply_count}}</span>
                  </div>
                </div>
              </div>
              <div
                class="subcomment"
                v-if="subComments.reply.length"
              >
                <div class="total">
                  全部回复
                </div>
                <div
                  class="sub-item"
                  v-for="(item,index) in subComments.reply"
                  :key=index
                >
                  <div class="s-i-title">
                    <span class="name">{{item.nickname}}</span>
                    <div class="subpraise">
                      <span
                        class="praise"
                        @click="replyup(item.id,index)"
                        :class="{active:item.is_like}"
                      ></span>{{item.like_times}}
                    </div>
                  </div>
                  <p>
                    {{item.time}}
                  </p>
                  <p class="s-i-content">
                    {{item.content}}
                  </p>
                </div>
              </div>
              <div
                class="loading-container"
                v-show="showDetailLoading"
              >
                <loading :title=commentLoadingText></loading>
              </div>
            </div>
          </div>
        </scroll>
        <router-view></router-view>
      </div>
      <comment-box
        @videocomment="subComment"
        ref="cbox"
        v-show="!showLoading "
      ></comment-box>
      <!-- <div class="subpublish" v-show="!showLoading">
                <div class=" text ">
                    <textarea placeholder="请输入回复内容... " ref="commentcontent "></textarea>
                </div>
                <div class="commbtn " @click="replyComment ">
                    <div class="btn ">发布</div>
                </div>
            </div> -->
      <div
        class="loading-comment "
        v-show="showLoading "
      >
        <loading :title=loadComment></loading>
      </div>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
import MHeader from 'components/m-header/m-header';
import Scroll from '@/base/scroll/scroll';
import Loading from '@/base/loading/loading';
import { getCommonInfoHasData, postInfo } from '@/base/api/indexpage/getindexinfo';
import { mapGetters } from 'vuex';
import CommentBox from '@/base/comment/comment';
import ArrowBack from '@/base/icon_widget/arrow_back';

export default {
  props: {
    commentId: {
      type: Number,
      default: 0,
    },
    videoId: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      titleText: '评论详情',
      pullUpLoad: true, // 是否监听上拉
      data: 0, // 通知scroll组件 更新上拉状态
      commentLoadingText: '',
      subComments: {
        reply: [],
      },
      loadComment: '正在加载...',
      showDetailLoading: false,
      showLoading: true,
      back: '3',
      canPrise: true,
    };
  },
  mounted() {
    this.$refs.detailbox.style.top = (44 + parseInt(this.statusbar)) + 'px';
  },
  filters: {
    filterDaysAgo(value) {
      if (!value) return '';
      let s1 = value.substr(0, 10);
      let day2 = new Date();
      day2.setTime(day2.getTime());
      let s2 = day2.getFullYear() + '-' + (day2.getMonth() + 1) + '-' + day2.getDate();
      let d1 = new Date(s1);
      let d2 = new Date(s2);
      return Math.round((d2 - d1) / (1000 * 60 * 60 * 24));
    },
  },
  methods: {
    //  初始化评论
    _getCommentInfo() {
      if (this.commentId === 0) return;
      const commentAddress = '/amuse/video/comments/details';
      getCommonInfoHasData(commentAddress, {
        id: this.commentId,
        token: this.getToken,
      }).then((res) => {
        this.subComments = res.data;
        this.$nextTick(() => {
          this.showLoading = false;
        });
      });
    },
    //  加载更多
    getMoreComment() {
      const address = '/amuse/video/comments/reply/more';
      getCommonInfoHasData(address, {
        id: this.commentId,
        token: this.getToken,
      }).then((res) => {
        if (res.data.length === 0) {
          this.$refs.cscroll.endPullUp();
        } else {
          this.subComment.reply.push.apply(this.subComment.reply, res.data);
        }
      });
    },
    //  评论点赞
    userup() {
      console.log(this.canPrise);
      if (!this.canPrise) return;
      this.canPrise = false;
      const address = '/amuse/video/comments/like';
      postInfo(address, {
        id: this.videoId,
        token: this.getToken,
        comments_id: this.commentId,
        type_id: 0,
      }).then((res) => {
        this.canPrise = true;
        if (res.status_code === 200) {
          //   if (this.subComments.is_like) {
          //     this.subComments.is_like = 0;
          //     this.subComments.like_times--;
          //   } else {
          //     this.subComments.is_like = 1;
          //     this.subComments.like_times++;
          //   }
          this.subComments.is_like = res.is_like;
          this.subComments.like_times = res.like_times;
        }
        plus.nativeUI.toast(res.message);
      });
    },
    // 子评论点赞 commentId:主评论ID(父组件接受);子评论ID;id:视频id=this.videoId;reply_id:回复ID=subId
    replyup(subId, index) {
      if (subId === 0) return;
      if (!this.canPrise) return;
      this.canPrise = false;
      const address = '/amuse/video/comments/reply/like';
      postInfo(address, {
        id: this.videoId,
        comments_id: this.commentId,
        reply_id: subId,
        type_id: 0,
        token: this.getToken,
      }).then((res) => {
        this.canPrise = true;
        if (res.status_code === 200) {
          if (this.subComments.reply[index].is_like) {
            this.subComments.reply[index].is_like = 0;
            this.subComments.reply[index].like_times--;
          } else {
            this.subComments.reply[index].is_like = 1;
            this.subComments.reply[index].like_times++;
          }
        }
        plus.nativeUI.toast(res.message);
      });
    },
    subComment(cv) {
      const address = '/amuse/video/comments/reply';
      postInfo(address, {
        id: this.commentId,
        token: this.getToken,
        content: cv,
        type_id: 0,
      }).then((res) => {
        if (res.status_code === 200) {
          const subComment = {
            content: cv,
            is_like: 0,
            like_times: 0,
            nickname: this.nickname,
            time: '1秒钟前',
            id: 0,
          };
          this.subComments.reply.push(subComment);
          this.data++;
          this.$refs.cbox._data.commentValue = '';
        }
        plus.nativeUI.toast(res.message);
      });
    },

    //  显示页面
    show() {
      this._getCommentInfo();
      this.$refs.subcomment.style.transform = 'translate3d(0, 0, 0)';
    },
    //  隐藏页面
    hide() {
      this.$refs.subcomment.style.transform = 'translate3d(100%, 0, 0)';
      this.subComments = {
        reply: [],
      };
      this.$refs.cscroll.endPullUp();
      setTimeout(() => {
        this.showLoading = true;
      }, 300);
    },
  },
  computed: {
    ...mapGetters(['getToken', 'statusbar', 'nickname']),
  },
  watch: {
    commentId() {
      this._getCommentInfo();
    },
  },
  components: {
    MHeader,
    Scroll,
    Loading,
    CommentBox,
    ArrowBack,
  },
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~common/stylus/variable';
@import '~common/stylus/mixin';

// slider();
.comment-detail {
  position: fixed;
  top: 0;
  bottom: 0;
  width: 100%;
  background: $color-background;
  background: #f2f2f2;
  transform: translate3d(100%, 0, 0);
  transition: all 300ms;

  .g-d-box {
    position: absolute;
    top: 68px;
    bottom: 50px;
    width: 100%;

    .g-d-wrapper {
      height: 100%;
      overflow: hidden;

      .comment {
        width: 100%;

        .total {
          height: 40px;
          width: 100%;
          line-height: 40px;
          color: #222222;
          border-bottom: 1px solid #cccccc;
          padding-left: 15px;
          font-size: $font-size-medium-x;
          background: #ffffff;

          span {
            font-size: $font-size-small;
            color: #ffd444;
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
        }

        .subcomment {
          font-size: $font-size-small;

          .total {
            font-size: $font-size-small;
          }

          .sub-item {
            line-height: 24px;
            padding: 6px 15px 0 15px;
            background: #ffffff;

            .s-i-title {
              width: 100%;
              display: flex;
              align-items: center;
              justify-content: space-between;

              .subpraise {
                display: flex;
                align-items: flex-end;
                line-height: 12px;
                color: #777777;

                .praise {
                  display: block;
                  margin-right: 4px;
                  width: 14px;
                  height: 14px;
                  display: block;
                  bg-image('parise');
                  background-size: 14px 14px;
                  background-repeat: no-repeat;
                  line-height: 14px;

                  &.active {
                    bg-image('parise-active');
                  }
                }
              }
            }

            .s-i-content {
              padding-bottom: 15px;
              border-bottom: 1px solid #cccccc;
            }
          }
        }
      }
    }
  }

  .subpublish {
    position: fixed;
    display: flex;
    width: 100%;
    bottom: 0;
    height: 50px;
    background: #ffffff;

    .text {
      width: 80%;
      height: 100%;
      box-sizing: border-box;
      position: relative;
      display: flex;
      justify-content: center;
      font-size: $font-size-small;
      color: #999999;
      padding: 2px 0;

      textarea {
        display: block;
        width: 94%;
        font-size: $font-size-small;
        line-height: 16px;
        height: 50px;
        overflow: hidden;
        padding: 2px;
        padding: 0;
        outline: none;
        border: none;
        resize: none;
        font-family: 'PingFang SC', 'STHeitiSC-Light', 'Helvetica-Light', arial, sans-serif, 'Droid Sans Fallback';
        color: #a0a0a0;
      }
    }

    .commbtn {
      width: 20%;
      height: 100%;
      display: flex;
      align-items: center;

      // justify-content: center;
      .btn {
        height: 30px;
        width: 60px;
        background: #ffc400;
        border-radius: 15px;
        color: #ffffff;
        line-height: 30px;
        text-align: center;
      }
    }
  }

  .loading-comment {
    loading();
  }
}
</style>
