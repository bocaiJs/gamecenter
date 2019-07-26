<template>
  <div class="game-swiper">
    <swiper
      :options="swiperOption"
      ref="swiper"
    >
      <swiper-slide
        v-for="(item,index) in swiperData"
        :key="index"
      >
        <!-- @click.native="goGameDetail" -->
        <router-link :to="'/gamedetail/'+item.url">
          <img
            :src="item.image_url"
            :id="item.url"
          >
        </router-link>
      </swiper-slide>
      <div
        id="game-swiper"
        class="game-swiper-pagination"
        slot="pagination"
      ></div>
    </swiper>
  </div>
</template>

<script type="text/ecmascript-6">
import { swiper, swiperSlide } from 'vue-awesome-swiper';
import 'swiper/dist/css/swiper.css';

export default {
  props: {
    swiperData: {
      type: Array,
    },
  },
  methods: {
    goGameDetail(id) {
      alert('dd');
      console.log(id);
    },
  },
  data() {
    return {
      swiperOption: {
        notNextTick: true,
        direction: 'horizontal',
        // autoplay: true,
        loop: false,
        height: 50,
        observer: true,
        observeParents: true,
        pagination: {
          el: '.game-swiper-pagination',
        },
        on: {
          tap: (e) => {
            console.log(e.target);
          },
        },
      },
    };
  },
  mounted() {
  },
  components: {
    swiper,
    swiperSlide,
  },
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
.game-swiper {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;

  .swiper-container {
    width: 100%;
    height: 100%;

    .swiper-wrapper {
      width: 100%;
      height: 100%;

      img {
        display: block;
        width: 100%;
        height: 100%;
      }
    }

    #game-swiper {
      &.game-swiper-pagination {
        position: absolute;
        text-align: center;
        -webkit-transition: 0.3s opacity;
        -o-transition: 0.3s opacity;
        transition: 0.3s opacity;
        -webkit-transform: translate3d(0, 0, 0);
        transform: translate3d(0, 0, 0);
        z-index: 10;

        &.swiper-pagination-bullets {
          span {
            &.swiper-pagination-bullet {
              &.swiper-pagination-bullet-active {
                width: 8px;
                height: 8px;
                background: red;
              }
            }
          }
        }
      }
    }
  }
}
</style>

