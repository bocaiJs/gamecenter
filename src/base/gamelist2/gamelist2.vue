<template>
    <div class="s-d-game-item">
        <div class="item" :key=game.id @click="goGame(game.id)">
            <div>
                <div class="icon">
                    <img v-lazy="game.icon" alt="">
                </div>
                <div class="item-content">
                    <h3>{{game.name}}
                        <span class="discount">{{game.discount}}折</span>
                    </h3>
                    <div class="star">
                        <div class="star-wrapper">
                            <span class="star-icon" :style="{ width: game.star*20+'%' }"></span>
                        </div>
                        <p class="score">{{game.size}}</p>
                        <div class="type">
                            <span class="game-desc" v-for="(type,index) in game.tagNames" :key=index>{{type}}</span>
                        </div>
                    </div>
                </div>
            </div>
            <button class="downbtn">详情</button>
        </div>
    </div>
</template>

<script type="text/ecmascript-6">
export default {
    props: {
        game: {
            type: Object,
        },
    },
    methods: {
        goGame(id) {
            this.$emit('gamedetail', id);
        },
    },
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~common/stylus/variable';
@import '~common/stylus/mixin';

.s-d-game-item {
    padding: 15px 15px;

    .item {
        display: block;
        height: 100px;
        padding-top: 1px;
        box-sizing: border-box;
        position: relative;
        text-decoration: none;
        border-bottom: 1px solid #eeeeee;

        .icon {
            height: 80px;
            position: absolute;
            left: 0;
            top: 9px;

            img {
                height: 100%;
            }
        }

        .item-content {
            margin-left: 100px;

            h3 {
                font-size: $font-size-large;
                margin: 0;
                color: #333333;
                padding: 10px 0 0 0;
                display: flex;
                align-items: center;

                .discount {
                    box-sizing: border-box;
                    padding-left: 7px;
                    font-size: 12px;
                    display: inline-block;
                    width: 43px;
                    height: 18px;
                    background: url('../../../static/zhe.png') no-repeat;
                    background-size: 43px 18px;
                    margin-left: 6px;
                    line-height: 18px;
                    color: #ffffff;
                    text-align: center;
                }
            }

            .star {
                .star-wrapper {
                    width: 50px;
                    display: inline-block;
                    height: 10px;
                    position: relative;
                    overflow: hidden;

                    .star-icon {
                        position: absolute;
                        left: 0;
                        top: 0;
                        display: inline-block;
                        height: 10px;
                        background: url('./star.png');
                        background-size: 10px 10px;
                    }
                }

                .score {
                    font-size: $font-size-small;
                    padding: 3px 0;
                    color: $color-font;
                }
            }
        }

        .type {
            margin-top: 4px;

            .game-desc {
                box-sizing: border-box;
                width: 34px;
                height: 15px;
                border: 1px solid #febf01;
                border-radius: 5px;
                font-size: $font-size-small;
                color: #febf01;
                padding: 2px 4px;
                margin-right: 6px;
            }
        }

        .downbtn {
            position: absolute;
            right: 0;
            top: 30px;
            downloadbtn();
        }
    }
}
</style>
