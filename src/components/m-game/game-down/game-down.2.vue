<template>
  <transition name="slider">
    <div class="game-down">
      <m-header>
        <template slot="header">
          <back-icon></back-icon>
          <p>下载中心 <span @click="clearAllTask()">清除所有任务</span></p>
          <div
            class="right-button"
            @click="isDeleteTask"
          >
            {{headerRightText}}
          </div>
        </template>
      </m-header>
      <div
        class="warpper"
        ref="downwrapper"
      >
        <div v-if="downloadTasks.length || complatedTasks.length">
          <!-- 已完成任务 -->
          <div
            class="item"
            v-for="(ctask,index) in complatedTasks"
            :key="ctask.id"
          >
            <!-- v-show="complatedTasks.length" -->
            <div class="icon"><img
                v-lazy="taskInfo[ctask.url].icon"
                alt=""
              >
              <span
                class="delete"
                v-show="deleteActive"
                @click="settingDeleteTask(1,index)"
              ></span>
            </div>
            <div class="content">
              <h5>{{taskInfo[ctask.url].name}}</h5>
              <div class="precent">
                <div class="progress">
                  <div class="size">{{taskInfo[ctask.url].size}}</div>
                  <div class="info">下载完成</div>
                  <span style="width:100%"></span>
                </div>
                100%
              </div>
            </div>
            <div
              class="buttom"
              :class="{'open':ctask.isInstall}"
              @click="openOrInstall(ctask)"
            >
              {{ctask.isInstall?'打开':'安装'}}
            </div>
          </div>
          <!-- 已完成任务 -->
          <!-- 未完成任务 -->
          <div
            class="item"
            v-for="(task,index) in downloadTasks"
            :key="task.id"
            v-show="downloadTasks.length"
            v-if="task.state !=2"
          >
            <div class="icon"><img
                v-lazy="taskInfo[task.url].icon"
                alt=""
              >
              <span
                class="delete"
                v-show="deleteActive"
                @click="settingDeleteTask(0,index)"
              ></span>
            </div>
            <div class="content">
              <h5>{{taskInfo[task.url].name}}</h5>
              <div class="precent">
                <div class="progress">
                  <div class="size">{{taskInfo[task.url].size}}</div>
                  <div class="info">{{task.isStart?'正在下载':'暂停下载'}}</div>
                  <span :style="{width:task.progress+'%'}"></span>
                </div>
                {{task.progress}}%
              </div>
            </div>
            <div class="icon-down">
              <span
                class="icon"
                :class="{'pause':!task.isStart,'start':task.isStart}"
                @click="changeDownloadState(task)"
              ></span>
            </div>
          </div>
        </div>
        <div v-else>
          <err-tip
            :showButton="showButton"
            :buttonText="buttonText"
            :tipText="tipText"
            :type="type"
            @refresh='goGame'
            style="margin-top:100px"
          ></err-tip>
        </div>
      </div>
      <mask-common
        :showMask="showMask"
        @mask="hideMask"
        :maskInfo="maskInfo"
        @delete=deleteTask
      ></mask-common>
    </div>
  </transition>
</template>
<script>
import MHeader from '@/components/m-header/m-header';
import BackIcon from '@/base/icon_widget/arrow_back';
import MaskCommon from '@/base/maskcommon/maskforgame';
import ErrTip from '@/base/errortipwidget/errortipwidget';
import { getLocalStorage, setLocalStorage } from 'common/js/storage';
import { mapGetters } from 'vuex';

