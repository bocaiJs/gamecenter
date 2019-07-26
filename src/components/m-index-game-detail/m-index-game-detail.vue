<template>
  <transition name="slider">
    <div
      class="game-detail"
      ref="gd"
    >
      <m-header>
        <template slot="header">
          <arrow-back></arrow-back>
          <p class="padding-right">
            游戏详情
          </p>
        </template>
      </m-header>
      <div
        class="g-d-box"
        v-show="!showFirstInloading"
        ref="gamedetail"
      >
        <scroll
          class="g-d-wrapper"
          :listenScroll=true
          :pullUpLoad=pullUpLoad
          :data=data
          @pullingUp='getMoreComment'
        >
          <div>
            <div style="height:8px;width:100%;background:#f5f5f5"></div>
            <gamedetail-item
              :gameInfo=gameInfo
              @favorite='favorite'
            ></gamedetail-item>
            <div class="ticket-box">
              <div
                class="t-b-item pink"
                @click="goPackList('giftlist')"
              >
                <span class="icon gift"></span>
                <p>礼包领取</p>
              </div>
              <div
                class="t-b-item blue"
                @click="goPackList('ticketlist')"
              >
                <span class="icon voucher"></span>
                <p>代金券领取</p>
              </div>
            </div>
            <div class="g-d-intro-box">
              <div class="intro">
                <h3><span class="bell"></span>游戏简介:</h3>
                <p>{{gameInfo.description}}</p>
                <div
                  class="slider-warpper"
                  ref="sliderWrapper"
                  v-show="gameInfo.image"
                >
                  <div
                    class="slider-box"
                    ref="sliderBox"
                  >
                    <img
                      :src="gameimgdesc"
                      alt=""
                      v-for="(gameimgdesc,index) in gameInfo.image"
                      :key=index
                      preview="0"
                      preview-text="描述文字"
                    >
                    <!-- @click="previewIMG(gameimgdesc)" -->
                  </div>
                </div>
              </div>
            </div>
            <div class="tab-head">
              <div
                class="tab-item"
                @click="changeTabIndex(0)"
                :class="{active:tabIndex===0}"
              >评论</div>
              <div
                class="tab-item"
                @click="changeTabIndex(1)"
                :class="{active:tabIndex===1}"
              >开服</div>
              <div
                class="tab-item"
                @click="changeTabIndex(2)"
                :class="{active:tabIndex===2}"
              >活动 <span
                  class="dot"
                  v-show="new_active"
                >new</span></div>
              <div
                class="tab-item"
                @click="changeTabIndex(3)"
                :class="{active:tabIndex===3}"
              >攻略</div>
              <!-- <div
                class="tab-item"
                @click="changeTabIndex(4)"
                :class="{active:tabIndex===4}"
              >公告</div> -->
            </div>
            <div class="tab-content">
              <div
                class="comment"
                v-if="tabIndex ===0"
              >
                <!-- 评论加载 -->
                <comment-item
                  v-for="(comment,index) in comments.list"
                  :key=index
                  :comment=comment
                  :index=index
                  @userup=userup
                  @userdown=userdown
                  @goCommentDetail=goCommentDetail
                ></comment-item>
                <!-- 评论加载 -->
                <div
                  class="loading-container "
                  v-if="this.comments.currentPage<totalPage"
                >
                  <loading-more></loading-more>
                </div>
                <p
                  v-if="comments.list &&!comments.list.length"
                  class="no-more"
                >暂无</p>
              </div>
              <!-- 开服信息 -->
              <div
                class="service-info"
                v-if="tabIndex ===1"
              >
                <service-item
                  v-for="server in serverList"
                  :key="server.id"
                  :serverInfo="server"
                ></service-item>
                <p
                  v-if="!serverList.length"
                  class="no-more"
                >暂无</p>
              </div>
              <!-- 公告信息 -->
              <div
                class="gift-info"
                v-if="tabIndex ===2"
              >
                <notice-item
                  v-for="(item,index) in noticeList"
                  :key="item.id"
                  :notice=item
                  :index=index
                  v-if="noticeList.length"
                ></notice-item>
                <p
                  v-if="!noticeList.length"
                  class="no-more"
                >暂无</p>
              </div>
              <!-- 攻略信息 -->
              <div
                class="strategy"
                v-if="tabIndex ===3"
                style="padding:1px 15px;"
              >
                <strategy-item
                  v-for="strategy in strategyList"
                  :key="strategy.id+'strategy'"
                  :strategy=strategy
                ></strategy-item>
                <p
                  v-if="!strategyList.length"
                  class="no-more"
                >暂无</p>
              </div>
            </div>
          </div>
        </scroll>
        <div class="g-d-comment">
          <div
            class="desc"
            @click="goDownPage"
          >
            <span class="icon downmanger">
              <span
                class="count"
                v-if="taskCount"
              ></span>
            </span>
            <p>管理</p>
          </div>
          <span
            class="downlgame"
            @click="downGame"
            ref="download"
          >{{downtext}}</span>
          <div class="desc">
            <span
              class="icon comment"
              @click="goPublishPage"
            ></span>
            <p>评论</p>
          </div>
        </div>
      </div>
      <mask-common
        :showMask="showMask"
        @mask="hideMask"
        :maskInfo="maskInfo"
        :showMoreTip=showMoreTip
        :dhcode=dhcode
      ></mask-common>
      <div
        class="preview"
        v-show="preview"
        @click="hidePreview"
        ref="previewdom"
      >
        <img
          :src="previewSrc"
          alt=""
        >
      </div>
      <div
        class=" loading-firstin "
        v-show="showFirstInloading "
      >
        <loading></loading>
      </div>
      <router-view></router-view>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
