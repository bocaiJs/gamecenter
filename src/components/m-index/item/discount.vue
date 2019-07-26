<template>
  <div class="discount">
    <div
      class="swiper-box"
      v-if="ads.length"
    >
      <slider :loop="ads.length>1?true:false">
        <div
          class="slider-item"
          v-for="(ad,index) in ads"
          :key="index"
        >

          <router-link
            tag="div"
            class="item"
            :to="'/gamedetail/'+ad.url"
          >
            <img
              :src="ad.image_url"
              style="width:100%"
            >
          </router-link>
        </div>
      </slider>
    </div>
    <game-type></game-type>
    <div
      class="game-box"
      v-if="games.length"
    >
      <discount-item
        v-for="game in games"
        :key="game.id"
        :gameinfo=game
      ></discount-item>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import Slider from 'base/slider/slider';

import GameType from './typecard';
import DiscountItem from './discount_item';


export default {
  props: {
    games: {
      type: Array,
    },
    ads: {
      type: Array,
    },
  },
  methods: {
    goGamePage(index) {
      console.log(index);
    },
  },
  components: {
    GameType,
    DiscountItem,
    Slider,
  },
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
.discount {
  .swiper-box {
    width: 100%;
    height: 0;
    padding-bottom: 50%;
    position: relative;
  }

  .game-box {
    background: #ffffff;
    margin-top: 15px;
  }
}
</style>

