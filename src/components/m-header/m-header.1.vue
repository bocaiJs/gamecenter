<template>
    <div class="m-header" ref="indexheader">
        <!-- type=1,只显示标题 -->
        <h1 class="text" v-if="type === 1">{{titleText}}</h1>
        <h1 class="text-left" v-if="type === 8">{{titleText}}</h1>
        <!-- type=2 显示搜索框 -->
        <div class="search" v-if="type === 2">
            <input type="text" :placeholder="keyword " ref="searchContent">
            <div class="search-btn " @click="startSearch">
                <i class="icon-search "></i>
            </div>
        </div>
        <!-- type=3 显示开服信息 -->
        <div class="serveinfo " v-if="type===3 ">
            <div class="s-i-w ">
                <div class="s-i-item" :class="{ active: selectItem ===0 }" @click="getitem(0)">今日新服</div>
                <div class="s-i-item" :class="{ active: selectItem ===1 }" @click="getitem(1)">新服预告</div>
            </div>
        </div>
        <!-- type=4 显示积分信息 -->
        <div class="serveinfo " v-if="type===4">
            <div class="s-i-w ">
                <div class="s-i-item" :class="{ active: selectItem ===0 }" @click="getitem(0)">积分记录</div>
                <div class="s-i-item" :class="{ active: selectItem ===1 }" @click="getitem(1)">兑换记录</div>
            </div>
        </div>
        <!-- type=5 显示下载信息 -->
        <div class="serveinfo " v-if="type===5">
            <div class="s-i-w ">
                <div class="s-i-item" :class="{ active: selectItem ===0 }" @click="getitem(0)">下载中</div>
                <div class="s-i-item" :class="{ active: selectItem ===1 }" @click="getitem(1)">已下载</div>
            </div>
        </div>
        <!-- type=6 显示榜单 -->
        <div class="serveinfo " v-if="type===6">
            <div class="s-i-w ">
                <div class="s-i-item" :class="{ active: selectItem ===0 }" @click="getitem(0)">荣耀星将</div>
                <div class="s-i-item" :class="{ active: selectItem ===1 }" @click="getitem(1)">智力榜</div>
            </div>
        </div>
        <div class="mine " @click="back " v-if="canreturn ">
            <i class="icon-mine "></i>
            <i class="task">{{taskCount}}</i>
        </div>
        <div class="mine " @click="downGame" v-if="beforedown">
            <i class="icon-mine down ">
                <span class="taskcount" v-show="taskscount">{{taskscount}}</span>
            </i>

        </div>
        <div class="searchpage " @click="goSearchPage " v-if="search ">
            <i class="search "></i>
        </div>
        <div class="publish " @click="onPublish" v-if="publish ">
            发表
        </div>
        <div class="publish " @click="onConfirm" v-if="confirm">
            确定
        </div>
        <div class="publish  small" @click="onConfirm" v-if="empty" style="font-size:12px;width:60px;">
            清空已读
        </div>
        <div class="publish  small" @click="onEdit" v-if="edit" style="font-size:16px" ref="edit">
            <span v-show="!isedit">编辑</span>
            <span v-show="isedit">取消</span>
        </div>
        <div class="publish" @click="onConfirm" v-if="down">
            <span class="down"></span>
        </div>
        <div class="publish" @click="onConfirm" v-if="exchange">
            <span class="wen"></span>
        </div>
    </div>
</template>

<script type="text/ecmascript-6">
import { mapMutations, mapGetters } from 'vuex';

