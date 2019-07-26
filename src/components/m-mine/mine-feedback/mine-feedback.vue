<template>
  <transition name="slider">
    <div class="feedback">
      <m-header>
        <template slot="header">
          <back-icon></back-icon>
          <p style="padding-right:46px;">{{titleText}}</p>
        </template>
      </m-header>
      <div
        class="feedbackbox"
        ref="feedbackbox"
      >
        <textarea
          name="feed"
          id=""
          cols="30"
          rows="10"
          placeholder="请填写您的意见与建议，我们将会尽快回复您的问题并进行解决"
          ref="feedcontent"
        ></textarea>
        <button
          class="submitfeed"
          @click="feedBack"
        >提交反馈</button>
      </div>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
import MHeader from '@/components/m-header/m-header';
import Scroll from '@/base/scroll/scroll';
import Loading from '@/base/loading/loading';
import { postInfo } from '@/base/api/indexpage/getindexinfo';
import { mapGetters } from 'vuex';
import BackIcon from '@/base/icon_widget/arrow_back';

export default {
  data() {
    return {
      titleText: '意见反馈',
    };
  },
  created() {
  },
  mounted() {
    this.$refs.feedbackbox.style.top = (44 + parseInt(this.statusbar)) + 'px';
  },
  methods: {
    showItem(e) {
      console.log(e.target.className);
      let items = document.getElementsByClassName('item');
      for (let i = 0; i < items.length; i++) {
        items[i].className = 'item';
        if (i === items.length - 1) {
          e.target.className = 'item active';
        }
      }
    },
    feedBack() {
      console.log(this.$refs.feedcontent.value);
      const feedaddress = '/user/feedback';
      postInfo(feedaddress, {
        token: this.getToken,
        content: this.$refs.feedcontent.value,
      }).then((res) => {
        if (res.status_code === 200) {
          plus.nativeUI.toast(res.message, {
            duration: 'long',
          });
        } else {
          plus.nativeUI.toast(res.message);
        }
      });
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

slider();

.feedback {
  position: fixed;
  width: 100%;
  top: 0;
  bottom: 0;
  background: #f2f2f2;

  .feedbackbox {
    padding: 15px;

    textarea {
      width: 100%;
      border: none;
      resize: none;
      padding: 10px;
      box-sizing: border-box;
      color: #333333;
      font-size: 13px;
      outline: none;
      font-family: 'PingFang SC', 'STHeitiSC-Light', 'Helvetica-Light', arial, sans-serif, 'Droid Sans Fallback';

      &::placeholder {
        color: #999999;
      }
    }

    .submitfeed {
      height: 40px;
      width: 100%;
      background: #1faed6;
      outline: none;
      border: none;
      margin-top: 15px;
      border-radius: 5px;
      font-size: 16px;
      color: #ffffff;
      font-family: 'PingFang SC', 'STHeitiSC-Light', 'Helvetica-Light', arial, sans-serif, 'Droid Sans Fallback';
    }
  }
}
</style>
