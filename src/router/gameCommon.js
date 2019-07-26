import MindexGameCommentDetail from 'components/m-index-game-comment-detail/m-index-game-comment-detail';
import PublishCommentPage from '@/base/publishcomment/publishcomment';
import MGameDown from 'components/m-game/game-down/game-down';
import MindexRecentServe from 'components/m-index-recentserve/m-index-recentserve';


export const commentDetail = {
    path: 'comment/:commentid',
    component: MindexGameCommentDetail,
};
export const serverDetail = {
    path: 'newserver',
    component: MindexRecentServe,
};
export const publishComment = {
    path: 'publish',
    component: PublishCommentPage,
};
export const gamedown = {
    path: 'down',
    component: MGameDown,
};
