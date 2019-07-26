export const setUserInfo = ({ commit }, list) => {
    console.log('设置用户信息-----------------');
    console.log(list.amount_money);
    // this.userLoginState();
    commit('userLoginState');
    commit('setusername', list.username);
    // this.setusername(res.data.username);
    // this.setnickname(res.data.nickname);
    commit('setnickname', list.nickname);
    // this.setage(res.data.age);
    commit('setage', list.age);
    // this.setmobile(res.data.mobile);
    commit('setmobile', list.mobile);
    // this.setavatar(res.data.avatar);
    commit('setavatar', list.avatar);
    // this.setsex(res.data.sex);
    commit('setsex', list.sex);
    commit('setVip', list.vip);
    commit('setvipNextScore', list.vipNextScore);
    commit('setScore', list.score);
    commit('setMoney', list.amount_money);
    commit('setTaskSignIn', list.taskSignIn);
    commit('setMsgInfo', {
        new_article: list.new_article,
        new_goods: list.new_goods,
        new_msg: list.new_msg,
    });
    console.log('设置用户信息完成-----------------');
};
export const clearUserInfo = ({ commit }) => {
    console.log('执行清除信息');
    commit('userLogout');
    commit('setusername', '');
    commit('setnickname', '');
    commit('setage', 0);
    commit('setmobile', '');
    commit('setavatar', '');
    commit('setsex', 0);
    commit('settoken', '');
    commit('setVip', 0);
    commit('setvipNextScore', 0);
    commit('setScore', 0);
    commit('setTaskSignIn', false);
};

