import Vue from 'vue';
import Vuex from 'vuex';
import { getLocalStorage } from 'common/js/storage';
import mutations from './mutations';
import * as getters from './getters';
import * as actions from './actions';

Vue.use(Vuex);

const state = {
    login: false,
    token: getLocalStorage('token'),
    username: 'jack',
    nickname: '橙子',
    age: 18,
    sex: '0',
    taskscount: 0,
    statusBar: 0,
    isios: false,
    mobile: null,
    avatar: null,
    gametags: [],
    downgames: [],
    gametasks: {},
    back: 0, //  评论返回时修改该数据，通知父页面刷新
    loginback: 0, // 登陆返回后 通知父页面刷新
    done: 0,
    androidId: '',
    unionId: '',
    vip: 0,
    vipNextScore: 0,
    score: 0,
    taskSignIn: false,
    amount_money: 0.0,
    msgInfo: {
        new_article: 0,
        new_goods: 0,
        new_msg: 0,
    },
};
export default new Vuex.Store({
    state,
    mutations,
    getters,
    actions,
});
