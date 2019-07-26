
import MShop from 'components/m-shop/shop-index/shop-index';
import MShopShowinfo from 'components/m-shop/shop-showinfo/shop-showinfo';
import MShopExchange from 'components/m-shop/shop-exchange/shop-exchange';
import MShopSearch from 'components/m-shop/shop-search/shop-search';
import MShopDetail from 'components/m-shop/shop-detail/shop-detail';
// import MineScore from 'components/m-mine/mine-score/mine-score';

export const shopRouter = {
    path: '/shop',
    name: 'MShop',
    component: MShop,
    children: [
        {
            path: 'about',
            component: MShopShowinfo,
        },
        {
            path: 'exchangerank',
            component: MShopExchange,
        },
        {
            path: 'search',
            component: MShopSearch,
        },
        {
            path: 'detail/:id',
            component: MShopDetail,
            children: [
                {
                    path: 'about',
                    component: MShopShowinfo,
                },
            ],
        },
        {
            path: 'allgoods',
            name: 'allgoods',
            component: () => import('components/m-shop/allGoods/allGoods'),
        },
        {
            path: 'subtype/:id',
            name: 'subtype',
            component: () => import('components/m-shop/subTypeList/subTypeList'),
        },
        {
            path: 'score',
            name: 'shop-score',
            component: () => import('components/m-shop/score-detail/scoredetail'),
        },
        {
            path: 'exchangerecord',
            name: 'shop-exchangerecord',
            component: () => import('components/m-shop/ecxhange-record/exchangerecord'),
        },
        {
            path: 'mission',
            name: 'shop-mission',
            component: () => import('components/m-shop/score-mission/scoremission'),
        },
    ],
};
export const ERROR_OK = 0;
