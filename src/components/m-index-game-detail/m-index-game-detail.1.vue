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
            <!-- <div class="item">
                            <div class="icon">
                                <img :src="gameInfo.icon" alt="">
                            </div>
                            <div class="item-content">
                                <h3>{{gameInfo.name}}</h3>
                                <div class="star">
                                    <p class="score lightblue">
                                        <span v-for="(gameType,index) in gameInfo.tagNames" :key=index style="margin-right:3px;">{{gameType}}</span>
                                    </p>
                                    <p class="score">{{gameInfo.downloads}}人下载 | {{gameInfo.size}}</p>
                                </div>
                            </div>
                            <div class="like" @click="favorite" :class="{n:!gameInfo.followStatus,c:gameInfo.followStatus}"></div>
                            
                        </div> -->
            <div style="height:8px;width:100%;background:#f5f5f5"></div>
            <gamedetail-item></gamedetail-item>
            <div class="g-d-intro-box">
              <div class="intro">
                <h3>游戏介绍:</h3>
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
                      @click="previewIMG(gameimgdesc)"
                    >
                  </div>
                </div>
              </div>
            </div>
            <div
              class="servedetail"
              @click="showServer"
            >
              <div class="serverbtn">
                <img
                  src="./kfxq.png"
                  alt=""
                >
              </div>
            </div>
            <div class="rate">
              <h3>评价</h3>
              <div class="ratebox">
                <div class="gamerate">
                  <p class="ratedesc">游戏评分</p>
                  <p class="ratescore">
                    {{commentScore.avgScore}}
                  </p>
                </div>
                <div class="gamescore">
                  <div class="scoreitem">
                    5
                    <span><img
                        src="./star.png"
                        alt=""
                      ></span>
                    <div class="box">
                      <span :style="{ width: star.starFive+'%'}"></span>
                    </div>
                  </div>
                  <div class="scoreitem">
                    4
                    <span><img
                        src="./star.png"
                        alt=""
                      ></span>
                    <div class="box">
                      <span :style="{ width: star.starFour+'%'}"></span>
                    </div>
                  </div>
                  <div class="scoreitem">
                    3
                    <span><img
                        src="./star.png"
                        alt=""
                      ></span>
                    <div class="box">
                      <span :style="{ width: star.starThree+'%'}"></span>
                    </div>
                  </div>
                  <div class="scoreitem">
                    2
                    <span><img
                        src="./star.png"
                        alt=""
                      ></span>
                    <div class="box">
                      <span :style="{ width: star.starTwo+'%'}"></span>
                    </div>
                  </div>
                  <div class="scoreitem">
                    1
                    <span><img
                        src="./star.png"
                        alt=""
                      ></span>
                    <div class="box">
                      <span :style="{ width: star.starOne+'%'}"></span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="comment">
              <div class="total">
                游戏点评
                <span>
                  ({{comments.total}})
                </span>
              </div>
              <div
                class="c-item"
                v-for="(comment,index) in comments.list"
                :key=index
                :data-id='comment.id'
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
                    <div class="star-wrapper">
                      <span
                        class="star-icon"
                        :style="{width:comment.star*20+'%'}"
                      ></span>
                    </div>
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
                      @click="userup(comment.id,index)"
                      :class="{active:comment.userup}"
                    >{{comment.up}}</span>
                    <span
                      class="subcomment"
                      @click="goCommentDetail(comment.id)"
                    >{{comment.reply}}</span>
                  </div>
                </div>
                <div
                  class="firstsub"
                  v-if="comment.replyInfo"
                >
                  <span>{{comment.replyInfo.nickname}} :</span>
                  <span>{{comment.replyInfo.content}}</span>
                </div>
              </div>
              <div class="loading-container ">
                <loading
                  :title=commentLoadingText
                  v-show="showCommentLoading"
                ></loading>
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
              >{{taskCount}}</span>
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
import MaskCommon from '@/base/maskcommon/maskcommon';
import ArrowBack from '@/base/icon_widget/arrow_back';
import { getCommonInfo, getCommonInfoHasData, postInfo } from '@/base/api/indexpage/getindexinfo';
import { getFileName, checkApp, checkTaskIsExist } from 'common/js/deviceUtil';
import { storageAvatar, storageId, getLocalStorage } from 'common/js/storage';
import { mapGetters, mapMutations } from 'vuex';
import GamedetailItem from './game_detail_item/game_detail_item';

