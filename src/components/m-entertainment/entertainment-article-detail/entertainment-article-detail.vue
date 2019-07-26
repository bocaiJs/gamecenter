<template>
  <transition name="slider">
    <div class="notice-detail">
      <m-header
        :canreturn=true
        :type="1"
      ></m-header>
      <div
        class="newsbox"
        ref="newsbox"
        v-show="!showLoading "
      >
        <div class="notice-wrapper  ">
          <h3>{{articleDetail.title}}</h3>
          <p class="newsdate">作者名称:<span>天橙游玩官方</span> {{articleDetail.created_at}}</p>
          <div
            class="newbody"
            id="newbody"
            v-html="articleDetail.content"
          >
          </div>
        </div>

      </div>
      <div
        class="loading-container "
        v-if="showLoading "
      >
        <loading></loading>
      </div>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
import MHeader from 'components/m-header/m-header';
import Loading from '@/base/loading/loading';
import { getCommonInfo } from '@/base/api/indexpage/getindexinfo';
import { mapGetters } from 'vuex';

export default {
  data() {
    return {
      data: 0,
      articleDetail: {},
      showLoading: true,
    };
  },
  created() {
    this.id = this.$route.query.id;
    this.getArticleDetail(this.id);
  },
  mounted() {
    this.$refs.newsbox.style.top = (44 + parseInt(this.statusbar)) + 'px';
  },
  methods: {
    getArticleDetail(id) {
      console.log('获取文章');
      getCommonInfo(`/amuse/article/details/${id}`).then((res) => {
        this.articleDetail = res.data;
        this.$nextTick(() => {
          this.showLoading = false;
        });
      });
    },
  },
  computed: {
    ...mapGetters(['statusbar']),
  },
  components: {
    MHeader,
    Loading,
  },
};
</script>

<style lang="stylus" rel="stylesheet/stylus">
@import '~common/stylus/variable';
@import '~common/stylus/mixin';

slider();

.notice-detail {
  position: fixed;
  top: 0;
  bottom: 0;
  width: 100%;
  background: $color-background;
  background: #ffffff;
  z-index: 10;

  .newsbox {
    sub-position();

    .notice-wrapper {
      height: 100%;
      overflow: scroll;
      -webkit-overflow-scrolling: touch;
      padding: 15px;
      color: #222222;

      &::-webkit-scrollbar {
        display: none;
      }

      &::-webkit-scrollbar {
        width: 0px;
      }

      h3 {
        font-size: $font-size-medium-x;
        text-align: left;
        font-weight: bold;
        line-height: 20px;
        text-over();
      }

      .newsdate {
        text-align: left;
        font-size: $font-size-small;
        padding: 10px 0 20px 0;
        color: #999999;
      }

      img {
        display: block;
        max-width: 80%;
        margin: 0 auto;
      }

      .newbody {
        font-size: $font-size-medium;
        line-height: 20px;
        padding-bottom: 60px;
        overflow: hidden;
        color: #777777;

        img {
          display: block !important;
          max-width: 100% !important;
          padding: 14px 0 !important;
          margin: 0 auto !important;
        }

        p {
          img {
            display: block;
            max-width: 80%;
            margin: 0 auto;
          }
        }
      }
    }
  }

  .loading-container {
    loading();
  }
}
</style>
