import Vue from 'vue';
import Router from 'vue-router';
import Mlogin from 'base/account/login/login';
import MForgetPassword from 'base/account/forgetpassword/forgetpassword';
import MRegister from 'base/account/register/register';
import MSearch from 'components/m-search/m-search';
// 圈子首页
import MEntertainment from 'components/m-entertainment/entertainment-index/entertainment-index';
// 游戏详情页
import MindexGameDetail from 'components/m-index-game-detail/m-index-game-detail';
// 游戏评论详情页
import MindexGameCommentDetail from 'components/m-index-game-comment-detail/m-index-game-comment-detail';
// 游戏排行
import MRank from 'components/m-honour/m-honour';
// 游戏排行提示页面
import Tips from '@/base/tips/tips';
// 小天学堂提示页面
import SchoolTips from '@/base/tips/schoolTips';
// 主播列表页面
import Anchor from 'components/m-entertainment/entertainment-anchor/anchor';
// 视频列表
import MEntertainmentvideo from 'components/m-entertainment/entertainment-video/entertainment-video';
// 娱乐文章列表
import MEntertainmentArticle from 'components/m-entertainment/entertainment-article/entertainment-article';
// 小天学堂
import MEntertainmentSchool from 'components/m-entertainment/entertainment-school/entertainment-school';
// 答题页面
import MEntertainmentExam from 'components/m-entertainment/entertainment-exam/entertainment-exam';
// 文章详情页
import NoticeDetail from 'components/m-index-notice-detail/m-index-notice-detail';
import MEntertainmentDetail from 'components/m-index-notice-detail/enter-notice-detai';
// 评论页
import PublishComment from '@/base/publishcomment/publishcomment';
// 视频详情页
import MEntertainmentvideoDetail from 'components/m-entertainment/entertainment-video-detail/entertainment-video-detail';
// 主播页面
import MEntertainmentTV from 'components/m-entertainment/entertainment-tv/entertainment-tv';
// 抽奖详情
import MEntertainmentZhuan from 'components/m-entertainment/entertainment-zhuan/entertainment-zhuan';
// 游戏下载页
import GameDown from 'components/m-game/game-down/game-down';


import { indexRouter } from './indexpage';
import { mineRouter } from './minepage';
import { gameRouter } from './gamepage';
import { shopRouter } from './shoppage';
// import { entertainmentRouter } from './entertainmentpage';
Vue.use(Router);

export default new Router({
    mode: 'hash',
    routes: [
        {
            path: '/',
            redirect: '/index',
        },
        {
            path: '/search',
            name: 'GameSearch',
            component: MSearch,
        },
        {
            path: '/down',
            name: 'GameDown',
            component: GameDown,
        },
        {
            path: '/service',
            name: 'Mservice',
            component: MEntertainment,
            children: [
                // 学堂页面
                {
                    path: 'school',
                    name: 'MEntertainmentSchool',
                    component: MEntertainmentSchool,
                    children: [
                        {
                            path: 'exam',
                            name: 'Eaxm',
                            component: MEntertainmentExam,
                        },
                        {
                            path: 'tips',
                            name: 'SchoolTips',
                            component: SchoolTips,
                        },
                    ],
                },
                // 主播列表页
                {
                    path: 'anchor',
                    name: 'Anchor',
                    component: Anchor,
                    children: [
                        {
                            path: 'tv',
                            name: 'MEntertainmentTV',
                            component: MEntertainmentTV,
                        },
                    ],
                },
                {
                    path: 'tv',
                    name: 'MEntertainmentTV',
                    component: MEntertainmentTV,
                },
                {
                    path: 'luck',
                    name: 'MEntertainmentZhuan',
                    component: MEntertainmentZhuan,
                },
                // 视频列表 MEntertainmentvideo
                {
                    path: 'video',
                    name: 'MEntertainmentvideo',
                    component: MEntertainmentvideo,
                    children: [
                        {
                            path: 'detail',
                            name: 'MEntertainmentvideoDetail',
                            component: MEntertainmentvideoDetail,
                        },
                    ],
                },
                // 娱乐文章列表 MEntertainmentArticle
                {
                    path: 'article/:type',
                    name: 'MEntertainmentArticle',
                    component: MEntertainmentArticle,
                    children: [
                        {
                            path: 'vd',
                            name: 'MEntertainmentvideoDetail',
                            component: MEntertainmentvideoDetail,
                        },
                    ],
                },
            ],
        },
        // {
        //     path: '/gamedetail/:gameid',
        //     name: 'GameDetail',
        //     component: MindexGameDetail,
        // },
        // 游戏详情页
        {
            path: '/gamedetail/:gameid',
            name: 'GameDetail',
            component: MindexGameDetail,
            children: [
                {
                    path: 'comment/:commentId',
                    name: 'Gamecomment',
                    component: MindexGameCommentDetail,
                },
                {
                    path: 'publish',
                    name: 'PublishComment',
                    component: PublishComment,
                },
                {
                    path: 'down',
                    name: 'GameDown',
                    component: GameDown,
                },
                {
                    path: 'h5',
                    name: 'H5Game',
                    component: MEntertainmentTV,
                },
                {
                    path: 'giftlist',
                    name: 'GiftList',
                    component: () => import('components/m-index-giftlist/m-index-giftlist'),
                },
                {
                    path: 'ticketlist',
                    name: 'TicketList',
                    component: () => import('components/m-index-ticketlist/m-index-ticketlist'),
                },
            ],
        },
        // 文章详情页 NoticeDetail
        // path: 'articledetail/:newsId',
        {
            path: '/articledetail/:newsId',
            name: 'articledetail',
            component: NoticeDetail,
        },
        {
            // MEntertainmentDetail
            path: '/enterdetail/:newsId/:type',
            name: 'MEntertainmentDetail',
            component: MEntertainmentDetail,
        },
        // 游戏评论详情页 MindexGameCommentDetail
        // {
        //     path: '/gamecomment/:commentId',
        //     name: 'Gamecomment',
        //     component: MindexGameCommentDetail,
        // },
        // 排行页面
        {
            path: '/rank',
            name: 'Rank',
            component: MRank,
            children: [
                {
                    path: 'tips',
                    name: 'Tips',
                    component: Tips,
                },
            ],
        },

        indexRouter,
        gameRouter,
        mineRouter,
        shopRouter,
        // entertainmentRouter,
        {
            path: '/login',
            name: 'Mlogin',
            component: Mlogin,
            children: [
                {
                    path: 'forgetpassword',
                    name: 'MForgetPassword',
                    component: MForgetPassword,
                },
                {
                    path: 'register',
                    name: 'MRegister',
                    component: MRegister,
                    children: [
                        {
                            path: 'agreement',
                            name: 'Magreement',
                            component: MEntertainmentTV,
                        },
                    ],
                },
            ],
        },
    ],
});
