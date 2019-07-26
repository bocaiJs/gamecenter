<template>
  <transition name="slider">
    <div class="vip">
      <m-header>
        <template slot="header">
          <back-icon></back-icon>
          <p style="padding-right:46px;">{{titleText}}</p>
        </template>
      </m-header>
      <div class="vip">
        <div class="vipbox">
          <div class="userinfo">
            <div class="ui-left">
              <div class="avatar">
                <img
                  :src="avatar"
                  alt=""
                >
              </div>
              <span class="dj">V{{dj}}</span>用户名
            </div>
            <div class="ui-right">
              积分<span>{{score}}</span>
            </div>
          </div>
          <div class="progress">
            <div class="jd-text">
              <span>V0 <i :class="{'active':dj>0}"></i> <span
                  class="after"
                  :class="{'active':dj>=1}"
                ></span></span>
              <span>V2
                <i :class="{'active':dj>=2}"></i>
                <span
                  class="after"
                  :class="{'active':dj>=3}"
                ></span>
                <span
                  class="before"
                  :class="{'active':dj>=2}"
                ></span></span>
              <span>V4 <i :class="{'active':dj>=4}"></i> <span
                  class="after"
                  :class="{'active':dj>=5}"
                ></span><span
                  class="before"
                  :class="{'active':dj>=4}"
                ></span></span>
              <span>V6 <i :class="{'active':dj>=6}"></i> <span
                  class="after"
                  :class="{'active':dj>=7}"
                ></span><span
                  class="before"
                  :class="{'active':dj>=6}"
                ></span></span>
              <span>V8 <i :class="{'active':dj>=8}"></i> <span
                  class="after"
                  :class="{'active':dj>=9}"
                ></span><span
                  class="before"
                  :class="{'active':dj>=8}"
                ></span></span>
              <span>V10 <i :class="{'active':dj==10}"></i> <span
                  class="before"
                  :class="{'active':dj==10}"
                ></span></span>
            </div>
          </div>
          <div class="score">
            还差 <span>{{vipNextScore}}</span> 积分升级到V{{dj+1}}
          </div>
        </div>
        <div class="title">
          <img
            src="./title.png"
            alt=""
          >
        </div>
        <div class="tablebox">
          <table>
            <tr>
              <th>会员等级</th>
              <th>积分条件</th>
              <th>积分奖励</th>
            </tr>
            <tr>
              <td>VIP1</td>
              <td>>100</td>
              <td></td>
            </tr>
            <tr>
              <td>VIP2</td>
              <td>>800</td>
              <td></td>
            </tr>
            <tr>
              <td>VIP3</td>
              <td>>3000</td>
              <td></td>
            </tr>
            <tr>
              <td>VIP4</td>
              <td>>5000</td>
              <td></td>
            </tr>
            <tr>
              <td>VIP5</td>
              <td>>15000</td>
              <td></td>
            </tr>
            <tr>
              <td>VIP6</td>
              <td>>50000</td>
              <td></td>
            </tr>
            <tr>
              <td>VIP7</td>
              <td>>200000</td>
              <td></td>
            </tr>
            <tr>
              <td>VIP8</td>
              <td>>500000</td>
              <td></td>
            </tr>
            <tr>
              <td>VIP9</td>
              <td>>1200000</td>
              <td></td>
            </tr>
            <tr>
              <td>VIP10</td>
              <td>>3000000</td>
              <td></td>
            </tr>
          </table>
        </div>
      </div>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
import MHeader from '@/components/m-header/m-header';
import Clipboard from 'clipboard';
import BackIcon from '@/base/icon_widget/arrow_back';
import { mapGetters } from 'vuex';

