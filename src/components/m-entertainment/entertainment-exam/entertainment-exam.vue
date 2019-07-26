<template>
  <transition name="slider">
    <div class="exam">
      <m-header class="green">
        <template slot="header">
          <div
            class="back-icon"
            @click="back"
          >
            <span class="icon-mine"> </span>
          </div>

          <p
            class="padding-right"
            style="text-align:left;color:#ffffff;"
          >
            {{ this.titleText}}
          </p>
        </template>
      </m-header>
      <div class="exambox">
        <transition
          name="fade-list"
          mode="out-in"
        >
          <div
            class="animated exam-item"
            v-for="(list,index) in testPaper"
            v-if="index ===showIndex"
            :key="list.id"
          >
            <div class="count-down">
              <i>{{timeCounter}}</i>s
            </div>
            <div class="title">
              <span>{{index +1}}</span> / 10
              <span>{{list.title}}</span>
            </div>
            <div class="option-box">
              <div
                class="option"
                :class="{'success':successNum === oindex,'error':errorNum===oindex}"
                v-for="(o,oindex) in list.option"
                :key="o.id"
                @click="selectOption(index,oindex)"
              >{{o.option}}</div>
            </div>
          </div>
        </transition>
      </div>
      <div
        class="loading-container"
        v-if="showLoading"
      >
        <loading></loading>
      </div>
      <transition name="fade">
        <div
          class="exam-mask"
          v-if="showMask"
        >
          <div class="content">
            <p>答题结束</p>
            <p>获得答题奖励</p>
            <div class="score">
              <span class="encourage-icon"></span>
              +
              <span>{{correctCount}}积分</span>
            </div>
            <div
              class="goback"
              @click="goPrePage"
            >
              领取
            </div>
          </div>
        </div>
      </transition>

      <router-view></router-view>
    </div>
  </transition>
</template>

<script>
import MHeader from 'components/m-header/m-header';
import Loading from '@/base/loading/loading';
import { Base64 } from 'js-base64';
import { getCommonInfoHasData, postInfo } from '@/base/api/indexpage/getindexinfo';
import { mapGetters } from 'vuex';
import ArrowBack from '@/base/icon_widget/arrow_back';

const TIMEDOWN = 30;
const NEXTQUES = 2000;
export default {
  data() {
    return {
      titleText: '',
      showIndex: 0,
      testPaper: [],
      errorNum: -1,
      successNum: -1,
      click: 0,
      canSend: 0,
      timeCounter: TIMEDOWN,
      answer: {},
      showLoading: true,
      showMask: false,
      correctCount: 0,
      isDestroyed: false,
      t: null,
    };
  },
  mounted() {
    const cate = this.$route.query.cate;
    this.getExamInfo(cate);
    this.titleText = cate === 1 ? '历史人物题' : cate === 2 ? '经典游戏题' : '人文地理题';
  },
  methods: {
    back() {
      this.$router.back(-1);
    },
    showTips() {
      console.log('showtips');
    },
    getExamInfo(cate) {
      getCommonInfoHasData(`/amuse/school/question/cate/${cate}`, { token: this.getToken }).then((res) => {
        console.log(res);
        this.showLoading = false;
        this.testPaper = res.data;
        if (!this.isDestroyed) {
          console.log('收到数据 执行倒计时');
          this.countDown();
        }
      });
    },
    selectOption(findex, sindex) {
      if (this.click === 0) {
        this.click = 1;
        let index = -1;
        const seletArray = this.testPaper[findex].option;
        for (let i = 0; i < seletArray.length; i++) {
          if (seletArray[i].correct === 1) {
            index = i;
          }
        }
        this.successNum = index;
        if (sindex !== index) {
          this.errorNum = sindex;
        }
        this.answer[this.testPaper[findex].id] = this.testPaper[findex].option[sindex].id;
        console.log(this.answer);
        this.nextItem();
      }
    },
    // 设置倒计时
    countDown() {
      let _this = this;
      if (this.t) {
        console.log('销毁上一个:' + this.t);
        clearInterval(this.t);
      }
      this.t = setInterval(() => {
        if (this.timeCounter === 0) {
          console.log('eeee');
          _this.nextItem();
          clearInterval(this.t);
        } else {
          this.timeCounter--;
        }
      }, NEXTQUES);
      console.log('当前' + this.t);
    },
    nextItem() {
      console.log('当前:' + this.t);
      console.log(`当前页${this.showIndex}===总长度${this.testPaper.length - 1}`);
      if (this.showIndex === this.testPaper.length - 1) {
        console.log(this.showIndex);
        this.postAnswer();
        clearInterval(this.t);
      } else {
        setTimeout(() => {
          this.click = 0;
          this.errorNum = -1;
          this.successNum = -1;
          this.showIndex++;
          this.timeCounter = TIMEDOWN;
          this.countDown();
        }, 1000);
      }
    },
    postAnswer() {
      console.log('cansend：' + this.canSend);
      if (this.canSend === 0) {
        const answerJson = {};
        const answerStr = JSON.stringify(this.answer);
        answerJson.token = this.getToken;
        answerJson.answer = Base64.encode(answerStr);
        console.log(answerJson);

        console.log('发送数据');
        postInfo('/amuse/school/question/answer', answerJson).then((res) => {
          console.log(res);
          this.canSend++;
          if (res.status_code === 200) {
            this.correctCount = res.correct;
            this.showMask = true;
          }
        });
      }
    },
    goPrePage() {
      this.$router.back();
    },
  },
  computed: {
    ...mapGetters(['getToken']),
  },
  destroyed() {
    clearInterval(this.t);
    this.isDestroyed = true;
    this.t = null;
  },
  components: {
    MHeader,
    Loading,
    ArrowBack,
  },
};
</script>