export default {
  data() {
    return {
      taskCount: 0,
      preview: false,
      previewSrc: '',
      commentLoadingText: null,
      showCommentLoading: false,
      showFirstInloading: true,
      commentScore: {},
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
      downtext: '下载',
    };
  },
  created() {
    this.id = this.$route.params.gameid;
    this.commentAddress = this.$route.query.commentAddress;
    console.log(this.commentAddress);
    // 在不同的回调函数里共享一些数据的时候，将共享数据挂载在这个对象上
    this._getCommonInfo();
    this.touch = {};
    this.star = {};
  },
  mounted() {
    console.log('发送请求');
    this.$refs.gamedetail.style.top = (44 + parseInt(this.statusbar)) + 'px';
  },
  methods: {
    //  图片预览
    previewIMG(imgUrl) {
      console.log(this.gameInfo.image);
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
        path: `${this.commentAddress}/${this.id}/comment/${commentId}`,
        params: {
          commentId,
        },
        query: {
          commentId,
        },
      });
    },
    userup(commentId, index) {
      console.log(commentId + '---' + index);
      if (this.comments.list[index].userup === 1) {
        return;
      }
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
    },
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
      }, 200);
      this.$refs.sliderBox.style.width = this.gameInfo.image.length * 160 + 'px';
    },
    goDownPage() {
      this.$router.push(`${this.commentAddress}/${this.id}/down`);
    },
    favorite() {
      if (this.getLoginState) {
        const address = `/game/follow/${this.id}?token=${this.getToken}`;
        getCommonInfo(address).then(() => {
          this.gameInfo.followStatus = !this.gameInfo.followStatus;
        });
      } else {
        this.showMask = true;
        this.maskInfo.content = '用户未登录';
        this.maskInfo.btn[0] = {
          btnTitle: '知道了',
          type: 'hide',
        };
        this.maskInfo.btn[1] = {
          btnTitle: '去登录',
          type: 'login',
        };
      }
    },
    //  跳转游戏评论页
    goPublishPage() {
      if (this.getLoginState) {
        this.$router.push({
          path: `${this.commentAddress}/${this.id}/publish`,
          query: {
            gameid: this.id,
          },
        });
      } else {
        this.showMask = true;
        this.maskInfo.content = '用户未登录';
        this.maskInfo.btn[0] = {
          btnTitle: '知道了',
          type: 'hide',
        };
        this.maskInfo.btn[1] = {
          btnTitle: '去登录',
          type: 'login',
        };
      }
    },
    //  获取游戏详情及评论信息;
    _getCommonInfo() {
      const address = `/game/info/${this.id}?token=${this.getToken}`;
      getCommonInfo(address).then((res) => {
        console.log(res);
        this.$nextTick(() => {
          this.commentScore = res.data.commentScore;
          this.comments = res.data.comments;
          this.gameInfo = res.data.gameInfo;
          this.star.starOne = this.commentScore.list[1].count === 0 ? 0 : Math.floor(this.commentScore.list[1].count / this.comments.total * 100);
          this.star.starTwo = this.commentScore.list[2].count === 0 ? 0 : Math.floor(this.commentScore.list[2].count / this.comments.total * 100);
          this.star.starThree = this.commentScore.list[3].count === 0 ? 0 : Math.floor(this.commentScore.list[3].count / this.comments.total * 100);
          this.star.starFour = this.commentScore.list[4].count === 0 ? 0 : Math.floor(this.commentScore.list[4].count / this.comments.total * 100);
          this.star.starFive = this.commentScore.list[5].count === 0 ? 0 : Math.floor(this.commentScore.list[5].count / this.comments.total * 100);
          this.data++;
          console.log('*******');
          let name = getFileName(this.gameInfo.android);
          this.filename = name;
          this._showDownText(this.filename, this.gameInfo.package_name);
          this.getDownloadTasks();
        });
        setTimeout(() => {
          this.showFirstInloading = false;
          this.initSlider();
        }, 200);
      });
    },
    getMoreComment() {
      const moreContentUrl = `/game/comments/list/${this.id}`;
      let commentData = {
        page: this.comments.currentPage + 1,
      };
      if (this.comments.currentPage * this.comments.pageSize < this.comments.total) {
        this.showCommentLoading = true;
        getCommonInfoHasData(moreContentUrl, commentData).then((res) => {
          console.log(res);
          this.comments.currentPage = res.data.currentPage;
          this.comments.list = this.comments.list.concat(res.data.list);

          /*  *************************************************************************************
           * 改变data值，通知scroll组件更新pullup状态，隐藏加载框
           * ***********************************************************************************  */
          this.data += 1;
          this.showCommentLoading = false;
        });
      } else {
        console.log('没有更多数据');
      }
    },
    hideMask() {
      this.showMask = false;
    },
    // 展示开服信息
    showServer() {
      console.log(this.commentAddress);
      this.$router.push({
        path: `${this.commentAddress}/${this.id}/newserver`,
        query: {
          id: this.id,
        },
      });
    },
    downGame() {
      if (this.getLoginState) {
        console.log('下载游戏');
        if (this.downtext === '下载') {
          this.addDownLoadTask(this.gameInfo.android, this.gameInfo.icon, this.gameInfo.package_name, this.gameInfo.id);
          this.taskCount += 1;
          this.setTasksCount(this.taskCount);
          console.log(this.gameInfo.package_name);
          this.downtext = '下载中...';
        } else if (this.downtext === '安装') {
          plus.runtime.install(`_downloads/${this.filename}`, {}, () => {
            if (checkApp(this.gameInfo.package_name)) {
              this.downtext = '打开';
            }
          }, () => {
            console.log('安装失败');
          });
        } else if (this.downtext === '打开') {
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
        } else if (this.downtext === '下载中···') {
          this.goDownPage();
        }
      } else {
        this.showMask = true;
        this.maskInfo.content = '用户未登录';
        this.maskInfo.btn[0] = {
          btnTitle: '知道了',
          type: 'hide',
        };
        this.maskInfo.btn[1] = {
          btnTitle: '去登录',
          type: 'login',
        };
      }
    },
    async _showDownText(fileN, packN) {
      if (!this.$refs.download) {
        return;
      }
      console.log('开始判断显示啥啦~');
      if (await checkApp(packN)) {
        console.log('是app');
        this.downtext = '打开';
        return;
      } else {
        checkTaskIsExist(fileN, () => {
          // 如果是文件 判断是否在下载完成列表里;
          console.log('是文件呢~');
          plus.downloader.enumerate((tasks) => {
            console.log(tasks);
            for (let i = 0; i < tasks.length; i++) {
              let task = tasks[i];
              if (`_downloads/${fileN}` === task.filename) {
                console.log('下载完了呢~');
                this.downtext = '安装';
                return;
              }
            }
          }, 4);
          plus.downloader.enumerate((tasks) => {
            console.log(tasks);
            for (let i = 0; i < tasks.length; i++) {
              let task = tasks[i];
              if (`_downloads/${fileN}` === task.filename) {
                this.downtext = '下载中···';
                if (task.state === 2 && (task.totalSize === task.downloadedSize)) {
                  this.downtext = '安装';
                }
              }
            }
          });
        }, () => {
          console.log('不是文件吗:~');
          this.downtext = '下载';
        });
      }
    },
    // 下载
    addDownLoadTask(url, icon, packgaeName, id) {
      console.log(`要下载的游戏ID${id}`);
      let _this = this;
      let address = url.split('/');
      let filename = address[address.length - 1];
      storageAvatar(icon, packgaeName, filename);
      console.log('储存头像成功');
      storageId(id, filename);
      console.log('储存ID成功');
      plus.io.resolveLocalFileSystemURL(
        `_downloads/${filename}`,
        (entry) => {
          if (entry.isFile) {
            plus.nativeUI.alert('任务已在列表中，请勿重复下载!', () => {
              console.log('User pressed!');
            }, '友情提示', '确定');
          }
        },
        (e) => {
          console.log(e);
          console.log('添加下载任务');
          let downTask = plus.downloader.createDownload(
            url,
            { method: 'GET' },
            //  下载完成执行的回调函数
            (d) => {
              console.log('完成回调');
              let gameObject = getLocalStorage('gameID');
              let idObj = gameObject !== '' ? JSON.parse(gameObject) : '';
              console.log('下载完成-------');
              console.log(d);
              console.log(idObj[d.filename]);
              console.log(idObj[d.filename].id);
              console.log(`游戏id${idObj[d.filename].id}`);
              getCommonInfoHasData(`/download/app/${idObj[d.filename].id}`, {
                token: this.getToken,
              }).then((res) => {
                console.log(res);
              });
              console.log('下载完成了 小伙子');
              _this.downtext = '安装';
              console.log(d.state);
              d.state = 4;
              console.log(d);
              console.log(d.state);
              console.log('******************');
              if (localStorage.getItem('autoInstall')) {
                plus.runtime.install(d.filename, {}, () => {
                  d.isinstall = true;
                  console.log('设置完成了 小伙子');
                  console.log(d.isinstall);
                }, () => {
                  d.isinstall = false;
                });
              }
            },
          );
          console.log(downTask);
          downTask.start();
        },
      );
    },
    getDownloadTasks() {
      plus.downloader.enumerate((tasks) => {
        this.taskCount = tasks.length;
        this.setTasksCount(tasks.length);
      });
    },
    ...mapMutations([
      'setTasksCount',
    ]),
  },
  watch: {
    back() {
      console.log('监听到back了，做操作吧小伙子');
      this._getCommonInfo();
    },
    done() {
      console.log('监听到none了，做操作吧小伙子');
      this._getCommonInfo();
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
    top: 44px;
    bottom: 60px;
    width: 100%;

    .g-d-wrapper {
      height: 100%;
      overflow: hidden;

      .g-d-intro-box {
        padding: 15px;
        background: #ffffff;

        h3 {
          font-size: $font-size-medium-x;
          color: #222222;
          font-weight: bold;
          padding-bottom: 10px;
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

      .servedetail {
        width: 100%;
        height: 64px;
        background: red;
        margin-bottom: 15px;
        background: url('./serverbg.png') no-repeat;
        display: flex;
        align-items: center;

        .serverbtn {
          height: 28px;
          width: 82px;
          margin: 0 auto;

          img {
            height: 100%;
          }
        }
      }

      .rate {
        margin-top: 15px;
        box-shadow: 0 3px 3px #cecece;
        background: #ffffff;
        width: 100%;
        height: 140px;

        h3 {
          font-size: $font-size-medium-x;
          color: #555555;
          text-align: center;
          border-bottom: 1px solid #cccccc;
          line-height: 29px;
        }

        .ratebox {
          height: 110px;
          display: flex;
          align-items: center;
          margin-left: 30px;

          .gamerate {
            width: 64px;
            height: 78px;
            text-align: center;

            .ratedesc {
              line-height: 28px;
              font-size: $font-size-small;
              color: #ffffff;
              background: #0ec486;
              border-top-left-radius: 6px;
              border-top-right-radius: 6px;
            }

            .ratescore {
              line-height: 48px;
              border: 1px solid #cccccc;
              border-top: none;
              border-bottom-left-radius: 6px;
              border-bottom-right-radius: 6px;
            }
          }

          .gamescore {
            height: 84px;
            width: 180px;
            margin-left: 30px;
            font-size: $font-size-small;
            display: flex;
            flex-direction: column;
            justify-content: space-between;

            .scoreitem {
              display: flex;
              align-items: center;

              span {
                display: block;
                padding-left: 4px;
                padding-right: 8px;

                img {
                  width: 12px;
                  height: 12px;
                }
              }

              .box {
                height: 10px;
                width: 160px;
                box-sizing: border-box;
                border-radius: 5px;
                border: 1px solid #cccccc;
                position: relative;
                overflow: hidden;

                span {
                  position: absolute;
                  left: 0;
                  height: 100%;
                  background: #0ec486;
                  border-radius: 5px;
                  padding: 0;
                }
              }
            }
          }
        }
      }

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

          .firstsub {
            padding: 10px 0;
            background: #f5fdfa;
            font-size: $font-size-small;
            line-height: 18px;
          }
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
        color: #ffc400;
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
            right: -8px;
            width: 14px;
            height: 14px;
            line-height: 14px;
            text-align: center;
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
        background: #58d2ec;
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
