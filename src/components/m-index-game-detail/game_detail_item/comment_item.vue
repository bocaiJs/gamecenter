<template>
  <div class="c-item">
    <!-- 用户信息 -->
    <div class="userinfo">
      <div
        class="prise-coin"
        :class="coinsCount"
        v-if="comment.stars"
      >
      </div>
      <div class="avatar">
        <img
          v-lazy="comment.avatar"
          alt=""
        >
      </div>
      <div class="nameinfo">
        <p class="name">{{comment.nickname}}</p>
        <div style="display:flex;align-items:center">
          <div class="star-wrapper">
            <span
              class="star-icon"
              :style="{width:comment.star*20+'%'}"
            ></span>
          </div>
          <span style="display:inline-block;height:13px;width:1px;background:#1faed6;margin:0 6px;"></span>
          <span style="font-size:12px;color:#555555">共发表{{comment.count}}条游戏点评</span>
        </div>
      </div>
    </div>
    <!-- 用户评论内容 -->
    <div class="c-content">
      {{comment.content}}
    </div>
    <!-- 功能按钮栏，点赞 点灭等 -->
    <div class="c-bottom">
      <div class="c-date">{{comment.created_at}}</div>
      <div class="c-praise">
        <span
          class="down"
          @click="userDown(comment.id)"
          :class="{active:comment.userdown}"
        >{{comment.down}}</span>
        <span
          class="praise"
          @click="userup(comment.id)"
          :class="{active:comment.userup}"
        >{{comment.up}}</span>
        <span
          class="subcomment"
          @click="goCommentDetail(comment.id)"
        >{{comment.reply}}</span>
      </div>
    </div>
    <!-- 子评论 -->
    <div
      class="sub-comment"
      v-if="comment.replyInfo.length"
    >
      <div
        class="sub-comment-item"
        v-for="(reply,index) in comment.replyInfo"
        :key="index"
        v-show="index ==0 ||showAllReply"
        @click="goCommentDetail(comment.id)"
      >
        <span>{{reply.nickname}} :</span>
        <span>{{reply.content}}</span>
      </div>
      <div
        class="more"
        @click="showAll"
        v-if="!showAllReply"
      >展开其他评论</div>
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
export default {
  props: {
    comment: {
      type: Object,
    },
    index: {
      type: Number,
    },
  },
  data() {
    return {
      showAllReply: false,
    };
  },
  computed: {
    coinsCount() {
      console.log('计算属性', this.comment.stars);
      let icons = '';
      switch (this.comment.stars) {
        case 1:
          icons = 'one';
          break;
        case 2:
          icons = 'two';
          break;
        case 3:
          icons = 'three';
          break;
        case 4:
          icons = 'four';
          break;
        case 5:
          icons = 'five';
          break;
        default:
          icons = '';
          break;
      }
      console.log(icons);
      return icons;
      //   return ` /static/coins/${this.comment.stars}.png`;
    },
  },
  mounted() {
    this.showAllReply = this.comment.replyInfo.length > 1 ? false : true;
  },
  methods: {
    showAll() {
      this.showAllReply = true;
    },
    userup(id) {
      this.$emit('userup', id, this.index);
    },
    userDown(id) {
      console.log('down');
      this.$emit('userdown', id, this.index);
    },
    goCommentDetail(commentId) {
      this.$emit('goCommentDetail', commentId);
      //   this.$router.push({
      //     path: `/gamecomment/${commentId}`,
      //     params: {
      //       commentId,
      //     },
      //     query: {
      //       commentId,
      //     },
      //   });
    },
  },
};
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~common/stylus/variable';
@import '~common/stylus/mixin';

.c-item {
  padding: 0 15px 10px 15px;
  min-height: 100px;
  background: #ffffff;
  position: relative;

  .prise-coin {
    position: absolute;
    width: 88px;
    height: 70px;
    right: 15px;
    top: 0;

    &.one {
      background: url('./one.png') no-repeat;
      background-size: cover;
    }

    &.two {
      background: url('./two.png') no-repeat;
      background-size: cover;
    }

    &.three {
      background: url('./three.png') no-repeat;
      background-size: cover;
    }

    &.four {
      background: url('./four.png') no-repeat;
      background-size: cover;
    }

    &.five {
      background: url('./five.png') no-repeat;
      background-size: cover;
    }
  }

  .userinfo {
    display: flex;
    align-items: center;
    height: 50px;

    .avatar {
      width: 44px;
      height: 44px;
      border-radius: 50%;
      overflow: hidden;

      img {
        width: 100%;
      }
    }

    .nameinfo {
      margin-left: 6px;
      font-size: 12px;
      font-weight: bold;
      color: #1faed6;
      height: 44px;
      padding: 4px 0;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      justify-content: space-between;

      .name {
        font-weight: bold;
      }

      .star-wrapper {
        width: 50px;
        display: inline-block;
        height: 10px;
        position: relative;
        overflow: hidden;
        background: url('./graystar.png');
        background-size: 10px 10px;

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
    }
  }

  .c-content {
    margin-top: 10px;
    box-sizing: border-box;
    padding-left: 42px;
    line-height: 18px;
    font-size: 12px;
    color: #333333;
    // max-height: 72px;
    overflow: hidden;
  }

  .c-bottom {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: $font-size-small;
    padding: 10px 0;
    padding-left: 42px;
    color: #777777;

    .c-praise {
      display: flex;
      justify-content: space-between;
      align-items: center;

      .down {
        height: 14px;
        display: block;
        background-image: url('./down.png');
        background-repeat: no-repeat;
        background-size: 14px 14px;
        padding-left: 16px;
        padding-right: 10px;
        line-height: 14px;

        &.active {
          background-image: url('./down-active.png');
          background-repeat: no-repeat;
        }
      }

      .praise {
        height: 14px;
        display: block;
        background-image: url('./up.png');
        background-repeat: no-repeat;
        background-size: 14px 14px;
        padding-left: 16px;
        padding-right: 10px;
        line-height: 14px;

        &.active {
          background-image: url('./up-active.png');
          background-repeat: no-repeat;
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

  .sub-comment {
    padding: 10px;
    margin-left: 42px;
    box-sizing: border-box;
    background: #f5f5f5;
    font-size: 13px;
    line-height: 18px;
    color: #222222;

    .sub-comment-item {
      warp();
    }

    span {
      &:first-child {
        font-weight: bold;
      }
    }

    .more {
      font-size: 12px;
      color: #1faed6;
    }
  }
}
</style>
