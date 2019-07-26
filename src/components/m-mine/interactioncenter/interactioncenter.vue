<template>
  <transition name="slider">
    <div class="interactioncenter">
      <m-header>
        <template slot="header">
          <back-icon></back-icon>
          <div class="tab-item">
            <div class="tab-box">
              <span
                class="title"
                :class="{active:showTag === 1}"
                @click="getSelect(1)"
              >消息</span>
              <span
                :class="{active:showTag === 2}"
                @click="getSelect(2)"
              ><span
                  class="notice-title"
                  :class="{dot:new_notice_msg}"
                >通知</span></span>
            </div>
          </div>
          <div class="right-button">
          </div>
        </template>
      </m-header>
      <div
        class="message-box"
        ref="msgbox"
      >
        <scroll
          style="height:100%;overflow:hidden"
          :data=updateScroll
          :pullUpLoad=pullUpLoad
          @pullingUp='getMoreNews'
          v-if="!isLoading"
        >
          <div>
            <div v-show="showTag === 1">
              <div class="newTitle">
                <span
                  :class="{active:showItem===1}"
                  @click="changeNewItem"
                >评论</span>
                <span
                  :class="[{active:showItem===0},{dot:new_up_msg}]"
                  @click="changeNewItem"
                >点赞</span>
              </div>
              <div v-show="showItem ===1">
                <slider-item
                  v-for="(item,index) in commentList"
                  v-if="commentList.length"
                  :key="item.id+'com'"
                  :info=item
                  :index=index
                  @game="goGameDetail"
                  @delete="deleteItem"
                ></slider-item>
                <loading-more v-if="commentCurrentPage < commentTotalPage"></loading-more>
                <err-tip
                  style="margin-top:30%;"
                  v-if="!commentList.length"
                  :tipText=tipText
                  :type=2
                ></err-tip>
              </div>
              <div v-show="showItem ===0">
                <slider-item
                  v-for="(item,index) in priseList"
                  v-if="priseList.length"
                  :key="item.id+'pri'"
                  :info=item
                  :newtype='0'
                  :index=index
                  @game="goGameDetail"
                  @delete="deleteItem"
                ></slider-item>
                <loading-more v-if=" priseCurrentPage < priseTotalPage"></loading-more>
                <err-tip
                  style="margin-top:30%;"
                  v-if="!priseList.length"
                  :tipText=tipText
                  :type=2
                ></err-tip>
              </div>
            </div>
            <div v-show="showTag === 2">
              <div class="notice">
                <div
                  v-if="noticeList.length"
                  class="item"
                  v-for="(item,index) in noticeList"
                  :key="item.id"
                  @touchstart="gotouchstart(index)"
                  @touchmove="gotouchmove"
                  @touchend="gotouchend"
                >
                  <h5>{{item.title}}</h5>
                  <p>{{item.description}}</p>
                  <div class="date">{{item.created_at}}</div>
                  <div
                    class="delete"
                    v-show="deleteIndex === index"
                    @click.stop.prevent="deleteNotice(item.id,index)"
                  >
                    删除
                  </div>
                </div>
                <err-tip
                  style="margin-top:30%;"
                  v-if="!noticeList.length"
                  :tipText=tipText
                  :type=2
                ></err-tip>
              </div>
            </div>
          </div>
        </scroll>
        <div
          class="loading-container"
          v-else
        >
          <loading></loading>
        </div>
      </div>
    </div>
  </transition>

</template>
<script type="text/ecmascript-6">
import MHeader from 'components/m-header/m-header';
import Scroll from '@/base/scroll/scroll';
import BackIcon from '@/base/icon_widget/arrow_back';
import SliderItem from '@/base/sliderItem/sliderItem';
import Loading from '@/base/loading/loading';
import LoadingMore from '@/base/loadingmore/loading';
import ErrTip from '@/base/errortipwidget/errortipwidget';
import { mapGetters, mapMutations } from 'vuex';
import { getCommonInfoHasData } from '@/base/api/indexpage/getindexinfo';

