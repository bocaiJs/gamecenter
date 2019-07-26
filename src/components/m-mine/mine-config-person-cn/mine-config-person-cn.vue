<template>
  <transition name="slider">
    <div class="change-nick">
      <m-header>
        <template slot="header">
          <back-icon></back-icon>
          <p style="padding-right:46px">{{titleText}}</p>
          <div
            class="right-button"
            @click="doChange"
          >
            确定
          </div>
        </template>
      </m-header>
      <div class="infobox">
        <input
          type="text"
          placeholder="请输入新昵称"
          ref="nick"
        >
      </div>
      <p class="rule">*仅允许使用汉字、字母和下划线</p>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
import MHeader from '@/components/m-header/m-header';
import { putInfo } from '@/base/api/indexpage/getindexinfo';
import { mapMutations, mapGetters } from 'vuex';
import BackIcon from '@/base/icon_widget/arrow_back';

export default {
  data() {
    return {
      titleText: '修改昵称',
      isconfirm: true,
    };
  },
  methods: {
    doChange() {
      console.log('确定改了');
      if (this.$refs.nick.value.length > 10) {
        plus.nativeUI.toast('昵称允许最大长度为10');
        return;
      }
      const address = '/user/nickname';
      putInfo(address, {
        token: this.getToken,
        nickname: this.$refs.nick.value,
      }).then((res) => {
        if (res.status_code === 200) {
          this.setnickname(this.$refs.nick.value);
          this.$router.back(-1);
        }
      });
    },
    ...mapMutations([
      'setnickname',
    ]),
  },
  computed: {
    ...mapGetters(['getToken']),
  },
  components: {
    MHeader,
    BackIcon,
  },
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~common/stylus/variable';
@import '~common/stylus/mixin';

slider();

.change-nick {
  position: fixed;
  width: 100%;
  top: 0;
  bottom: 0;
  background: #ffffff;

  .infobox {
    height: 56px;
    width: 100%;
    position: relative;
    background: #f6f6f6;

    input {
      outline: none;
      width: 100%;
      height: 100%;
      color: #777777;
      text-indent: 20px;
      font-size: $font-size-medium-x;
      font-family: 'PingFang SC', 'STHeitiSC-Light', 'Helvetica-Light', arial, sans-serif, 'Droid Sans Fallback';
      background: #f6f6f6;

      &::placeholder {
        color: #cccccc;
      }
    }
  }

  .rule {
    margin-top: 10px;
    color: #777777;
    font-size: $font-size-small;
    padding-left: 15px;
  }
}
</style>