const CANCLE = '取消';
const EDIT = '编辑';
const DOWNTASK = 'downtask';
export default {
  data() {
    return {
      headerRightText: EDIT,
      downloadTasks: [],
      complatedTasks: [],
      deleteActive: false, // 是否显示删除按钮
      showMask: false,
      deleteType: 0, // 删除任务类型 0:未完成任务，1：已完成任务
      deleteIndex: 0, // 删除任务下标，配合deleteType使用
      maskInfo: {
        content: '',
        btn: [],
      }, // 配置弹出框相关内容
      taskInfo: null,
      isMounted: true,
      // 配置提示信息
      showButton: true,
      buttonText: '去下载',
      tipText: '我这儿啥都没有',
      type: 2,
    };
  },

  mounted() {
    this.$refs.downwrapper.style.top = this.statusbar ? `${44 + parseInt(this.statusbar)}px` : '68px';
    if (this.isMounted) {
      this.initTasks();
      this.isMounted = false;
    }
  },
  activated() {
    if (!this.isMounted) {
      this.initTasks();
    }
  },
  deactivated() {
    this.isMounted = false;
  },
  destroyed() {
    console.log('销毁页面');
  },
  computed: {
    ...mapGetters(['statusbar']),
  },
  methods: {
    goGame() {
      this.$router.push({
        path: '/gamemod',
      });
    },
    initTasks() {
      let info = getLocalStorage(DOWNTASK);
      this.taskInfo = info !== '' ? JSON.parse(info) : {};

      this.enumeratecTasks();
      this.enumerateDownTasks();
    },
    changeDownloadState(task) {
      if (!task.isStart) {
        task.resume();
        this.$set(task, 'isStart', true);
        plus.nativeUI.toast('开始下载', {
          duration: 'shortsh',
        });
      } else {
        task.pause();
        this.$set(task, 'isStart', false);
        plus.nativeUI.toast('任务暂停', {
          duration: 'shortsh',
        });
      }
    },
    clearAllTask() {
      alert('清除任务呢');
      plus.downloader.clear();
      plus.downloader.clear(4);
      this.enumeratecTasks();
    },
    // 获取所有完成任务
    enumeratecTasks() {
      this.complatedTasks = [];
      plus.downloader.enumerate((tasks) => {
        console.log('完成任务');
        console.log(tasks);
        for (let i = 0; i < tasks.length; i++) {
          if (tasks[i].downloadedSize === tasks[i].totalSize) {
            if (tasks[i].isInstall === undefined) {
              this.$set(tasks[i], 'isInstall', false);
            }
            this.complatedTasks.push(tasks[i]);
          }
        }
        for (let j = 0; j < this.complatedTasks.length; j++) {
          let task = this.complatedTasks[j];
          console.log(this.taskInfo[task.url]);
          console.log(this.taskInfo[task.url].pk_n);
          if (plus.runtime.isApplicationExist({ pname: task.pk_n })) {
            this.$set(task, 'isInstall', true);
          } else {
            this.$set(task, 'isInstall', false);
          }
        }
      }, 4);
    },
    // 获取所有未完成任务，并且添加事件监听
    enumerateDownTasks() {
      plus.downloader.enumerate((tasks) => {
        this.downloadTasks = tasks;
        console.log('未完成任务');
        console.log(this.downloadTasks);
        // for (let i = 0; i < this.downloadTasks.length; i++) {
        //   if (this.downloadTasks[i].state === 2 && (this.downloadTasks[i].downloadedSize === this.downloadTasks[i].totalSize) && this.downloadTasks[i].totalSize !== 0) {
        //     this.downloadTasks[i].addEventListener = null;
        //     this.complatedTasks.push(this.downloadTasks[i]);
        //   }
        //   //   console.log('添加事件监听');
        //   //   this.pauseDownload(this.downloadTasks[i]);
        //   this.downloadTasks[i].addEventListener('statechanged', this.onStateChanged, false);
        //   if (!this.downloadTasks[i].isStart) {
        //     this.$set(this.downloadTasks[i], 'isStart', true);
        //   }
        //   if (!this.downloadTasks[i].isListen) {
        //     console.log('添加了监听');
        //     this.$set(this.downloadTasks[i], 'progress', isNaN(Math.floor(this.downloadTasks[i].downloadedSize / this.downloadTasks[i].totalSize * 100)) ? 0 : Math.floor(this.downloadTasks[i].downloadedSize / this.downloadTasks[i].totalSize * 100));
        //     this.$set(this.downloadTasks[i], 'isListen', true);
        //   }
        //   //   this.resumeDownload(this.downloadTasks[i]);
        // }
        this.downloadTasks.forEach((task, index) => {
          if (task.state === 2 && (task.downloadedSize === task.totalSize) && task.totalSize !== 0) {
            task.addEventListener = null;
            this.complatedTasks.push(task);
            this.downloadTasks.slice(index, 1);
          }
          //   console.log('添加事件监听');
          //   this.pauseDownload(this.downloadTasks[i]);
          task.addEventListener('statechanged', this.onStateChanged, false);
          if (!task.isStart) {
            this.$set(task, 'isStart', true);
          }
          if (!task.isListen) {
            this.$set(task, 'progress', isNaN(Math.floor(task.downloadedSize / task.totalSize * 100)) ? 0 : Math.floor(task.downloadedSize / task.totalSize * 100));
            this.$set(task, 'isListen', true);
          }
        });
      });
    },
    //  监听下载任务状态
    onStateChanged(download, status) {
      if (download.state === 4 && status !== 200) {
        download.start();
        download.resume();
      }
      if (download.state === 4 && status === 200) {
        download.addEventListener = null;
        // 重新刷新页面
        this.enumeratecTasks();
        this.enumerateDownTasks();
      }
      if (download.state === 3 && status === 200) {
        let progress = Math.floor(download.downloadedSize / download.totalSize * 100);
        if (progress !== download.progress) {
          this.$set(download, 'progress', progress);
        }
      }
    },
    // 暂停任务
    pauseDownload(task) {
      task.pause();
    },
    // 恢复任务
    resumeDownload(task) {
      task.resume();
    },
    // 删除任务
    deleteTask() {
      this.showMask = false;
      // deleteType:删除任务类型 0:未完成任务，1：已完成任务
      let game = this.deleteType ? this.complatedTasks[this.deleteIndex] : this.downloadTasks[this.deleteIndex];
      delete this.taskInfo[game.url];
      setLocalStorage(DOWNTASK, JSON.stringify(this.taskInfo));
      if (this.deleteType) {
        this.complatedTasks.splice(this.deleteTask, 1);
      } else {
        this.downloadTasks.splice(this.deleteIndex, 1);
      }
      // 删除文件
      plus.io.resolveLocalFileSystemURL(game.filename, (entry) => {
        entry.remove();
        game.abort();
      }, () => {
        game.abort();
      });
    },
    // 编辑和取消切换
    isDeleteTask() {
      if (this.headerRightText === EDIT) {
        this.headerRightText = CANCLE;
        this.deleteActive = true;
      } else {
        this.headerRightText = EDIT;
        this.deleteActive = false;
      }
    },
    // 设置要删除任务的相关信息，并且展示下载框
    settingDeleteTask(deleteType, index) {
      this.deleteType = deleteType;
      this.deleteIndex = index;
      this.showConfirmBox();
    },
    showConfirmBox() {
      this.showMask = true;
      this.maskInfo.extendtips = '温馨提示';
      this.maskInfo.content = '删除下载任务及安装包';
      this.maskInfo.btn[0] = {
        btnTitle: '取消',
        type: 'hide',
        theme: 'dark',
      };
      this.maskInfo.btn[1] = {
        btnTitle: '确定',
        type: 'delete',
      };
    },
    // 判断是打开还是安装
    openOrInstall(task) {
      if (task.isInstall) {
        this.openGame(task);
      } else {
        this.install(task);
      }
    },
    // 安装应用
    install(task) {
      plus.runtime.install(task.filename, {}, () => {
        this.$set(task, 'isInstall', true);
      }, () => {
        this.$set(task, 'isInstall', false);
        plus.nativeUI.toast('应用安装失败');
      });
    },
    openGame(task) {
      let pkName = this.taskInfo[task.url].pk_n;
      if (plus.runtime.isApplicationExist({ pname: pkName })) {
        //  安装=>启动应用
        console.log('打开应用');
        if (plus.os.name === 'Android') {
          plus.runtime.launchApplication({
            pname: pkName,
          }, () => {
            plus.nativeUI.toast('打开失败');
          });
        }
      } else {
        console.log('安装');
        this.install(task);
      }
    },
    // 判断安装包是否存在
    checkTaskIsExist(task) {
      console.log('进入文件判断流程');
      plus.io.resolveLocalFileSystemURL(
        task.filename,
        (entry) => {
          console.log(entry);
          if (entry.isFile) {
            console.log('文件存在');
          }
        },
        () => {
          console.log('文件不存在');
        },
      );
    },
    hideMask() {
      this.showMask = false;
    },
  },
  components: {
    MHeader,
    BackIcon,
    MaskCommon,
    ErrTip,
  },
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~common/stylus/variable';
@import '~common/stylus/mixin';

slider();

.game-down {
  position: fixed;
  top: 0;
  bottom: 0;
  width: 100%;
  background: #ffffff;

  .warpper {
    sub-position();
    z-index: 20;
    overflow: scroll;
    border-top: 8px solid #f5f5f5;
    -webkit-overflow-scrolling: touch;

    &::-webkit-scrollbar {
      display: none;
    }

    &::-webkit-scrollbar {
      width: 0px;
    }

    .item {
      height: 80px;
      width: 100%;
      display: flex;
      align-items: center;
      padding: 15px;
      box-sizing: border-box;
      border-bottom: 1px solid #eeeeee;

      .precent {
        display: flex;
        align-items: center;
        font-size: 12px;
        color: #333333;

        .progress {
          flex: 1;
          height: 8px;
          box-sizing: border-box;
          border-radius: 4px;
          border: 1px solid #1faed6;
          background: #ffffff;
          margin-right: 5px;
          position: relative;

          .info {
            position: absolute;
            left: 0;
            top: -15px;
            font-size: 10px;
          }

          .size {
            position: absolute;
            right: 0;
            top: -15px;
            font-size: 10px;
          }

          span {
            display: block;
            height: 100%;
            background: #1faed6;
          }
        }
      }

      .icon {
        position: relative;
        width: 50px;
        height: 50px;
        border-raduis: 5px;

        img {
          width: 100%;
          height: 100%;
          border-radius: 5px;
        }

        .delete {
          position: absolute;
          width: 14px;
          height: 14px;
          right: -7px;
          top: -7px;
          border-radius: 7px;
          background: url('./shanchu@3x.png') no-repeat;
          background-size: 14px 14px;
        }
      }

      .content {
        flex: 1;
        display: flex;
        height: 50px;
        padding-left: 10px;
        flex-direction: column;
        justify-content: space-between;

        h5 {
          font-size: 14px;
          color: #333333;
          font-weight: bold;
        }

        .size {
          display: flex;
          flex-direction: row-reverse;
          font-size: 12px;
          color: #333333;
        }
      }

      .buttom {
        margin-left: 30px;
        width: 50px;
        height: 28px;
        border: 1px solid #1faed6;
        border-radius: 5px;
        line-height: 28px;
        text-align: center;
        color: #1faed6;
        font-weight: bold;
        font-size: 14px;

        &.open {
          border: 1px solid #ffb244;
          color: #ffb244;
        }
      }

      .icon-down {
        margin-left: 30px;
        width: 50px;
        height: 28px;
        display: flex;
        justify-content: flex-end;

        .icon {
          display: block;
          width: 20px;
          height: 20px;
          border-radius: 50%;

          &.pause {
            background: url('./pause.png') no-repeat center;
            background-size: 100%;
          }

          &.start {
            background: url('./start.png') no-repeat center;
            background-size: 100%;
          }
        }
      }
    }
  }
}
</style>
