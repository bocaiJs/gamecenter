
import MIndex from 'components/m-index/m-index';
import MIndexLibao from 'components/m-index-libao/m-index-libao';
import MSearch from 'components/m-search/m-search';
import MIndexNotice from 'components/m-index-notice/m-index-notice';
import MindexNoticeDetail from 'components/m-index-notice-detail/m-index-notice-detail';
import MindexPaihang from 'components/m-index-paihang/m-index-paihang';
import MindexGameDetail from 'components/m-index-game-detail/m-index-game-detail';
import MindexGameCommentDetail from 'components/m-index-game-comment-detail/m-index-game-comment-detail';
import PublishCommentPage from '@/base/publishcomment/publishcomment';
import MGameDown from 'components/m-game/game-down/game-down';
import MindexRecentServe from 'components/m-index-recentserve/m-index-recentserve';


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
    component: MGameDown,
};
export const indexRouter = {
    path: '/index',
    name: 'MIndex',
    component: MIndex,
    children: [
        {
            path: '/game/:gameid',
            component: MindexGameDetail,
        },
        {
            path: 'gamedetail/:gameid',
            component: MindexGameDetail,
            children: [
                commentDetail,
                {
                    path: 'download',
                    component: MGameDown,
                    name: 'DownPage',
                },
            ],
        },
        {
            path: 'libao',
            name: 'MIndexLibao',
            component: MIndexLibao,
        },
        {
            path: 'down',
            component: MGameDown,
        },
        {
            path: 'search',
            name: 'MSearch',
            component: MSearch,
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
            path: 'notice',
            name: 'MIndexNotice',
            component: MIndexNotice,
            children: [
                {
                    path: 'detail/:newsId',
                    name: 'MindexNoticeDetail',
                    component: MindexNoticeDetail,
                },
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
            path: 'paihang',
            name: 'MindexPaihang',
            component: MindexPaihang,
            children: [
                {
                    path: 'gamedetail/:gameid',
                    name: 'MindexGameDetail',
                    component: MindexGameDetail,
                    children: [
                        commentDetail,
                        serverDetail,
                        publishComment,
                        gamedown,
                    ],
                },
                {
                    path: 'search',
                    component: MSearch,
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
            ],
        },
        {
            path: 'kaifu',
            name: 'MindexRecentServe',
            component: MindexRecentServe,
            children: [
                {
                    path: 'gamedetail/:gameid',
                    component: MindexGameDetail,
                    children: [
                        commentDetail,
                        serverDetail,
                        publishComment,
                    ],
                },
            ],
        },
    ],
};
export const ERROR_OK = 0;
