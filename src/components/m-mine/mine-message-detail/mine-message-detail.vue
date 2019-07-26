<template>
    <transition name="slider">
        <div class="message-detail">
            <m-header :canreturn=true :titleText="titleText"></m-header>
            <div class="m-d-box" ref="mdbox">
                <scroll class="m-d-warpper">
                    <div>
                        <div class="m-d-content">
                            <div class="desc">
                                <span class="logo"></span>
                                <p style="font-size:14px;margin:0 10px;color:#777777"> 天橙游玩</p>
                                <p style="font-size:12px;color:#999999">{{$route.query.created_at}}</p>
                            </div>
                            <div class="detail">
                                {{$route.query.message}}
                            </div>
                        </div>
                    </div>
                </scroll>
            </div>
        </div>
    </transition>
</template>

<script type="text/ecmascript-6">
import MHeader from '@/components/m-header/m-header';
import Scroll from '@/base/scroll/scroll';
import { getCommonInfoHasData } from '@/base/api/indexpage/getindexinfo';
import { mapGetters } from 'vuex';

export default {
    data() {
        return {
            titleText: '我的消息',
        };
    },
    created() {
        this._getMessageDetail();
    },
    mounted() {
        this.$refs.mdbox.style.top = (44 + parseInt(this.statusbar)) + 'px';
        console.log(this.$refs.mdbox.style.top);
    },
    methods: {
        _getMessageDetail() {
            console.log(this.$route.params.id);
            const addre = `/user/notice/read/${this.$route.params.id}`;
            getCommonInfoHasData(addre, {
                token: this.getToken,
                id: this.$route.params.id,
            }).then((res) => {
                console.log(res);
            });
        },
    },
    components: {
        MHeader,
        Scroll,
    },
    computed: {
        ...mapGetters(['getToken', 'statusbar']),
    },
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~common/stylus/variable';
@import '~common/stylus/mixin';

slider();

.message-detail {
    position: fixed;
    width: 100%;
    top: 0;
    bottom: 0;
    background: #ffffff;

    .m-d-box {
        sub-position();

        .m-d-warpper {
            height: 100%;
            overflow: hidden;

            .m-d-content {
                padding: 0 15px;
                padding-top: 40px;

                .desc {
                    display: flex;
                    align-items: center;

                    .logo {
                        display: block;
                        height: 28px;
                        width: 28px;
                        border-radius: 50%;
                        bg-image('logio');
                        background-size: 100% 100%;
                    }
                }

                .detail {
                    margin-top: 10px;
                    color: #555555;
                    font-size: $font-size-medium;
                    line-height: 28px;
                }
            }
        }
    }
}
</style>
