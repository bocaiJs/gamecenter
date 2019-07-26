import MGame from 'components/m-game/game-index/game-index';
import MGameType from 'components/m-game/game-type/game-type';
import MSearch from 'components/m-search/m-search';
import MindexGameDetail from 'components/m-index-game-detail/m-index-game-detail';
import MindexGameCommentDetail from 'components/m-index-game-comment-detail/m-index-game-comment-detail';
import PublishCommentPage from '@/base/publishcomment/publishcomment';
import MindexRecentServe from 'components/m-index-recentserve/m-index-recentserve';
import MGameDown from 'components/m-game/game-down/game-down';

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

export const gameRouter = {
    path: '/gamemod',
    name: 'MGame',
    component: MGame,
    children: [
        {
            path: 'type/:id',
            name: 'MGameType',
            component: MGameType,
            children: [
                {
                    path: 'down',
                    component: MGameDown,
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
                    ],
                },
            ],
        },
    ],
};
export const ERROR_OK = 0;
