<template>
    <transition name="slider">
        <div class="down">
            <m-header :canreturn=true :type='5' @edit='editGame' @server="selectItem" :edit="edit"></m-header>
            <div class="warpper" ref="downwrapper">
                <div class="down-ing" v-show="item === 0">
                    <div class="item" v-for="(task,index) in comtasks" :key="index" v-show="comtasks.length" v-if="task.state !==2">
                        <div :class="{gameicon:isedit}" @click="delTask(index)">
                            <img v-lazy="task.icon" alt="" class="">
                            <span class="close-messiong"></span>
                        </div>
                        <div class="precent">
                            <div class="box" :style="{width:task.precent+'%'}"></div>
                            <p>

                                <span>{{task.precent}}%</span>
                            </p>
                        </div>
                        <div class="ctrl">
                            <div v-if="task.rate === 100" class="anzhuang" @click="install(task)">安装</div>
                            <div v-else>
                                <span class="stop" v-show="task.isstart" @click="stop(index)"></span>
                                <span class="start" v-show="!task.isstart" @click="start(index)"></span>
                            </div>
                        </div>
                    </div>
                    <div class="nogametip" v-show="!comtasks.length">
                        <div class="gametipbg"></div>
                        <p>没有下载中的游戏~~</p>
                    </div>
                </div>
                <div class="install" v-show="item === 1">
                    <div class="item" v-for="(game,index) in downcomplete" :key="index" @click="openGame(game,index)" v-show="downcomplete.length">
                        <img v-lazy="game.icon" alt="">
                        <span class="close-messiong" v-show="isedit"></span>
                        <p>打开</p>
                    </div>
                    <div class="nogametip" v-show="!downcomplete.length">
                        <div class="gametipbg"></div>
                        <p>没有已安装的游戏~~</p>
                    </div>
                </div>
            </div>
        </div>
    </transition>
</template>

<script type="text/ecmascript-6">
import MHeader from '@/components/m-header/m-header';
import Scroll from '@/base/scroll/scroll';
import Loading from '@/base/loading/loading';
import { mapGetters, mapMutations } from 'vuex';
import { getLocalStorage } from 'common/js/storage';

