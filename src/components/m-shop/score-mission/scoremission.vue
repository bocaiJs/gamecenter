<template>
  <transition name="slider">
    <div class="mission-detail">
      <m-header>
        <template slot="header">
          <back-icon></back-icon>
          <p style="padding-right:46px;">
            积分任务
          </p>
        </template>
      </m-header>
      <div
        class="mission-box"
        ref="missionbox"
      >
        <div class="top">
          <p class="title">我的积分</p>
          <h5 class="score">{{score}}</h5>
          <div class="signwrapper">
            <p>已连续签到<span class="yellow">{{signDay}}天</span></p>
            <div class="signbox">
              <div
                class="item"
                v-for="(item,index) in scoreList"
                :key=index
                :class="{active:(index+1) ===signDay ||(index===4 &&signDay>5)}"
              >
                <i class="star"></i>
                <span>+{{scoreList[index]}}</span>
              </div>
            </div>
          </div>
        </div>
        <div class="box">
          <div
            class="item"
            @click="doTasks(task.task_cate,task.app_id,task.task_finish_status)"
            v-for="task in taskList"
            :key="task.id"
          >
            <h5>{{task.title}}
              <span class="gold">+{{task.score}}</span>
            </h5>
            <p>{{task.description}}</p>
            <button
              class="go"
              :class="{done:task.task_finish_status}"
            >{{task.task_finish_status?"已完成":"去完成"}}</button>
          </div>
        </div>
      </div>
    </div>
  </transition>

</template>
<script type="text/ecmascript-6">
import { mapGetters } from 'vuex';
import { getCommonInfoHasData } from '@/base/api/indexpage/getindexinfo';

export default {
  data() {
    return {
      taskList: [],
      scoreList: [],
      score: 0,
      signDay: 0,
    };
  },
  mounted() {
    this.getTaskList();
    this.$refs.missionbox.style.top = (44 + parseInt(this.statusbar)) + 'px';
  },
  methods: {
    // 去签到
    signin() {
      this.$router.back(-1);
    },
    doTasks(id, appId, done) {
      if (done) return;
      console.log(id, appId);
      switch (id) {
        case 1:
          this.$router.push({
            path: '/mine',
          });
          break;
        case 2:
          this.$router.push({
            path: '/gamemod',
          });
          break;
        case 3:
          this.$router.push({
            path: `/gamedetail/${appId}`,
          });
          break;
        default:
          this.$router.push({
            path: '/index',
          });
          break;
      }
    },
    //  下载游戏
    downGame() {
      this.$router.push({
        path: '/index',
      });
    },
    getTaskList() {
      const address = '/user/task';
      getCommonInfoHasData(address, { token: this.getToken }).then((res) => {
        this.taskList = res.task;
        this.scoreList = res.sign_score;
        this.score = res.user_score;
        this.signDay = res.user_sign_day;
        this.$nextTick(() => {
          this.showLoading = false;
        });
      });
    },
  },
  computed: {
    ...mapGetters(['statusbar', 'getToken']),
  },
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~common/stylus/variable';
@import '~common/stylus/mixin';

slider();

.mission-detail {
  position: fixed;
  width: 100%;
  top: 0;
  bottom: 0;
  background: #ffffff;

  .mission-box {
    position: absolute;
    top: 68px;
    bottom: 0;
    width: 100%;
    overflow-x: scroll;

    .top {
      width: 100%;
      min-height: 240px;
      display: flex;
      flex-direction: column;
      align-items: center;
      background: url('./bg.png') no-repeat;
      background-size: 100% 60%;
      position: relative;
      font-size: 16px;
      color: #fefefe;

      .title {
        margin-top: 22px;
      }

      .score {
        font-size: 36px;
        color: #fefefe;
        padding: 15px 0;
      }

      .signwrapper {
        width: 90%;
        height: 130px;
        background: #ffffff;
        border-radius: 5px;
        box-shadow: 0 4px 10px #f3f3f3;
        box-sizing: border-box;
        padding: 12px;
        position: relative;

        .line {
        }

        p {
          color: #333333;
          font-size: 16px;
          font-weight: bold;

          .yellow {
            color: #ffba00;
            font-size: 16px;
            font-weight: bold;
          }
        }

        .signbox {
          margin-top: 15px;
          width: 100%;
          height: 70px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          position: relative;

          &:before {
            position: absolute;
            content: '';
            width: 100%;
            height: 4px;
            background: #f5f5f5;
            top: 50%;
            left: 0;
            z-index: 0;
          }

          .item {
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            align-items: center;
            height: 100%;
            width: 44px;
            font-size: 16px;
            color: #555555;
            border-radius: 5px;
            background: #f5f5f5;
            box-sizing: border-box;
            padding: 10px 0;
            z-index: 1;

            span {
              font-weight: bold;
            }

            .star {
              display: inline-block;
              height: 28px;
              width: 28px;
              background: url('./star.png') no-repeat;
              background-size: cover;
            }

            &.active {
              background: #ffba00;
              color: #ffffff;

              .star {
                background: url('./gou.png') no-repeat;
                background-size: cover;
              }
            }
          }
        }
      }
    }

    .box {
      .item {
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        box-sizing: border-box;
        width: 100%;
        height: 65px;
        padding: 12px 15px;
        background: #ffffff;
        position: relative;
        border-bottom: 1px solid #f5f5f5;

        h5 {
          color: #222222;
          font-size: $font-size-medium;
          box-sizing: border-box;
          padding-bottom: 4px;

          .gold {
            display: inline-block;
            padding-left: 20px;
            margin-left: 15px;
            color: #ffaa07;
            position: relative;

            &:before {
              position: absolute;
              content: '';
              width: 16px;
              height: 16px;
              top: -1px;
              left: 0;
              background: url('./gold.png') no-repeat;
              background-size: 100% 100%;
            }
          }
        }

        p {
          color: #777777;
          font-size: $font-size-small;
          box-sizing: border-box;
          padding-right: 60px;
        }

        .go {
          width: 58px;
          height: 28px;
          line-height: 26px;
          border-radius: 29px;
          background: #1faed6;
          background-size: 100% 100%;
          position: absolute;
          right: 15px;
          outline: none;
          border: none;
          font-size: 14px;
          color: #ffffff;
          font-family: 'PingFang SC', 'STHeitiSC-Light', 'Helvetica-Light', arial, sans-serif, 'Droid Sans Fallback';

          &.done {
            background: #cccccc;
            background-size: 100% 100%;
          }
        }
      }
    }
  }
}
</style>
