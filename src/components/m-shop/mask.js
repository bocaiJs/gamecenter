import { postInfo } from '@/base/api/indexpage/getindexinfo';
import { mapGetters } from 'vuex';

export default {
    computed: {
        ...mapGetters(['getToken']),
    },
    data() {
        return {

            dhcode: '',
            showMoreTip: false,
            selectedId: 0,
            maskInfo: {
                content: '确认后不予退换',
                extendtips: '温馨提示',
                btn: [{
                    btnTitle: '再想想',
                    type: 'hide',
                    theme: '',
                }, {
                    btnTitle: '确定',
                    type: 'sure',
                    theme: 'blue',
                }],
            },
        };
    },
    methods: {
        hideMask() {
            this.showMask = false;
            this.showMoreTip = false;
            this.dhcode = '';
            this.maskInfo = {
                content: '确认后不予退换',
                extendtips: '温馨提示',
                btn: [
                    {
                        btnTitle: '再想想',
                        type: 'hide',
                        theme: '',
                    }, {
                        btnTitle: '确定',
                        type: 'sure',
                        theme: 'blue',
                    },
                ],
            };
        },
        exchangeGoods() {
            const path = '/shop/getShopGood';
            postInfo(path, {
                good_id: this.selectedId,
                token: this.getToken,
            }).then((res) => {
                console.log(res);
                this.maskInfo.btn = [];
                if (res.status_code === 200) {
                    this.showMask = true;
                    this.maskInfo.extendtips = '兑换成功';
                    this.maskInfo.content = '您的验证码为:';
                    this.showMoreTip = true;
                    this.maskInfo.btn[0] = {
                        btnTitle: '复制',
                        type: 'copy',
                        theme: 'blue',
                    };
                    this.dhcode = res.code;
                    console.log(this.dhcode);
                } else {
                    this.showMask = true;
                    this.maskInfo.content = res.message;
                    this.maskInfo.extendtips = '兑换失败';
                    this.maskInfo.btn[0] = {
                        btnTitle: '知道了',
                        type: 'hide',
                    };
                    this.dhcode = '';
                }
            });
        },
        goGoodsDetail(id) {
            console.log('-----------------');
            this.selectedId = id;
            this.showMask = true;
        },
    },
};
