<template>
  <transition name="slider">
    <div class="service">
      <m-header>
        <template slot="header">
          <back-icon></back-icon>
          <p>{{titleText}}</p>
          <feed-back @feedback='goFeedBack'></feed-back>
        </template>
      </m-header>
      <div
        class="servicebox"
        ref="servicebox"
      >
        <div class="module">
          <h3>常规问题</h3>
          <div
            class="item"
            :class="{'active':showIndex ==1 &&isItemOpen}"
            @click="showItem(1)"
          >
            <span class="arrow"></span> 如何解绑手机？
            <p>
              进入【我的-设置-个人资料-手机号】进行解绑
            </p>
          </div>
        </div>
        <div class="module">
          <h3>积分问题</h3>
          <div
            class="item"
            :class="{'active':showIndex ==2 &&isItemOpen}"
            @click="showItem(2)"
          >
            <span class="arrow"></span>礼包兑换码找不到了怎么办？
            <p>
              进入【我的-我的礼包】进行查看。
            </p>
          </div>
        </div>
        <div class="module">
          <h3>充值问题</h3>
          <div
            class="item"
            :class="{'active':showIndex ==3 &&isItemOpen}"
            @click="showItem(3)"
            style=" border-bottom: 1px solid #eeeeee; padding-bottom:10px;"
          >
            <span class="arrow"></span>充值没有到账？
            <p>
              1.充值成功：可能出现延迟情况，请您先耐心等待一下，若等几分钟后还未到账，尽快联系客服处理。<br> 2.充值失败：充值失败是不会扣钱的，请重新使用支付宝或微信进行充值即可
            </p>
          </div>
          <div
            class="item"
            :class="{'active':showIndex ==4 &&isItemOpen}"
            @click="showItem(4)"
            style=" padding-top:10px;"
          >
            <span
              class="arrow"
              style="top:22px"
            ></span> 账号被盗怎么办？
            <p>
              联系客服，提供账号资料
            </p>
          </div>
        </div>
        <div class="module">
          <h3>账号问题</h3>
          <div
            class="item"
            :class="{'active':showIndex ==5 &&isItemOpen}"
            @click="showItem(5)"
          >
            <span class="arrow"></span>如何更改密码？
            <p>
              进入【我的-账号安全】进行修改。
            </p>
          </div>
        </div>
        <div class="contact">
          <div
            class="item"
            @click="call"
          >
            <img
              src="./1.png"
              alt=""
            >
            <p>拨打客服电话</p>
          </div>
          <a
            class="item"
            href="mqqwpa://im/chat?chat_type=wpa&uin=358226609&version=1&src_type=web&web_src=oicqzone.com"
          >
            <img
              src="./2.png"
              alt=""
            >
            <p>联系客服QQ</p>
          </a>
          <div class="item">
            <img
              src="./3.png"
              alt=""
            >
            <p>进入官方Q群</p>
          </div>
        </div>
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
import BackIcon from '@/base/icon_widget/arrow_back';
import FeedBack from '@/base/icon_widget/feedback';
// import { addClass, hasClass } from '@/common/js/dom';

export default {
  data() {
    return {
      titleText: '客服中心',
      showIndex: 0,
      isItemOpen: false,
    };
  },
  created() {
  },
  mounted() {
    this.$refs.servicebox.style.top = (44 + parseInt(this.statusbar)) + 'px';
  },
  methods: {
    goFeedBack() {
      this.$router.push({
        path: '/mine/service/feedback',
      });
    },
    call() {
      plus.device.dial('13500090151', true);
    },
    showItem(index) {
      if (index === this.showIndex) {
        this.isItemOpen = !this.isItemOpen;
      } else {
        this.showIndex = index;
        this.isItemOpen = true;
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
    FeedBack,
  },
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~common/stylus/variable';
@import '~common/stylus/mixin';

slider();

.service {
  position: fixed;
  width: 100%;
  top: 0;
  bottom: 0;
  background: #ffffff;

  .servicebox {
    sub-position();
    padding: 20px 15px 0 15px;
    box-sizing: border-box;
    overflow: scroll;
    border-top: 8px solid #eeeeee;
    -webkit-overflow-scrolling: touch;

    &::-webkit-scrollbar {
      display: none;
    }

    &::-webkit-scrollbar {
      width: 0px;
    }

    .module {
      margin-top: 20px;

      h3 {
        font-size: 16px;
        font-weight: bold;
        color: #222222;
        margin-bottom: 20px;
      }

      .item {
        font-size: 14px;
        color: #222222;
        min-height: 30px;
        line-height: 30px;
        text-indent: 20px;
        position: relative;

        .arrow {
          display: inline-block;
          width: 8px;
          height: 5px;
          background: url('./jiantou.png') no-repeat;
          background-size: 8px 5px;
          position: absolute;
          left: 6px;
          top: 12px;
          transform: rotate(-90deg);
          transform-origin: center;
        }

        p {
          padding-bottom: 4px;
          padding-top: 10px;
          padding-left: 20px;
          line-height: 18px;
          display: none;
          color: #555555;
          text-indent: 0px;
          text-align: left;
          font-size: 12px;
        }

        &.active {
          p {
            display: block;
          }

          .arrow {
            transform: rotate(0deg);
            transform-origin: center;
            color: blue;
            background: url('./jiantoulanse.png') no-repeat;
            background-size: 8px 5px;
          }
        }
      }
    }

    .contact {
      margin-top: 40px;
      width: 100%;
      padding: 0 40px;
      padding-bottom: 20px;
      box-sizing: border-box;
      display: flex;
      justify-content: space-between;

      .item {
        font-size: 12px;
        color: #fe5ba8;
        display: flex;
        flex-direction: column;
        align-items: center;

        img {
          height: 48px;
        }

        p {
          margin-top: 10px;
        }
      }
    }
  }
}
</style>