<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~common/stylus/variable';
@import '~common/stylus/mixin';

slider();

@keyframes confirm-fadein {
  0% {
    opacity: 0;
  }

  100% {
    opacity: 1;
  }
}

@keyframes confirm-fadeout {
  0% {
    opacity: 1;
  }

  100% {
    opacity: 0;
  }
}

@keyframes confirm-zoomIn {
  0% {
    transform: scale(0);
  }

  100% {
    transform: scale(1);
  }
}

@keyframes confirm-zoomOut {
  0% {
    transform: scale(1);
  }

  100% {
    transform: scale(0);
  }
}

@keyframes zoomIn {
  from {
    opacity: 0;
    -webkit-transform: scale3d(1, 1, 1);
    transform: scale3d(1, 1, 1);
  }

  50% {
    opacity: 1;
  }
}

@keyframes zoomOut {
  from {
    opacity: 1;
  }

  50% {
    opacity: 0;
    -webkit-transform: scale3d(1, 1, 1);
    transform: scale3d(1, 1, 1);
  }

  to {
    opacity: 0;
  }
}

.exam {
  position: fixed;
  width: 100%;
  top: 0;
  bottom: 0;
  z-index: 3;
  background: linear-gradient(#7aeed2, #5ed9f5, #5ed9f5);
  background: -webkit-linear-gradient(left, #7aeed2, #5ed9f5, #5ed9f5);

  .back-icon {
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    padding: 14px 15px;

    .icon-mine {
      display: block;
      height: 16px;
      width: 9px;
      background: url('../../../common/image/back/back@2x.png');
      background-size: 9px 16px;
    }
  }

  .exambox {
    overflow: hidden;
    min-height: 450px;
    box-sizing: border-box;
    padding: 0 15px;

    span {
      display: block;
      width: 100%;
      height: 100%;
      display: flex;
      flex-wrap: nowrap;
      overflow: hidden;

      .exam-item {
        width: 100%;
        min-width: 100%;
      }
    }

    .exam-item {
      display: flex;
      flex-direction: column;
      align-items: center;

      &.fade-list-enter-active {
        animation-duration: 0.5s;
        animation-name: confirm-zoomIn;
      }

      &.fade-list-leave-active {
        animation-duration: 0.5s;
        animation-name: confirm-zoomOut;
      }

      .count-down {
        width: 40px;
        height: 40px;
        margin: 30px 0;
        border-radius: 50%;
        background: #98eceb;
        border: 2px solid #ffffff;
        text-align: center;
        line-height: 40px;
        font-size: $font-size-medium-x;
        color: #ffffff;

        i {
          color: #1681d3;
          font-weight: bold;
        }
      }

      .title {
        font-size: $font-size-medium-x;
        color: #fefefe;

        span {
          display: inline;
        }
      }

      .option-box {
        margin-top: 90px;

        .option {
          position: relative;
          width: 180px;
          height: 40px;
          background: #ffffff;
          border-radius: 20px;
          margin-bottom: 20px;
          color: #0a6c80;
          font-size: $font-size-large;
          text-align: center;
          line-height: 40px;
          font-weight: bold;

          &.success {
            background: #58f071;
            color: #ffffff;

            &:before {
              content: '';
              position: absolute;
              width: 18px;
              height: 18px;
              top: 11px;
              right: 10px;
              background: url('./gg@3x.png') no-repeat;
              background-size: cover;
            }
          }

          &.error {
            background: #ffbc47;
            color: #ffffff;

            &:before {
              content: '';
              position: absolute;
              width: 18px;
              height: 18px;
              top: 11px;
              right: 10px;
              background: url('./cc@3x.png') no-repeat;
              background-size: cover;
            }
          }
        }
      }
    }
  }

  .exam-mask {
    position: fixed;
    width: 100%;
    top: 0;
    bottom: 0;
    z-index: 4;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;

    &.fade-enter-active {
      animation: confirm-fadein 0.3s;

      .content {
        animation: confirm-zoom 0.3s;
      }
    }

    .content {
      height: 240px;
      width: 190px;
      background: url('./bjj@2x.png') no-repeat;
      background-size: cover;
      font-size: $font-size-large;
      color: #ffffff;
      text-align: center;
      box-sizing: border-box;
      padding-top: 40px;

      p {
        margin-bottom: 6px;
        letter-spacing: 1px;
      }

      .score {
        color: #ffe775;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 30px 0;

        .encourage-icon {
          display: inline-block;
          width: 22px;
          height: 21px;
          margin-right: 4px;
          background: url('./iq@3x.png') no-repeat;
          background-size: cover;
        }
      }

      .goback {
        width: 65px;
        height: 28px;
        background: url('./an@3x.png') no-repeat;
        background-size: cover;
        line-height: 28px;
        text-align: center;
        margin: 0 auto;
      }
    }
  }

  .loading-container {
    loading();
  }
}
</style>
