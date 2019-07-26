import Vue from 'vue';
import MHeader from 'components/m-header/m-header';
import BackIcon from './icon_widget/arrow_back';
import SearchIcon from './icon_widget/search_info';
import MaskCommon from './maskcommon/maskcommon';
import MaskGame from './maskcommon/maskforgame';
import Scroll from './scroll/scroll';
import LoadingMore from './loadingmore/loading';
import Loading from './loading/loading';
import ErrorTips from './errortipwidget/errortipwidget';
import MaskTip from './maskcommon/maskforTip';

const components = [
    MHeader,
    BackIcon,
    SearchIcon,
    MaskCommon,
    MaskGame,
    Scroll,
    LoadingMore,
    Loading,
    ErrorTips,
    MaskTip,
];

// 将所有组件保存到vue上后面在页面上可以直接用组件name调用
for (let i = 0; i < components.length; i++) {
    Vue.component(components[i].name, components[i]);
}

