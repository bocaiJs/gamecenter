<template>
  <transition :name="transitionName">
    <div class="mission">
      <m-header>
        <template slot="header">
          <back-icon></back-icon>
          <p style="padding-right:46px">{{titleText}}</p>
        </template>
      </m-header>
      <div
        class="mission-box"
        ref="mission"
        v-show="!showLoading"
      >
        <div
          class="item"
          @click="doTasks(task.id,task.app_id,task.task_finish_status)"
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
      <div
        class="loading-container"
        v-if="showLoading"
      >
        <loading></loading>
      </div>
      <router-view></router-view>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
import MHeader from '@/components/m-header/m-header';
import Scroll from '@/base/scroll/scroll';
import Loading from '@/base/loading/loading';
import { mapGetters } from 'vuex';
import { getCommonInfoHasData } from '@/base/api/indexpage/getindexinfo';
import BackIcon from '@/base/icon_widget/arrow_back';

export default {
  data() {
    return {
      titleText: '成长任务',
      transitionName: 'slider',
      taskList: [],
      showLoading: true,
    };
  },
  mounted() {
    this.$refs.mission.style.top = (44 + parseInt(this.statusbar)) + 'px';
    this.getTaskList();
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
          this.$router.back(-1);
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
        this.taskList = res;
        this.$nextTick(() => {
          this.showLoading = false;
        });
      });
    },
  },
  watch: {
    $route(to) {
      if (to.path === '/index') {
        console.log('ddd');
        this.transitionName = 'opacity';
      } else {
        this.transitionName = 'slide-left';
      }
    },
  },
  computed: {
    ...mapGetters(['getToken', 'statusbar']),
  },
  components: {
    MHeader,
    Scroll,
    Loading,
    BackIcon,
  },
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~common/stylus/variable';
@import '~common/stylus/mixin';

.slider-enter-active, .slider-leave-active {
  transition: all 300ms;
}

.slider-enter, .slider-leave-to {
  transform: translate3d(100%, 0, 0);
}

.opacity-enter, .opacity-leave-to {
  opacity: 0;
}

.mission {
  position: fixed;
  width: 100%;
  top: 0;
  bottom: 0;
  background: #f2f2f2;

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
    margin-bottom: 10px;

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
          background: url('./jb@3x.png') no-repeat;
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

  .loading-container {
    loading();
  }
}
</style>
