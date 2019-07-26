<template>
  <transition name="slider">
    <div class="entertainment-article">
      <m-header>
        <template slot="header">
          <arrow-back></arrow-back>
          <p style="padding-right:46px">{{titleText}}</p>
        </template>
      </m-header>
      <div
        class="article-box"
        ref="abox"
        v-show="!showLoading "
      >
        <scroll
          style="height:100%;overflow:hidden"
          :data=data
          :pullUpLoad=pullUpLoad
          @pullingUp='getMoreComment'
        >
          <div style="padding:1px 0 15px 0 ;">
            <div
              class="a-b-item"
              @click="goDetail(article.id)"
              v-for="article in articleList"
              :key='article.id'
            >
              <div class="top-img">
                <img
                  :src="article.thumb"
                  alt=""
                >
              </div>
              <div class="rightbox">
                <div class="topinfo">
                  <h3>{{article.title}}</h3>
                  <p class="a-desc">{{article.description | fliterDesc}}</p>
                </div>
                <div class="bottominfo">
                  <div class="b-left">
                    <span style="display:inline-block;width:16px;height:16px;border-radius:50%;overflow:hidden;margin-right:4px;">
                      <img
                        v-lazy="article.user_icon"
                        style="width:100%;"
                        alt=""
                      ></span>
                    <span>{{article.user_name}}</span>
                  </div>
                  <div class="b-right">
                    <span style="display:inline-block;width:14px;height:14px;overflow:hidden;margin-right:4px;">
                      <img
                        src="./parise@3x.png"
                        style="width:100%;"
                        alt=""
                      ></span>
                    <span>{{article.like_times}}</span>
                  </div>
                </div>
              </div>
              <!-- <div class="a-info">
                <h3>{{article.title}}</h3>
                <span class="time">{{article.created_at}}</span>
              </div> -->
              <!-- <p class="a-desc">{{article.desc}}</p> -->
            </div>
            <loading-more v-if="currentPage <totalPage"></loading-more>
          </div>
        </scroll>
      </div>
      <div
        class="loading-container "
        v-if="showLoading "
      >
        <loading></loading>
      </div>
      <router-view></router-view>
    </div>
  </transition>
</template>
<script type="text/ecmascript-6">
import MHeader from 'components/m-header/m-header';
import Scroll from '@/base/scroll/scroll';
import { getCommonInfoHasData } from '@/base/api/indexpage/getindexinfo';
import { mapGetters } from 'vuex';
import LoadingMore from '@/base/loadingmore/loading';
import Loading from '@/base/loading/loading';
import ArrowBack from '@/base/icon_widget/arrow_back';

const TITLE = ['精选视频', '休闲趣文', '天橙周报'];
const URL = ['/amuse/video', '/amuse/article/list', '/amuse/weekly/list'];
export default {
  data() {
    return {
      titleText: '趣文',
      data: 0,
      showLoading: true,
      articleList: [],
      currentPage: 0,
      totalPage: 1,
      pullUpLoad: true,
    };
  },
  mounted() {
    this.id = this.$route.params.type;
    if (this.id) {
      this.titleText = TITLE[this.id];
    }
    this.$refs.abox.style.top = (44 + parseInt(this.statusbar)) + 'px';
    // this.getArticleList();
    this.getInfo();
  },
  filters: {
    fliterDesc(val) {
      if (val) {
        return val.substring(0, 25) + '...';
      }
      return '暂无简介';
    },
  },
  methods: {
    getMoreComment() {
      this.getInfo();
    },
    goDetail(id) {
      if (this.id !== '0') {
        this.$router.push({
          path: `/enterdetail/${id}/${this.id}`,
          query: {
            title: '文章详情',
          },
        });
      } else {
        this.$router.push({
          path: `/service/article/${this.id}/vd`,
          query: {
            id,
          },
        });
      }
    },
    getInfo() {
      if (this.currentPage + 1 > this.totalPage) return;
      let url = URL[this.id];
      getCommonInfoHasData(url, { page: this.currentPage + 1 }).then((res) => {
        console.log(res.list);
        this.showLoading = false;
        this.totalPage = Math.ceil(res.total / res.pageSize);
        this.currentPage = this.currentPage + 1;
        this.articleList.push.apply(this.articleList, res.list);
        this.data++;
      });
    },


    // getArticleList() {
    //   getCommonInfoHasData('/amuse/article/list', { page: 1 }).then((res) => {
    //     this.showLoading = false;
    //     this.data++;
    //     console.log(res.data);
    //     this.articleList = res.data;
    //   });
    // },
  },
  computed: {
    ...mapGetters(['statusbar']),
  },
  watch: {
    $route(to, from) {
      console.log(from.name);
      if (from.name === 'MEntertainmentDetail') {
        this.data++;
      }
    },
  },
  components: {
    MHeader,
    Scroll,
    Loading,
    ArrowBack,
    LoadingMore,
  },
};
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~common/stylus/variable';
@import '~common/stylus/mixin';

slider();

.entertainment-article {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: #ffffff;
  z-index: 9;

  .article-box {
    sub-position();
    top: 68px;
    padding: 0 15px;
    box-sizing: border-box;

    .a-b-item {
      box-sizing: border-box;
      position: relative;
      background: #ffffff;
      display: flex;
      align-items: center;
      padding-top: 20px;
      padding-bottom: 20px;
      border-bottom: 1px solid #eeeeee;

      .top-img {
        position: relative;
        overflow: hidden;
        height: 90px;
        max-width: 132px;
        background: #eeeeee;

        img {
          width: 100%;
          height: 100%;
        }
      }

      .rightbox {
        flex: 1;
        height: 100%;
        min-height: 90px;
        box-sizing: border-box;
        padding-left: 10px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;

        .topinfo {
          h3 {
            max-width: 200px;
            font-size: 16px;
            color: #333333;
            font-weight: bold;
            text-over();
            padding-top: 2px;
          }

          .a-desc {
            margin-top: 10px;
            font-size: 14px;
            color: #999999;
            text-overflow: -o-ellipsis-lastline;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            line-clamp: 2;
            -webkit-box-orient: vertical;
          }
        }

        .bottominfo {
          display: flex;
          justify-content: space-between;
          align-items: center;

          .b-left, .b-right {
            display: flex;
            align-items: center;
            font-size: 12px;
            color: #999999;
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
