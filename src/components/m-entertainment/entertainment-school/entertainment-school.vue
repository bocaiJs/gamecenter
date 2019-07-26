<template>
  <transition name="slider">
    <div class="school">
      <div class="school-box">
        <div class="top-info">
          <div
            class="top-box"
            ref="tbox"
          >
            <div class="school-header">
              <span class="text">小天学堂</span>
              <div
                class="mine"
                @click="back"
              >
                <i class="icon-mine "></i>
              </div>
              <div
                class="publish"
                @click="showTips"
              >
                <span class="wen"></span>
              </div>
            </div>
            <div class="school-info">
              <div class="s-dj">等级:
                <span>{{studentInfo.level}}</span>
              </div>
              <div class="s-iq">IQ :
                <span style="color:#2560c2">{{studentInfo.iq_value}}</span>
              </div>
              <div class="s-avatar">
                <img
                  v-lazy="studentInfo.avatar"
                  alt=""
                >
              </div>
              <div class="count">
                今日答题次数:
                <span style="color:#2560c2"> {{studentInfo.answer_times}} </span>/ 3
              </div>
            </div>
            <p class="s-nick">{{studentInfo.nickname}}</p>
          </div>
        </div>
        <div class="class-item">
          <div
            class="item-c"
            @click="goEaxm(1)"
          >
            <img
              src="./lishi@3x.png"
              alt=""
            >
          </div>
          <div
            class="item-c"
            @click="goEaxm(2)"
          >
            <img
              src="./jindian@3x.png"
              alt=""
            >
          </div>
          <div
            class="item-c"
            @click="goEaxm(3)"
          >
            <img
              src="./renwen@3x.png"
              alt=""
            >
          </div>
        </div>
      </div>
      <router-view></router-view>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
import MHeader from '@/components/m-header/m-header';
import TipIcon from '@/base/icon_widget/tip';
import { mapGetters } from 'vuex';
import { getCommonInfoHasData } from '@/base/api/indexpage/getindexinfo';

export default {
  data() {
    return {
      titleText: '小天学堂',
      exchange: true,
      studentInfo: {
        answer_times: 0,
        avatar: '',
        iq_value: 0,
        nickname: '',
        level: '',
      },
    };
  },
  created() {
    this.getStudentInfo();
  },
  mounted() {
    this.$refs.tbox.style.paddingTop = parseInt(this.statusbar) + 'px';
  },
  methods: {
    getStudentInfo() {
      getCommonInfoHasData('/amuse/school/index', { token: this.getToken }).then((res) => {
        this.studentInfo = res.data;
      });
    },
    back() {
      this.$router.back(-1);
    },
    showTips() {
      this.$router.push({
        path: '/service/school/tips',
      });
    },
    goEaxm(cate) {
      this.$router.push({
        path: '/service/school/exam',
        query: {
          cate,
        },
      });
    },
  },
  computed: {
    ...mapGetters(['getToken', 'statusbar']),
  },
  components: {
    MHeader,
    TipIcon,
  },
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~common/stylus/variable';
@import '~common/stylus/mixin';

slider();

.school {
  position: fixed;
  width: 100%;
  top: 0;
  bottom: 0;
  background: #ffffff;
  overflow: hidden;
  z-index: 10;
  tips();

  .school-box {
    sub-position();
    top: 0px;

    .top-info {
      box-sizing: border-box;
      // padding-top: 20px;
      width: 100%;
      height: 0;
      position: relative;
      overflow: hidden;
      font-size: $font-size-small;
      background: url('./k@3x.png') no-repeat;
      background-size: cover;
      padding-top: 51%;

      .top-box {
        position: absolute;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;

        .school-header {
          position: relative;
          height: 44px;
          text-align: center;
          color: $color-theme;
          font-size: 0;
          z-index: 2;
          display: flex;

          .text {
            display: inline-block;
            line-height: 44px;
            font-weight: bold;
            text-align: left;
            font-size: $font-size-large;
            margin-left: 35px;
          }

          .mine {
            position: absolute;
            bottom: 0;
            left: 0;
            width: 50px;
            height: 44px;

            .icon-mine {
              display: block;
              height: 16px;
              width: 9px;
              margin-top: 14px;
              margin-left: 12px;
              background: url('../../../common/image/back/back@2x.png');
              background-size: 9px 16px;
              transform: scale(1.5);
            }
          }

          .publish {
            position: absolute;
            bottom: 0;
            right: 5px;
            width: 44px;
            height: 44px;
            font-size: 16px;
            color: #ffffff;
            line-height: 44px;
            text-align: center;
            display: flex;
            align-items: center;
            justify-content: center;

            .wen {
              display: block;
              height: 20px;
              width: 20px;
              background: url('./wen@3x.png') no-repeat;
              background-size: 20px 20px;
            }
          }
        }

        .school-info {
          z-index: 2;
          position: relative;
          display: flex;
          justify-content: space-between;
          align-items: center;
          box-sizing: border-box;
          padding: 15px 20px 0 20px;
          color: #ffffff;

          .s-avatar {
            width: 60px;
            height: 60px;
            overflow: hidden;
            border-radius: 50%;
            border: 2px solid #ffffff;

            img {
              width: 100%;
            }
          }
        }

        .s-nick {
          text-align: center;
          z-index: 2;
          position: relative;
          color: #ffffff;
          margin-top: 10px;
        }
      }
    }

    .class-item {
      padding: 0 15px;
      box-sizing: border-box;

      .item-c {
        width: 100%;

        img {
          width: 100%;
        }
      }
    }
  }
}
</style>

