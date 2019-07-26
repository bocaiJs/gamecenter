import MineIndex from 'components/m-mine/index/index';
import MineConfig from 'components/m-mine/mine-config/mine-config';
import MineConfigPerson from 'components/m-mine/mine-config-person/mine-config-person';
import ChangePhone from 'base/changephone/changephone';
import MineConfigPersonCn from 'components/m-mine/mine-config-person-cn/mine-config-person-cn';
import GiftPacks from 'components/m-mine/giftpacks/giftpacks';
import MineMessage from 'components/m-mine/mine-message/mine-message';
import MineScoreDetail from 'components/m-mine/mine-message-detail/mine-message-detail';
import MineAccountSafe from 'components/m-mine/mine-accountsafe/mine-accountsafe';
import MineAccountSafeCP from 'components/m-mine/mine-accountsafe-cp/mine-accountsafe-cp';
import MineFavorite from 'components/m-mine/mine-favorite/mine-favorite';
import MinePrivilege from 'components/m-mine/mine-privilege/mine-privilege';
import MindexGameCommentDetail from 'components/m-index-game-comment-detail/m-index-game-comment-detail';
import PublishCommentPage from '@/base/publishcomment/publishcomment';
import MindexRecentServe from 'components/m-index-recentserve/m-index-recentserve';
import MGameDown from 'components/m-game/game-down/game-down';
import MindexGameDetail from 'components/m-index-game-detail/m-index-game-detail';
import MineService from 'components/m-mine/mine-service/mine-service';
import MineFeedBack from 'components/m-mine/mine-feedback/mine-feedback';
import MineInvite from 'components/m-mine/mine-invite/mine-invite';
import MineMission from 'components/m-mine/mine-mission/mine-mission';
import Recharge from 'components/m-mine/recharge/index';

// 互动中心 interactioncenter
import Interactioncenter from 'components/m-mine/interactioncenter/interactioncenter';
// 平台公告
import Notice from 'components/m-mine/notice/notice';
// 付款页面
import Pay from 'components/m-mine/recharge/paywebview';

const commentDetail = {
    path: 'comment/:commentid',
    component: MindexGameCommentDetail,
};
const serverDetail = {
    path: 'newserver',
    component: MindexRecentServe,
};
const publishComment = {
    path: 'publish',
    component: PublishCommentPage,
};
const gamedown = {
    path: 'down',
    name: 'mineGameDown',
    component: MGameDown,
};

export const mineRouter = {
    path: '/mine',
    name: 'MineIndex',
    component: MineIndex,
    children: [
        {
            path: 'config',
            name: 'MineConfig',
            component: MineConfig,
            children: [
                {
                    path: 'person',
                    component: MineConfigPerson,
                    children: [
                        {
                            path: 'bind',
                            name: 'ChangePhone',
                            component: ChangePhone,
                        },
                        {
                            path: 'nick',
                            name: 'MineConfigPersonCn',
                            component: MineConfigPersonCn,
                        },
                    ],
                },
            ],
        },
        // 充值
        {
            path: 'recharge',
            name: 'Recharge',
            component: Recharge,
            children: [
                {
                    path: 'pay',
                    name: 'Pay',
                    component: Pay,
                },
            ],
        },
        // 充值明细
        {
            path: 'rechargedetail',
            name: 'RechargeDetail',
            component: () => import('components/m-mine/rechargeDetail'),
        },
        {
            path: 'giftpack',
            name: 'GiftPacks',
            component: GiftPacks,
        },
        // 账号安全
        {
            path: 'password',
            name: 'MineAccountSafeCP',
            component: MineAccountSafeCP,
        },
        // 平台公告
        {
            path: 'notice',
            name: 'Notice',
            component: Notice,
        },
        {
            path: 'privilege',
            name: 'MinePrivilege',
            component: MinePrivilege,
        },
        {
            path: 'message',
            name: 'MineMessage',
            component: MineMessage,
            children: [
                {
                    path: ':id',
                    name: 'MineScoreDetail',
                    component: MineScoreDetail,
                },
            ],
        },
        // {
        //     path: 'score',
        //     name: 'MineScore',
        //     component: MineScore,
        // },
        {
            path: 'favorite',
            name: 'MineFavorite',
            component: MineFavorite,
            children: [
                {
                    path: 'gamedetail/:gameid',
                    component: MindexGameDetail,
                    children: [
                        commentDetail,
                        serverDetail,
                        publishComment,
                        gamedown,
                    ],
                },
            ],
        },
        {
            path: 'accountsafe',
            name: 'MineAccountSafe',
            component: MineAccountSafe,
            children: [
                {
                    path: 'password',
                    name: 'MineAccountSafeCP',
                    component: MineAccountSafeCP,
                },
                {
                    path: 'paypassword',
                    name: 'MineAccountSafeCPW',
                    component: () => import('@/base/account/setPayPassword/setPayPassword'),
                },
            ],
        },
        {
            path: 'service',
            name: 'MineService',
            component: MineService,
            children: [
                {
                    path: 'feedback',
                    name: 'MineFeedBack',
                    component: MineFeedBack,
                },
            ],
        },
        {
            path: 'invite',
            name: 'MineInvite',
            component: MineInvite,
        },
        {
            path: 'mission',
            name: 'MineMission',
            component: MineMission,
            children: [
                {
                    path: 'gamedetail/:gameid',
                    component: MindexGameDetail,
                    children: [
                        commentDetail,
                        serverDetail,
                        publishComment,
                        gamedown,
                    ],
                },
            ],
        },
        // 互动中心
        {
            path: 'interactioncenter',
            name: 'Interactioncenter',
            component: Interactioncenter,
        },
    ],
};
export const ERROR_OK = 0;
