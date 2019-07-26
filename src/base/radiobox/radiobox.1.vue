<template>
  <div class="switch">
    <input
      type="checkbox"
      name="toggle"
      v-model="select"
      v-on:click="alocked(select)"
    >
    <label for="toggle">
      <i></i>
    </label>
  </div>
</template>

<script type="text/ecmascript-6">
export default {
  props: {
    selected: {
      default: false,
    },
  },
  data() {
    return {
      select: false,
    };
  },
  mounted() {
    setTimeout(() => {
      this.select = this.selected;
    }, 20);
  },
  methods: {
    alocked(select) {
      this.select = !select;
      this.$emit('radioselect', this.select);
    },
  },
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
.switch {
  padding: 0;
  width: 50px;
  height: 30px;
  position: relative;

  input {
    margin: 0;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    -moz-opacity: 0;
    opacity: 0;
    z-index: 100;
    position: absolute;
    width: 100%;
    height: 100%;
    cursor: pointer;
    background: yellow;

    +label {
      display: block;
      width: 100%;
      height: 100%;
      position: relative;
      background: #aaaaaa;
      -webkit-transition: all 0.5s ease;
      transition: all 0.5s ease;
      border-radius: 15px;

      i {
        display: block;
        height: 16px;
        width: 16px;
        border-radius: 8px;
        position: absolute;
        left: 2px;
        top: 2px;
        z-index: 0;
        background: #ffffff;
        -webkit-transition: all 0.5s ease;
        transition: all 0.5s ease;
      }
    }

    &:checked {
      +label {
        display: block;
        width: 100%;
        height: 100%;
        position: relative;
        background: #58d2ec;
        -webkit-transition: all 0.5s ease;
        transition: all 0.5s ease;
        border-radius: 15px;

        i {
          display: block;
          height: 16px;
          width: 16px;
          border-radius: 8px;
          position: absolute;
          top: 2px;
          left: 16px;
          z-index: 0;
          -webkit-transition: all 0.5s ease;
          transition: all 0.5s ease;
        }
      }
    }
  }
}
</style>