export default {
  data() {
    return {
      titleText: '会员特权',
      dj: 0,
    };
  },
  mounted() {
    this.dj = this.vip;
  },
  methods: {
    copyLink() {
      let shareLink = this.$refs.share.textContent;
      let clipboard = new Clipboard('.copy', {
        text: () => {
          console.log(shareLink);
          return shareLink;
        },
      });
      clipboard.on('success', () => {
        this.showTips('复制成功');
        clipboard.destroy();
      });
      clipboard.on('error', () => {
        this.showTips('复制失败');
      });
    },
    showTips(content) {
      plus.nativeUI.toast(content);
    },
  },
  computed: {
    ...mapGetters(['vip', 'score', 'vipNextScore', 'avatar']),
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

.vip {
  position: fixed;
  width: 100%;
  top: 0;
  bottom: 0;
  background: #ffffff;

  .vip {
    position: absolute;
    width: 100%;
    bottom: 0;
    top: 68px;
    overflow-y: scroll;

    .vipbox {
      width: 100%;
      height: 190px;
      background: url('./bg.png') no-repeat;
      background-size: cover;
      padding-top: 1px;

      .userinfo {
        height: 60px;
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 15px;
        margin: 14px 0;
        box-sizing: border-box;

        .ui-left {
          display: flex;
          align-items: center;
          font-size: 16px;
          color: #ffffff;
          font-weight: bold;

          .dj {
            display: inline-block;
            font-size: 18px;
            color: #fcf438;
            margin: 0 6px;
          }

          .avatar {
            width: 60px;
            height: 60px;
            box-sizing: border-box;
            border: 2px solid #ffffff;
            border-radius: 50%;
            overflow: hidden;

            img {
              width: 100%;
              height: 100%;
            }
          }
        }

        .ui-right {
          width: 140px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid #ffffff;
          border-radius: 4px;
          background: #09b4c4;
          font-size: 16px;
          color: #ffffff;

          span {
            display: inline-block;
            margin-left: 4px;
            font-weight: bold;
          }
        }
      }

      .progress {
        padding: 0 15px;
        box-sizing: border-box;
        font-size: 16px;
        color: #fcf438;

        .jd-text {
          display: flex;
          align-items: center;
          justify-content: space-between;
          position: relative;

          .bar {
            position: absolute;
            left: 0;
            bottom: 0;
            height: 4px;
            width: 50%;
            background: red;
          }

          span {
            display: flex;
            height: 30px;
            width: 20%;
            align-items: center;
            flex-direction: column;
            justify-content: space-between;
            position: relative;

            .after {
              position: absolute;
              bottom: 3px;
              right: 0;
              height: 2px;
              width: 50%;
              background: #93dcf0;

              &.active {
                background: #fcf438;
              }
            }

            .before {
              position: absolute;
              bottom: 3px;
              left: 0;
              height: 2px;
              width: 50%;
              background: #93dcf0;

              &.active {
                background: #fcf438;
              }
            }

            i {
              position: absolute;
              bottom: 0;
              display: inline-block;
              width: 8px;
              height: 8px;
              border-radius: 50%;
              background: #93dcf0;
              z-index: 10;

              &.active {
                background: #fcf438;
              }
            }
          }
        }
      }

      .score {
        text-align: center;
        margin-top: 15px;
        color: #ffffff;

        span {
          color: #fcf438;
        }
      }
    }

    .title {
      width: 70%;
      margin: 0 auto;
      margin-top: 25px;

      img {
        width: 100%;
      }
    }

    .tablebox {
      box-sizing: border-box;
      padding: 0 15px;
      margin-top: 15px;

      table {
        width: 100%;

        tr {
          th {
            height: 44px;
            background: #06aac6;
            line-height: 44px;
            text-align: center;
            color: #ffffff;
            font-size: 15px;

            &:nth-child(2) {
              background: #0bb4d1;
            }
          }

          td {
            height: 30px;
            font-size: 12px;
            color: #777777;
            line-height: 30px;
            text-align: center;
            border-bottom: 1px solid #eeeeee;
            border-left: 1px solid #eeeeee;

            &:last-child {
              border-right: 1px solid #eeeeee;
            }
          }
        }
      }
    }
  }

  .loading-container {
    loading();
    z-index: 99999;
  }
}
</style>
