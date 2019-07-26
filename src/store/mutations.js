// import * as types from './mutation-types';

const mutations = {
    userLoginState(state) {
        state.login = true;
    },
    userLogout(state) {
        state.login = false;
    },
    settoken(state, token) {
        state.token = token;
    },
    setusername(state, username) {
        state.username = username;
    },
    setnickname(state, nickname) {
        state.nickname = nickname;
    },
    setage(state, age) {
        state.age = age;
    },
    setmobile(state, mobile) {
        console.log('dddddd' + mobile);
        state.mobile = mobile;
    },
    setsex(state, sex) {
        state.sex = sex;
    },
    setavatar(state, avatar) {
        state.avatar = avatar;
    },
    setgametags(state, gametags) {
        state.gametags = gametags;
    },
    setdowngames(state, games) {
        state.downgames = games;
    },
    setStatusBar(state, statusbar) {
        state.statusbar = statusbar;
    },
    setBack(state, back) {
        state.back = back;
    },
    setLoginback(state, loginback) {
        state.loginback = loginback;
    },
    setDone(state, done) {
        state.done = done;
    },
    setGametasks(state, games) {
        state.gametasks = games;
    },
    setTasksCount(state, tasks) {
        state.taskscount = tasks;
    },
    setAndroidId(state, andid) {
        state.androidId = andid;
    },
    setUnionId(state, unionId) {
        state.unionId = unionId;
    },
    setVip(state, vip) {
        state.vip = vip;
    },
    setvipNextScore(state, vipNextScore) {
        state.vipNextScore = vipNextScore;
    },
    setScore(state, score) {
        state.score = score;
    },
    setTaskSignIn(state, taskSignIn) {
        state.taskSignIn = taskSignIn;
    },
    setMsgInfo(state, msgInfo) {
        console.log('设置msgInfo');
        state.msgInfo = msgInfo;
        console.log(state.msgInfo);
    },
    setMoney(state, info) {
        console.log(' 设置money', info);
        state.amount_money = info;
    },
};
export default mutations;

