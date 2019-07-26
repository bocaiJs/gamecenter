<template>
    <div class="mine-index">
        <header style="width:100%;background: -webkit-linear-gradient(left, #7aeed2, #5ed9f5, #5ed9f5);" ref="mindexheader"></header>
        <div class="indexwrapper" ref="indexwrapper">
            <div class="m-top">
                <div class="logobox">
                    <div class="user-avatar">
                        <div class="avatar default">
                            <img v-lazy="avatar" alt="" v-if="$store.state.login">
                            <div class="avatar-nologin" v-else></div>
                        </div>
                        <p class="name" @click="changeNickname" v-if="$store.state.login">{{userInfo.nickname}}</p>
                        <p class="name" @click="goLogin" v-else>点击登录</p>
                        <div class="vip-dj" v-show="$store.state.login">VIP{{userInfo.vip}}</div>
                        <span class="vipavatar" :class="vipClass" @click="changeAvatar" v-show="$store.state.login"></span>
                    </div>
                    <div class="login-y" v-show="$store.state.login">
                        <div class="score">
                            <p class="score-title">
                                积分
                            </p>
                            <span style="color:#f1dd54">{{userInfo.score}}</span>
                        </div>
                        <div class="vip" @click="goSubPage('/mine/privilege')">
                            <p class="levelup">升级还需</p>
                            <span style="color:#18d1ea">{{userInfo.vipNextScore}}积分</span>
                        </div>
                    </div>
                    <div class="config" @click="goConfigPage"></div>
                    <div class="sign" @click="sigin" v-if="!issigin" v-show="$store.state.login">签到</div>
                    <div class="sign" v-else @click="sigin" v-show="$store.state.login">已签到</div>
                </div>
                <div class="gamebox" v-show="userInfo.gameList &&userInfo.gameList.length">
                    <div class="mygame-title">
                        <span class="mg-icon"></span> 我的游戏
                    </div>
                    <div class="mg-box" ref="mgBox">
                        <div class="mg-box-wrapper">
                            <img src="../../../common/image/icon.png" alt="" ref="myGame">
                            <img src="../../../common/image/icon.png" alt="" ref="myGame">
                            <img src="../../../common/image/icon.png" alt="" ref="myGame">
                            <img src="../../../common/image/icon.png" alt="" ref="myGame">
                            <img src="../../../common/image/icon.png" alt="" ref="myGame">
                            <img src="../../../common/image/icon.png" alt="" ref="myGame">
                            <img src="../../../common/image/icon.png" alt="" ref="myGame">
                            <img src="../../../common/image/icon.png" alt="" ref="myGame">
                            <img src="../../../common/image/icon.png" alt="" ref="myGame">
                            <img src="../../../common/image/icon.png" alt="" ref="myGame">
                            <img src="../../../common/image/icon.png" alt="" ref="myGame">
                            <img src="../../../common/image/icon.png" alt="" ref="myGame">
                        </div>
                    </div>
                </div>
            </div>
            <div class="mine-box">
                <div class="mine">
                    <div class="m-item" @click="goSubPage('/mine/giftpack')">
                        <span class="gift"></span>
                        <p>我的礼包</p>
                    </div>
                    <div class="m-item" @click="goSubPage('/mine/message')">
                        <span class="message"></span>
                        <p>我的消息</p>
                    </div>
                    <div class="m-item" @click="goSubPage('/mine/score')">
                        <span class="score"></span>
                        <p>我的积分</p>
                    </div>
                    <div class="m-item" @click="goSubPage('/mine/accountsafe')">
                        <span class="accountsafe"></span>
                        <p>账号安全</p>
                    </div>
                    <div class="m-item" @click="goSubPage('/mine/favorite')">
                        <span class="focus"></span>
                        <p>我的关注</p>
                    </div>
                    <div class="m-item" @click="goSubPage('/mine/privilege')">
                        <span class="vip"></span>
                        <p>会员特权</p>
                    </div>
                    <div class="m-item" @click="goSubPage('/mine/service')">
                        <span class="service"></span>
                        <p>常见问题</p>
                    </div>
                    <div class="m-item" @click="goSubPage('/mine/invite')">
                        <span class="invite"></span>
                        <p>邀请好友</p>
                    </div>
                    <div class="m-item" @click="goSubPage('/mine/mission')">
                        <span class="mession"></span>
                        <p>成长任务</p>
                    </div>
                </div>
            </div>

        </div>
        <change-avatar class="avatar-wrapper" :class="{active:showAvatar === true}" @newAvatar='hideAvatar'></change-avatar>
        <mask-common :showMask="showMask" @mask="hideMask" :maskInfo="maskInfo"></mask-common>
        <router-view></router-view>
    </div>
