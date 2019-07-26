<template>
  <transition
    enter-active-class="animation-fade-in"
    leave-active-class="animation-fade-out"
  >
    <div
      class="otc-toast"
      v-if="show"
    >
      <div class="otc-toast-mask"></div>
      <div
        class="otc-toast-wrap"
        :class="icon.className"
      >
        <span
          class="icon icon-mobile"
          v-if="icon.html"
          v-html="icon.html"
        ></span>
        <span
          class="text"
          v-if="icon.title"
        >{{icon.title}}</span>
      </div>
    </div>
  </transition>
</template>
<script>
export default {
  name: 'otc-toast',
  props: {
    show: Boolean,
    type: {
      type: String,
      default: 'html',
      validator: (value) => {
        let check = ['html', 'loading', 'sucess', 'error'].indexOf(value);
        return check !== -1;
      },
    },
    message: String,
  },
  computed: {
    icon() {
      let html = '';
      let title = '';
      let className = '';
      switch (this.type) {
        case 'loading':
          html = '&#xe65c;';
          title = '数据加载中';
          className = 'loading';
          break;
        case 'html':
          html = '';
          title = this.message;
          className = '';
          break;
        case 'sucess':
          html = '&#xe6b6;';
          title = this.message;
          className = 'sucess';
          break;
        case 'error':
          html = '&#xe656;';
          title = this.message;
          className = 'error';
          break;
      }
      return {
        html,
        title,
        className,
      };
    },
  },
};

</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
.otc-toast {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  top: 0;
  z-index: 1000;
  display: flex;
  justify-content: center;
  align-items: center;

  &-mask {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    top: 0;
    z-index: 1;
  }

  &-wrap {
    position: relative;
    z-index: 2;
    padding: 0.2rem;
    min-width: 2.4rem;
    text-align: center;
    background: rgba(0, 0, 0, 0.7);
    border-radius: 0.1rem;
    color: $fc10;
    overflow: hidden;
  }

  .text {
    display: block;
    font-size: $f28;
    color: $fc10;
  }

  .icon-mobile {
    display: inline-block;
    width: 1rem;
    height: 1rem;
    line-height: 1rem;
    text-align: center;
    border-radius: 50%;
    font-size: 0.7rem;
    color: $fc10;
  }

  .loading, .sucess, .error {
    padding: 0.4rem 0;
  }

  .loading {
    .icon-mobile {
      animation: rotate linear 3s infinite;
    }

    @keyframes rotate {
      0% {
        transform: rotate(0deg);
      }

      to {
        transform: rotate(720deg);
      }
    }
  }
}
</style>