export default {
    data() {
        return {
            item: 0,
            precent: 0,
            downGameTasks: [],
            downcomplete: [],
            gamelist: [],
            edit: true,
            isedit: false,
            flag: true,
        };
    },
    created() {
        this.enumerate();
    },
    mounted() {
        this.$refs.downwrapper.style.top = (44 + parseInt(this.statusbar)) + 'px';
    },
    methods: {
        selectItem(val) {
            let _this = this;
            this.item = val;
            if (val === 1) {
                console.log('展示完成游戏');
                // 获取本地头像数据
                if (this.flag) {
                    this.flag = false;
                    let avatar = getLocalStorage('icon');
                    //  解析头像对象
                    let avatarObject = avatar !== '' ? JSON.parse(avatar) : '';
                    plus.downloader.enumerate((tasks) => {
                        console.log('tasks--complate');
                        _this.downcomplete.push.apply(_this.downcomplete, tasks);
                        console.log(_this.downcomplete);
                        for (let i = 0; i < _this.downcomplete.length; i++) {
                            let gameName = _this.downcomplete[i].filename;
                            _this.$set(_this.downcomplete[i], 'icon', avatarObject[gameName].icon ? avatarObject[gameName].icon : '');
                            _this.$set(_this.downcomplete[i], 'pk_n', avatarObject[gameName].pk_n ? avatarObject[gameName].pk_n : '');
                        }
                    }, 4);
                }
            }
        },
        start(index) {
            this.gamelist[index].resume();
            this.$set(this.gamelist[index], 'isstart', true);
        },
        stop(index) {
            this.gamelist[index].pause();
            this.$set(this.gamelist[index], 'isstart', false);
        },
        delTask(index) {
            let taskCount = this.taskscount;
            console.log(index);
            console.log(this.gamelist[index]);
            this.gamelist[index].abort();
            this.gamelist.splice(index, 1);
            let done = this.done + 1;
            setTimeout(() => {
                this.setDone(done);
                this.setTasksCount(taskCount - 1);
            }, 200);
        },
        openGame(game, index) {
            if (this.isedit) {
                console.log('编辑');
                console.log(game);
                let done = this.done + 1;
                plus.nativeUI.confirm('确定删除任务吗?', (e) => {
                    if (e.index === 0) {
                        plus.io.resolveLocalFileSystemURL(game.filename, (entry) => {
                            console.log('删除文件成功');
                            entry.remove();
                            game.abort();
                        }, (error) => {
                            console.log(error);
                            console.log('删除文件失败');
                            game.abort();
                        });
                        this.downcomplete.splice(index, 1);
                        this.setDone(done);
                    }
                }, { title: '确认删除' });
                console.log(game.filename);
            } else {
                if (plus.runtime.isApplicationExist({ pname: game.pk_n })) {
                    //  安装=>启动应用
                    console.log('打开应用');
                    if (plus.os.name === 'Android') {
                        plus.runtime.launchApplication({
                            pname: game.pk_n,
                        }, () => {
                            console.log('打开失败');
                        });
                    }
                } else {
                    console.log('安装');
                    this.install(game);
                }
            }
        },
        install(game) {
            plus.runtime.install(game.filename, {}, () => {
                console.log('安装成功');
            }, (error) => {
                console.log('安装失败');
                console.log(error);
            });
        },
        enumerate() {
            let _this = this;
            console.log('进入');
            // 获取本地头像数据
            let avatar = getLocalStorage('icon');
            //  解析头像对象
            let avatarObject = avatar !== '' ? JSON.parse(avatar) : '';
            plus.downloader.enumerate((tasks) => {
                console.log('tasks--nullargs');
                console.log(tasks);
                let done = this.done + 1;
                _this.gamelist = tasks;
                for (let i = 0; i < _this.gamelist.length; i++) {
                    let gameName = _this.gamelist[i].filename;
                    console.log(_this.gamelist[i]);
                    console.log(_this.gamelist[i].filename);
                    console.log(gameName);
                    _this.$set(_this.gamelist[i], 'icon', avatarObject[gameName] && avatarObject[gameName].icon ? avatarObject[gameName].icon : '');
                    if (_this.gamelist[i].state === 2) {
                        console.log('状态2');
                        if (_this.gamelist[i].totalSize === _this.gamelist[i].downloadedSize) {
                            console.log('大小也相等');
                            console.log(tasks[i]);
                            _this.flag = true;
                            _this.downcomplete = [];
                            _this.downcomplete.push(_this.gamelist[i]);
                        }
                    }
                    if (_this.gamelist[i].state === 3) {
                        _this.gamelist[i].pause();
                        _this.gamelist[i].addEventListener('statechanged', (task) => {
                            switch (task.state) {
                                case 4:
                                    console.log('下载完成');
                                    this.setDone(done);
                                    console.log('#######');
                                    this.enumerate();
                                    break;
                            }
                        });
                        _this.gamelist[i].resume();
                        _this.$set(_this.gamelist[i], 'isstart', true);
                    }
                    if (_this.gamelist[i].state === 5) {
                        // _this.$set(_this.gamelist[i], 'rate', Math.ceil(task.downloadedSize / task.totalSize * 100));
                        _this.$set(_this.gamelist[i], 'isstart', false);
                    }
                }
            });
        },
        editGame(val) {
            console.log(val);
            this.isedit = val;
        },
        ...mapMutations([
            'setDone',
            'setTasksCount',
        ]),
    },
    computed: {
        comtasks() {
            for (let i = 0; i < this.gamelist.length; i++) {
                if (this.gamelist[i].totalSize === 0) {
                    console.log('对对对');
                    this.$set(this.gamelist[i], 'precent', 0);
                } else {
                    this.$set(this.gamelist[i], 'precent', Math.ceil(this.gamelist[i].downloadedSize / this.gamelist[i].totalSize * 100) > 100 ? 100 : Math.ceil(this.gamelist[i].downloadedSize / this.gamelist[i].totalSize * 100));
                }
            }
            return this.gamelist;
        },
        ...mapGetters(['downgames', 'statusbar', 'done', 'taskscount']),
    },
    components: {
        MHeader,
        Scroll,
        Loading,
    },
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~common/stylus/variable';
@import '~common/stylus/mixin';

slider();

@keyframes mymove {
    0% {
        transform: rotate(0deg);
        transform-origin: center;
    }

    25% {
        transform: rotate(-5deg);
        transform-origin: center;
    }

    50% {
        transform: rotate(0deg);
        transform-origin: center;
    }

    75% {
        transform: rotate(8deg);
        transform-origin: center;
    }

    100% {
        transform: rotate(0deg);
    }
}

.down {
    position: fixed;
    width: 100%;
    top: 0;
    bottom: 0;
    background: #ffffff;
    z-index: 20;

    .warpper {
        sub-position();
        z-index: 20;

        .down-ing {
            width: 100%;

            .nogametip {
                width: 100%;

                .gametipbg {
                    margin: 0 auto;
                    width: 153px;
                    height: 191px;
                    margin-top: 150px;
                    background: url('./xiazaizhong@3x.png') no-repeat;
                    background-size: 153px 191px;
                }

                p {
                    text-align: center;
                    font-size: 16px;
                    color: #999999;
                    margin-top: 12px;
                }
            }

            .item {
                display: flex;
                align-items: center;
                padding: 15px;
                border-bottom: 1px solid #eeeeee;
                position: relative;

                .gameicon {
                    position: relative;

                    // animation: mymove 200ms infinite;
                    .close-messiong {
                        width: 20px;
                        height: 20px;
                        position: absolute;
                        right: 0;
                        top: 0;
                        background: red;
                        background: url('./shanchu@3x.png') no-repeat;
                        background-size: 20px 20px;
                    }
                }

                .precent {
                    height: 15px;
                    width: 65%;
                    box-sizing: border-box;
                    border: 1px solid #dea303;
                    border-radius: 15px;
                    margin-left: 15px;
                    position: relative;

                    .box {
                        width: 0;
                        height: 100%;
                        border-radius: 15px;
                        background: linear-gradient(#fbe098, #f8b500, #fad56e);
                    }

                    p {
                        position: absolute;
                        top: -14px;
                        right: 0;
                        font-size: 12px;
                        color: #999999;

                        span {
                            color: #222222;
                        }
                    }
                }

                .ctrl {
                    position: absolute;
                    right: 15px;
                    height: 50px;
                    top: 15px;
                    width: 10%;
                    display: flex;
                    justify-content: center;
                    align-items: center;

                    .anzhuang {
                        width: 36px;
                        height: 18px;
                        font-size: 12px;
                        background: #ffc400;
                        color: #ffffff;
                        text-align: center;
                        line-height: 18px;
                        border-radius: 9px;
                    }

                    span {
                        display: block;
                        height: 20px;
                        width: 20px;
                        background-size: 100% 100%;

                        &.stop {
                            bg-image('stop');
                        }

                        &.start {
                            bg-image('startdown');
                        }
                    }
                }

                img {
                    display: block;
                    width: 50px;
                    height: 50px;
                    border-radius: 5px;
                }
            }
        }

        .install {
            padding: 0 15px;
            display: flex;
            flex-wrap: wrap;

            .nogametip {
                width: 100%;

                .gametipbg {
                    margin: 0 auto;
                    width: 158px;
                    height: 175px;
                    margin-top: 150px;
                    background: url('./yianzhuang@3x.png') no-repeat;
                    background-size: 158px 175px;
                }

                p {
                    text-align: center;
                    font-size: 16px;
                    color: #999999;
                    margin-top: 12px;
                }
            }

            .item {
                width: 32%;
                background: red;
                margin-right: 2%;
                padding: 15px;
                padding-bottom: 41px;
                margin-top: 15px;
                box-sizing: border-box;
                background: #eeeeee;
                border: 1px solid #cccccc;
                border-bottom: none;
                border-radius: 5px;
                text-align: center;
                position: relative;

                img {
                    width: 100%;
                    display: block;
                    border-radius: 10px;
                }

                .close-messiong {
                    width: 20px;
                    height: 20px;
                    position: absolute;
                    right: 5px;
                    top: 5px;
                    background: red;
                    background: url('./shanchu@3x.png') no-repeat;
                    background-size: 20px 20px;
                }

                &:nth-child(3n+0) {
                    margin-right: 0;
                }

                p {
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    width: 100%;
                    height: 26px;
                    line-height: 26px;
                    text-align: center;
                    background: #ffc400;
                    border-bottom-left-radius: 5px;
                    border-bottom-right-radius: 5px;
                    color: #ffffff;
                }
            }
        }
    }
}
</style>