</template>

<script type="text/ecmascript-6">
// import BSscroll from 'better-scroll';
import Scroll from '@/base/scroll/scroll';
import { avatarMixin } from 'common/js/mixin';
import { getCommonInfoHasData } from '@/base/api/indexpage/getindexinfo';
import { mapMutations, mapGetters, mapActions } from 'vuex';

import MaskCommon from '@/base/maskcommon/maskcommon';

export default {
    mixins: [avatarMixin],
    data() {
        return {
            userInfo: {},
            actived: false,
            issigin: false,
            showMask: false,
            maskInfo: {
                content: '',
                btn: [],
            },
        };
    },
    // mounted() {
    //     this.$refs.mindexheader.style.height = (parseInt(this.statusbar)) + 'px';
    //     this.$refs.indexwrapper.style.top = (parseInt(this.statusbar)) + 'px';
    //     setTimeout(() => {
    //         this._initScroll();
    //     }, 20);
    // },
    activated() {
        if (this.actived === false) {
            this._getUserLoginInfo();
        }
    },
    methods: {
        // 获取用户基本信息
        _getUserLoginInfo() {
            const userLoginAddress = '/user/info';
            console.log(this.getToken);
            if (this.getToken === '' || this.getToken === null) {
                console.log('token == dd');
                this.userLogout();
            } else {
                getCommonInfoHasData(userLoginAddress, { token: this.getToken }).then((res) => {
                    console.log(res);
                    if (!res.status_code) {
                        this.actived = true;
                        this.userInfo = res.data;
                        this.issigin = res.data.taskSignIn;
                        this.setUserInfo(res.data);
                    } else {
                        this.userLogout();
                    }
                });
            }
        },
        changeNickname() {
            if (this.getLoginState) {
                this.$router.push({
                    path: '/mine/config/person',
                });
            } else {
                this.goLogin();
            }
        },
        changeAvatar() {
            if (this.getLoginState) {
                this.showAvatarWrapper();
            } else {
                this.goLogin();
            }
        },
        goLogin() {
            this.$router.push({
                path: '/login',
            });
            this.scroll && this.scroll.destroy();
            console.log(this.scroll);
        },
        goSubPage(url) {
            if (this.getLoginState) {
                this.$router.push({
                    path: url,
                });
            } else {
                this.showMask = true;
                this.maskInfo.content = '用户未登录';
                this.maskInfo.btn[0] = {
                    btnTitle: '知道了',
                    type: 'hide',
                };
                this.maskInfo.btn[1] = {
                    btnTitle: '去登录',
                    type: 'login',
                };
            }
        },
        goConfigPage() {
            this.$router.push({
                path: '/mine/config',
            });
        },
        canScroll(pos) {
            if (pos.y > 0) {
                this.$refs.scroll.scrollTo(0, 0);
            }
        },
        //  签到
        sigin() {
            if (this.issigin) {
                this.showTips('今日签到任务已完成!');
                return;
            }
            const siginAdd = '/task/signin';
            getCommonInfoHasData(siginAdd, {
                token: this.getToken,
            }).then(() => {
                this.showTips('+5积分!');
                this.userInfo.vipNextScore -= 5;
                this.userInfo.score += 5;
                this.issigin = true;
            });
        },
        // _initScroll() {
        //     if (!this.$refs.mgBox) {
        //         return;
        //     }
        //     this.scroll = new BSscroll(this.$refs.mgBox, {
        //         click: this.click,
        //         momentum: true,
        //         bounce: true,
        //         scrollX: true,
        //     });
        // },
        showTips(content) {
            plus.nativeUI.toast(content);
        },
        hideMask() {
            this.showMask = false;
        },
        ...mapMutations([
            'userLoginState',
            'userLogout',
            'setusername',
            'setnickname',
            'setage',
            'setmobile',
            'setavatar',
            'setsex',
        ]),
        ...mapActions([
            'setUserInfo',
        ]),
    },
    watch: {
        back() {
            // console.log('监听到back了，做操作吧小伙子');
            this._getUserLoginInfo();
        },
        // getLoginState() {
        //     console.log('监听到登陆状态改变===');
        //     this._initScroll();
        //     console.log(this.scroll);
        // },
    },
    computed: {
        vipClass() {
            const vc = `vip${this.userInfo.vip}-img`;
            console.log(vc);
            return vc;
        },
        ...mapGetters(['getLoginState', 'getToken', 'avatar', 'statusbar', 'back']),
    },
    components: {
        Scroll,
        MaskCommon,
    },
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~common/stylus/variable';
@import '~common/stylus/mixin';

.mine-index {
    position: fixed;
    width: 100%;
    top: 0;
    bottom: 50px;
    background: $color-background;

    .indexwrapper {
        position: relative;
        width: 100%;
        height: 100%;
        overflow: hidden;

        .m-top {
            box-shadow: 0 2px 5px #d1d0d0;
            position: relative;
            height: 200px;
            overflow: hidden;

            .logobox {
                box-sizing: border-box;
                position: absolute;
                top: 0;
                width: 100%;
                height: 100%;
                padding: 0 15px;
                background: url('./bj@3x.png') no-repeat;
                background-size: 100% 100%;

                .user-avatar {
                    margin-top: 35px;
                    position: relative;
                    width: 100%;
                    display: flex;
                    flex-direction: column;
                    align-items: center;

                    .avatar {
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        height: 60px;
                        width: 60px;
                        box-sizing: border-box;
                        overflow: hidden;
                        border-radius: 50%;

                        &.default {
                            background: #eeeeee;

                            .avatar-nologin {
                                width: 60px;
                                height: 60px;
                                background: url('./touxiang@3x.png');
                                background-size: 100% 100%;
                            }
                        }

                        img {
                            width: 100%;
                            height: 100%;
                        }
                    }

                    .name {
                        margin-top: 16px;
                        margin-bottom: 4px;
                        font-size: $font-size-medium;
                        color: #ffffff;
                    }

                    .vip-dj {
                        position: relative;
                        font-size: $font-size-small;
                        color: #01f2ff;
                        text-indent: 16px;
                        margin-top: 5px;

                        &:before {
                            content: '';
                            position: absolute;
                            top: 0;
                            left: 0;
                            width: 12px;
                            height: 12px;
                            background: url('./vip-icon@3x.png') no-repeat;
                            background-size: 100% 100%;
                        }
                    }

                    .vipavatar {
                        left: 50%;
                        transform: translate(-50%, 0);

                        &.vip0-img {
                            position: absolute;
                            width: 60px;
                            height: 60px;
                            border: 2px solid #ffffff;
                            border-radius: 30px;
                            top: -2px;
                        }

                        &.vip1-img {
                            position: absolute;
                            width: 83px;
                            height: 70px;
                            background: url('./va/1@3x.png') no-repeat;
                            background-size: 83px 70px;
                            top: -5px;
                        }

                        &.vip2-img {
                            position: absolute;
                            width: 66px;
                            height: 66px;
                            top: -5px;
                            background: url('./va/2@3x.png') no-repeat;
                            background-size: 66px 66px;
                        }

                        &.vip3-img {
                            position: absolute;
                            width: 82px;
                            height: 82px;
                            top: -10px;
                            background: url('./va/3@3x.png') no-repeat;
                            background-size: 82px 82px;
                        }

                        &.vip4-img {
                            position: absolute;
                            width: 68px;
                            height: 69px;
                            top: -5px;
                            background: url('./va/4@3x.png') no-repeat;
                            background-size: 68px 69px;
                        }

                        &.vip5-img {
                            position: absolute;
                            width: 82px;
                            height: 82px;
                            top: -9px;
                            background: url('./va/5@3x.png') no-repeat;
                            background-size: 82px 82px;
                        }

                        &.vip6-img {
                            position: absolute;
                            width: 68px;
                            height: 72px;
                            top: -9px;
                            background: url('./va/6@3x.png') no-repeat;
                            background-size: 68px 72px;
                        }

                        &.vip7-img {
                            position: absolute;
                            width: 82px;
                            height: 80px;
                            top: -9px;
                            background: url('./va/7@3x.png') no-repeat;
                            background-size: 82px 80px;
                        }

                        &.vip8-img {
                            position: absolute;
                            width: 73px;
                            height: 78px;
                            top: -9px;
                            background: url('./va/8@3x.png') no-repeat;
                            background-size: 73px 78px;
                        }

                        &.vip9-img {
                            position: absolute;
                            width: 81px;
                            height: 79px;
                            top: -9px;
                            background: url('./va/9@3x.png') no-repeat;
                            background-size: 81px 79px;
                        }

                        &.vip10-img {
                            position: absolute;
                            width: 71px;
                            height: 77px;
                            top: -9px;
                            background: url('./va/10@3x.png') no-repeat;
                            background-size: 71px 77px;
                        }
                    }
                }

                .login-n {
                    margin-left: 15px;
                    color: #222222;
                }

                .login-y {
                    height: 34px;
                    width: 80%;
                    font-size: $font-size-small-s;
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                    padding-left: 40px;
                    margin-top: 6px;
                    box-sizing: border-box;

                    .name {
                        color: #ffa800;
                        font-size: $font-size-medium-x;
                        width: 50%;
                        overflow: hidden;
                    }

                    .score {
                        display: flex;
                        position: relative;

                        .score-title {
                            width: 64px;
                            color: #ffffff;
                            position: relative;

                            &:before {
                                position: absolute;
                                top: 0;
                                left: -18px;
                                content: '';
                                width: 12px;
                                height: 12px;
                                background: url('./jf@3x.png') no-repeat;
                                background-size: 12px 12px;
                            }
                        }
                    }

                    .vip {
                        display: flex;
                        position: relative;

                        .levelup {
                            width: 64px;
                            color: #ffffff;

                            &:before {
                                position: absolute;
                                top: 0;
                                left: -18px;
                                content: '';
                                width: 12px;
                                height: 12px;
                                background: url('./sj@3x.png') no-repeat;
                                background-size: 12px 12px;
                            }
                        }
                    }
                }

                .config {
                    position: absolute;
                    right: 15px;
                    top: 35px;
                    width: 17px;
                    height: 16px;
                    bg-image('config');
                    background-size: 17px 16px;
                }

                .sign {
                    position: absolute;
                    right: 35px;
                    bottom: 20px;
                    height: 20px;
                    width: 50px;
                    border: 1px solid #b2780c;
                    color: #ffffff;
                    background: #fcb537;
                    background: linear-gradient(#f2e66c, #fcb537);
                    box-sizing: border-box;
                    text-align: center;
                    line-height: 19px;
                    border-radius: 10px;
                    font-size: $font-size-small-s;
                }
            }

            .gamebox {
                padding: 0 15px;

                .mygame-title {
                    width: 100%;
                    height: 44px;
                    padding: 0 15px;
                    display: flex;
                    align-items: center;
                    color: #000000;

                    .mg-icon {
                        display: block;
                        width: 20px;
                        height: 20px;
                        bg-image('mygame');
                        background-size: 20px 20px;
                        margin-right: 10px;
                    }
                }

                .mg-box {
                    width: 100%;
                    height: 80px;
                    overflow: hidden;
                    padding: 10px 0;
                    box-sizing: border-box;
                    border-top: 1px solid #eeeeee;

                    .mg-box-wrapper {
                        height: 100%;
                        min-width: 100%;
                        display: flex;
                        width: 840px;

                        img {
                            display: block;
                            width: 60px;
                            height: 60px;
                            margin-right: 11px;
                        }
                    }
                }
            }
        }

        .mine-box {
            width: 100%;
            height: calc(100% - 210px);
            margin-top: 10px;
            overflow: scroll;
            -webkit-overflow-scrolling: touch;

            &::-webkit-scrollbar {
                display: none;
            }

            &::-webkit-scrollbar {
                width: 0px;
            }

            .mine {
                width: 100%;
                background: #ffffff;
                min-height: 300px;

                .m-item {
                    height: 60px;
                    border-bottom: 1px solid #eeeeee;
                    display: flex;
                    align-items: center;
                    padding: 0 15px;

                    span {
                        display: block;
                        width: 20px;
                        height: 20px;
                        background-size: 20px 20px;
                        margin-right: 10px;

                        &.gift {
                            bg-image('gift');
                        }

                        &.message {
                            bg-image('message');
                        }

                        &.score {
                            bg-image('score');
                        }

                        &.accountsafe {
                            bg-image('accountsafe');
                        }

                        &.focus {
                            bg-image('focus');
                        }

                        &.vip {
                            bg-image('vip');
                        }

                        &.service {
                            bg-image('service');
                        }

                        &.invite {
                            bg-image('invite');
                        }

                        &.mession {
                            bg-image('cz');
                        }
                    }
                }
            }
        }
    }

    .avatar-wrapper {
        opacity: 0;
        z-index: -1;
        height: 0;

        &.active {
            opacity: 1;
            z-index: 10;
            height: 100%;
        }
    }
}
</style>
