<template>
  <transition name="slider">
    <div class="comment-detail">
      <m-header>
        <template slot="header">
          <arrow-back></arrow-back>
          <p class="padding-right">
            评论详情
          </p>
        </template>
      </m-header>
      <div
        class="g-d-box"
        ref="detailbox"
        v-show="subComments.id"
      >
        <scroll
          class="g-d-wrapper"
          :listenScroll=true
          :pullUpLoad=pullUpLoad
          :data=data
          @pullingUp='getMoreComment'
        >
          <div>
            <div class="comment">
              <div class="total">
                游戏点评
                <span>
                  ({{subComments.commentCount}})
                </span>
              </div>
              <div class="c-item">
                <div class="userinfo">
                  <div class="avatar">
                    <img
                      :src="subComments.avatar"
                      alt=""
                    >
                  </div>
                  <div class="nameinfo">
                    <p class="name"> {{subComments.nickname}}</p>
                    <div class="star-wrapper">
                      <span
                        class="star-icon"
                        :style="{width:subComments.star*20+'%'}"
                      ></span>
                    </div>
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
                      @click="userup(subComments.id)"
                      :class="{active:subComments.userup}"
                    >{{subComments.up}}</span>
                    <span class="subcomment">{{subComments.reply}}</span>
                  </div>
                </div>
              </div>
              <div
                class="subcomment"
                v-if="subComments.reply"
              >
                <div class="total">
                  全部回复 ({{subComments.replyList.total}})
                </div>
                <div
                  class="sub-item"
                  v-for="(item,index) in subComments.replyList.list"
                  :key=index
                >
                  <div class="s-i-title">
                    <span class="name">{{item.nickname}}</span>
                    <span
                      class="praise"
                      @click="replyup(item.id,index)"
                      :class="{active:item.userup}"
                    ></span>
                  </div>
                  <p>
                    {{item.created_at | filterDaysAgo}}天前
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
                <!-- <loading :title=commentLoadingText></loading> -->
                <loading-more></loading-more>
              </div>
            </div>
          </div>
        </scroll>
        <router-view></router-view>
      </div>
      <div class="subpublish">
        <div class="text">
          <textarea
            placeholder="请输入回复内容..."
            ref="commentcontent"
          ></textarea>
        </div>
        <div
          class="commbtn"
          @click="replyComment"
        >
          <div class="btn">发布</div>
        </div>
      </div>
      <div
        class="loading-comment"
        v-show="!subComments.id"
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
import ArrowBack from '@/base/icon_widget/arrow_back';
import LoadingMore from '@/base/loadingmore/loading';

export default {
  data() {
    return {
      titleText: '评论详情',
      pullUpLoad: true, // 是否监听上拉
      data: 0, // 通知scroll组件 更新上拉状态
      commentLoadingText: '',
      subComments: {},
      loadComment: '正在加载...',
      showDetailLoading: false,
      totalPage: 0,
    };
  },
  created() {
    this.commentId = this.$route.query.commentId;
    this._getCommentInfo();
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
      const commentAddress = `/game/comments/detail/${this.commentId}`;
      getCommonInfoHasData(commentAddress, {
        id: this.commentId,
        token: this.getToken,
      }).then((res) => {
        this.subComments = res.data;
        // 计算分页总数
        if (this.subComments.replyList.total % this.subComments.replyList.pageSize === 0) {
          this.totalPage = this.subComments.replyList.total / this.subComments.replyList.pageSize;
        } else {
          this.totalPage = Math.floor(this.subComments.replyList.total / this.subComments.replyList.pageSize) + 1;
        }
      });
    },
    //  加载更多
    getMoreComment() {
      //  当上拉加载数据加载完毕后,告诉 better-scroll 数据已加载
      const moreDetail = `/game/comments/reply/${this.commentId}`;
      if (this.subComments.replyList.currentPage + 1 < this.totalPage) {
        let commentData = {
          page: this.subComments.replyList.currentPage + 1,
        };
        this.showDetailLoading = true;
        getCommonInfoHasData(moreDetail, commentData).then((res) => {
          this.subComments.replyList.currentPage = res.data.currentPage;
          this.subComments.replyList.list = this.subComments.replyList.list.concat(res.data.list);

          /*  *************************************************************************************
           * 改变data值，通知scroll组件更新pullup状态，隐藏加载框
           * ***********************************************************************************  */
          this.data += 1;
          this.showDetailLoading = false;
        });
      } else {
        console.log('没有更多数据');
      }
    },
    //  评论点赞
    userup(commentId) {
      if (this.subComments.userup === 1) {
        return;
      }
      const userUpAdd = `/game/comments/up/${commentId}`;
      postInfo(userUpAdd, {
        commentId,
        token: this.getToken,
      }).then((res) => {
        if (res.status_code === 200) {
          this.subComments.userup = 1;
          this.subComments.up++;
          plus.nativeUI.toast(res.message);
        } else {
          plus.nativeUI.toast(res.message);
        }
      });
    },
    //  自评论点赞
    replyup(commentId, index) {
      if (this.subComments.replyList.list[index].userup === 1) {
        return;
      }
      const replyUpAdd = `/game/comments/replyup/${commentId}`;
      postInfo(replyUpAdd, {
        replyId: commentId,
        token: this.getToken,
      }).then((res) => {
        if (res.status_code === 200) {
          this.subComments.replyList.list[index].userup = 1;
          plus.nativeUI.toast(res.message);
        } else {
          plus.nativeUI.toast(res.message);
        }
      });
    },
    replyComment() {
      const replyAddress = '/game/comments/add/reply';
      let replyContent = this.$refs.commentcontent.value;
      getCommonInfoHasData(replyAddress, {
        replyContent,
        commentId: this.commentId,
        token: this.getToken,
      }).then((res) => {
        if (res.status_code === 200) {
          this.$refs.commentcontent.value = '';
          this._getCommentInfo();
        }
        plus.nativeUI.toast(res.message);
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
    ArrowBack,
    LoadingMore,
  },
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~common/stylus/variable';
@import '~common/stylus/mixin';

slider();

.comment-detail {
  position: fixed;
  top: 0;
  bottom: 0;
  width: 100%;
  background: $color-background;
  background: #f2f2f2;

  .g-d-box {
    position: absolute;
    top: 44px;
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

              .star-wrapper {
                star();
              }
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

              .praise {
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
