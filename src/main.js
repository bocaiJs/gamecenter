import Vue from 'vue';
import VueLazyLoad from 'vue-lazyload';
import store from '@/store/store';
import VueHtml5Plus from 'vue-html5plus';
import fastclick from 'fastclick';
import promise from 'es6-promise';
import preview from 'vue-photo-preview';
import 'vue-photo-preview/dist/skin.css';
import Toast from '@/base/Toast';
import App from './App';
import router from './router';
import './base';
import './common/stylus/index.styl';
// import './common/js/util';

// 图片预览插件
let options = {
    fullscreenEl: false,
};
Vue.use(preview, options);

fastclick.attach(document.body); // 固定用法。取消300毫秒的延迟
Vue.config.productionTip = false;
Vue.use(VueHtml5Plus);
Vue.use(Toast);
// 兼容 Promise
promise.polyfill();
/* eslint-disable global-require */
Vue.use(VueLazyLoad, {
    error: require('common/image/default.png'),
    loading: require('common/image/default.png'),
});
/* eslint-enable global-require */

/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    store,
    render: h => h(App),
});