import BSscroll from 'better-scroll';
import MHeader from 'components/m-header/m-header';
import Scroll from '@/base/scroll/scroll';
import Loading from '@/base/loading/loading';
// import MaskCommon from '@/base/maskcommon/maskcommon';
import MaskCommon from '@/base/maskcommon/maskforgame';
import ArrowBack from '@/base/icon_widget/arrow_back';
import { getCommonInfo, getCommonInfoHasData, postInfo } from '@/base/api/indexpage/getindexinfo';
import { getFileName, checkApp, checkTaskIsExist } from 'common/js/deviceUtil';
import { storageAvatar, storageId, getLocalStorage, storageDownTask } from 'common/js/storage';
import { mapGetters } from 'vuex';
// 加载更多
import LoadingMore from '@/base/loadingmore/loading';
// 游戏详情顶部
import GamedetailItem from './game_detail_item/game_detail_item';
// 开服组件
import ServiceItem from './game_detail_item/service-item';
// 礼包组件
import GiftPackage from './game_detail_item/giftpackage';
// 攻略组件
import StrategyItem from './game_detail_item/strategy_item';
// 评论组件
import CommentItem from './game_detail_item/comment_item';
// 公告组件
import NoticeItem from './game_detail_item/notice_item';

const DOWN = '下载';
const DOWNING = '下载中...';
const INSTALLGAME = '安装';
const OPENGAME = '打开';
const REDOWNLOAD = '重新下载';
export default {
  name: 'gamedetail',
  data() {
    return {
      tabIndex: 0,
      taskCount: 0,
      preview: false,
      previewSrc: '',
      commentLoadingText: null,
      showFirstInloading: true,
      comments: {},
      gameInfo: {},
      filename: '',
      pullUpLoad: true, // 是否监听上拉
      data: 0, // 通知scroll组件 更新上拉状态
      showMask: false,
      maskInfo: {
        content: '',
        btn: [],
      },
      downtext: DOWN,
      serverList: [],
      giftList: [],
      strategyList: [],
      noticeList: [],
      showMoreTip: true, // 为提示组件配置
      dhcode: '', // 存放兑换码
      canGetGiftCode: true, // 点击领取礼包的请求在返回结果之前，是否可以再次点击
      totalPage: 0,
      retry: false,
      new_active: false,
    };
  },
  created() {
    this.id = this.$route.params.gameid;
    this._getCommonInfo();
  },
  mounted() {
    this.$refs.gamedetail.style.top = (44 + parseInt(this.statusbar)) + 'px';
  },
  methods: {
    changeTabIndex(i) {
      this.tabIndex = i;
      if (i === 2) {
        this.new_active = false;
      }
    },
    //  图片预览
    previewIMG(imgUrl) {
      this.preview = true;
      this.previewSrc = imgUrl;
      this.$refs.previewdom.style.opacity = 1;
    },
    hidePreview() {
      this.preview = false;
      this.$refs.previewdom.style.opacity = 0;
    },
    goCommentDetail(commentId) {
      this.$router.push({
        path: `/gamedetail/${this.id}/comment/${commentId}`,
        params: {
          commentId,
        },
        query: {
          commentId,
        },
      });
    },
    // 点灭 取消点灭 userdown:表示自己踩没有。down 表示所有的踩的人数
    userdown(id, index) {
      if (this.comments.list[index].userdown === 1) {
        const url = '/game/comments/delDown';
        postInfo(url, {
          id,
          token: this.getToken,
        }).then((res) => {
          if (res.status_code === 200) {
            this.comments.list[index].userdown = 0;
            if (this.comments.list[index].down > 0) {
              this.comments.list[index].down--;
            }
            plus.nativeUI.toast(res.message, {
              duration: 'shortsh',
            });
          } else {
            plus.nativeUI.toast(res.message, {
              duration: 'shortsh',
            });
          }
        });
      } else {
        const url = '/game/comments/down';
        postInfo(url, {
          id,
          token: this.getToken,
        }).then((res) => {
          if (res.status_code === 200) {
            this.comments.list[index].userdown = 1;
            this.comments.list[index].down++;
            plus.nativeUI.toast(res.message);
          } else {
            plus.nativeUI.toast(res.message);
          }
        });
      }
    },
    // 点赞，取消点赞,
    userup(commentId, index) {
      if (this.comments.list[index].userup === 1) {
        const url = '/game/comments/delUp';
        postInfo(url, {
          id: commentId,
          token: this.getToken,
        }).then((res) => {
          if (res.status_code === 200) {
            this.comments.list[index].userup = 0;
            if (this.comments.list[index].up > 0) {
              this.comments.list[index].up--;
            }
            plus.nativeUI.toast(res.message);
          } else {
            plus.nativeUI.toast(res.message);
          }
        });
      } else {
        const userUpAdd = `/game/comments/up/${commentId}`;
        postInfo(userUpAdd, {
          commentId,
          token: this.getToken,
        }).then((res) => {
          if (res.status_code === 200) {
            this.comments.list[index].userup = 1;
            this.comments.list[index].up++;
            plus.nativeUI.toast(res.message);
          } else {
            plus.nativeUI.toast(res.message);
          }
        });
      }
    },
    // 初始化五图
    initSlider() {
      setTimeout(() => {
        if (!this.$refs.sliderWrapper) {
          return;
        }
        this.scroll = new BSscroll(this.$refs.sliderWrapper, {
          click: false,
          momentum: true,
          bounce: true,
          scrollX: true,
        });
        this.$previewRefresh();
      }, 200);
      this.$refs.sliderBox.style.width = this.gameInfo.image.length * 160 + 'px';
    },
    goPackList(path) {
      this.$router.push({
        path: `/gamedetail/${this.id}/${path}?id=${this.id}`,
      });
    },
    goDownPage() {
      this.$router.push({
        path: `/gamedetail/${this.id}/down`,
      });
    },
    favorite() {
      if (this.getLoginState) {
        const address = `/game/follow/${this.id}?token=${this.getToken}`;
        getCommonInfo(address).then(() => {
          this.gameInfo.followStatus = !this.gameInfo.followStatus;
        });
      } else {
        this.maskLoginInfo('用户未登录');
      }
    },
    //  跳转游戏评论页
    goPublishPage() {
      if (this.getLoginState) {
        this.$router.push({
          path: `/gamedetail/${this.id}/publish`,
          query: {
            gameid: this.id,
          },
        });
      } else {
        this.maskLoginInfo('用户未登录');
      }
    },
    //  获取游戏详情及评论信息;
    _getCommonInfo() {
      const address = `/game/info/${this.id}?token=${this.getToken}`;
      getCommonInfoHasData(address, {
         imei: plus.device.imei.split(',')[0],
      }).then((res) => {
        this.new_active = res.data.new_active;
        this.$nextTick(() => {
          this.comments = res.data.comments;
          this.gameInfo = res.data.gameInfo;
          this.data++;
          let name = getFileName(this.gameInfo.android);
          this.filename = name;
          // 计算分页总数
          if (this.comments.total % this.comments.pageSize === 0) {
            this.totalPage = this.comments.total / this.comments.pageSize;
          } else {
            this.totalPage = Math.floor(this.comments.total / this.comments.pageSize) + 1;
          }
          this._showDownText(this.filename, this.gameInfo.package_name, this.gameInfo.android, this.gameInfo.h5_status);
          this.getDownloadTasks();
        });
        this._getServer(this.id);
        // this._getGift(this.id);
        this._getStrategy(this.id);
        this._getNotice(this.id);
        setTimeout(() => {
          this.showFirstInloading = false;
          this.initSlider();
        }, 200);
      });
    },
    getMoreComment() {
      if (this.tabIndex !== 0) return;
      const moreContentUrl = `/game/comments/list/${this.id}`;
      if (this.comments.currentPage + 1 <= this.totalPage) {
        let commentData = {
          page: this.comments.currentPage + 1,
        };
        getCommonInfoHasData(moreContentUrl, commentData).then((res) => {
          this.comments.currentPage = res.data.currentPage;
          this.comments.list = this.comments.list.concat(res.data.list);

          /*  *************************************************************************************
           * 改变data值，通知scroll组件更新pullup状态，隐藏加载框
           * ***********************************************************************************  */
          this.data += 1;
        });
      } else {
        console.log('没有更多数据');
      }
    },
    hideMask() {
      this.showMask = false;
    },
    downGame() {
      if (!this.getLoginState) {
        this.showMask = true;
        this.showMoreTip = false;
        this.maskInfo.extendtips = '温馨提示';
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
        this.dhcode = '';
        return;
      }
      if (this.gameInfo.h5_status) {
        this.gameInfo.h5_url = this.gameInfo.h5_url.indexOf('?') !== -1 ? `${this.gameInfo.h5_url}&appToken=${this.getToken}` : `${this.gameInfo.h5_url}?appToken=${this.getToken}`;
        if (!this.gameInfo.followStatus) {
          this.favorite();
        }
        this.$router.push({
          path: `/gamedetail/${this.id}/h5`,
          query: {
            tvurl: this.gameInfo.h5_url,
            title: Base64.encode(this.gameInfo.name),
          },
        });
        return;
      }
      if (this.downtext === DOWN || this.downtext === REDOWNLOAD) {
        this.addDownLoadTask(this.gameInfo.android, this.gameInfo.icon, this.gameInfo.package_name, this.gameInfo.id, this.gameInfo.name, this.gameInfo.size);
        this.taskCount += 1;
        this.downtext = DOWNING;
      } else if (this.downtext === INSTALLGAME) {
        plus.runtime.install(`_downloads/${this.filename}`, {}, () => {
          if (checkApp(this.gameInfo.package_name)) {
            this.downtext = OPENGAME;
          }
        }, () => {
          console.log('安装失败');
        });
      } else if (this.downtext === OPENGAME) {
        if (plus.runtime.isApplicationExist({ pname: this.gameInfo.package_name })) {
          //  安装=>启动应用
          if (plus.os.name === 'Android') {
            plus.runtime.launchApplication({
              pname: this.gameInfo.package_name,
            }, () => {
              console.log('打开失败');
            });
          }
        }
      } else if (this.downtext === DOWNING) {
        this.goDownPage();
      }
    },
    // 展示下载按钮文字
    async _showDownText(fileN, packN, url, state) {
      if (!this.$refs.download) {
        return;
      }
      if (state) {
        this.downtext = OPENGAME;
        return;
      }
      if (await checkApp(packN)) {
        this.downtext = OPENGAME;
        return;
      } else {
        checkTaskIsExist(fileN, () => {
          // 如果是文件 判断是否在下载完成列表里;
          plus.downloader.enumerate((tasks) => {
            for (let i = 0; i < tasks.length; i++) {
              let task = tasks[i];
              if (`_downloads/${fileN}` === task.filename) {
                this.downtext = INSTALLGAME;
                return;
              }
            }
          }, 4);
          // url 一定是存在的。下载任务的文件名有可能是空的
          plus.downloader.enumerate((tasks) => {
            for (let i = 0; i < tasks.length; i++) {
              let task = tasks[i];
              if (url === task.url) {
                this.downtext = DOWNING;
                if (task.state === 2 && (task.totalSize === task.downloadedSize)) {
                  this.downtext = INSTALLGAME;
                }
              }
            }
          });
        }, () => {
          // 判断任务是否重复
          // url 一定是存在的。下载任务的文件名有可能是空的
          let isTaskExist = new Promise((resolve, reject) => {
            plus.downloader.enumerate((tasks) => {
              for (let i = 0; i < tasks.length; i++) {
                if (tasks[i].url === url) {
                  reject();
                }
              }
              resolve();
            });
          });
          isTaskExist.then(() => {
            this.downtext = DOWN;
          }, () => {
            this.downtext = DOWNING;
          });
        });
      }
    },
    // 下载
    async addDownLoadTask(url, icon, packgaeName, id, name, size) {
      let _this = this;
      let address = url.split('/');
      let filename = address[address.length - 1];
      storageAvatar(icon, packgaeName, filename);
      storageId(id, filename);
      plus.io.resolveLocalFileSystemURL(
        `_downloads/${filename}`,
        (entry) => {
          if (entry.isFile) {
            plus.nativeUI.alert('任务已在列表中，请勿重复下载!', () => {
              console.log('User pressed!');
            }, '友情提示', '确定');
          }
        },
        () => {
          // 判断任务是否重复
          let isTaskExist = new Promise((resolve, reject) => {
            plus.downloader.enumerate((tasks) => {
              for (let i = 0; i < tasks.length; i++) {
                if (tasks[i].url === url) {
                  reject();
                }
              }
              resolve();
            });
          });
          isTaskExist.then(() => {
            let downTask = plus.downloader.createDownload(
              url,
              { method: 'GET' },
              //  下载完成执行的回调函数
              (d, status) => {
                // 下载成功
                if (status === 200) {
                  _this.downtext = INSTALLGAME;
                  let gameObject = getLocalStorage('gameID');
                  let idObj = gameObject !== '' ? JSON.parse(gameObject) : '';
                  getCommonInfoHasData(`/download/app/${idObj[d.filename].id}`, {
                    token: this.getToken,
                  }).then((res) => {
                    console.log(res);
                  });
                  if (localStorage.getItem('autoInstall')) {
                    plus.runtime.install(d.filename, {}, () => {
                      d.isinstall = true;
                    }, () => {
                      d.isinstall = false;
                    });
                  }
                } else { // 下载失败
                  if (d.totalSize === d.downloadedSize) {
                    d.addEventListener = null;
                    return;
                  }
                  d.abort();
                  if (!this.retry) {
                    this.retry = true;
                    this.addDownLoadTask(url, icon, packgaeName, id, name, size);
                  }
                }
              },
            );
            downTask.pn_k = packgaeName;
            // 存储用户ID对应的包名 还有头像
            console.log('存储游戏信息', name);
            storageDownTask(downTask.url, icon, packgaeName, name, size);
            downTask.start();
            this.retry = false;
          }, () => {
            console.log('任务已经存在');
          });
        },
      );
    },
    getDownloadTasks() {
      plus.downloader.enumerate((tasks) => {
        this.taskCount = tasks.length;
      });
    },
    // 获取开服信息
    _getServer(id) {
      const url = '/game/openServer';
      getCommonInfoHasData(url, {
        game_id: id,
      }).then((res) => {
        this.serverList = res.data;
      });
    },
    // // 游戏礼包列表
    // _getGift(id) {
    //   const url = '/gift/list';
    //   getCommonInfoHasData(url, {
    //     game_id: id,
    //     token: this.getToken,
    //   }).then((res) => {
    //     this.giftList = res.data;
    //   });
    // },
    // 游戏攻略
    _getStrategy(id) {
      const url = '/game/strategies';
      getCommonInfoHasData(url, {
        game_id: id,
      }).then((res) => {
        console.log(res);
        this.strategyList = res.data;
      });
    },
    // 游戏活动
    _getNotice(id) {
      const url = '/game/notice';
      getCommonInfoHasData(url, {
        game_id: id,
        imei: plus.device.imei.split(',')[0],
        // imei: '868217035671172',
      }).then((res) => {
        this.noticeList = res.data;
      });
    },
    // 获取礼包兑换码
    getGiftCode(id, index) {
      if (!this.canGetGiftCode) return;
      this.canGetGiftCode = false;
      if (this.getLoginState) {
        const getGiftAddress = '/gift/code/receive';
        postInfo(getGiftAddress, {
          token: this.getToken,
          gid: id,
        }).then((res) => {
          this.canGetGiftCode = true;
          if (res.status_code === 200) {
            this.giftList[index].have = 1;
            this.showMask = true;
            this.showMoreTip = true;
            this.maskInfo.content = '您的验证码为:';
            this.maskInfo.extendtips = '领取成功';
            this.maskInfo.btn[0] = {
              btnTitle: '复制',
              type: 'copy',
              theme: 'light',
            };
            this.maskInfo.btn.splice(1, 1);
            this.dhcode = res.code;
          } else {
            this.canGetGiftCode = true;
            this.maskLoginInfo(res.message);
          }
        });
      } else {
        this.canGetGiftCode = true;
        this.maskLoginInfo('用户未登录');
      }
    },
    maskLoginInfo(message) {
      this.showMask = true;
      this.showMoreTip = false;
      this.maskInfo.extendtips = '温馨提示';
      this.maskInfo.content = message;
      this.maskInfo.btn[0] = {
        btnTitle: '知道了',
        type: 'hide',
        theme: 'dark',
      };
      this.maskInfo.btn[1] = {
        btnTitle: '去登录',
        type: 'login',
      };
      this.dhcode = '';
    },
  },
  watch: {
    back() {
      this._getCommonInfo();
    },
    done() {
      this._getCommonInfo();
    },
    $route(to, from) {
      if (from.path.includes('down')) {
        this.taskCount = 0;
      }
    },
  },
  computed: {
    ...mapGetters(['getToken', 'getLoginState', 'statusbar', 'back', 'done']),
  },
  components: {
    MHeader,
    Scroll,
    Loading,
    MaskCommon,
    ArrowBack,
    GamedetailItem,
    ServiceItem,
    GiftPackage,
    StrategyItem,
    CommentItem,
    LoadingMore,
    NoticeItem,
  },
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~common/stylus/variable';
@import '~common/stylus/mixin';

slider();

.game-detail {
  position: fixed;
  top: 0;
  bottom: 0;
  width: 100%;
  background: $color-background;
  background: #f2f2f2;

  .g-d-box {
    position: absolute;
    top: 68px;
    bottom: 60px;
    width: 100%;

    .g-d-wrapper {
      height: 100%;
      overflow: hidden;

      .ticket-box {
        height: 130px;
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 15px;
        background: #ffffff;
        box-sizing: border-box;
        border-top: 5px solid #f5f5f5;
        border-bottom: 5px solid #f5f5f5;

        .t-b-item {
          width: 160px;
          height: 88px;
          box-sizing: border-box;
          padding: 14px 0;
          border-radius: 5px;
          display: flex;
          align-items: center;
          flex-direction: column;
          justify-content: space-between;
          font-size: 16px;
          color: #ffffff;

          &.pink {
            background: #fe5ba8;
          }

          &.blue {
            background: #1faed6;
          }

          .icon {
            display: inline-block;

            &.gift {
              width: 37px;
              height: 40px;
              background: url('./gift.png') no-repeat;
              background-size: cover;
            }

            &.voucher {
              width: 40px;
              height: 33px;
              background: url('./voucher.png') no-repeat;
              background-size: cover;
            }
          }
        }
      }

      .g-d-intro-box {
        padding: 15px;
        background: #ffffff;

        h3 {
          font-size: $font-size-medium-x;
          color: #222222;
          font-weight: bold;
          padding-bottom: 10px;
          display: flex;
          align-items: center;

          .bell {
            display: inline-block;
            width: 14px;
            height: 17px;
            margin-right: 8px;
            background: url('./bell.png') no-repeat;
            background-size: cover;
          }
        }

        p {
          font-size: $font-size-small;
          line-height: 18px;
          text-indent: 24px;
          padding-bottom: 15px;
        }

        .slider-box {
          display: flex;

          img {
            width: 100%;
            display: block;
          }
        }

        .swiper-slide {
          background: red;

          img {
            width: 100%;
            display: 100%;
          }
        }

        .slider-warpper {
          height: 225px;
          min-width: 320px;
          position: relative;
          overflow: hidden;

          .slider-box {
            box-sizing: border-box;
            display: flex;
            height: 100%;
            max-width: 800px;

            img {
              height: 100%;
              width: 150px;
              margin-right: 10px;
              border-radius: 5px;
            }
          }
        }
      }

      .tab-head {
        margin-top: 8px;
        width: 100%;
        height: 60px;
        padding-top: 20px;
        background: #ffffff;
        display: flex;
        border-bottom: 1px solid #f1f1f1;
        box-sizing: border-box;

        .tab-item {
          flex: 1;
          position: relative;
          text-align: center;
          line-height: 40px;
          font-size: 18px;
          color: #333333;
          fong-weight: bold;
          transition: all 0.4s ease 0s;

          .dot {
            position: absolute;
            display: inline-block;
            top: 0;
            right: 8px;
            padding: 0 2px;
            line-height: 16px;
            border-radius: 8px;
            font-size: 12px;
            color: #ffffff;
            background: red;
          }

          &.active {
            color: #1faed6;

            &:after {
              position: absolute;
              content: '';
              width: 50%;
              height: 2px;
              bottom: 0;
              left: 25%;
              background: #1faed6;
            }
          }

          &:before {
            position: absolute;
            content: '';
            width: 1px;
            height: 80%;
            right: 0;
            top: 10%;
            background: #f1f1f1;
          }

          &:last-child {
            &:before {
              background: transparent;
            }
          }
        }
      }

      .tab-content {
        background: #ffffff;

        .no-more {
          text-align: center;
          margin-top: 15px;
          font-size: 16px;
          color: #777777;
          background: #f1f1f1;
        }

        .comment {
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
            min-height: 100px;
            background: #ffffff;

            .userinfo {
              display: flex;
              align-items: center;
              height: 50px;

              .avatar {
                width: 30px;
                height: 30px;
                border-radius: 50%;
                overflow: hidden;

                img {
                  width: 100%;
                }
              }

              .nameinfo {
                margin-left: 6px;
                font-size: 13px;
                font-weight: bold;
                color: #222222;

                .name {
                  font-weight: bold;
                }

                .star-wrapper {
                  star();
                }
              }
            }

            .c-content {
              box-sizing: border-box;
              padding-left: 42px;
              line-height: 18px;
              font-size: 13px;
              color: #222222;
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

            .sub-comment {
              padding: 10px;
              margin-left: 42px;
              box-sizing: border-box;
              background: #f5f5f5;
              font-size: 13px;
              line-height: 18px;
              color: #222222;

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
        }

        .service-info {
          width: 100%;
          box-sizing: border-box;
        }
      }
    }

    .g-d-comment {
      position: fixed;
      display: flex;
      flex-direction: row;
      flex-wrap: nowrap;
      align-items: center;
      width: 100%;
      box-sizing: border-box;
      justify-content: space-between;
      bottom: 0;
      height: 50px;
      padding: 0 15px;
      background: #e6e6e6;

      .desc {
        font-size: $font-size-small;
        color: #333333;
        width: 16%;

        .icon {
          display: block;
          width: 22px;
          height: 22px;
          margin: 0 auto;
          position: relative;

          .count {
            display: block;
            position: absolute;
            right: -2px;
            width: 4px;
            height: 4px;
            border-radius: 50%;
            background: red;
          }

          &.downmanger {
            bg-image('guanli');
            background-size: 22px 22px;
            background-repeat: no-repeat;
          }

          &.comment {
            bg-image('pinglun');
            background-size: 22px 22px;
            background-repeat: no-repeat;
          }
        }

        p {
          margin-top: 4px;
          text-align: center;
        }
      }

      .downlgame {
        display: block;
        height: 40px;
        width: 80%;
        border-radius: 20px;
        background: #1faed6;
        line-height: 40px;
        text-align: center;
        color: #ffffff;
      }
    }
  }

  .loading-firstin {
    loading();
  }

  .preview {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(0, 0, 0, 0.9);
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 2s linear;
    opacity: 0;

    img {
      display: block;
      width: 100%;
    }
  }
}
</style>
