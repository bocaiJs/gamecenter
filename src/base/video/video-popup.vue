<template>
  <transition name="fade">
    <div class="daq-video-popup">
      <div class="video">
        <div id="players"></div>
      </div>
    </div>
  </transition>
</template>
<script>
export default {
  name: 'VideoPopup',
  props: ['url'],
  data() {
    return {
      show: true,
    };
  },
  mounted() {
    let popup = document.getElementsByClassName('daq-video-popup')[0];
    popup.addEventListener('touchmove', (event) => {
      event.preventDefault();
    }, false);
  },
  watch: {
    url(value) {
      let flashvars = {
        // 需引入m3u8播放器
        f: '../../base/ckplayer/ckplayer/ckplayer/ckplayer.swf',
        // 流媒体地址
        a: value,
        c: 1,
        s: 4,
        lv: 0,
        p: 0,
      };
      let params = { bgcolor: '#FFF', allowFullScreen: false, allowScriptAccess: 'always', wmode: 'transparent' };
      let video = [value];
      CKobject.embed('../../base/ckplayer/ckplayer/ckplayer/ckplayer.swf', 'players', 'ck-video', '100%', '100%', false, flashvars, video, params);
      let playerbox = document.getElementById('players');
      playerbox.style.width = '100%';
      playerbox.style.height = '100%';
    },
  },
};
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
.fade-enter, .fade-leave-active, .fade-enter-active {
  transition: opacity 0.5s;
}

.fade-enter, .fade-leave-active {
  opacity: 0;
}

.daq-video-popup {
  width: 100%;
  height: 100%;

  .video {
    width: 100%;
    height: 100%;

    #player {
      height: 100%;
      max-width: 100%;
    }
  }
}
</style>