export default {
  components: {
    MHeader,
    Scroll,
    Loading,
    BackIcon,
    SliderItem,
    LoadingMore,
    ErrTip,
  },
  data() {
    return {
      tipText: '暂无更多消息',
      pullUpLoad: true,
      isLoading: true,
      showItem: 1,
      showTag: 1,
      updateScroll: 0,
      commentCurrentPage: 0,
      commentList: [],
      commentTotalPage: 1,
      priseCurrentPage: 0,
      priseList: [],
      priseTotalPage: 0,
      noticeList: [],
      timeOutEvent: null,
      deleteIndex: -1,
      startTime: 0,
      endTime: 0,
      new_up_msg: 0,
      new_notice_msg: 0,
    };
  },
  mounted() {
    this.getNewsList(1);
    this.$refs.msgbox.style.top = (44 + parseInt(this.statusbar)) + 'px';
  },
  methods: {
    deleteNotice(id, index) {
      console.log(id);
      const url = '/article/delNoticeMsg';
      this.noticeList.splice(index, 1);
      this.deleteIndex = -1;
      getCommonInfoHasData(url, {
        notice_id: id,
        token: this.getToken,
      }).then((res) => {
        plus.nativeUI.toast(res.message);
      });
    },
    getSelect(index) {
      this.showTag = index;
      if (index === 2 && this.noticeList.length === 0) {
        this.getNoticeList();
        this.new_notice_msg = 0;
        this.changeMsgInfo();
      }
      this.updateScroll++;
    },
    changeMsgInfo() {
      if (this.new_up_msg === 0 && this.new_notice_msg === 0) {
        console.log(this.msgInfo);
        this.msgInfo.new_msg = 0;
        console.log(this.msgInfo.new_msg);
        this.setMsgInfo(this.msgInfo);
      }
    },
    changeNewItem() {
      this.showItem = this.showItem === 0 ? 1 : 0;
      if (this.showItem === 0 && this.priseList.length === 0) {
        this.isLoading = true;
        this.new_up_msg = 0;
        this.changeMsgInfo();
        this.getNewsList(0);
      }
      this.updateScroll++;
    },
    deleteItem(id, index) {
      console.log('这是删除');
      console.log(id, index);
      this.deleteMsg(id, index);
    },
    goGameDetail(id, gameId, index) {
      console.log('这是点击');
      this.$router.push({
        path: `/gamedetail/${gameId}`,
      });
      this.changeNewStatu(id, index);
    },
    getMoreNews() {
      console.log('加载更多');
      //   showItem=1加载评论 showItem=0加载点赞
      if (this.showItem) {
        if (this.commentCurrentPage < this.commentTotalPage) {
          this.getNewsList(this.showItem);
        }
      } else {
        if (this.priseCurrentPage < this.priseTotalPage) {
          this.getNewsList(this.showItem);
        }
      }
      return false;
    },
    deleteMsg(id, index) {
      const url = '/user/delMsg';
      getCommonInfoHasData(url, {
        id,
        token: this.getToken,
      }).then((res) => {
        console.log(res);
        if (this.showItem) {
          this.commentList.splice(index, 1);
        } else {
          this.priseList.splice(index, 1);
        }
        this.getMoreNews();
      });
    },
    // 点击后修改消息状态
    changeNewStatu(id, index) {
      //  type_id：1 评论 0：点赞
      const url = '/user/gameDetail';
      getCommonInfoHasData(url, { id, token: this.getToken }).then((res) => {
        console.log(res);
        if (this.showItem) {
          this.commentList[index].new_status = 0;
        } else {
          this.priseList[index].new_status = 0;
        }
      });
    },
    getNewsList(type) {
      //  type_id：1 评论 0：点赞
      const url = '/user/comment_msg';
      let page;
      if (type) {
        page = this.commentCurrentPage + 1;
      } else {
        page = this.priseCurrentPage + 1;
      }
      getCommonInfoHasData(url, {
        type_id: type,
        token: this.getToken,
        page,
      }).then((res) => {
        console.log(res);
        if (type) {
          this.commentCurrentPage = res.current_page;
          this.commentTotalPage = res.last_page;
          this.commentList.push.apply(this.commentList, res.list);
          this.new_notice_msg = res.new_notice_msg;
          this.new_up_msg = res.new_up_msg;
        } else {
          this.priseCurrentPage = res.current_page;
          this.priseTotalPage = res.last_page;
          this.priseList.push.apply(this.priseList, res.list);
        }
        this.$nextTick(() => {
          this.isLoading = false;
        });
      });
    },
    getNoticeList() {
      this.isLoading = true;
      const url = '/article/noticeMsg';
      getCommonInfoHasData(url, {
        token: this.getToken,
        page: 1,
      }).then((res) => {
        console.log('新闻列表');
        this.noticeList = res.list;
        console.log(this.noticeList);
        this.$nextTick(() => {
          this.isLoading = false;
        });
      });
    },
    gotouchstart(index) {
      clearTimeout(this.timeOutEvent);// 清除定时器
      this.timeOutEvent = 0;
      this.startTime = (new Date()).getTime();
      this.timeOutEvent = setTimeout(() => {
        this.deleteIndex = index;
      }, 2000);// 这里设置定时
    },
    // 手释放如果在500毫秒内就释放则取消长按事件此时可以执行onclick应该执行的事件
    gotouchend(e) {
      clearTimeout(this.timeOutEvent);
      this.endTime = (new Date()).getTime();
      let distance = this.endTime - this.startTime;
      console.log(distance);
      // 没有移动说明是长按或者点击
      if (this.timeOutEvent !== 0) {
        // 大于2000长按事件
        if (distance > 2000) {
          console.log('长按');
        } else {
          if (e.target.className === 'delete') {
            console.log('执行delete');
          } else {
            this.deleteIndex = -1;
            console.log('执行click');
          }
        }
      }
    },
    // 如果手指有移动则取消所有事件此时说明用户只是要移动而不是长按
    gotouchmove() {
      clearTimeout(this.timeOutEvent);// 清除定时器
      this.timeOutEvent = 0;
    },
    ...mapMutations([
      'setMsgInfo',
    ]),
  },
  computed: {
    ...mapGetters(['statusbar', 'getToken', 'msgInfo']),
  },
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~common/stylus/variable';
@import '~common/stylus/mixin';

slider();

.interactioncenter {
  position: fixed;
  width: 100%;
  top: 0;
  bottom: 0;
  background: #ffffff;
  z-index: 1;

  .notice-title {
    positon: relative;

    &.dot {
      position: relative;

      &:before {
        position: absolute;
        content: '';
        width: 8px;
        height: 8px;
        border-radius: 50%;
        right: 0px;
        top: 4px;
        background: red;
      }
    }
  }

  .message-box {
    position: absolute;
    top: 68px;
    bottom: 0;
    width: 100%;

    .newTitle {
      height: 50px;
      box-siziong: border-box;
      border-bottom: 1px solid #f5f5f5;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 100px;

      span {
        display: flex;
        height: 100%;
        align-items: center;
        justify-content: center;
        font-size: 18px;
        color: #333333;

        &.dot {
          position: relative;

          &:before {
            position: absolute;
            content: '';
            width: 8px;
            height: 8px;
            border-radius: 50%;
            right: -10px;
            top: 12px;
            background: red;
          }
        }

        &.active {
          position: relative;
          font-weight: bold;
          color: #1faed6;

          &:after {
            position: absolute;
            content: '';
            width: 20px;
            height: 2px;
            left: 50%;
            transform: translate3d(-50%, 0, 0);
            bottom: 0;
            background: #1faed6;
            border-radius: 1px;
          }
        }
      }
    }

    .notice {
      width: 100%;
      padding: 1px 15px;
      box-sizing: border-box;

      .item {
        width: 100%;
        margin-top: 15px;
        box-sizing: border-box;
        border-radius: 5px;
        padding: 10px 15px;
        background: #f9f9f9;
        position: relative;

        &:first-child {
          margin-top: 30px;
        }

        .delete {
          position: absolute;
          font-size: 14px;
          padding: 6px 12px;
          background: #fe5ba8;
          left: 50%;
          top: -10px;
          transform: translate3D(-50%, 0, 0);
          color: #ffffff;
          border-radius: 5px;
          z-index: 100;
          transition: all 300ms;

          &:after {
            position: absolute;
            content: '';
            width: 0;
            height: 0;
            border-left: 5px solid transparent;
            border-right: 5px solid transparent;
            border-top: 10px solid #fe5ba8;
            left: 50%;
            bottom: -8px;
            transform: translate3D(-50%, 0, 0);
          }
        }

        h5 {
          font-size: 16px;
          color: #1faed6;
          font-weight: bold;
          padding-bottom: 5px;
          text-over();
        }

        p {
          font-family: 14px;
          line-height: 21px;
          color: #333333;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .date {
          margin-top: 10px;
          color: #777777;
          font-size: 12px;
        }
      }
    }

    .loading-container {
      loading();
    }
  }
}
</style>
