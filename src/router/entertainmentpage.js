
import MEntertainment from 'components/m-entertainment/entertainment-index/entertainment-index';
import MEntertainmentvideo from 'components/m-entertainment/entertainment-video/entertainment-video';
import MEntertainmentvideoDetail from 'components/m-entertainment/entertainment-video-detail/entertainment-video-detail';
import MEntertainmentvideoArticle from 'components/m-entertainment/entertainment-article/entertainment-article';
import MEntertainmentvideoArticleDetail from 'components/m-entertainment/entertainment-article-detail/entertainment-article-detail';
import MEntertainmentvideoHonour from 'components/m-entertainment/entertainment-honour/entertainment-honour';
import MEntertainmentSchool from 'components/m-entertainment/entertainment-school/entertainment-school';
import MEntertainmentExam from 'components/m-entertainment/entertainment-exam/entertainment-exam';
import MEntertainmentTV from 'components/m-entertainment/entertainment-tv/entertainment-tv';
import MEntertainmentAllVideo from 'components/m-entertainment/entertainment-videoall/entertainment-videoall';
import MEntertainmentZhuan from 'components/m-entertainment/entertainment-zhuan/entertainment-zhuan';

export const entertainmentRouter = {
    path: '/service',
    component: MEntertainment,
    children: [

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
                {
                    path: 'tv',
                    name: 'MEntertainmentTV',
                    component: MEntertainmentTV,
                },
                {
                    path: 'all',
                    name: 'MEntertainmentAllVideo',
                    component: MEntertainmentAllVideo,
                    children: [
                        {
                            path: 'detail',
                            name: 'allDetail',
                            component: MEntertainmentvideoDetail,
                        },
                    ],
                },
            ],
        },
        {
            path: 'article/:id',
            name: 'MEntertainmentvideoArticle',
            component: MEntertainmentvideoArticle,
            children: [
                {
                    path: 'detail',
                    name: 'MEntertainmentvideoArticleDetail',
                    component: MEntertainmentvideoArticleDetail,
                },
            ],
        },
        {
            path: 'honour',
            name: 'MEntertainmentvideoHonour',
            component: MEntertainmentvideoHonour,
        },
        {
            path: 'school',
            name: 'MEntertainmentSchool',
            component: MEntertainmentSchool,
            children: [
                {
                    path: 'exam',
                    name: 'MEntertainmentExam',
                    component: MEntertainmentExam,
                },
            ],
        },
        {
            path: 'luck',
            name: 'MEntertainmentZhuan',
            component: MEntertainmentZhuan,
        },
    ],
};
export const ERROR_OK = 0;
