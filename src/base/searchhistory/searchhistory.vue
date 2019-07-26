<template>
  <div class="history">
    <div class="search-title">
      <h3>搜索记录</h3>
      <p
        @click="clearHistory"
        class="clear"
      >
        <span class="delete"><img
            src="./shanchu.png"
            alt=""
          ></span>
      </p>
    </div>
    <div class="search-record ">
      <div
        class="record-item"
        v-for="(searhis,index) in history"
        :key="index"
        @click="onSearchGame(searhis)"
      >{{searhis}}</div>
      <p
        class="tips"
        v-if="!history.length"
      >暂无搜索记录</p>
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
import { setLocalStorage, getLocalStorage } from '@/common/js/storage';


export default {
  props: {
    historytype: {
      type: String,
    },
  },
  data() {
    return {
      history: [],
    };
  },
  created() {
    this._showSearchHistory();
    console.log(this.historytype);
  },
  methods: {
    onSearchGame(val) {
      console.log(val);
      this.$emit('searchGoods', val);
    },
    setSearchHistory(val) {
      if (!val || val.length <= 0) return;
      console.log('meiguol');
      let searchHis = getLocalStorage(this.historytype);
      if (searchHis) {
        searchHis += `&${val}`;
        this.history = searchHis.split('&');
      } else {
        searchHis = val;
        this.history.push(searchHis);
      }
      this.history = this.unique(this.history);
      setLocalStorage(this.historytype, this.history.join('&'));
    },
    _showSearchHistory() {
      if (getLocalStorage(this.historytype)) {
        this.history = getLocalStorage(this.historytype).split('&');
      }
    },
    clearHistory() {
      this.history = [];
      setLocalStorage(this.historytype, '');
    },
    unique(array) {
      let r = [];
      for (let i = 0, l = array.length; i < l; i++) {
        for (let j = i + 1; j < l; j++) {
          if (array[i] === array[j]) j = ++i;
        }
        r.push(array[i]);
      }
      return r;
    },
  },
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
.history {
  padding: 15px;

  .search-title {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;

    h3 {
      font-size: 16px;
      font-weight: bold;
      color: #555555;
    }

    p {
      width: 20%;
      font-size: $font-size-small;
      text-align: right;
      padding-right: 2px;
    }

    .clear {
      font-size: 12px;
      color: #fe5ba8;

      .delete {
        display: inline-block;
        padding: 5px;

        img {
          width: 15px;
          height: 15px;
        }
      }
    }
  }

  .search-record {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;

    .tips {
      width: 100%;
      margin-top: 10px;
      font-size: 14px;
      color: #999999;
      text-align: center;
    }

    .record-item {
      margin-top: 15px;
      height: 30px;
      width: 80px;
      border-radius: 15px;
      background: #eeeeee;
      text-align: center;
      line-height: 30px;
      font-size: $font-size-small;
      margin-right: 10px;
    }
  }
}
</style>