export default {
    props: {
        type: {
            type: Number,
            default: 1,
        },
        titleText: {
            type: String,
            default: '天橙游玩',
        },
        canreturn: {
            type: Boolean,
            default: false,
        },
        search: {
            type: Boolean,
            default: false,
        },
        publish: {
            type: Boolean,
            default: false,
        },
        confirm: {
            type: Boolean,
            default: false,
        },
        keyword: {
            type: String,
            default: '',
        },
        empty: {
            type: Boolean,
            default: false,
        },
        down: {
            type: Boolean,
            default: false,
        },
        beforedown: {
            type: Boolean,
            default: false,
        },
        edit: {
            type: Boolean,
            default: false,
        },
        taskCount: {
            type: Number,
            default: 0,
        },
        exchange: {
            type: Boolean,
            default: false,
        },
        backType: {
            type: Number,
            default: 1,
        },
    },
    mounted() {
        let immersed = 0;
        let ms = (/Html5Plus\/.+\s\(.*(Immersed\/(\d+\.?\d*).*)\)/gi).exec(navigator.userAgent);
        if (ms && ms.length >= 3) {
            immersed = parseFloat(ms[2]);
            this.setStatusBar(immersed);
            this.$refs.indexheader.style.paddingTop = immersed + 'px';
        }
        this.backtime = this.$route.query.backtime;
    },
    data() {
        return {
            selectItem: 0,
            isedit: false,
        };
    },
    methods: {
        back() {
            if (this.backType === 1) {
                if (this.backtime === undefined || this.backtime === null || this.backtime === '') {
                    console.log('后退一页');
                    this.$router.back();
                } else {
                    console.log('后退两页');
                    this.$router.go(-2);
                }
            } else {
                this.$emit('back');
            }
        },
        goSearchPage() {
            // this.$router.push('/index/search');
            this.$emit('search');
        },
        getitem(item) {
            //  item =0:选中第一个 item=1:选中第二个
            this.selectItem = item;
            this.$emit('server', this.selectItem);
        },
        startSearch() {
            const searchVal = this.$refs.searchContent.value;
            this.$emit('search', searchVal);
        },
        onPublish() {
            this.$emit('publish');
        },
        onConfirm() {
            this.$emit('confirm');
        },
        onEdit() {
            this.isedit = !this.isedit;
            this.$emit('edit', this.isedit);
        },
        downGame() {
            this.$emit('downgame');
        },
        ...mapMutations([
            'setStatusBar',
        ]),

    },
    computed: {
        ...mapGetters(['taskscount']),
    },
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~common/stylus/variable';
@import '~common/stylus/mixin';

.m-header {
    position: relative;
    height: 44px;
    width: 100%;
    text-align: center;
    color: $color-theme;
    font-size: 0;
    background: linear-gradient(#7aeed2, #5ed9f5, #5ed9f5);
    background: -webkit-linear-gradient(left, #7aeed2, #5ed9f5, #5ed9f5);

    .search {
        height: 100%;
        width: 70%;
        margin: 0 auto;
        position: relative;

        input {
            width: 100%;
            height: 28px;
            line-height: 28px;
            margin-top: 9px;
            border-radius: 15px;
            font-size: $font-size-medium-x;
            font-weight: 500;
            font-family: 'PingFang SC', 'STHeitiSC-Light', 'Helvetica-Light', arial, sans-serif, 'Droid Sans Fallback';
            outline: none;
            border: 1px solid #baf4ed;
            text-indent: 15px;
            color: #fff;
            background: transparent;

            &::-webkit-input-placeholder {
                color: #ffffff;
                opacity: 0.5;
            }
        }

        .search-btn {
            position: absolute;
            right: 12px;
            top: 11px;
            height: 26px;
            width: 26px;

            .icon-search {
                display: block;
                height: 16px;
                width: 16px;
                margin-left: 5px;
                margin-top: 5px;
                bg-image('search');
                background-size: 16px 16px;
            }
        }
    }

    .text {
        display: inline-block;
        vertical-align: top;
        line-height: 44px;
        font-weight: bold;
        font-size: $font-size-large;
    }

    .text-left {
        font-size: $font-size-medium-x;
        color: #fefefe;
        width: 100%;
        line-height: 44px;
        text-align: left;
        text-indent: 30px;
    }

    .mine {
        position: absolute;
        bottom: 0;
        left: 0;
        width: 50px;
        height: 44px;

        .icon-mine {
            display: block;
            height: 16px;
            width: 9px;
            margin-top: 14px;
            margin-left: 12px;
            bg-image('../../common/image/back/back');
            background-size: 9px 16px;
            translate: sacle(1.5);

            &.down {
                bg-image('down');
                width: 20px;
                height: 20px;
                background-size: 20px 20px;
                margin-top: 10px;
                transform: scale(1);
                position: relative;

                .taskcount {
                    font-size: 12px;
                    text-align: center;
                    position: absolute;
                    right: -10px;
                    display: block;
                    width: 14px;
                    height: 14px;
                    line-height: 12px;
                    border-radius: 50%;
                    background: red;
                    color: #ffffff;
                }
            }
        }
    }

    .searchpage {
        position: absolute;
        bottom: 0;
        right: 5px;
        width: 44px;
        height: 44px;

        .search {
            height: 20px;
            width: 20px;
            display: block;
            margin-top: 10px;
            bg-image('search');
            background-size: 20px 20px;
        }
    }

    .publish {
        position: absolute;
        bottom: 0;
        right: 5px;
        width: 44px;
        height: 44px;
        font-size: 16px;
        color: #ffffff;
        line-height: 44px;
        text-align: center;
        display: flex;
        align-items: center;
        justify-content: center;

        .down {
            display: block;
            height: 20px;
            width: 20px;
            bg-image('down');
            background-size: 20px 20px;
        }

        .wen {
            display: block;
            height: 20px;
            width: 20px;
            background: url('./wen@3x.png') no-repeat;
            background-size: 20px 20px;
        }

        &.small {
            font-size: 12px;
        }
    }

    .serveinfo {
        width: 50%;
        height: 100%;
        margin: 0 auto;
        padding-top: 5px;

        .s-i-w {
            height: 34px;
            width: 100%;
            background: #b5f1f2;
            border-radius: 17px;
            padding: 2px;
            display: flex;
            flex-wrap: nowrap;
            position: relative;

            .s-i-item {
                width: 50%;
                height: 100%;
                border-radius: 17px;
                font-size: $font-size-medium-x;
                line-height: 34px;
                text-align: center;

                &.active {
                    background: #ffffff;
                    color: #58d2ec;
                }
            }
        }
    }
}
</style>
