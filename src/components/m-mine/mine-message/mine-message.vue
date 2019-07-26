<template>
  <transition name="slider">
    <div class="message">
      <m-header
        :canreturn=true
        :titleText="titleText"
        :empty='isempty'
        @confirm="doClear"
      ></m-header>
      <div
        class="noliststip"
        ref="tipbg"
      >
        <scroll
          class="messagewrapper"
          :pullUpLoad=pullUpLoad
          :data=data
          @pullingUp='getMessage'
        >
          <div>
            <div
              class="message-item"
              v-for="(message,index) in messageList"
              :key=index
              @click="goMessageDetail(index)"
              v-show="messageList.length"
            >
              <div class="message-item-info">{{message.message}}</div>
              <span
                class="delete"
                @click.stop.prevent="delMessage(index,message.id)"
                v-show="message.is_read"
              ></span>
              <span class="date">{{message.created_at}}</span>
              <span
                class="dot"
                v-show="!message.is_read"
              ></span>
            </div>
            <div>
              <loading
                :title="moremessageLoadingText"
                v-show="moreMessage"
              ></loading>
            </div>
          </div>
        </scroll>
        <div v-show="!messageList.length">
          <div class="noliststip-bg"></div>
          <p>你现在没有消息，只有我哦~~</p>
        </div>
      </div>
      <div
        class="loading-container"
        v-show="!isloading"
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
import { getCommonInfoHasData, postInfo } from '@/base/api/indexpage/getindexinfo';
import { mapMutations, mapGetters } from 'vuex';

export default {
  data() {
    return {
      moremessageLoadingText: '',
      moreMessage: false,
      titleText: '我的消息',
      isempty: true,
      pullUpLoad: true,
      data: 0, // 通知scroll组件 更新上拉状态
      page: 1,
      totalPage: 1,
      isloading: false,
      messageList: [],

    };
  },
  created() {
    this._getMessage();
  },
  mounted() {
    this.$refs.tipbg.style.top = (44 + parseInt(this.statusbar)) + 'px';
  },
  methods: {
    doClear() {
      console.log('清空消息');
      const address = '/user/deleteAllNotices';
      postInfo(address, {
        token: this.getToken,
      }).then((res) => {
        let noRead = [];
        if (res.status_code === 200) {
          for (let i = 0; i < this.messageList.length; i++) {
            if (!this.messageList[i].is_read) {
              noRead.push(i);
            }
          }
          this.messageList = noRead;
        }
      });
    },
    getMessage() {
      if (this.page <= this.totalPage) {
        this.moreMessage = true;
        this._getMessage();
      }
    },
    delMessage(index, id) {
      console.log(index);
      const delMadd = '/user/deleteNotices';
      postInfo(delMadd, {
        token: this.getToken,
        msg_id: id,
      }).then((res) => {
        if (res.status_code === 200) {
          this.messageList.splice(index, 1);
        } else {
          plus.nativeUI.toast(res.message);
        }
      });

      //  给后台发送数据
    },
    goMessageDetail(index) {
      console.log(this.messageList[index]);
      this.messageList[index].is_read = true;
      this.$router.push({
        path: `/mine/message/${this.messageList[index].id}`,
        query: {
          created_at: this.messageList[index].created_at,
          message: this.messageList[index].message,
        },
      });
    },
    _getMessage() {
      const add = '/user/notice/list';
      getCommonInfoHasData(add, {
        token: this.getToken,
        page: this.page,
      }).then((res) => {
        if (res) {
          this.isloading = true;
          this.moreMessage = false;
          this.totalPage = Math.ceil(res.data.total / res.data.pageSize);
          this.page = res.data.currentPage + 1;
          console.log('=============');
          console.log(this.page);
          console.log(res.data.currentPage);
          this.messageList.push.apply(this.messageList, res.data.list);
          console.log(this.messageList);
          this.data++;
        } else {
          plus.nativeUI.toast(res.message);
        }
      });
    },
    ...mapMutations([
      'setnickname',
    ]),
  },
  computed: {
    ...mapGetters(['getToken', 'statusbar']),
  },
  components: {
    MHeader,
    Scroll,
    Loading,
  },
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~common/stylus/variable';
@import '~common/stylus/mixin';

slider();

.message {
  position: fixed;
  width: 100%;
  top: 0;
  bottom: 0;
  background: #f2f2f2;

  .noliststip {
    position: absolute;
    left: 0;
    top: 44px;
    width: 100%;
    height: 100%;
    background: #ffffff;

    p {
      text-align: center;
      font-size: 16px;
      color: #999999;
      margin-top: 12px;
    }

    .noliststip-bg {
      display: block;
      margin: 0 auto;
      width: 159px;
      height: 190px;
      margin-top: 150px;
      background: url('./wodexiaoxi@3x.png') no-repeat;
      background-size: 159px 190px;
    }
  }

  .messagewrapper {
    height: 100%;
    overflow: hidden;

    .message-item {
      box-sizing: border-box;
      width: 100%;
      min-height: 50px;
      padding: 10px 15px 30px 24px;
      background: #ffffff;
      position: relative;
      font-size: $font-size-small;
      color: #555555;
      margin-bottom: 6px;

      .message-item-info {
        width: 88%;
        line-height: 18px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .delete {
        display: block;
        position: absolute;
        right: 15px;
        top: 10px;
        width: 12px;
        height: 14px;
        bg-image('delete');
        background-size: 12px 14px;
      }

      .date {
        display: block;
        position: absolute;
        right: 15px;
        bottom: 10px;
      }

      .dot {
        position: absolute;
        left: 10px;
        top: 14px;
        display: block;
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background: radial-gradient(#ea7070, #f63737, #f3bbbb);
      }
    }
  }

  .loading-container {
    loading();
    z-index: 99999;
  }
}
</style>
