<template>
  <div class="mine-config-person">
    <m-header
      :canreturn=true
      :titleText="titleText"
    ></m-header>
    <div class="config-box">
      <div class="config-item">
        <p>账号</p>
        <div class="right">
          <div class="info">{{username}}</div>
        </div>
      </div>
      <div
        class="config-item"
        @click="showAvatarWrapper"
      >
        <p>头像</p>
        <div class="right">
          <div class="avatar">
            <img
              :src="avatar"
              alt=""
            >
          </div>
          <div class="arrow"></div>
        </div>
      </div>
      <div
        class="config-item"
        @click="changeNick"
      >
        <p>昵称</p>
        <div class="right">
          <div class="info">{{nickname}}</div>
          <div class="arrow"></div>
        </div>
      </div>
      <div
        class="config-item"
        @click="changeMobile"
      >
        <p>手机号</p>
        <div class="right">
          <div
            class="info"
            v-show="mobile != ''"
          >{{mobile}}</div>
          <div
            class="info"
            v-show="mobile == ''"
          >去绑定</div>
          <div class="arrow"></div>
        </div>
      </div>
      <div
        class="config-item"
        @click="showSexPicker"
      >
        <p>性别</p>
        <div class="right">
          <div
            class="info"
            v-show="sex === 0"
          >女</div>
          <div
            class="info"
            v-show="sex === 1"
          >男</div>
          <div class="arrow"></div>
        </div>
      </div>
      <div
        class="config-item"
        @click="showAgePicker"
      >
        <p>年龄</p>
        <div class="right">
          <div class="info">{{age}}</div>
          <div class="arrow"></div>
        </div>
      </div>
    </div>
    <change-avatar
      class="avatar-wrapper"
      :class="{active:showAvatar === true}"
      @newAvatar='hideAvatar'
    ></change-avatar>
    <router-view></router-view>
  </div>
</template>

<script type="text/ecmascript-6">
import MHeader from '@/components/m-header/m-header';
import ChangeAvatar from '@/base/changeavatar/changeavatar';
import { putInfo } from '@/base/api/indexpage/getindexinfo';
import Picker from 'better-picker';
import BackIcon from '@/base/icon_widget/arrow_back';
import { mapMutations, mapGetters } from 'vuex';

export default {
  data() {
    return {
      titleText: '个人资料',
      showAvatar: false,
    };
  },
  methods: {
    changeNick() {
      this.$router.push({
        path: '/mine/config/person/nick',
        query: {
          mobile: this.mobile,
        },
      });
    },
    showAgePicker() {
      let ageAdress = '/user/age';
      let data = [];
      let userage = '';
      for (let i = 1; i <= 100; i++) {
        data.push({ text: i });
      }
      let picker = new Picker({
        data: [data],
        selectedIndex: [0],
        title: '请选择年龄',
      });
      picker.show();
      //  请求后端更改年龄
      picker.on('picker.select', (selectedVal, selectedIndex) => {
        userage = data[selectedIndex[0]].text;
        putInfo(ageAdress, {
          token: this.getToken,
          age: userage,
        }).then((res) => {
          //  更新VUEX状态
          if (res.status_code === 200) {
            this.setage(userage);
          }
        });
      });
    },
    showSexPicker() {
      let ageAdress = '/user/sex';
      let usersex = '';
      let data = [{
        text: '男',
        value: 1,
      }, {
        text: '女',
        value: 0,
      }];
      let picker = new Picker({
        data: [data],
        selectedIndex: [0],
        title: '请选择性别',
      });
      picker.show();
      picker.on('picker.select', (selectedVal, selectedIndex) => {
        usersex = data[selectedIndex[0]].value;
        console.log(usersex);
        putInfo(ageAdress, {
          token: this.getToken,
          sex: usersex,
        }).then((res) => {
          //  更新VUEX状态
          if (res.status_code === 200) {
            this.setsex(usersex);
          }
        });
      });
    },
    showAvatarWrapper() {
      this.showAvatar = true;
    },
    hideAvatar(avatar) {
      if (avatar) {
        this.setavatar(avatar);
      }
      this.showAvatar = false;
    },
    //  更改手机号码
    changeMobile() {
      this.$router.push({
        path: '/mine/config/person/bind',
        query: {
          mobile: this.mobile,
        },
      });
    },
    ...mapMutations([
      'setnickname',
      'setage',
      'setmobile',
      'setavatar',
      'setsex',
    ]),
  },
  computed: {
    ...mapGetters(['username', 'nickname', 'age', 'mobile', 'sex', 'avatar', 'getToken']),
  },
  components: {
    MHeader,
    ChangeAvatar,
    BackIcon,
  },
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~common/stylus/variable';
@import '~common/stylus/mixin';

.mine-config-person {
  position: fixed;
  width: 100%;
  top: 0;
  bottom: 0;
  background: #ffffff;

  .config-box {
    .config-item {
      height: 60px;
      border-bottom: 1px solid #eeeeee;
      display: flex;
      align-items: center;
      padding: 0 15px;
      position: relative;

      .right {
        position: absolute;
        right: 15px;
        display: flex;
        height: 100%;
        align-items: center;

        .arrow {
          width: 9px;
          height: 16px;
          bg-image('rightArrow');
          background-size: 9px 16px;
          margin-left: 10px;
        }

        .avatar {
          width: 30px;
          height: 30px;
          border-radius: 50%;
          overflow: hidden;

          img {
            display: block;
            width: 100%;
            height: 100;
          }
        }
      }
    }
  }

  .avatar-wrapper {
    opacity: 0;
    z-index: -1;

    &.active {
      opacity: 1;
      z-index: 10;
    }
  }
}
</style>
