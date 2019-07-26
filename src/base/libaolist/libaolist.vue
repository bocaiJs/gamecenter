<template>
    <div class="libao-item-list">
        <h3 class="game-type" @click='back'>{{giftList.title}}</h3>
        <div class="item" v-for="(item,index) in giftList.list" :key=index>
            <div class="item-link">
                <div class="icon">
                    <img v-lazy="item.icon" alt="">
                </div>
                <div class="item-content">
                    <h3>{{item.title}}</h3>
                    <p>剩余:{{item.per}} &nbsp;&nbsp;所需积分:{{item.score}}</p>
                    <p class="libaodate">{{item.end_time}}</p>
                </div>
            </div>
            <p class="libaodesc">{{item.description}}</p>
            <button class="downbtn" @click="getGift(item.id)">领取</button>
        </div>
    </div>
</template>

<script type="text/ecmascript-6">
export default {
    props: {
        giftList: {
            type: Object,
        },
    },
    data() {
        return {
            gift: {},
        };
    },
    methods: {
        back() {
            console.log(this.giftList);
        },
        getGift(giftId) {
            this.$emit('getGift', giftId);
        },
    },
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~common/stylus/variable';
@import '~common/stylus/mixin';

.libao-item-list {
    width: 100%;
    box-shadow: 0 2px 2px #d1d0d0;
    background: #ffffff;
    box-sizing: border-box;
    min-height: 150px;
    margin-bottom: 16px;

    h3 {
        padding: 15px 0;
        color: #222222;
        font-weight: bold;
        position: relative;

        &.game-type {
            text-indent: 16px;
            padding: 15px 15px 15px 12px;

            &:before {
                content: '';
                display: block;
                width: 8px;
                height: 16px;
                background: $color-header-bg;
                position: absolute;
                top: 14px;
                left: 10px;
                border-radius: 8px 0 0 8px; /* 左上、右上、右下、左下 */
            }
        }
    }

    .item {
        display: block;
        padding-top: 1px;
        box-sizing: border-box;
        position: relative;
        text-decoration: none;
        box-shadow: 0 2px 5px #d1d0d0;
        margin-bottom: 10px;

        .item-link {
            display: block;
            min-height: 90px;

            .icon {
                height: 70px;
                position: absolute;
                left: 10px;
                top: 9px;

                img {
                    height: 100%;
                }
            }

            .item-content {
                max-height: 100%;
                margin-left: 100px;

                h3 {
                    font-size: $font-size-large;
                    margin: 0;
                    padding: 15px 0 0 0;
                    color: #333333;
                }

                p {
                    font-size: $font-size-medium;
                    margin-top: 6px;

                    &.libaodate {
                        color: $color-header-bg;
                    }
                }
            }
        }

        .libaodesc {
            border-top: 1px solid #eeeeee;
            line-height: 30px;
            box-sizing: border-box;
            padding: 0 10px;
        }

        .type {
            margin-top: 6px;

            .game-desc {
                width: 30px;
                height: 15px;
                border: 1px solid #febf01;
                border-radius: 5px;
                font-size: 12px;
                color: #febf01;
                padding: 2px 4px;
            }
        }

        .downbtn {
            position: absolute;
            right: 15px;
            top: 30px;
            downloadbtn();
        }
    }
}
</style>
