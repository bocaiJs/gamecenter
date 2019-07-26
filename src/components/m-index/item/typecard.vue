<template>
  <div class="type-card">
    <div class="title">
      <span>类型</span>
      <span @click="goGame">更多</span>
    </div>
    <div class="type-item">
      <div
        class="item"
        @click="goGameType(T_TC,C_XX)"
      >
        <div class="bg xx">
          <div class="text">
            仙侠
          </div>
        </div>
      </div>
      <div
        class="item"
        @click="goGameType(T_LX,C_KP)"
      >
        <div class="bg kp">
          <div class="text">
            卡牌
          </div>
        </div>
      </div>
      <div
        class="item"
        @click="goGameType(T_WF,C_GJ)"
      >
        <div class="bg gj">
          <div class="text">
            挂机
          </div>
        </div>
      </div>
      <div
        class="item"
        @click="goGameType(T_WF,C_MMO)"
      >
        <div class="bg mmo">
          <div class="text">
            MMO
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


<script type="text/ecmascript-6">

export default {
  data() {
    return {
      C_XX: 44,
      C_MMO: 55,
      C_KP: 14,
      C_GJ: 19,
      T_TC: 2,
      T_WF: 5,
      T_LX: 6,
    };
  },
  methods: {
    goGame() {
      this.$router.push('/gamemod');
    },
    // T大分类6个固定:TYPEID，C小分类:categoryId
    // 仙侠---题材--44
    // MMO---玩法--55
    // 卡牌---类型--14
    // 挂机---玩法--19
    goGameType(t, c) {
      this.$router.push({
        path: '/gamemod',
        query: {
          typeId: t,
          categoryId: c,
        },
      });
    },
  },
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
.type-card {
  width: 100%;
  box-sizing: border-box;
  padding: 0 15px 15px 15px;
  background: #ffffff;

  .title {
    width: 100%;
    height: 40px;
    display: flex;
    justify-content: space-between;
    align-items: center;

    span {
      display: inline-block;

      &:first-child {
        font-size: 14px;
        color: #333333;
      }

      &:last-child {
        font-size: 12px;
        color: #999999;
        padding: 5px;
        padding-right: 0;
      }
    }
  }

  .type-item {
    display: flex;
    justify-content: space-between;

    .item {
      flex: 1;
      border-radius: 4px;
      margin-left: 5px;

      .bg {
        position: relative;
        width: 100%;
        padding-bottom: 60%;
        height: 0;

        &.xx {
          background: url('./type1.png') no-repeat;
          background-size: cover;
        }

        &.kp {
          background: url('./type2.png') no-repeat;
          background-size: cover;
        }

        &.gj {
          background: url('./type3.png') no-repeat;
          background-size: cover;
        }

        &.mmo {
          background: url('./type4.png') no-repeat;
          background-size: cover;
        }

        .text {
          position: absolute;
          display: flex;
          width: 100%;
          height: 100%;
          align-items: center;
          justify-content: center;
          color: #ffffff;
          font-size: 14px;
          font-weight: bold;
        }
      }

      &:first-child {
        margin-left: 0;
      }
    }
  }
}
</style>
