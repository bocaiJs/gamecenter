<template>
  <transition name="slider">
    <div class="publishcomment">
      <!-- :canreturn=true :type="1" :titleText=titleText :publish="publish" @publish="publishComment" -->
      <m-header>
        <template slot="header">
          <arrow-back></arrow-back>
          <p>
            评论
          </p>
          <div
            class="right-button"
            @click="publishComment"
          >
            发表
          </div>
        </template>
      </m-header>
      <div class="star-warper">
        <div class="star-box">
          <i
            class="star-item"
            v-for="(star,index) in stars"
            :key="index"
            :class="{active:star}"
            @click="score(index)"
          ></i>
          <p style="font-size:12px;margin-left:16px;color:#cccccc">点击星星评分</p>
        </div>
      </div>
      <div class="content">
        <textarea
          name="commentcontent"
          cols="30"
          rows="10"
          placeholder="请发表对游戏本身的看法，心得攻略，成就感想"
          class="commentcontent"
          ref="content"
        ></textarea>
      </div>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
import MHeader from 'components/m-header/m-header';
import { mapGetters, mapMutations } from 'vuex';
import { postInfo } from '@/base/api/indexpage/getindexinfo';
import ArrowBack from '@/base/icon_widget/arrow_back';

export default {
  data() {
    return {
      titleText: '',
      publish: true,
      gameid: 0,
      stars: [0, 0, 0, 0, 0],
      gameScore: 0,
    };
  },
  created() {
    this.gameid = this.$route.query.gameid;
  },
  methods: {
    score(index) {
      for (let i = 0; i < this.stars.length; i++) {
        if (i <= index) {
          this.$set(this.stars, i, 1);
        } else {
          this.$set(this.stars, i, 0);
        }
      }
      this.gameScore = index;
    },
    publishComment() {
      const commentAddress = '/game/comments/add';
      if (this.$refs.content.value.length < 5) {
        plus.nativeUI.toast('评论内容不能少于5个汉字!');
        return;
      }
      postInfo(commentAddress, {
        content: this.$refs.content.value,
        id: this.gameid,
        star: this.gameScore + 1,
        token: this.getToken,
      }).then((res) => {
        let backNum = this.back + 1;
        if (res.status_code === 200) {
          this.$router.back(-1);
          this.setBack(backNum);
          plus.nativeUI.toast('评论发表成功');
        } else {
          plus.nativeUI.toast(res.message);
        }
      });
    },
    ...mapMutations([
      'setBack',
    ]),
  },
  computed: {
    ...mapGetters(['getToken', 'back']),
  },
  components: {
    MHeader,
    ArrowBack,
  },
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~common/stylus/variable';
@import '~common/stylus/mixin';

slider();

.publishcomment {
  position: fixed;
  top: 0;
  bottom: 0;
  width: 100%;
  background: $color-background;
  background: #f2f2f2;

  .star-warper {
    height: 56px;
    width: 100%;
    box-sizing: border-box;
    background: #ffffff;
    padding: 0 15px;

    .star-box {
      height: 100%;
      width: 100%;
      box-sizing: border-box;
      border-bottom: 1px solid #cccccc;
      display: flex;
      align-items: center;

      .star-item {
        display: inline-block;
        height: 26px;
        width: 26px;
        margin-left: 10px;
        background: red;
        background: url('huixin.png') no-repeat;
        background-size: 100% 100%;

        &.active {
          background: url('huangxin.png') no-repeat;
          background-size: 100% 100%;
        }
      }
    }
  }

  .content {
    width: 100%;
    height: 100%;

    .commentcontent {
      box-sizing: border-box;
      padding: 15px;
      outline: none;
      height: 100%;
      width: 100%;
      border: none;
      font-family: 'PingFang SC', 'STHeitiSC-Light', 'Helvetica-Light', arial, sans-serif, 'Droid Sans Fallback';
      font-size: $font-size-small;
      line-height: 18px;

      &::placeholder {
        color: #cccccc;
      }

      &:focus {
        border: none;
        outline-offset: 0;
      }
    }
  }
}
</style>
